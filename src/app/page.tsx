import HeroBanner from "@/components/home/HeroBanner";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedEvents from "@/components/home/FeaturedEvents";
import AboutBanner from "@/components/home/AboutBanner";
import LatestEvents from "@/components/home/LatestEvents";
import StatsSection from "@/components/home/StatsSection";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <CategoriesSection />
      <FeaturedEvents />
      <AboutBanner />
      <LatestEvents />
      <StatsSection />
    </>
  );
}
