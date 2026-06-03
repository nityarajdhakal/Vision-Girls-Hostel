import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { api } from '../services/api.js';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  message: yup.string().required('Message is required'),
});

const ContactForm = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await api.post('/contact', data);
      toast.success('Message sent successfully');
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-3xl bg-white p-6 shadow-soft">
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
      <label className="block text-sm text-plum/80">
        Phone
        <input className="mt-2 w-full rounded-2xl border border-plum/20 px-4 py-3" {...register('phone')} />
        <p className="mt-1 text-xs text-rose-600">{errors.phone?.message}</p>
      </label>
      <label className="block text-sm text-plum/80">
        Message
        <textarea rows="5" className="mt-2 w-full rounded-2xl border border-plum/20 px-4 py-3" {...register('message')} />
        <p className="mt-1 text-xs text-rose-600">{errors.message?.message}</p>
      </label>
      <button disabled={isSubmitting} className="w-full rounded-full bg-plum px-6 py-3 text-white transition hover:bg-rose-600">
        Send Message
      </button>
    </form>
  );
};

export default ContactForm;
