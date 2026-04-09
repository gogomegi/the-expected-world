import { SiteHeader, SiteFooter } from "@/components/SiteLayout";
import { SubmitForm } from "@/components/SubmitForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Prediction",
  description:
    "Know a historical prediction we should feature? Submit it here.",
};

export default function SubmitPage() {
  return (
    <>
      <SiteHeader />
      <main className="max-w-[720px] mx-auto px-12 max-md:px-4 py-16">
        <h1 className="font-display font-semibold text-[40px] max-md:text-[28px] tracking-[0.02em] text-center mb-2">
          Submit a Prediction
        </h1>
        <p className="text-dusk text-center mb-12">
          Know a prediction we&apos;re missing? Help us build the archive.
        </p>

        <SubmitForm />

        <p className="text-graphite text-[13px] text-center mt-4">
          All submissions are reviewed before publishing.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
