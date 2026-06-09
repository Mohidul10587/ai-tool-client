import { createClient } from "@/lib/supabase/server";
import { getPricingSettings } from "@/lib/pricing-settings";
import PricingClient from "./pricing-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for listing and featuring your AI tool on AI Directory.",
};

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const pricing = await getPricingSettings();
  return <PricingClient isLoggedIn={!!user} pricing={pricing} />;
}
