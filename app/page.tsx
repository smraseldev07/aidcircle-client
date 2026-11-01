import { Banner } from "@/components/banner";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Subscribe } from "@/components/subscribe";
import { WhyOrganize } from "@/components/why-organize";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <Banner />
      <WhyOrganize />
      <Subscribe />
      <Footer />
    </div>
  );
}
