import { useEffect } from 'react';
import { setPageMeta } from '../utils/meta';

const PianoBooks = () => {
  useEffect(() => {
    setPageMeta({
      title: 'Music Player - Piano Books',
      description:
        'Explore our collection of piano books and sheet music. Learn to play your favorite songs.',
      keywords: ['piano', 'books', 'sheet music', 'learning', 'music'],
      openGraph: [
        { property: 'og:title', content: 'Music Player - Piano Books' },
        {
          property: 'og:description',
          content: 'Explore our collection of piano books and sheet music',
        },
        { property: 'og:type', content: 'website' },
      ],
    });
  }, []);

  return (
    <main className="piano-books-page">
      <div className="piano-books-content">
        <h1>Piano Books</h1>
        <p>Explore our collection of piano books and sheet music.</p>
        {/* Piano books content will be added here */}
      </div>
    </main>
  );
};

export default PianoBooks;
