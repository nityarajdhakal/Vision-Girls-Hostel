const TestimonialCard = ({ photo, name, roomType, review }) => (
  <div className="rounded-3xl border border-plum/10 bg-white p-6 shadow-soft">
    <div className="flex items-center gap-4">
      <img src={photo} alt={name} className="h-14 w-14 rounded-full object-cover" />
      <div>
        <h4 className="font-semibold text-plum">{name}</h4>
        <p className="text-sm text-plum/70">{roomType}</p>
      </div>
    </div>
    <p className="mt-5 text-sm leading-7 text-plum/80">“{review}”</p>
  </div>
);

export default TestimonialCard;
