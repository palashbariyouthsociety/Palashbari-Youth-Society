import { Metadata } from 'next';
import Navbar from "@/components/Navbar";
import RecentActivitiesSection from "@/components/RecentActivitiesSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: 'সকল কার্যক্রম ও প্রতিবেদন | পলাশবাড়ী ইয়াং সোসাইটি',
  description: 'পলাশবাড়ী ইয়াং সোসাইটির সকল বাস্তব কর্মসূচি, সমাজসেবা ও উন্নয়নমূলক কাজের বিস্তারিত প্রতিবেদন ও ফটো আর্কাইভ।',
};

export default function ActivitiesPage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="pt-20 md:pt-24 flex-1">
        <RecentActivitiesSection isLandingPage={false} />
      </div>
      <Footer />
    </main>
  );
}
