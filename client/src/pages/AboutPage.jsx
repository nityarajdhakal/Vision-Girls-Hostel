const AboutPage = () => (
  <section className="mx-auto max-w-7xl px-5 py-16">
    <div className="mb-12 space-y-4 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-rosegold">About Vision</p>
      <h1 className="text-5xl font-serif">A warm home with premium care.</h1>
      <p className="mx-auto max-w-2xl text-plum/70">Our mission is to provide a safe and luxurious environment for young women pursuing their education and careers.</p>
    </div>
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-6 rounded-[2rem] bg-white p-10 shadow-soft">
        <h2 className="text-3xl font-semibold">Our Story</h2>
        <p className="text-plum/75">Vision Girls Hostel was created to deliver a boutique residential experience with all the comforts of home. Every detail is designed for safety, wellness and study-friendly living.</p>
        <p className="text-plum/75">We combine beautiful interiors, active community programs, and attentive staff so residents can thrive inside and outside the hostel.</p>
      </div>
      <div className="space-y-6 rounded-[2rem] bg-plum/5 p-10 text-plum">
        <h2 className="text-3xl font-semibold">Mission & Vision</h2>
        <ul className="space-y-4 text-plum/80">
          <li>Provide a secure environment with premium amenities.</li>
          <li>Support every resident with empathy and respect.</li>
          <li>Create a vibrant, nurturing community.</li>
          <li>Maintain excellence through care and trust.</li>
        </ul>
      </div>
    </div>
    <div className="mt-12 grid gap-6 lg:grid-cols-3">
      {['Friendly Warden', '24/7 Support', 'Regular Events'].map((item) => (
        <div key={item} className="rounded-3xl bg-white p-8 shadow-soft">
          <h3 className="font-semibold text-plum">{item}</h3>
          <p className="mt-3 text-plum/75">{item === 'Friendly Warden' ? 'Meet our caring warden and staff who keep every resident supported.' : item === '24/7 Support' ? 'Always available help with safety, medical or daily concerns.' : 'Monthly meetups, skill workshops and wellness activities.'}</p>
        </div>
      ))}
    </div>
    <div className="mt-12 rounded-[2rem] bg-white p-10 shadow-soft">
      <h2 className="text-3xl font-semibold">Rules & Regulations</h2>
      <div className="mt-6 space-y-4">
        {['Maintain cleanliness', 'Respect quiet hours after 10 PM', 'Follow visitor policy', 'Pay fees on time'].map((rule) => (
          <div key={rule} className="rounded-3xl border border-plum/10 p-6 text-plum/80">{rule}</div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutPage;
