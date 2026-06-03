import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { useApi } from '../../hooks/useApi.js';
import Loader from '../../components/Loader.jsx';
import { formatDate, statusClass } from '../../utils/helpers.js';

const tabs = ['Overview', 'Residents', 'Rooms', 'Bookings', 'Complaints', 'Fees', 'Notices', 'Gallery'];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [refresh, setRefresh] = useState(0);
  const [roomForm, setRoomForm] = useState({ roomNumber: '', type: 'single', floor: 1, capacity: 1, price: 12000, amenities: '', description: '', images: '' });
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', category: 'general', expiryDate: '' });
  const [galleryForm, setGalleryForm] = useState({ title: '', category: 'rooms', image: null });
  const [complaintStatus, setComplaintStatus] = useState({});
  const [complaintReply, setComplaintReply] = useState({});

  const { data: residents, loading: residentsLoading } = useApi(`/users/residents?refresh=${refresh}`);
  const { data: rooms, loading: roomsLoading } = useApi(`/rooms?refresh=${refresh}`);
  const { data: bookings, loading: bookingsLoading } = useApi(`/bookings?refresh=${refresh}`);
  const { data: complaints, loading: complaintsLoading } = useApi(`/complaints?refresh=${refresh}`);
  const { data: fees, loading: feesLoading } = useApi(`/fees?refresh=${refresh}`);
  const { data: notices, loading: noticesLoading } = useApi(`/notices/all?refresh=${refresh}`);
  const { data: gallery, loading: galleryLoading } = useApi(`/gallery?refresh=${refresh}`);

  const overviewStats = useMemo(() => ({
    residents: residents?.length || 0,
    availableRooms: rooms?.filter((room) => room.isAvailable).length || 0,
    pendingBookings: bookings?.filter((booking) => booking.status === 'pending').length || 0,
    openComplaints: complaints?.filter((complaint) => complaint.status !== 'resolved').length || 0,
  }), [residents, rooms, bookings, complaints]);

  const handleActivateResident = async (resident) => {
    try {
      await api.put(`/users/${resident._id}`, { isActive: !resident.isActive });
      toast.success(`${resident.name} updated successfully`);
      setRefresh((count) => count + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update resident');
    }
  };

  const handleAddRoom = async (event) => {
    event.preventDefault();
    try {
      await api.post('/rooms', {
        ...roomForm,
        amenities: roomForm.amenities.split(',').map((item) => item.trim()).filter(Boolean),
        images: roomForm.images.split(',').map((item) => item.trim()).filter(Boolean),
      });
      toast.success('Room added successfully');
      setRoomForm({ roomNumber: '', type: 'single', floor: 1, capacity: 1, price: 12000, amenities: '', description: '', images: '' });
      setRefresh((count) => count + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to add room');
    }
  };

  const handleBookingStatus = async (bookingId, status) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
      toast.success(`Booking ${status}`);
      setRefresh((count) => count + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update booking');
    }
  };

  const handleComplaintUpdate = async (complaintId, status) => {
    try {
      await api.put(`/complaints/${complaintId}`, {
        status,
        adminReply: complaintReply[complaintId] || '',
      });
      toast.success('Complaint updated');
      setComplaintReply((prev) => ({ ...prev, [complaintId]: '' }));
      setComplaintStatus((prev) => ({ ...prev, [complaintId]: status }));
      setRefresh((count) => count + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update complaint');
    }
  };

  const handleGenerateFees = async (event) => {
    event.preventDefault();
    try {
      const month = event.target.month.value;
      const year = event.target.year.value;
      await api.post('/fees', { month, year });
      toast.success('Monthly fees generated');
      setRefresh((count) => count + 1);
      event.target.reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to generate fees');
    }
  };

  const handleMarkFeePaid = async (fee) => {
    try {
      await api.put(`/fees/${fee._id}`, {
        status: 'paid',
        paymentDate: new Date(),
        paymentMethod: 'UPI',
        receiptNumber: `RCPT-${Date.now()}`,
      });
      toast.success('Fee marked as paid');
      setRefresh((count) => count + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to mark fee paid');
    }
  };

  const handleCreateNotice = async (event) => {
    event.preventDefault();
    try {
      await api.post('/notices', noticeForm);
      toast.success('Notice created');
      setNoticeForm({ title: '', content: '', category: 'general', expiryDate: '' });
      setRefresh((count) => count + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create notice');
    }
  };

  const handleDeleteNotice = async (noticeId) => {
    try {
      await api.delete(`/notices/${noticeId}`);
      toast.success('Notice deleted');
      setRefresh((count) => count + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete notice');
    }
  };

  const handleGalleryUpload = async (event) => {
    event.preventDefault();
    if (!galleryForm.image) {
      toast.error('Please select an image');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', galleryForm.title);
      formData.append('category', galleryForm.category);
      formData.append('image', galleryForm.image);
      await api.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Gallery image uploaded');
      setGalleryForm({ title: '', category: 'rooms', image: null });
      setRefresh((count) => count + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to upload image');
    }
  };

  const renderSection = () => {
    if (activeTab === 'Overview') {
      return (
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="rounded-3xl border border-plum/10 bg-white p-6 shadow-soft">
            <p className="text-sm text-plum/70">Total Residents</p>
            <p className="mt-4 text-3xl font-semibold text-plum">{overviewStats.residents}</p>
          </div>
          <div className="rounded-3xl border border-plum/10 bg-white p-6 shadow-soft">
            <p className="text-sm text-plum/70">Available Rooms</p>
            <p className="mt-4 text-3xl font-semibold text-plum">{overviewStats.availableRooms}</p>
          </div>
          <div className="rounded-3xl border border-plum/10 bg-white p-6 shadow-soft">
            <p className="text-sm text-plum/70">Pending Bookings</p>
            <p className="mt-4 text-3xl font-semibold text-plum">{overviewStats.pendingBookings}</p>
          </div>
          <div className="rounded-3xl border border-plum/10 bg-white p-6 shadow-soft">
            <p className="text-sm text-plum/70">Open Complaints</p>
            <p className="mt-4 text-3xl font-semibold text-plum">{overviewStats.openComplaints}</p>
          </div>
        </div>
      );
    }

    if (activeTab === 'Residents') {
      return (
        <div className="rounded-3xl border border-plum/10 bg-white p-6 shadow-soft overflow-x-auto">
          <h2 className="text-xl font-semibold mb-6">Residents</h2>
          {residentsLoading ? (
            <Loader />
          ) : (
            <table className="min-w-full text-left text-sm text-plum/80">
              <thead className="bg-cream">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Room</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-plum/10">
                {residents?.map((resident) => (
                  <tr key={resident._id}>
                    <td className="px-6 py-4">{resident.name}</td>
                    <td className="px-6 py-4">{resident.email}</td>
                    <td className="px-6 py-4">{resident.roomNumber || 'Unassigned'}</td>
                    <td className="px-6 py-4">{resident.isActive ? 'Active' : 'Pending'}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleActivateResident(resident)} className="rounded-full bg-plum px-4 py-2 text-xs text-white hover:bg-rose-600">
                        {resident.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );
    }

    if (activeTab === 'Rooms') {
      return (
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-plum/10 bg-white p-6 shadow-soft overflow-x-auto">
            <h2 className="text-xl font-semibold mb-6">Rooms</h2>
            {roomsLoading ? (
              <Loader />
            ) : (
              <table className="min-w-full text-left text-sm text-plum/80">
                <thead className="bg-cream">
                  <tr>
                    <th className="px-6 py-4">Room</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Floor</th>
                    <th className="px-6 py-4">Rent</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-plum/10">
                  {rooms?.map((room) => (
                    <tr key={room._id}>
                      <td className="px-6 py-4">{room.roomNumber}</td>
                      <td className="px-6 py-4">{room.type}</td>
                      <td className="px-6 py-4">{room.floor}</td>
                      <td className="px-6 py-4">₹{room.price}</td>
                      <td className="px-6 py-4">{room.isAvailable ? 'Available' : 'Occupied'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="rounded-3xl border border-plum/10 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold mb-4">Add Room</h2>
            <form onSubmit={handleAddRoom} className="space-y-4">
              <input value={roomForm.roomNumber} onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })} placeholder="Room Number" className="w-full rounded-2xl border border-plum/20 px-4 py-3" />
              <select value={roomForm.type} onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })} className="w-full rounded-2xl border border-plum/20 px-4 py-3">
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="triple">Triple</option>
                <option value="dormitory">Dormitory</option>
              </select>
              <div className="grid gap-4 sm:grid-cols-2">
                <input type="number" value={roomForm.floor} onChange={(e) => setRoomForm({ ...roomForm, floor: Number(e.target.value) })} placeholder="Floor" className="rounded-2xl border border-plum/20 px-4 py-3" />
                <input type="number" value={roomForm.price} onChange={(e) => setRoomForm({ ...roomForm, price: Number(e.target.value) })} placeholder="Price" className="rounded-2xl border border-plum/20 px-4 py-3" />
              </div>
              <input value={roomForm.capacity} type="number" onChange={(e) => setRoomForm({ ...roomForm, capacity: Number(e.target.value) })} placeholder="Capacity" className="w-full rounded-2xl border border-plum/20 px-4 py-3" />
              <input value={roomForm.amenities} onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })} placeholder="Amenities (comma separated)" className="w-full rounded-2xl border border-plum/20 px-4 py-3" />
              <input value={roomForm.images} onChange={(e) => setRoomForm({ ...roomForm, images: e.target.value })} placeholder="Image URLs (comma separated)" className="w-full rounded-2xl border border-plum/20 px-4 py-3" />
              <textarea value={roomForm.description} onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })} rows="3" placeholder="Description" className="w-full rounded-2xl border border-plum/20 px-4 py-3" />
              <button type="submit" className="w-full rounded-full bg-plum px-6 py-3 text-white transition hover:bg-rose-600">Create Room</button>
            </form>
          </div>
        </div>
      );
    }

    if (activeTab === 'Bookings') {
      return (
        <div className="rounded-3xl border border-plum/10 bg-white p-6 shadow-soft overflow-x-auto">
          <h2 className="text-xl font-semibold mb-6">Booking Requests</h2>
          {bookingsLoading ? (
            <Loader />
          ) : (
            <table className="min-w-full text-left text-sm text-plum/80">
              <thead className="bg-cream">
                <tr>
                  <th className="px-6 py-4">Resident</th>
                  <th className="px-6 py-4">Room</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-plum/10">
                {bookings?.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4">{booking.resident?.name || booking.guestName || '—'}</td>
                    <td className="px-6 py-4">{booking.room?.roomNumber}</td>
                    <td className="px-6 py-4"><span className={`rounded-full px-3 py-1 text-xs ${statusClass(booking.status)}`}>{booking.status}</span></td>
                    <td className="px-6 py-4 space-x-2">
                      <button onClick={() => handleBookingStatus(booking._id, 'approved')} className="rounded-full bg-emerald-600 px-4 py-2 text-xs text-white">Approve</button>
                      <button onClick={() => handleBookingStatus(booking._id, 'rejected')} className="rounded-full bg-rose-600 px-4 py-2 text-xs text-white">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );
    }

    if (activeTab === 'Complaints') {
      return (
        <div className="rounded-3xl border border-plum/10 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-semibold mb-6">Complaints</h2>
          {complaintsLoading ? (
            <Loader />
          ) : (
            <div className="space-y-4">
              {complaints?.map((complaint) => (
                <div key={complaint._id} className="rounded-3xl border border-plum/10 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-plum">{complaint.title}</p>
                      <p className="text-sm text-plum/70">{complaint.category} • {complaint.priority}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs ${statusClass(complaint.status)}`}>{complaint.status}</span>
                  </div>
                  <p className="mt-4 text-sm text-plum/75">{complaint.description}</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <select value={complaintStatus[complaint._id] || complaint.status} onChange={(e) => setComplaintStatus((prev) => ({ ...prev, [complaint._id]: e.target.value }))} className="rounded-2xl border border-plum/20 px-4 py-3 text-sm">
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    <input value={complaintReply[complaint._id] || ''} onChange={(e) => setComplaintReply((prev) => ({ ...prev, [complaint._id]: e.target.value }))} placeholder="Reply" className="rounded-2xl border border-plum/20 px-4 py-3 text-sm" />
                    <button onClick={() => handleComplaintUpdate(complaint._id, complaintStatus[complaint._id] || complaint.status)} className="rounded-full bg-plum px-5 py-3 text-sm text-white transition hover:bg-rose-600">Update</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'Fees') {
      return (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-plum/10 bg-white p-6 shadow-soft overflow-x-auto">
            <h2 className="text-xl font-semibold mb-6">Fees</h2>
            {feesLoading ? (
              <Loader />
            ) : (
              <table className="min-w-full text-left text-sm text-plum/80">
                <thead className="bg-cream">
                  <tr>
                    <th className="px-6 py-4">Resident</th>
                    <th className="px-6 py-4">Month</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-plum/10">
                  {fees?.map((fee) => (
                    <tr key={fee._id}>
                      <td className="px-6 py-4">{fee.resident?.name}</td>
                      <td className="px-6 py-4">{fee.month} {fee.year}</td>
                      <td className="px-6 py-4">₹{fee.amount}</td>
                      <td className="px-6 py-4"><span className={`rounded-full px-3 py-1 text-xs ${statusClass(fee.status)}`}>{fee.status}</span></td>
                      <td className="px-6 py-4">
                        {fee.status !== 'paid' && <button onClick={() => handleMarkFeePaid(fee)} className="rounded-full bg-emerald-600 px-4 py-2 text-xs text-white">Mark Paid</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="rounded-3xl border border-plum/10 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold mb-4">Generate Fees</h2>
            <form onSubmit={handleGenerateFees} className="space-y-4">
              <input name="month" placeholder="Month" className="w-full rounded-2xl border border-plum/20 px-4 py-3" />
              <input name="year" placeholder="Year" type="number" className="w-full rounded-2xl border border-plum/20 px-4 py-3" />
              <button type="submit" className="w-full rounded-full bg-plum px-6 py-3 text-white transition hover:bg-rose-600">Create Fees</button>
            </form>
          </div>
        </div>
      );
    }

    if (activeTab === 'Notices') {
      return (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-plum/10 bg-white p-6 shadow-soft overflow-x-auto">
            <h2 className="text-xl font-semibold mb-6">Notices</h2>
            {noticesLoading ? (
              <Loader />
            ) : (
              <table className="min-w-full text-left text-sm text-plum/80">
                <thead className="bg-cream">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Expiry</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-plum/10">
                  {notices?.map((notice) => (
                    <tr key={notice._id}>
                      <td className="px-6 py-4">{notice.title}</td>
                      <td className="px-6 py-4">{notice.category}</td>
                      <td className="px-6 py-4">{notice.expiryDate ? formatDate(notice.expiryDate) : 'No expiry'}</td>
                      <td className="px-6 py-4"><button onClick={() => handleDeleteNotice(notice._id)} className="rounded-full bg-rose-600 px-4 py-2 text-xs text-white">Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="rounded-3xl border border-plum/10 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold mb-4">Create Notice</h2>
            <form onSubmit={handleCreateNotice} className="space-y-4">
              <input value={noticeForm.title} onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })} placeholder="Title" className="w-full rounded-2xl border border-plum/20 px-4 py-3" />
              <textarea value={noticeForm.content} onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })} rows="4" placeholder="Content" className="w-full rounded-2xl border border-plum/20 px-4 py-3" />
              <select value={noticeForm.category} onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })} className="w-full rounded-2xl border border-plum/20 px-4 py-3">
                <option value="general">General</option>
                <option value="maintenance">Maintenance</option>
                <option value="event">Event</option>
                <option value="urgent">Urgent</option>
              </select>
              <input value={noticeForm.expiryDate} onChange={(e) => setNoticeForm({ ...noticeForm, expiryDate: e.target.value })} type="date" className="w-full rounded-2xl border border-plum/20 px-4 py-3" />
              <button type="submit" className="w-full rounded-full bg-plum px-6 py-3 text-white transition hover:bg-rose-600">Publish Notice</button>
            </form>
          </div>
        </div>
      );
    }

    if (activeTab === 'Gallery') {
      return (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-plum/10 bg-white p-6 shadow-soft overflow-x-auto">
            <h2 className="text-xl font-semibold mb-6">Gallery</h2>
            {galleryLoading ? (
              <Loader />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gallery?.map((item) => (
                  <div key={item._id} className="rounded-3xl overflow-hidden border border-plum/10">
                    <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
                    <div className="p-4">
                      <p className="font-semibold text-plum">{item.title}</p>
                      <p className="text-sm text-plum/70">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-3xl border border-plum/10 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
            <form onSubmit={handleGalleryUpload} className="space-y-4">
              <input value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} placeholder="Title" className="w-full rounded-2xl border border-plum/20 px-4 py-3" />
              <select value={galleryForm.category} onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })} className="w-full rounded-2xl border border-plum/20 px-4 py-3">
                <option value="rooms">Rooms</option>
                <option value="amenities">Amenities</option>
                <option value="events">Events</option>
                <option value="common-areas">Common Areas</option>
              </select>
              <input type="file" accept="image/*" onChange={(e) => setGalleryForm({ ...galleryForm, image: e.target.files?.[0] || null })} className="w-full rounded-2xl border border-plum/20 px-4 py-3" />
              <button type="submit" className="w-full rounded-full bg-plum px-6 py-3 text-white transition hover:bg-rose-600">Upload</button>
            </form>
          </div>
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
            <p className="text-sm uppercase tracking-[0.3em] text-rosegold">Admin Dashboard</p>
            <h1 className="text-4xl font-serif">Welcome, {user?.name || 'Admin'}.</h1>
          </div>
          <div className="rounded-full bg-plum/10 px-6 py-3 text-plum">Role: Admin</div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-full px-5 py-2 text-sm transition ${activeTab === tab ? 'bg-plum text-white' : 'bg-cream text-plum border border-plum/20'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-10">{renderSection()}</div>
      </div>
    </section>
  );
};

export default AdminDashboard;
