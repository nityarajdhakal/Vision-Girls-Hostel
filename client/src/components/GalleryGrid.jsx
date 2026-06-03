const GalleryGrid = ({ items }) => {
  const galleryItems = Array.isArray(items) ? items : [];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {galleryItems.map((item) => (
        <div key={item._id || item.title} className="overflow-hidden rounded-3xl bg-white shadow-soft">
          <img src={item.image} alt={item.title} className="h-64 w-full object-cover" />
          <div className="p-4">
            <h4 className="font-semibold text-plum">{item.title}</h4>
            <p className="mt-2 text-sm text-plum/70">{item.category}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;
