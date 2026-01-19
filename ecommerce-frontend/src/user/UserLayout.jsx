import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


export default function UserLayout() {
  // Pages manage their own layout; no path check required here.
  return (
    <>
      <Navbar />
      {/* Render pages full-width; individual pages handle their own containers.
          This avoids double containers and keeps hero sections full screen. */}
      <Outlet />
      <Footer />
    </>
  );
}
