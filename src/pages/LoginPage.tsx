import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Gamepad2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (data.email === 'user@example.com' && data.password === 'password123') {
        login({ name: 'Demo User', email: data.email });
        navigate('/');
      } else {
        setError('root', { message: 'Invalid email or password.' });
      }
    } catch (error) {
      setError('root', { message: 'An unexpected error occurred.' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      {/* Logo Section */}
      <div className="mb-10 text-center">
        <Link to="/login" className="inline-block">
          <Gamepad2 className="mx-auto h-16 w-16 text-primary" />
          <h1 className="mt-4 text-4xl font-bold text-white tracking-tight">GameStore</h1>
        </Link>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-card p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-white">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errors.root && (
            <p className="rounded-md bg-red-900/50 p-3 text-center text-sm text-red-300">{errors.root.message}</p>
          )}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-text-muted">Email</label>
            <Input id="email" type="email" {...register('email')} placeholder="user@example.com" />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <Input id="password" type="password" {...register('password')} placeholder="password123" />
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-text-muted">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

