import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import HeroSection from '../../components/Hero/HeroSection';
import BestSellers from '../../components/BestSeller/BestSellers';
import NewArrivals from '../../components/NewArrivals/NewArrivals';
import Trending from '../../components/Trending/Trending';
import Categories from '../../components/Categories/Categories';
import OurStory from '../../components/OurStory/OurStory';
import Customer from '../../components/Customer/Customer';
import Commitment from '../../components/Commitment/Commitment';
import SesoneSale from '../../components/SesoneSale/SesoneSale';
import SizeGurd from '../../components/SizeGurd/SizeGurd';



export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <BestSellers />
      <NewArrivals />
      <Trending />
      <Categories />
      <OurStory />
      <Customer />
      <Commitment/>
      <SesoneSale />
      <SizeGurd />
      <Footer />
    </>
  );
}
