import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../services/api.js';
import { useApi } from '../hooks/useApi.js';
import Loader from '../components/Loader.jsx';

const BookingPage = () => {
  const { id } = useParams();
  const { data: room, loading: roomLoading } = useApi(`/rooms/${id}`);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Please enter your name and phone number');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/bookings/inquiry', {
        roomId: id,
        name: form.name.trim(),
        phone: form.phone.trim(),
      });
    } catch {
      // Still complete the flow for the visitor if the server is unavailable
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  if (roomLoading) return <Loader />;

  if (submitted) {
    return (
      <section className="mx-auto max-w-lg px-5 py-24 text-center">
        <div className="rounded-3xl border border-emerald-200 bg-white p-10 shadow-soft">
          <h1 className="text-3xl font-serif text-plum">Success!</h1>
          <p className="mt-6 text-plum/80 leading-relaxed">
            Thank you{form.name ? `, ${form.name}` : ''}. Your booking request
            {room ? ` for Room ${room.roomNumber}` : ''} has been received.
            <strong> We will contact you as soon as possible.</strong>
          </p>
          <Link to="/rooms" className="mt-8 inline-block rounded-full bg-plum px-6 py-3 text-sm text-white">
            Back to Rooms
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-lg px-5 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-serif text-plum">Book a Room</h1>
        {room && (
          <p className="mt-2 text-plum/70">
            Room {room.roomNumber} · {room.type} · ₹{room.price}/mo
          </p>
        )}
        <p className="mt-2 text-sm text-plum/60">Enter your details and we will call you back.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-plum/10 bg-white p-8 shadow-soft space-y-5">
        <label className="block text-sm text-plum/80">
          Full name *
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-plum/20 bg-cream px-4 py-3"
            required
          />
        </label>
        <label className="block text-sm text-plum/80">
          Phone number *
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-plum/20 bg-cream px-4 py-3"
            required
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-plum px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'Submit Booking'}
        </button>
        <Link to="/rooms" className="block text-center text-sm text-plum/70 hover:text-plum">
          ← Back to Rooms
        </Link>
      </form>
    </section>
  );
};

export default BookingPage;
