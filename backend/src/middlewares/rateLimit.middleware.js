import rateLimit from 'express-rate-limit';

// Limiter global untuk sebagian besar API, cukup longgar.
export const globalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 menit
	max: 100, // Batasi setiap IP hingga 100 request per 15 menit
	message: 'Terlalu banyak request dari IP ini, silakan coba lagi setelah 15 menit.',
	standardHeaders: true,
	legacyHeaders: false,
});

// Limiter yang lebih ketat khusus untuk percobaan login untuk mencegah brute-force.
export const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 menit
	max: 5, // Batasi setiap IP hingga 5 percobaan login per 15 menit
	message: 'Terlalu banyak percobaan login dari IP ini. Akun Anda mungkin dikunci sementara. Coba lagi setelah 15 menit.',
	standardHeaders: true,
	legacyHeaders: false,
});

// Limiter untuk aksi sensitif seperti registrasi atau lupa password.
// Tidak seketat login, tapi tetap melindungi dari spam.
export const accountActionLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 jam
	max: 10, // Batasi setiap IP hingga 10 aksi per jam
	message: 'Terlalu banyak permintaan pembuatan akun atau reset password dari IP ini. Coba lagi setelah satu jam.',
	standardHeaders: true,
	legacyHeaders: false,
});