import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../services/api.js';
import { useApi } from '../hooks/useApi.js';
import Loader from '../components/Loader.jsx';
import { formatDate } from '../utils/helpers.js';

const RoomDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: room, loading, error } = useApi(`/rooms/${id}`);
  const [form, setForm] = useState({ startDate: '', endDate: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const totalAmount = useMemo(() => {
    if (!room) return 0;
    if (!form.startDate || !form.endDate) return room.price;
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    return room.price;
  }, [room, form.startDate, form.endDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate) {
      toast.error('Please select both start and end dates');
      return;
    }
    if (new Date(form.endDate) <= new Date(form.startDate)) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/bookings', {
        roomId: room._id,
        startDate: form.startDate,
        endDate: form.endDate,
        totalAmount,
        advancePayment: totalAmount * 0.2,
        notes: form.notes,
      });
      toast.success('Booking request submitted');
      navigate('/resident');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to submit booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (error || !room) return <div className="mx-auto max-w-7xl px-5 py-16 text-center text-plum">Room not found or unable to load details.</div>;

  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-rosegold">Room Details</p>
          <h1 className="mt-3 text-4xl font-serif">Room {room.roomNumber} — {room.type}</h1>
          <p className="mt-3 max-w-2xl text-plum/70">{room.description || 'A beautifully curated stay with premium amenities and peaceful comfort.'}</p>
        </div>
        <Link to="/rooms" className="rounded-full border border-plum px-5 py-3 text-sm text-plum transition hover:bg-plum hover:text-white">
          Back to Rooms
        </Link>
      </div>
      <div className="grid gap-10 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {room.images?.slice(0, 4).map((img, index) => (
              <div key={index} className="overflow-hidden rounded-3xl bg-white shadow-soft">
                <img src={img} alt={`${room.type}-${index}`} className="h-64 w-full object-cover" />
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-plum/10 bg-white p-8 shadow-soft">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-sm text-plum/70">Room Number</p>
                <p className="mt-2 text-lg font-semibold text-plum">{room.roomNumber}</p>
              </div>
              <div>
                <p className="text-sm text-plum/70">Monthly Rent</p>
                <p className="mt-2 text-lg font-semibold text-plum">₹{room.price}</p>
              </div>
              <div>
                <p className="text-sm text-plum/70">Capacity</p>
                <p className="mt-2 text-lg font-semibold text-plum">{room.capacity} occupant{room.capacity > 1 ? 's' : ''}</p>
              </div>
              <div>
                <p className="text-sm text-plum/70">Availability</p>
                <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm ${room.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {room.isAvailable ? 'Available' : 'Occupied'}
                </span>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-plum">Amenities</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {room.amenities?.map((amenity) => (
                  <span key={amenity} className="rounded-full bg-cream px-4 py-2 text-sm text-plum/80">{amenity}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-plum/10 bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-plum">Request Booking</h2>
          <p className="mt-3 text-plum/70">Submit a booking request and our admin team will review your application.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block text-sm text-plum/80">
              Check-in Date
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="mt-2 w-full rounded-2xl border border-plum/20 bg-cream px-4 py-3" />
            </label>
            <label className="block text-sm text-plum/80">
              Check-out Date
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="mt-2 w-full rounded-2xl border border-plum/20 bg-cream px-4 py-3" />
            </label>
            <label className="block text-sm text-plum/80">
              Notes
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows="4" className="mt-2 w-full rounded-2xl border border-plum/20 bg-cream px-4 py-3" placeholder="Any special requirements?" />
            </label>
            <div className="rounded-3xl bg-plum/5 p-5 text-plum/80">
              <p>Total Estimated Monthly Rent</p>
              <p className="mt-2 text-3xl font-semibold text-plum">₹{totalAmount}</p>
            </div>
            <button type="submit" disabled={submitting || !room.isAvailable} className="w-full rounded-full bg-plum px-6 py-3 text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-plum/40">
              {room.isAvailable ? (submitting ? 'Submitting...' : 'Request Booking') : 'Room Occupied'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RoomDetailPage;
