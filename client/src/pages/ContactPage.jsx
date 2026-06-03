import ContactForm from '../components/ContactForm.jsx';

const ContactPage = () => (
  <section className="mx-auto max-w-7xl px-5 py-16">
    <div className="mb-12 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-rosegold">Reach Out</p>
      <h1 className="text-5xl font-serif">Contact Us</h1>
      <p className="mx-auto mt-4 max-w-2xl text-plum/70">Send a message for bookings, tours or any questions about Vision Girls Hostel.</p>
    </div>
    <div className="grid gap-10 lg:grid-cols-[0.9fr_0.7fr]">
      <div className="rounded-[2rem] bg-plum/5 p-10 text-plum">
        <h2 className="text-3xl font-semibold">Contact Details</h2>
        <div className="mt-8 space-y-5 text-sm text-plum/80">
          <div>
            <p className="font-semibold">Address</p>
            <p>48 Rosewood Ave, City Center</p>
          </div>
          <div>
            <p className="font-semibold">Phone</p>
            <p>+91 98765 43210</p>
          </div>
          <div>
            <p className="font-semibold">Email</p>
            <p>hello@visionhostel.com</p>
          </div>
        </div>
        <div className="mt-10 h-[300px] overflow-hidden rounded-3xl border border-plum/10">
          <iframe title="Hostel location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31555.48261955895!2d-122.47825515972441!3d37.81992838587647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808581844bb5a135%3A0x2c074e10b02b3b2a!2sGolden%20Gate%20Bridge!5e0!3m2!1sen!2sin!4v1678406757651!5m2!1sen!2sin" className="h-full w-full border-0" allowFullScreen="" loading="lazy" />
        </div>
      </div>
      <ContactForm />
    </div>
  </section>
);

export default ContactPage;
