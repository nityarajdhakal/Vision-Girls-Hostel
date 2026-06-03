import { useMemo, useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import RoomCard from '../components/RoomCard.jsx';
import Loader from '../components/Loader.jsx';

const sampleRooms = [
  { _id: '101', roomNumber: '101', type: 'single', price: 12000, amenities: ['WiFi', 'Laundry', 'Hot Water'], description: 'Cozy single room with warm lighting.', isAvailable: true, images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80'] },
  { _id: '202', roomNumber: '202', type: 'double', price: 18000, amenities: ['CCTV', 'Kitchen', 'Study Room'], description: 'Spacious double room with premium bedding.', isAvailable: true, images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'] },
  { _id: '301', roomNumber: '301', type: 'triple', price: 22000, amenities: ['Mess', 'WiFi', 'CCTV'], description: 'Comfortable triple stay for groups.', isAvailable: false, images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80'] },
  { _id: '401', roomNumber: '401', type: 'dormitory', price: 15000, amenities: ['Hot Water', 'Study Room', 'CCTV'], description: 'Shared dorm-style room with community vibe.', isAvailable: true, images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'] },
];

const roomTypes = ['single', 'double', 'triple', 'dormitory'];

const RoomsPage = () => {
  const { data: rooms, loading } = useApi('/rooms');
  const [typeFilter, setTypeFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');

  const displayedRooms = Array.isArray(rooms) && rooms.length > 0 ? rooms : sampleRooms;

  const filteredRooms = useMemo(() => {
    return displayedRooms.filter((room) => {
      if (typeFilter && room.type !== typeFilter) return false;
      if (availabilityFilter && String(room.isAvailable) !== availabilityFilter) return false;
      return true;
    });
  }, [displayedRooms, typeFilter, availabilityFilter]);

  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <div className="mb-10 space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-rosegold">Explore Rooms</p>
        <h1 className="text-5xl font-serif">Find your perfect home</h1>
        <p className="mx-auto max-w-2xl text-plum/70">Filter by room type and availability to discover the best match for your lifestyle.</p>
      </div>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          {roomTypes.map((type) => (
            <button key={type} onClick={() => setTypeFilter(type === typeFilter ? '' : type)} className={`rounded-full px-4 py-2 text-sm transition ${typeFilter === type ? 'bg-plum text-white' : 'bg-white text-plum border border-plum/20'}`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setAvailabilityFilter('true')} className={`rounded-full px-4 py-2 text-sm transition ${availabilityFilter === 'true' ? 'bg-plum text-white' : 'bg-white text-plum border border-plum/20'}`}>
            Available
          </button>
          <button onClick={() => setAvailabilityFilter('false')} className={`rounded-full px-4 py-2 text-sm transition ${availabilityFilter === 'false' ? 'bg-plum text-white' : 'bg-white text-plum border border-plum/20'}`}>
            Occupied
          </button>
          <button onClick={() => { setTypeFilter(''); setAvailabilityFilter(''); }} className="rounded-full bg-cream px-4 py-2 text-sm text-plum border border-plum/20">
            Reset
          </button>
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {(filteredRooms.length ? filteredRooms : rooms || []).map((room) => <RoomCard key={room._id} room={room} />)}
        </div>
      )}
    </section>
  );
};

export default RoomsPage;
