import { Banner } from "@/components/banner";
import { Subscribe } from "@/components/subscribe";
import { UpcomingEvents } from "@/components/upcoming-events";
import { WhyOrganize } from "@/components/why-organize";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-card">
      
      <Banner />
      <UpcomingEvents />
      <WhyOrganize />
      <Subscribe />
      
    </div>
  );
}
