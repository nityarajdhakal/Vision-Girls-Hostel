import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext.jsx';

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    await login(data);
    navigate('/resident');
  };

  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <div className="grid gap-10 rounded-[2rem] bg-white shadow-soft lg:grid-cols-2">
        <div className="hidden rounded-l-[2rem] bg-[url('https://images.unsplash.com/photo-1534850336045-c8b05d3d7d61?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center lg:block" />
        <div className="p-10">
          <h1 className="text-4xl font-serif">Welcome back</h1>
          <p className="mt-4 text-plum/70">Login to access your resident dashboard and manage bookings, fees, and notices.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <label className="block text-sm text-plum/80">
              Email
              <input className="mt-2 w-full rounded-2xl border border-plum/20 px-4 py-3" {...register('email')} />
              <p className="mt-1 text-xs text-rose-600">{errors.email?.message}</p>
            </label>
            <label className="block text-sm text-plum/80">
              Password
              <input type="password" className="mt-2 w-full rounded-2xl border border-plum/20 px-4 py-3" {...register('password')} />
              <p className="mt-1 text-xs text-rose-600">{errors.password?.message}</p>
            </label>
            <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-plum px-6 py-3 text-white transition hover:bg-rose-600">
              Login
            </button>
          </form>
          <p className="mt-6 text-sm text-plum/70">New here? <Link className="text-plum font-semibold" to="/register">Create an account</Link></p>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
