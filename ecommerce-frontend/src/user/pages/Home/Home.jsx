import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import HeroSection from '../../components/Hero/HeroSection';
import Categories from '../../components/Categories/Categories';
import NewArrivals from '../../components/NewArrivals/NewArrivals';
import BestSellers from '../../components/BestSeller/BestSellers';
import OurStory from '../../components/OurStory/OurStory';
import AllProducts from '../../components/AllProducts/AllProducts';
import Customer from '../../components/Customer/Customer';
import Journal from '../../components/Journal/Journal';
import InstagramFeed from '../../components/Instagram/InstagramFeed';
import Marquee from '../../components/Marquee/Marquee';
import './Home.css';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash !== '#journal') return;
    const timer = window.setTimeout(() => {
      document.getElementById('journal')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [location.hash]);

  return (
    <div className="bh-home">
      <Header />
      <main>
        <HeroSection />
        <Categories />
        <Marquee />
        <NewArrivals />
        <Marquee />
        <InstagramFeed />
        <Marquee />
        <BestSellers />
        <Marquee />
        <section className="bh-house">
          <p className="bh-house__eyebrow">The House of Beeztee</p>
          <p className="bh-house__quote">
            Built different, curated for the daily. We drop immaculate essentials that never miss—long after the trend cycle fades.
          </p>
        </section>
        <OurStory />
        <Marquee />
        <AllProducts />
        <Marquee />
        <Customer />
        <Marquee />
        <Journal />
      </main>
      <Footer />
    </div>
  );
}
