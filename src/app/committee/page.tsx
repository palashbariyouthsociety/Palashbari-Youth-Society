import { Metadata } from 'next';
import Navbar from "@/components/Navbar";
import CommitteeSection from "@/components/CommitteeSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: 'কার্যকরী পরিষদ (২০২৪–২০২৬) | পলাশবাড়ী ইয়াং সোসাইটি',
  description: 'পলাশবাড়ী ইয়াং সোসাইটির গঠনতন্ত্র, আদর্শ ও লক্ষ্য বাস্তবায়নে নিবেদিতপ্রাণ তরুণ নেতৃত্বের কার্যনির্বাহী পরিষদ ও পূর্ণাঙ্গ সদস্য তালিকা।',
};

export default function CommitteePage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="pt-20 md:pt-24 flex-1">
        <CommitteeSection isLandingPage={false} />
      </div>
      <Footer />
    </main>
  );
}
