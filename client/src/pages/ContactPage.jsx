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
            <p>Thamel, Kathmandu 44600, Nepal</p>
          </div>
          <div>
            <p className="font-semibold">Phone</p>
            <p>+977 9800000000</p>
          </div>
          <div>
            <p className="font-semibold">Email</p>
            <p>hello@visionhostel.com</p>
          </div>
        </div>
        <div className="mt-10 h-[300px] overflow-hidden rounded-3xl border border-plum/10">
          <iframe
            title="Nepal map"
            src="https://www.google.com/maps?q=Kathmandu%2C%20Nepal&output=embed"
            className="h-full w-full border-0"
            allowFullScreen=""
            loading="lazy"
          />
        </div>
      </div>
      <ContactForm />
    </div>
  </section>
);

export default ContactPage;
