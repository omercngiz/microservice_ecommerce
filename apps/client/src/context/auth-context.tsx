"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	type ReactNode,
} from "react";
import { tokenStore } from "@/lib/token-store";
import { refreshAPI, logoutAPI } from "@/services/auth.service";

export interface AuthUser {
	id: string;
	email: string;
	role: string;
}

interface AuthState {
	user: AuthUser | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	setAuth: (user: AuthUser, token: string) => void;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Silent refresh — runs once on mount
	useEffect(() => {
		let cancelled = false;
		refreshAPI()
			.then(({ accessToken, user: refreshedUser }) => {
				if (cancelled) return;
				tokenStore.set(accessToken);
				setUser(refreshedUser);
			})
			.catch(() => {
				// Refresh token invalid or absent — treat as logged-out, not an error
				if (!cancelled) tokenStore.set(null);
			})
			.finally(() => {
				if (!cancelled) setIsLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, []);

	const setAuth = useCallback((newUser: AuthUser, token: string) => {
		tokenStore.set(token);
		setUser(newUser);
	}, []);

	const logout = useCallback(async () => {
		try {
			await logoutAPI();
		} catch {
			// Best-effort — clear state regardless
		} finally {
			tokenStore.set(null);
			setUser(null);
		}
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				isAuthenticated: user !== null,
				setAuth,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth(): AuthState {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
	return ctx;
}
