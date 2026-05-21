"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleButton } from "./GoogleButton";
import { OrSeparator } from "./OrSeparator";
import { useAuth } from "@/context/auth-context";
import { registerAPI, loginAPI } from "@/services/auth.service";

export function SignupForm() {
	const { setAuth } = useAuth();
	const router = useRouter();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await registerAPI({
				firstName,
				lastName,
				email,
				password,
				phone: phone || undefined,
			});
			const { accessToken, user } = await loginAPI(email, password);
			setAuth(user, accessToken);
			router.push("/");
		} catch (error) {
			setError(`Kayıt sırasında hata oluştu: ${error}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
			<GoogleButton />
			<OrSeparator />
			<div className="flex gap-3">
				<div className="flex flex-col gap-1.5 flex-1">
					<label className="text-sm font-medium text-primary">Ad</label>
					<Input
						type="text"
						placeholder="Adınız"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						required
						autoComplete="given-name"
					/>
				</div>
				<div className="flex flex-col gap-1.5 flex-1">
					<label className="text-sm font-medium text-primary">Soyad</label>
					<Input
						type="text"
						placeholder="Soyadınız"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						required
						autoComplete="family-name"
					/>
				</div>
			</div>
			<div className="flex flex-col gap-1.5">
				<label className="text-sm font-medium text-primary">
					Telefon <span className="text-muted text-xs">(opsiyonel)</span>
				</label>
				<Input
					type="tel"
					placeholder="+905555555555"
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
					autoComplete="tel"
				/>
			</div>
			<div className="flex flex-col gap-1.5">
				<label className="text-sm font-medium text-primary">
					E-posta adresi
				</label>
				<Input
					type="email"
					placeholder="email@example.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					autoComplete="email"
				/>
			</div>
			<div className="flex flex-col gap-1.5">
				<label className="text-sm font-medium text-primary">Şifre</label>
				<div className="relative">
					<Input
						type={showPassword ? "text" : "password"}
						placeholder="En az 8 karakter"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						autoComplete="new-password"
						className="pr-10"
					/>
					<button
						type="button"
						onClick={() => setShowPassword((v) => !v)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
						tabIndex={-1}
					>
						{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
					</button>
				</div>
			</div>
			{error && <p className="text-xs text-destructive">{error}</p>}
			<Button
				type="submit"
				disabled={loading}
				className="w-full bg-accent hover:bg-accent/90 text-white"
			>
				{loading ? "Kaydediliyor..." : "İleri ▶"}
			</Button>
		</form>
	);
}
