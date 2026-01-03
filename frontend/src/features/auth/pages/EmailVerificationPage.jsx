import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useVerifyEmailMutation } from '../../../services/authApi.js';
import { LoadingState } from '../../../shared/ui/LoadingState/LoadingState.jsx';
import { CheckCircle, XCircle } from 'lucide-react';

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [verifyEmail, { isLoading, isSuccess, isError, error }] = useVerifyEmailMutation();
  const hasRun = useRef(false);

  useEffect(() => {
  if (token && !hasRun.current) {
    verifyEmail(token); // Fungsi panggil API
    hasRun.current = true; // Kunci agar tidak lari dua kali
  }
}, [token, verifyEmail]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center border">
        {isLoading && <LoadingState message="Memverifikasi akun Anda..." />}

        {isSuccess && (
          <>
            <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Terverifikasi!</h1>
            <p className="text-gray-600 mb-6">Akun Anda telah berhasil diaktifkan. Anda sekarang dapat mulai belanja.</p>
            <Link to="/" className="inline-block bg-[#ffd814] px-8 py-2 rounded-md font-medium">Mulai Belanja</Link>
          </>
        )}

        {isError && (
          <>
            <XCircle className="mx-auto text-red-500 mb-4" size={64} />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifikasi Gagal</h1>
            <p className="text-gray-600 mb-6">{error?.data?.message || 'Token tidak valid atau sudah kadaluarsa.'}</p>
            <button onClick={() => navigate('/')} className="text-blue-600 hover:underline text-sm font-medium">Kembali ke Beranda</button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationPage;