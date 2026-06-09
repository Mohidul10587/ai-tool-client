import type { CommentRow } from "@/lib/comment-actions";

export type Ad = {
  id: number;
  url: string;
  description: string;
  tool_name: string;
  logo_url?: string | null;
};

export type Tool = {
  qa_items: never[];
  id: string;
  name: string | null;
  slug: string | null;
  overview: string | null;
  subcategory_snapshot: string | null;
  pricing: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  url: string | null;
  key_features: { title: string; description: string }[] | null;
  use_cases: { title: string; audience: string; description: string }[] | null;
  pricing_info: {
    model: string;
    paidFrom: string;
    billingFrequency: string;
    freeTrial?: string;
  } | null;
  pros: string[] | null;
  cons: string[] | null;
  platform: string | null;
  short_description: string | null;
  detail_description: string | null;
};

export type CurrentUser = {
  id: string;
  name: string;
  avatar_url: string | null;
} | null;

export type ToolDetailsClientProps = {
  tool: Tool;
  featuredAds: Ad[];
  initialComments: CommentRow[];
  currentUser: CurrentUser;
  initialUpvotes?: number;
  initialDownvotes?: number;
  initialUserVote?: 1 | -1 | null;
};
