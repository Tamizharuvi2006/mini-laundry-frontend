import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdDashboard, MdListAlt, MdAddCircle, MdLocalLaundryService } from 'react-icons/md';
import { FiLogOut, FiTag } from 'react-icons/fi';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('laundry_token');
    localStorage.removeItem('laundry_user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <MdDashboard /> },
    { path: '/orders', label: 'Orders', icon: <MdListAlt /> },
    { path: '/orders/new', label: 'New Order', icon: <MdAddCircle /> },
    { path: '/products', label: 'Products', icon: <FiTag /> },
  ];

  return (
    <div className="pt-3 sm:pt-4 px-3 sm:px-6 lg:px-8 mb-4 sm:mb-6 sticky top-2 sm:top-4 z-50 animate-fade-in">
      <nav className="dark-glass-navbar rounded-3xl sm:rounded-full max-w-5xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <span className="text-2xl text-primary-400 drop-shadow-sm"><MdLocalLaundryService /></span>
            <span className="text-sm sm:text-lg font-bold text-white group-hover:text-primary-400 transition-colors drop-shadow-sm">
              Mini Laundry
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Logout */}
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-rose-400 hover:bg-slate-800 transition-all duration-300"
            >
              <FiLogOut className="text-lg" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden grid grid-cols-4 gap-1 py-2 border-t border-slate-700 mt-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center gap-1 px-1.5 py-2 rounded-xl text-[11px] font-semibold transition-all duration-300 ${
                isActive(link.path)
                  ? 'text-white bg-primary-600'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
