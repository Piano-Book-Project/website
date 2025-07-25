import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import AboutUs from './routes/AboutUs';
import ContactUs from './routes/ContactUs';
import Home from './routes/Home';
import PianoBooks from './routes/PianoBooks';
import Price from './routes/Price';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {' '}
          {/* App에서 SideNav, PlayerBar 등 공통 UI */}
          <Route index element={<Home />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="piano-books" element={<PianoBooks />} />
          <Route path="price" element={<Price />} />
          <Route path="contact" element={<ContactUs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
