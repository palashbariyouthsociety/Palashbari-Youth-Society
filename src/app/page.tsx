import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MissionSection from "@/components/MissionSection";
import PrinciplesSection from "@/components/PrinciplesSection";
import RecentActivitiesSection from "@/components/RecentActivitiesSection";
import StructureSection from "@/components/StructureSection";
import MembershipSection from "@/components/MembershipSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex-1">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <MissionSection />
      <PrinciplesSection />
      <RecentActivitiesSection />
      <StructureSection />
      <MembershipSection />
      <Footer />
    </main>
  );
}
