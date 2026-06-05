import Hero from "../components/Hero";
import {type JSX } from "react";
import BestSellers from "../components/Bestseller";
import ServicesAndReviews from "../components/ServicesAndReviews";
import Footer from "../components/Footer";
import Categories from "../components/Categories";
import Newsletter from "../components/Newsletter";

export default function Home(): JSX.Element {
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