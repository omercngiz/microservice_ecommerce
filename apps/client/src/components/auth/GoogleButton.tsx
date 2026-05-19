export function GoogleButton() {
	return (
		<button
			disabled
			className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-muted/40 px-4 py-2.5 text-sm font-medium text-muted cursor-not-allowed opacity-60"
		>
			<svg width="18" height="18" viewBox="0 0 48 48" fill="none">
				<path
					d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.332 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.65-.389-3.917z"
					fill="#FFC107"
				/>
				<path
					d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
					fill="#FF3D00"
				/>
				<path
					d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.316 0-9.828-3.519-11.33-8.306l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
					fill="#4CAF50"
				/>
				<path
					d="M43.611 20.083H42V20H24v8h11.303a11.99 11.99 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
					fill="#1976D2"
				/>
			</svg>
			Google ile giriş yapın
		</button>
	);
}
