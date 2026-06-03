import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => (
  <motion.article whileHover={{ y: -5 }} className="group rounded-3xl border border-plum/10 bg-white p-5 shadow-soft transition">
    <div className="overflow-hidden rounded-3xl">
      <img src={room.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80'} alt={room.type} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
    </div>
    <div className="mt-5">
      <span className="inline-flex rounded-full bg-plum/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-plum">
        {room.type}
      </span>
      <h3 className="mt-4 text-xl font-semibold">Room {room.roomNumber}</h3>
      <p className="mt-2 text-sm text-plum/70">{room.description || 'Comfortable and stylish stay.'}</p>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-lg font-semibold">₹{room.price}/mo</p>
        <span className={`rounded-full px-3 py-1 text-xs ${room.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
          {room.isAvailable ? 'Available' : 'Occupied'}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm text-plum/70">
        {room.amenities?.slice(0, 3).map((item) => (
          <span key={item} className="rounded-full bg-cream px-3 py-1">{item}</span>
        ))}
      </div>
      <Link to={`/rooms/${room._id}`} className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-plum px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600">
        View Details
      </Link>
    </div>
  </motion.article>
);

export default RoomCard;
