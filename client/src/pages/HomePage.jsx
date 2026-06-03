import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection.jsx';
import RoomCard from '../components/RoomCard.jsx';
import AmenityCard from '../components/AmenityCard.jsx';
import TestimonialCard from '../components/TestimonialCard.jsx';
import NoticeBoard from '../components/NoticeBoard.jsx';
import GalleryGrid from '../components/GalleryGrid.jsx';
import ContactForm from '../components/ContactForm.jsx';
import { useApi } from '../hooks/useApi.js';
import Loader from '../components/Loader.jsx';

const featuredRooms = [
  { _id: '1', roomNumber: '101', type: 'single', price: 12000, amenities: ['WiFi', 'Laundry', 'Hot Water'], description: 'Cozy single room with warm lighting.', isAvailable: true, images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80'] },
  { _id: '2', roomNumber: '202', type: 'double', price: 18000, amenities: ['CCTV', 'Kitchen', 'Study Room'], description: 'Spacious room with premium bedding.', isAvailable: true, images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'] },
  { _id: '3', roomNumber: '301', type: 'triple', price: 22000, amenities: ['Mess', 'WiFi', 'CCTV'], description: 'Comfortable triple stay for groups.', isAvailable: true, images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80'] },
];

const amenities = [
  { title: 'WiFi', description: 'High-speed internet across the property.' },
  { title: 'CCTV Security', description: '24/7 monitored cameras for added safety.' },
  { title: 'Laundry', description: 'Efficient laundry service available.' },
  { title: 'Mess/Kitchen', description: 'Healthy meals prepared daily.' },
  { title: 'Hot Water', description: 'Instant hot water for showers.' },
  { title: 'Study Room', description: 'Quiet space for focused study.' },
  { title: 'Parking', description: 'Secure parking for visitors.' },
  { title: 'Power Backup', description: 'Uninterrupted electricity at all times.' },
];

const testimonials = [
  { photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', name: 'Aisha', roomType: 'Single', review: 'A warm environment, caring staff, and peaceful nights. I feel right at home.' },
  { photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80', name: 'Priya', roomType: 'Double', review: 'The hostel is beautifully curated and always spotless. Love the community vibe.' },
  { photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', name: 'Mira', roomType: 'Triple', review: 'Safe, comfortable and supportive. The staff make everything so easy.' },
];

const sampleGallery = [
  { _id: 'g1', title: 'Welcome Lounge', category: 'common-areas', image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80' },
  { _id: 'g2', title: 'Study Session', category: 'amenities', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80' },
  { _id: 'g3', title: 'Event Night', category: 'events', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80' },
  { _id: 'g4', title: 'Common Garden', category: 'common-areas', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80' },
  { _id: 'g5', title: 'Dining Hall', category: 'amenities', image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=900&q=80' },
  { _id: 'g6', title: 'Bedroom Corner', category: 'rooms', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80' },
];

const HomePage = () => {
  const { data: notices, loading: noticesLoading } = useApi('/notices');
  const { data: gallery, loading: galleryLoading } = useApi('/gallery');
  const latestNotices = Array.isArray(notices) ? notices.slice(0, 3) : [];
  const galleryItems = Array.isArray(gallery) && gallery.length > 0 ? gallery.slice(0, 6) : sampleGallery;

  return (
    <main className="space-y-24">
      <HeroSection />

      <section className="mx-auto max-w-7xl px-5">
        <div className="grid gap-8 rounded-[2rem] bg-white/90 p-10 shadow-soft md:grid-cols-4">
          {['200+ Happy Residents', '50+ Rooms', '5 Years of Excellence', '24/7 Security'].map((stat) => (
            <motion.div key={stat} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="rounded-3xl bg-plum/5 p-6 text-center">
              <p className="text-2xl font-semibold text-plum">{stat.split(' ')[0]}</p>
              <p className="mt-2 text-sm text-plum/70">{stat}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] overflow-hidden shadow-soft">
            <img src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80" alt="Interior" className="h-full w-full object-cover" />
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-rosegold">Why Choose Us</p>
              <h2 className="mt-4 text-4xl font-serif">Elegant living built for comfort and peace of mind.</h2>
            </div>
            <div className="space-y-4 text-plum/80">
              <p>Vision Girls Hostel blends luxury boutique details with a safe, nurturing environment designed for ambitious women.</p>
              <p>From tranquil study spaces to gourmet meals and 24/7 support, every stay is crafted for confidence and calm.</p>
              <p>Our residents choose Vision for our values, vibrant community, and premium care.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {['Trusted staff', 'Luxury comforts', 'Secure neighbourhood', 'Community events'].map((item) => (
                <div key={item} className="rounded-3xl border border-plum/10 bg-cream p-5 text-sm text-plum/90">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-rosegold">Find Your Perfect Room</p>
            <h2 className="mt-3 text-4xl font-serif">Rooms curated for rest and connection.</h2>
          </div>
          <p className="max-w-xl text-plum/70">Browse our featured stays and choose a space that fits your lifestyle and budget.</p>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {featuredRooms.map((room) => <RoomCard key={room._id} room={room} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5">
        <div className="space-y-6 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-rosegold">Everything You Need</p>
          <h2 className="text-4xl font-serif">Everything You Need, Under One Roof</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {amenities.map((item) => <AmenityCard key={item.title} title={item.title} description={item.description} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5">
        <div className="space-y-6 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-rosegold">What Our Residents Say</p>
          <h2 className="text-4xl font-serif">What Our Residents Say</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => <TestimonialCard key={item.name} {...item} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-rosegold">Latest Notices</p>
            <h2 className="text-4xl font-serif">Notice Board</h2>
          </div>
          <a href="/" className="text-sm font-semibold text-plum transition hover:text-rosegold">View All Notices</a>
        </div>
        <div className="mt-10">
          {noticesLoading ? <Loader /> : <NoticeBoard notices={latestNotices} />}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-rosegold">Past Glimpses</p>
            <h2 className="text-4xl font-serif">Gallery Preview</h2>
          </div>
          <a href="/gallery" className="text-sm font-semibold text-plum transition hover:text-rosegold">View Full Gallery</a>
        </div>
        <div className="mt-10">
          {galleryLoading ? <Loader /> : <GalleryGrid items={galleryItems} />}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-5">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_0.8fr]">
          <div className="rounded-[2rem] bg-plum/5 p-10 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-rosegold">Get in Touch</p>
            <h2 className="mt-4 text-4xl font-serif">Ready to tour your new home?</h2>
            <p className="mt-6 text-sm leading-7 text-white/80">Reach out for a guided visit, a room booking, or answers to any questions.</p>
            <div className="mt-10 space-y-4 text-sm text-white/80">
              <p><strong>Address:</strong> 48 Rosewood Ave, City Center</p>
              <p><strong>Phone:</strong> +91 98765 43210</p>
              <p><strong>Email:</strong> hello@visionhostel.com</p>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
};

export default HomePage;
