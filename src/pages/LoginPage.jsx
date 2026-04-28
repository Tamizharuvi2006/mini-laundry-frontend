import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { loginApi } from '../api/authApi';
import { MdLocalLaundryService } from 'react-icons/md';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@laundry.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('laundry_token');

  const redirectTo = location.state?.from || '/dashboard';

  if (token) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await loginApi(email, password);
      if (result.success) {
        localStorage.setItem('laundry_token', result.data.token);
        localStorage.setItem('laundry_user', JSON.stringify(result.data.user));
        navigate(redirectTo, { replace: true });
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
            <MdLocalLaundryService className="text-4xl text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Mini Laundry</h1>
          <p className="text-sm text-slate-400 mt-1">Order Management System</p>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-3xl p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-1">Welcome back</h2>
          <p className="text-sm text-slate-400 mb-6">Sign in to manage your orders</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-600 animate-slide-down">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                readOnly
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-6">
            Demo credentials: admin@laundry.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
