import { getPricingSettings } from "@/lib/pricing-settings";
import PricingSettingsForm from "./form";

export default async function PricingSettingsPage() {
  const settings = await getPricingSettings();
  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-xl font-semibold">Pricing Settings</h2>
      <PricingSettingsForm settings={settings} />
    </div>
  );
}
