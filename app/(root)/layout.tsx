import Navbar from "@/components/navbar";
import { getApprovedFeaturedAds } from "@/lib/featured-ads-actions";

export default async function RootGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const featuredAds = await getApprovedFeaturedAds();
  return (
    <>
      <Navbar featuredAds={featuredAds} />
      {children}
    </>
  );
}
