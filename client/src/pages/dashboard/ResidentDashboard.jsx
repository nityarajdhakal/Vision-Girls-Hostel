import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { useApi } from '../../hooks/useApi.js';
import Loader from '../../components/Loader.jsx';
import { formatDate, statusClass } from '../../utils/helpers.js';

const tabs = ['Overview', 'My Room', 'Bookings', 'Complaints', 'Fees', 'Notices', 'Profile'];

const ResidentDashboard = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [refresh, setRefresh] = useState(0);
  const [complaintForm, setComplaintForm] = useState({
    title: '',
    description: '',
    category: 'maintenance',
    priority: 'medium',
    images: [],
  });
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
  });
  const { data: notices, loading: noticesLoading } = useApi('/notices');
  const { data: fees, loading: feesLoading } = useApi(`/fees/my?refresh=${refresh}`);
  const { data: complaints, loading: complaintsLoading } = useApi(`/complaints/my?refresh=${refresh}`);
  const { data: bookings, loading: bookingsLoading } = useApi(`/bookings/my?refresh=${refresh}`);
  const { data: rooms, loading: roomsLoading } = useApi('/rooms');

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        phone: user.phone || '',
        emergencyContactName: user.emergencyContact?.name || '',
        emergencyContactPhone: user.emergencyContact?.phone || '',
        emergencyContactRelation: user.emergencyContact?.relation || '',
      });
    }
  }, [user]);

  const currentRoom = useMemo(
    () => rooms?.find((room) => room.roomNumber === user?.roomNumber),
    [rooms, user]
  );

  const handleComplaintChange = (key, value) => {
    setComplaintForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (event) => {
    setComplaintForm((prev) => ({
      ...prev,
      images: Array.from(event.target.files),
    }));
  };

  const handleSubmitComplaint = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', complaintForm.title);
      formData.append('description', complaintForm.description);
      formData.append('category', complaintForm.category);
      formData.append('priority', complaintForm.priority);
      complaintForm.images.forEach((file) => formData.append('images', file));

      await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Complaint submitted successfully');
      setComplaintForm({ title: '', description: '', category: 'maintenance', priority: 'medium', images: [] });
      setRefresh((count) => count + 1);
      setActiveTab('Complaints');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    }
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.put('/auth/update-profile', {
        name: profile.name,
        phone: profile.phone,
        emergencyContact: {
          name: profile.emergencyContactName,
          phone: profile.emergencyContactPhone,
          relation: profile.emergencyContactRelation,
        },
      });
      setUser(response.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update profile');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.delete(`/bookings/${bookingId}`);
      toast.success('Booking cancelled');
      setRefresh((count) => count + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to cancel booking');
    }
  };

  const overviewStats = [
    { label: 'Active Bookings', value: bookings?.filter((item) => item.status === 'approved').length || 0 },
    { label: 'Open Complaints', value: complaints?.filter((item) => item.status !== 'resolved').length || 0 },
    { label: 'Pending Fees', value: fees?.filter((item) => item.status === 'pending').length || 0 },
  ];

  const renderContent = () => {
    if (activeTab === 'Overview') {
      return (
        <div className="grid gap-6 lg:grid-cols-3">
          {overviewStats.map((item) => (
            <div key={item.label} className="rounded-3xl border border-plum/10 bg-white p-6 shadow-soft">
              <p className="text-sm text-plum/70">{item.label}</p>
              <p className="mt-4 text-3xl font-semibold text-plum">{item.value}</p>
            </div>
          ))}
          <div className="rounded-3xl border border-plum/10 bg-white p-6 shadow-soft lg:col-span-3">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Latest Notices</h2>
                <p className="mt-2 text-sm text-plum/70">Stay updated with campus announcements, events and reminders.</p>
              </div>
              <a href="/rooms" className="rounded-full bg-plum px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600">
                Browse Rooms
              </a>
            </div>
            {noticesLoading ? (
              <Loader />
            ) : (
              <div className="mt-5 space-y-4">
                {notices?.slice(0, 3).map((notice) => (
                  <div key={notice._id} className="rounded-3xl bg-plum/5 p-4">
                    <p className="font-semibold text-plum">{notice.title}</p>
                    <p className="mt-1 text-sm text-plum/75">{notice.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeTab === 'My Room') {
      return (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-plum/10 bg-white p-8 shadow-soft">
            <h2 className="text-xl font-semibold">Room Details</h2>
            {roomsLoading ? (
              <Loader />
            ) : currentRoom ? (
              <div className="mt-6 space-y-4 text-plum/80">
                <p><span className="font-semibold text-plum">Number:</span> {currentRoom.roomNumber}</p>
                <p><span className="font-semibold text-plum">Type:</span> {currentRoom.type}</p>
                <p><span className="font-semibold text-plum">Floor:</span> {currentRoom.floor}</p>
                <p><span className="font-semibold text-plum">Capacity:</span> {currentRoom.capacity}</p>
                <p><span className="font-semibold text-plum">Rent:</span> ₹{currentRoom.price}/mo</p>
                <p><span className="font-semibold text-plum">Amenities:</span> {currentRoom.amenities?.join(', ')}</p>
                <p className="mt-4 text-plum/70">{currentRoom.description}</p>
              </div>
            ) : (
              <p className="mt-6 text-plum/75">No room assigned yet.</p>
            )}
          </div>
          <div className="rounded-3xl border border-plum/10 bg-white p-8 shadow-soft">
            <h2 className="text-xl font-semibold">Booking Summary</h2>
            <div className="mt-6 space-y-4 text-plum/80">
              <p><span className="font-semibold text-plum">Name:</span> {user?.name}</p>
              <p><span className="font-semibold text-plum">Email:</span> {user?.email}</p>
              <p><span className="font-semibold text-plum">Phone:</span> {user?.phone}</p>
              <p><span className="font-semibold text-plum">Status:</span> {user?.isActive ? 'Active' : 'Pending Approval'}</p>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'Bookings') {
      return (
        <div className="rounded-3xl border border-plum/10 bg-white p-8 shadow-soft">
          <h2 className="text-xl font-semibold">My Bookings</h2>
          {bookingsLoading ? (
            <Loader />
          ) : (
            <div className="mt-6 space-y-4">
              {bookings?.length ? bookings.map((booking) => (
                <div key={booking._id} className="rounded-3xl border border-plum/10 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-plum">Room {booking.room?.roomNumber} • {booking.room?.type}</p>
                      <p className="mt-2 text-sm text-plum/75">{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs ${statusClass(booking.status)}`}>{booking.status}</span>
                      {booking.status === 'pending' && (
                        <button type="button" onClick={() => handleCancelBooking(booking._id)} className="rounded-full bg-rose-500 px-4 py-2 text-sm text-white transition hover:bg-rose-600">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )) : <p className="mt-4 text-plum/75">No bookings found yet.</p>}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'Complaints') {
      return (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-plum/10 bg-white p-8 shadow-soft">
            <h2 className="text-xl font-semibold">My Complaints</h2>
            {complaintsLoading ? (
              <Loader />
            ) : (
              <div className="mt-6 space-y-4">
                {complaints?.length ? complaints.map((item) => (
                  <div key={item._id} className="rounded-3xl border border-plum/10 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-plum">{item.title}</p>
                        <p className="text-sm text-plum/70">{item.category} • {item.priority}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs ${statusClass(item.status)}`}>{item.status}</span>
                    </div>
                    <p className="mt-3 text-sm text-plum/75">{item.description}</p>
                  </div>
                )) : <p className="mt-4 text-plum/75">No complaints filed yet.</p>}
              </div>
            )}
          </div>
          <div className="rounded-3xl border border-plum/10 bg-white p-8 shadow-soft">
            <h2 className="text-xl font-semibold">New Complaint</h2>
            <form onSubmit={handleSubmitComplaint} className="mt-6 space-y-4">
              <label className="block text-sm text-plum/80">
                Complaint Title
                <input value={complaintForm.title} onChange={(e) => handleComplaintChange('title', e.target.value)} className="mt-2 w-full rounded-2xl border border-plum/20 px-4 py-3" />
              </label>
              <label className="block text-sm text-plum/80">
                Category
                <select value={complaintForm.category} onChange={(e) => handleComplaintChange('category', e.target.value)} className="mt-2 w-full rounded-2xl border border-plum/20 px-4 py-3">
                  <option value="maintenance">Maintenance</option>
                  <option value="food">Food</option>
                  <option value="security">Security</option>
                  <option value="cleanliness">Cleanliness</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="block text-sm text-plum/80">
                Priority
                <select value={complaintForm.priority} onChange={(e) => handleComplaintChange('priority', e.target.value)} className="mt-2 w-full rounded-2xl border border-plum/20 px-4 py-3">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
              <label className="block text-sm text-plum/80">
                Description
                <textarea value={complaintForm.description} onChange={(e) => handleComplaintChange('description', e.target.value)} rows="4" className="mt-2 w-full rounded-2xl border border-plum/20 px-4 py-3" />
              </label>
              <label className="block text-sm text-plum/80">
                Attach Images
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="mt-2 w-full rounded-2xl border border-plum/20 px-4 py-3" />
              </label>
              <button type="submit" className="w-full rounded-full bg-plum px-6 py-3 text-white transition hover:bg-rose-600">Submit Complaint</button>
            </form>
          </div>
        </div>
      );
    }

    if (activeTab === 'Fees') {
      return (
        <div className="rounded-3xl border border-plum/10 bg-white p-8 shadow-soft">
          <h2 className="text-xl font-semibold">Fee History</h2>
          {feesLoading ? (
            <Loader />
          ) : (
            <div className="mt-6 overflow-hidden rounded-3xl border border-plum/10">
              <table className="min-w-full divide-y divide-plum/10 text-left text-sm text-plum/80">
                <thead className="bg-cream">
                  <tr>
                    <th className="px-6 py-4">Month</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Paid On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-plum/10">
                  {fees?.map((fee) => (
                    <tr key={fee._id}>
                      <td className="px-6 py-4">{fee.month} {fee.year}</td>
                      <td className="px-6 py-4">₹{fee.amount}</td>
                      <td className="px-6 py-4"><span className={`rounded-full px-3 py-1 text-xs ${statusClass(fee.status)}`}>{fee.status}</span></td>
                      <td className="px-6 py-4">{fee.paymentDate ? formatDate(fee.paymentDate) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'Notices') {
      return (
        <div className="rounded-3xl border border-plum/10 bg-white p-8 shadow-soft">
          <h2 className="text-xl font-semibold">Active Notices</h2>
          {noticesLoading ? (
            <Loader />
          ) : (
            <div className="mt-6 space-y-4">
              {notices?.map((notice) => (
                <div key={notice._id} className="rounded-3xl bg-plum/5 p-5">
                  <p className="font-semibold text-plum">{notice.title}</p>
                  <p className="mt-2 text-sm text-plum/75">{notice.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'Profile') {
      return (
        <div className="rounded-3xl border border-plum/10 bg-white p-8 shadow-soft">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <form onSubmit={handleProfileSubmit} className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-plum/80">
                Name
                <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="mt-2 w-full rounded-2xl border border-plum/20 px-4 py-3" />
              </label>
              <label className="block text-sm text-plum/80">
                Phone
                <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="mt-2 w-full rounded-2xl border border-plum/20 px-4 py-3" />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block text-sm text-plum/80">
                Emergency Name
                <input value={profile.emergencyContactName} onChange={(e) => setProfile({ ...profile, emergencyContactName: e.target.value })} className="mt-2 w-full rounded-2xl border border-plum/20 px-4 py-3" />
              </label>
              <label className="block text-sm text-plum/80">
                Emergency Phone
                <input value={profile.emergencyContactPhone} onChange={(e) => setProfile({ ...profile, emergencyContactPhone: e.target.value })} className="mt-2 w-full rounded-2xl border border-plum/20 px-4 py-3" />
              </label>
              <label className="block text-sm text-plum/80">
                Relation
                <input value={profile.emergencyContactRelation} onChange={(e) => setProfile({ ...profile, emergencyContactRelation: e.target.value })} className="mt-2 w-full rounded-2xl border border-plum/20 px-4 py-3" />
              </label>
            </div>
            <button type="submit" className="rounded-full bg-plum px-6 py-3 text-white transition hover:bg-rose-600">Save Changes</button>
          </form>
        </div>
      );
    }

    return null;
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <div className="rounded-[2rem] bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-rosegold">Resident Dashboard</p>
            <h1 className="text-4xl font-serif">Welcome back, {user?.name || 'Resident'}!</h1>
          </div>
          <div className="rounded-full bg-plum/10 px-6 py-3 text-plum">Role: Resident</div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-full px-5 py-2 text-sm transition ${activeTab === tab ? 'bg-plum text-white' : 'bg-cream text-plum border border-plum/20'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-10">{renderContent()}</div>
      </div>
    </section>
  );
};

export default ResidentDashboard;
