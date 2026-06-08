import Navbar from "@/components/navbar";
import { getApprovedFeaturedAds } from "@/lib/featured-ads-actions";
import { getSiteSettings } from "@/lib/site-settings";

export default async function RootGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [featuredAds, settings] = await Promise.all([
    getApprovedFeaturedAds(),
    getSiteSettings(),
  ]);
  return (
    <>
      <Navbar featuredAds={featuredAds} logoUrl={settings.logo_url} />
      {children}
    </>
  );
}
