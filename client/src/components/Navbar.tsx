import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/hooks/useAuthMutations';
import { useNotifications } from '@/hooks/useNotification';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout: logoutContext } = useAuth();
  const { mutate: logout } = useLogout();
  const { data: notificationsData } = useNotifications(1, true);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        logoutContext();
        navigate('/login');
      },
    });
  };

  const unreadCount = notificationsData?.total || 0;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">DevTracker X</h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
