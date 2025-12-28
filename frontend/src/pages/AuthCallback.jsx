import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../lib/store.js';

export default function AuthCallback() {
  const navigate = useNavigate();
  const setUser = useAppStore((s) => s.setUser);

  useEffect(() => {
    const handleAuthCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const authData = urlParams.get('auth');

      if (authData) {
        try {
          const parsed = JSON.parse(decodeURIComponent(authData));
          console.log('AuthCallback received data:', parsed);
          console.log('AuthCallback user data:', parsed.user);
          console.log('AuthCallback user picture:', parsed.user?.picture);

          if (parsed.login && parsed.user && parsed.token) {
            setUser(parsed.user, parsed.token, parsed.user.role || 'user');

            // Remove auth parameter from URL
            window.history.replaceState({}, '', window.location.pathname);

            // Redirect based on role
            const redirectPath = parsed.user.role === 'admin' ? '/admin' : '/dashboard';
            navigate(redirectPath);
          }
        } catch (error) {
          console.error('Error parsing auth data:', error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-slate-300">Completing authentication...</p>
      </div>
    </div>
  );
}
