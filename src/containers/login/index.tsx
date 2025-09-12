import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useAppSelector } from '../../store/hooks';
import LoginWithEmail from './with-email';

const Login = () => {
  const navigate = useNavigate();
  const { loadingType, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const [loginType, setLoginType] = useState<
    'google' | 'apple' | 'email' | null
  >(null);

  return (
    <div className='flex flex-col items-center justify-center h-full w-full px-4'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>BiteCount</h1>
        <h3 className='text-lg font-medium text-gray-600'>
          Track your food, not your worries.
        </h3>
      </div>
      {loginType === 'email' && <LoginWithEmail />}
      {!loginType && (
        <div className='flex flex-col gap-4 items-center justify-center w-full max-w-sm'>
          {error && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-full text-center'>
              {error}
            </div>
          )}
          <Button
            variant='outline'
            className='w-full h-12'
            onClick={() => setLoginType('google')}
            disabled={!!loadingType}
          >
            {loadingType === 'google' ? 'Logging in...' : 'Login with Google'}
          </Button>
          <Button
            variant='outline'
            className='w-full h-12'
            onClick={() => setLoginType('apple')}
            disabled={!!loadingType}
          >
            {loadingType === 'apple' ? 'Logging in...' : 'Login with Apple'}
          </Button>
          <Button
            variant='default'
            className='w-full h-12'
            onClick={() => setLoginType('email')}
            disabled={!!loadingType}
          >
            {loadingType === 'email' ? 'Logging in...' : 'Login with Email'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Login;
