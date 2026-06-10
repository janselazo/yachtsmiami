"use client";

import { useState } from "react";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { CombinedScrollVideo } from "@/components/CombinedScrollVideo";
import { ScrollVideoScene } from "@/components/ScrollVideoScene";
import { FleetSection } from "@/components/FleetSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { BookingSection } from "@/components/BookingSection";
import { SiteFooter } from "@/components/SiteFooter";
import { boats } from "@/data/boats";

export function HomePage() {
  const [selectedBoatId, setSelectedBoatId] = useState(
    boats.find((boat) => boat.featured)?.id ?? boats[0].id,
  );

  return (
    <SmoothScrollProvider>
      <div className="site-atmosphere" aria-hidden="true" />
      <div className="relative z-10">
        <SiteHeader />
        <main>
          <CombinedScrollVideo
            sceneEyebrow="Signature Experience"
            sceneTitle="Live the luxury"
            sceneTitleAccent="of the open sea"
            sceneTitleAccentClassName="italic text-ocean-light"
            sceneDescription="This is not just a boat ride — it is music, bubbles, skyline views, and a crew that keeps the vibes high from dock to sandbar."
            sceneAlign="right"
          />
          <FleetSection
            selectedBoatId={selectedBoatId}
            onSelectBoat={(boatId) => {
              setSelectedBoatId(boatId);
              document
                .getElementById("book")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          />
          <ScrollVideoScene
            id="signature-pink"
            eyebrow="Fan Favorite"
            title="The Pink Yacht"
            titleAccent="experience"
            titleAccentClassName="italic text-pink-soft"
            description="Our iconic pink vessel brings bachelorette energy, birthday hype, and VIP style to Biscayne Bay. Luxury in pink, by design."
            overlay="light"
          />
          <ExperienceSection />
          <BookingSection
            selectedBoatId={selectedBoatId}
            onBoatChange={setSelectedBoatId}
          />
        </main>
        <SiteFooter />
      </div>
    </SmoothScrollProvider>
  );
}
