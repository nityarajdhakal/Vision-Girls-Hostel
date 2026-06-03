import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { api } from '../services/api.js';
import toast from 'react-hot-toast';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match'),
  emergencyContactName: yup.string().required('Emergency contact name is required'),
  emergencyContactPhone: yup.string().required('Emergency contact phone is required'),
  emergencyContactRelation: yup.string().required('Relation is required'),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        emergencyContact: {
          name: data.emergencyContactName,
          phone: data.emergencyContactPhone,
          relation: data.emergencyContactRelation,
        },
      });
      toast.success('Registration successful! Pending admin approval');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <div className="grid gap-10 rounded-[2rem] bg-white shadow-soft lg:grid-cols-2">
        <div className="hidden rounded-l-[2rem] bg-[url('https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center lg:block" />
        <div className="p-10">
          <h1 className="text-4xl font-serif">Join Vision Girls Hostel</h1>
          <p className="mt-4 text-plum/70">Register now to request residency and enjoy secure, elegant hostel living.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-plum/80">
                Name
                <input className="mt-2 w-full rounded-2xl border border-plum/20 px-4 py-3" {...register('name')} />
                <p className="mt-1 text-xs text-rose-600">{errors.name?.message}</p>
              </label>
              <label className="block text-sm text-plum/80">
                Email
                <input className="mt-2 w-full rounded-2xl border border-plum/20 px-4 py-3" {...register('email')} />
                <p className="mt-1 text-xs text-rose-600">{errors.email?.message}</p>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-plum/80">
                Phone
                <input className="mt-2 w-full rounded-2xl border border-plum/20 px-4 py-3" {...register('phone')} />
                <p className="mt-1 text-xs text-rose-600">{errors.phone?.message}</p>
              </label>
              <label className="block text-sm text-plum/80">
                Password
                <input type="password" className="mt-2 w-full rounded-2xl border border-plum/20 px-4 py-3" {...register('password')} />
                <p className="mt-1 text-xs text-rose-600">{errors.password?.message}</p>
              </label>
            </div>
            <label className="block text-sm text-plum/80">
              Confirm Password
              <input type="password" className="mt-2 w-full rounded-2xl border border-plum/20 px-4 py-3" {...register('confirmPassword')} />
              <p className="mt-1 text-xs text-rose-600">{errors.confirmPassword?.message}</p>
            </label>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block text-sm text-plum/80">
                Emergency Name
                <input className="mt-2 w-full rounded-2xl border border-plum/20 px-4 py-3" {...register('emergencyContactName')} />
                <p className="mt-1 text-xs text-rose-600">{errors.emergencyContactName?.message}</p>
              </label>
              <label className="block text-sm text-plum/80">
                Emergency Phone
                <input className="mt-2 w-full rounded-2xl border border-plum/20 px-4 py-3" {...register('emergencyContactPhone')} />
                <p className="mt-1 text-xs text-rose-600">{errors.emergencyContactPhone?.message}</p>
              </label>
              <label className="block text-sm text-plum/80">
                Relation
                <input className="mt-2 w-full rounded-2xl border border-plum/20 px-4 py-3" {...register('emergencyContactRelation')} />
                <p className="mt-1 text-xs text-rose-600">{errors.emergencyContactRelation?.message}</p>
              </label>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-plum px-6 py-3 text-white transition hover:bg-rose-600">
              Register
            </button>
          </form>
          <p className="mt-6 text-sm text-plum/70">Already registered? <Link className="text-plum font-semibold" to="/login">Login here</Link></p>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
