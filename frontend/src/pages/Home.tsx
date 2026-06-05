import Hero from "../components/Hero";
import BestSellers from "../components/Bestseller";
import ServicesAndReviews from "../components/ServicesAndReviews";
import Footer from "../components/Footer";
import Categories from "../components/Categories";
import Newsletter from "../components/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <BestSellers />
      <Categories />
      <ServicesAndReviews />
      <Newsletter />
      <Footer />
    </>
  );
}