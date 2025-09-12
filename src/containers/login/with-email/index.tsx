import { useFormik } from 'formik';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import * as Yup from 'yup';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { login } from '../api-helpers';
import { toast } from 'sonner';
import { useAppDispatch } from '../../../store/hooks';
import { loginFailure, loginStart, loginSuccess } from '../../../store/slices/authSlice';

// Example validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginWithEmail = ({ handleBack }: { handleBack: () => void }) => {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      dispatch(loginStart('email'));
      console.log(values);
      const response = await login(values.email, values.password);
      console.info(response);
      if (response.success) {
        const { user, refreshToken, accessToken } = response.data ?? {};
        dispatch(loginSuccess({ user, refreshToken, accessToken }));
        toast.success('Login successful');
      } else {
        throw new Error(response.message ?? 'Login failed');
      }
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
      dispatch(loginFailure((error as Error).message));
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className='flex flex-col gap-4 max-w-sm w-full'>
      <h1>Login with Email</h1>
      <div className='flex flex-col gap-4 w-full'>
        <Input
          type='email'
          placeholder='Email'
          name='email'
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <Input
          type='password'
          placeholder='Password'
          name='password'
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <div className='flex flex-col gap-2 justify-end'>
          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={handleBack}>
              Back
            </Button>
            <Button
              variant='default'
              disabled={formik.isSubmitting || !formik.isValid || loading}
              onClick={() => formik.handleSubmit()}
            >
                {loading && <Loader2 className='animate-spin w-4 h-4' />}
              Login
            </Button>
          </div>
          <Button disabled title='Coming soon' variant='link'>
            Forgot password?
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginWithEmail;
