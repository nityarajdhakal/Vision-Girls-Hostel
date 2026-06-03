const AmenityCard = ({ title, description }) => (
  <div className="rounded-3xl border border-plum/10 bg-white p-6 text-center shadow-soft">
    <h4 className="font-semibold text-plum">{title}</h4>
    <p className="mt-3 text-sm text-plum/70">{description}</p>
  </div>
);

export default AmenityCard;
