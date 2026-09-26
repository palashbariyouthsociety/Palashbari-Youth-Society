import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MissionSection from "@/components/MissionSection";
import PrinciplesSection from "@/components/PrinciplesSection";
import StructureSection from "@/components/StructureSection";
import MembershipSection from "@/components/MembershipSection";
import RegisterSection from "@/components/RegisterSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex-1">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <MissionSection />
      <PrinciplesSection />
      <StructureSection />
      <MembershipSection />
      <RegisterSection />
      <Footer />
    </main>
  );
}
