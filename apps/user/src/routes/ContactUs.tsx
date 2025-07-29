import { useEffect } from 'react';
import { setPageMeta } from '../utils/meta';

const ContactUs = () => {
  useEffect(() => {
    setPageMeta({
      title: 'Music Player - Contact Us',
      description:
        'Get in touch with us for support, feedback, or any questions about our music player service.',
      keywords: ['contact', 'support', 'feedback', 'help', 'music'],
      openGraph: [
        { property: 'og:title', content: 'Music Player - Contact Us' },
        { property: 'og:description', content: 'Get in touch with us for support or feedback' },
        { property: 'og:type', content: 'website' },
      ],
    });
  }, []);

  return (
    <main className="contact-page">
      <div className="contact-content">
        <h1>Contact Us</h1>
        <p>Get in touch with us for support, feedback, or any questions.</p>
        {/* Contact form and information will be added here */}
      </div>
    </main>
  );
};

export default ContactUs;
