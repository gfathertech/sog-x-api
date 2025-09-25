import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const ProtectedRoute: React.FC<{children:React.ReactNode}> = ({children}) => {
  const { user, isLoading, hasCheckedAuth } = useAuth();
  const location = useLocation();
  
  // Show loading only if we're still checking auth
  if (isLoading || !hasCheckedAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading...</span>
      </div>
    );
  }

  // Only redirect if we've completed the auth check and no user exists
  if (!user) {
    console.log('🔒 Redirecting to login');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

