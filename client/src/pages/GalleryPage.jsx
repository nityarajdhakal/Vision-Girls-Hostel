import { useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import GalleryGrid from '../components/GalleryGrid.jsx';
import Loader from '../components/Loader.jsx';

const categories = [
  { value: 'all', label: 'ALL' },
  { value: 'rooms', label: 'ROOMS' },
  { value: 'amenities', label: 'AMENITIES' },
  { value: 'events', label: 'EVENTS' },
  { value: 'common-areas', label: 'COMMON AREAS' },
];

const sampleGallery = [
  { _id: 'g1', title: 'Welcome Lounge', category: 'common-areas', image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80' },
  { _id: 'g2', title: 'Study Session', category: 'amenities', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80' },
  { _id: 'g3', title: 'Event Night', category: 'events', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80' },
  { _id: 'g4', title: 'Common Garden', category: 'common-areas', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80' },
  { _id: 'g5', title: 'Dining Hall', category: 'amenities', image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=900&q=80' },
  { _id: 'g6', title: 'Bedroom Corner', category: 'rooms', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80' },
];

const GalleryPage = () => {
  const { data: gallery, loading } = useApi('/gallery');
  const [activeCategory, setActiveCategory] = useState('all');

  const galleryItems = Array.isArray(gallery) && gallery.length > 0 ? gallery : sampleGallery;
  const filtered = galleryItems.filter((item) => activeCategory === 'all' || item.category === activeCategory);

  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <div className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-rosegold">Our Stories</p>
        <h1 className="text-5xl font-serif">Gallery</h1>
      </div>
      <div className="mb-10 flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <button key={category.value} onClick={() => setActiveCategory(category.value)} className={`rounded-full px-5 py-2 text-sm ${activeCategory === category.value ? 'bg-plum text-white' : 'bg-white text-plum border border-plum/20'}`}>
            {category.label}
          </button>
        ))}
      </div>
      {loading ? <Loader /> : <GalleryGrid items={filtered} />}
    </section>
  );
};

export default GalleryPage;
