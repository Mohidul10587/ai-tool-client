"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Zap,
  Search,
  MessageSquare,
  Image,
  Code,
  Video,
  Music,
  FileText,
  Briefcase,
  Megaphone,
  PenTool,
  Database,
  Bot,
  TrendingUp,
  Globe,
  Mic,
  GraduationCap,
  DollarSign,
  Headphones,
  Linkedin,
  ArrowRight,
  Layers,
  Users,
  Cpu,
  Mail,
  Calendar,
  Presentation,
  BookOpen,
  Sparkles,
  Shield,
  Box,
  Gamepad2,
  Wallet,
  Clock,
  UserCheck,
  Heart,
  Scale,
  Building,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";

// Category data with icons - Complete list with 35 categories
const categories = [
  { name: "All", icon: Layers },
  { name: "Chat", icon: MessageSquare },
  { name: "Image", icon: Image },
  { name: "Writing", icon: FileText },
  { name: "Code", icon: Code },
  { name: "Video", icon: Video },
  { name: "Productivity", icon: Briefcase },
  { name: "Marketing", icon: Megaphone },
  { name: "Audio", icon: Music },
  { name: "Search", icon: Search },
  { name: "Design", icon: PenTool },
  { name: "Data", icon: Database },
  { name: "Automation", icon: Bot },
  { name: "SEO", icon: TrendingUp },
  { name: "Translation", icon: Globe },
  { name: "Voice", icon: Mic },
  { name: "Education", icon: GraduationCap },
  { name: "Sales", icon: DollarSign },
  { name: "Support", icon: Headphones },
  { name: "Agents", icon: Users },
  { name: "Models", icon: Cpu },
  { name: "Music", icon: Music },
  { name: "Email", icon: Mail },
  { name: "Meetings", icon: Calendar },
  { name: "Presentations", icon: Presentation },
  { name: "Research", icon: BookOpen },
  { name: "Prompts", icon: Sparkles },
  { name: "Security", icon: Shield },
  { name: "3D", icon: Box },
  { name: "Gaming", icon: Gamepad2 },
  { name: "Finance", icon: Wallet },
  { name: "Scheduling", icon: Clock },
  { name: "HR", icon: UserCheck },
  { name: "Healthcare", icon: Heart },
  { name: "Legal", icon: Scale },
  { name: "Property", icon: Building },
];

// AI Tools data
const allTools = [
  { id: 1, letter: "C", name: "ChatGPT", description: "Advanced conversational AI for writing, analysis, and coding assistance", category: "Chat", votes: 15420, pricing: "freemium", date: "2022-11-30" },
  { id: 2, letter: "C", name: "Claude", description: "Anthropic AI assistant focused on helpfulness and nuanced reasoning", category: "Chat", votes: 12850, pricing: "freemium", date: "2023-03-14" },
  { id: 3, letter: "M", name: "Midjourney", description: "Create stunning artistic images from text descriptions", category: "Image", votes: 11200, pricing: "paid", date: "2022-07-12" },
  { id: 4, letter: "G", name: "GitHub Copilot", description: "AI pair programmer that helps you write code faster", category: "Code", votes: 10500, pricing: "paid", date: "2021-06-29" },
  { id: 5, letter: "D", name: "DALL-E 3", description: "OpenAI image generation with incredible detail and accuracy", category: "Image", votes: 9800, pricing: "freemium", date: "2023-10-03" },
  { id: 6, letter: "P", name: "Perplexity", description: "AI-powered search engine with real-time information", category: "Search", votes: 8900, pricing: "freemium", date: "2022-12-07" },
  { id: 7, letter: "S", name: "Stable Diffusion", description: "Open-source image generation model", category: "Image", votes: 8400, pricing: "free", date: "2022-08-22" },
  { id: 8, letter: "S", name: "Sora", description: "Text-to-video AI model by OpenAI", category: "Video", votes: 7600, pricing: "paid", date: "2024-02-15" },
  { id: 9, letter: "R", name: "Runway", description: "AI-powered video editing and generation tools", category: "Video", votes: 7200, pricing: "freemium", date: "2023-03-20" },
  { id: 10, letter: "E", name: "ElevenLabs", description: "Advanced AI voice synthesis and cloning", category: "Voice", votes: 6800, pricing: "freemium", date: "2023-01-23" },
  { id: 11, letter: "J", name: "Jasper", description: "AI content creation for marketing teams", category: "Marketing", votes: 6500, pricing: "paid", date: "2021-02-01" },
  { id: 12, letter: "G", name: "Gemini", description: "Google multimodal AI assistant", category: "Chat", votes: 6200, pricing: "freemium", date: "2023-12-06" },
  { id: 13, letter: "N", name: "Notion AI", description: "AI writing assistant built into Notion", category: "Productivity", votes: 5900, pricing: "freemium", date: "2023-02-22" },
  { id: 14, letter: "C", name: "Cursor", description: "AI-first code editor for developers", category: "Code", votes: 5600, pricing: "freemium", date: "2023-03-01" },
  { id: 15, letter: "D", name: "Devin", description: "Autonomous AI software engineer", category: "Agents", votes: 5300, pricing: "paid", date: "2024-03-12" },
  { id: 16, letter: "F", name: "Figma AI", description: "AI-powered design tools in Figma", category: "Design", votes: 5100, pricing: "freemium", date: "2024-06-26" },
  { id: 17, letter: "C", name: "Copy.ai", description: "AI copywriting and content generation", category: "Writing", votes: 4800, pricing: "freemium", date: "2020-10-01" },
  { id: 18, letter: "H", name: "Hugging Face", description: "Open-source ML models and datasets", category: "Models", votes: 4600, pricing: "free", date: "2016-05-05" },
  { id: 19, letter: "L", name: "Leonardo AI", description: "AI image generation for game assets", category: "Image", votes: 4400, pricing: "freemium", date: "2022-12-01" },
  { id: 20, letter: "S", name: "Synthesia", description: "AI video generation with avatars", category: "Video", votes: 4200, pricing: "paid", date: "2017-01-01" },
  { id: 21, letter: "G", name: "Grammarly", description: "AI writing assistant for grammar and style", category: "Writing", votes: 4000, pricing: "freemium", date: "2009-01-01" },
  { id: 22, letter: "O", name: "Otter.ai", description: "AI meeting transcription and notes", category: "Meetings", votes: 3800, pricing: "freemium", date: "2016-01-01" },
  { id: 23, letter: "D", name: "Descript", description: "AI video and podcast editing", category: "Audio", votes: 3600, pricing: "freemium", date: "2017-01-01" },
  { id: 24, letter: "M", name: "Murf AI", description: "AI voice generator for voiceovers", category: "Voice", votes: 3400, pricing: "freemium", date: "2020-01-01" },
  { id: 25, letter: "R", name: "Replika", description: "AI companion chatbot", category: "Chat", votes: 3200, pricing: "freemium", date: "2017-03-01" },
  { id: 26, letter: "T", name: "Tome", description: "AI presentation generator", category: "Presentations", votes: 3000, pricing: "freemium", date: "2022-09-20" },
  { id: 27, letter: "P", name: "Pika", description: "AI video generation and editing", category: "Video", votes: 2800, pricing: "freemium", date: "2023-11-27" },
  { id: 28, letter: "A", name: "Adobe Firefly", description: "Generative AI for creative tools", category: "Design", votes: 2600, pricing: "freemium", date: "2023-03-21" },
  { id: 29, letter: "C", name: "Canva AI", description: "AI design tools in Canva", category: "Design", votes: 2400, pricing: "freemium", date: "2023-03-22" },
  { id: 30, letter: "Z", name: "Zapier AI", description: "AI automation for workflows", category: "Automation", votes: 2200, pricing: "freemium", date: "2023-03-16" },
  { id: 31, letter: "S", name: "Surfer SEO", description: "AI-powered SEO content optimization", category: "SEO", votes: 2100, pricing: "paid", date: "2018-01-01" },
  { id: 32, letter: "D", name: "DeepL", description: "AI translation with superior accuracy", category: "Translation", votes: 2000, pricing: "freemium", date: "2017-08-01" },
  { id: 33, letter: "K", name: "Khan Academy AI", description: "AI-powered personalized tutoring", category: "Education", votes: 1900, pricing: "free", date: "2023-03-14" },
  { id: 34, letter: "G", name: "Gong", description: "AI revenue intelligence for sales teams", category: "Sales", votes: 1800, pricing: "paid", date: "2015-01-01" },
  { id: 35, letter: "I", name: "Intercom Fin", description: "AI customer support chatbot", category: "Support", votes: 1700, pricing: "paid", date: "2023-03-14" },
  { id: 36, letter: "S", name: "Suno", description: "AI music generation from text prompts", category: "Music", votes: 1650, pricing: "freemium", date: "2023-09-01" },
  { id: 37, letter: "A", name: "AutoGPT", description: "Autonomous AI agent for complex tasks", category: "Agents", votes: 1600, pricing: "free", date: "2023-04-01" },
  { id: 38, letter: "L", name: "Llama 3", description: "Meta open-source large language model", category: "Models", votes: 1550, pricing: "free", date: "2024-04-18" },
  { id: 39, letter: "M", name: "Mailchimp AI", description: "AI-powered email marketing automation", category: "Email", votes: 1500, pricing: "freemium", date: "2023-06-01" },
  { id: 40, letter: "B", name: "Beautiful.ai", description: "AI presentation design tool", category: "Presentations", votes: 1450, pricing: "paid", date: "2018-01-01" },
  { id: 41, letter: "E", name: "Elicit", description: "AI research assistant for academics", category: "Research", votes: 1400, pricing: "freemium", date: "2021-01-01" },
  { id: 42, letter: "P", name: "PromptBase", description: "Marketplace for AI prompts", category: "Prompts", votes: 1350, pricing: "freemium", date: "2022-06-01" },
  { id: 43, letter: "D", name: "Darktrace", description: "AI cybersecurity threat detection", category: "Security", votes: 1300, pricing: "paid", date: "2013-01-01" },
  { id: 44, letter: "F", name: "Fireflies.ai", description: "AI meeting assistant and transcription", category: "Meetings", votes: 1250, pricing: "freemium", date: "2016-01-01" },
  { id: 45, letter: "U", name: "Udio", description: "AI music creation platform", category: "Music", votes: 1200, pricing: "freemium", date: "2024-04-10" },
  { id: 46, letter: "S", name: "Spline AI", description: "AI-powered 3D design and modeling", category: "3D", votes: 1150, pricing: "freemium", date: "2023-05-01" },
  { id: 47, letter: "I", name: "Inworld AI", description: "AI characters for games and experiences", category: "Gaming", votes: 1100, pricing: "freemium", date: "2021-01-01" },
  { id: 48, letter: "M", name: "Mint AI", description: "AI-powered financial planning assistant", category: "Finance", votes: 1050, pricing: "freemium", date: "2023-08-01" },
  { id: 49, letter: "C", name: "Calendly AI", description: "AI scheduling and meeting automation", category: "Scheduling", votes: 1000, pricing: "freemium", date: "2023-07-01" },
  { id: 50, letter: "H", name: "HireVue", description: "AI-powered hiring and recruitment", category: "HR", votes: 950, pricing: "paid", date: "2014-01-01" },
  { id: 51, letter: "A", name: "Ada Health", description: "AI symptom checker and health guide", category: "Healthcare", votes: 900, pricing: "freemium", date: "2016-01-01" },
  { id: 52, letter: "H", name: "Harvey AI", description: "AI legal assistant for law firms", category: "Legal", votes: 850, pricing: "paid", date: "2022-11-01" },
  { id: 53, letter: "R", name: "Restb.ai", description: "AI property image analysis", category: "Property", votes: 800, pricing: "paid", date: "2015-01-01" },
  { id: 54, letter: "W", name: "Writesonic", description: "AI writing assistant for blogs and marketing", category: "Writing", votes: 780, pricing: "freemium", date: "2021-01-01" },
  { id: 55, letter: "P", name: "Pictory", description: "AI video creation from scripts", category: "Video", votes: 760, pricing: "freemium", date: "2020-01-01" },
  { id: 56, letter: "L", name: "Lumen5", description: "AI video maker for social media", category: "Video", votes: 740, pricing: "freemium", date: "2017-01-01" },
  { id: 57, letter: "R", name: "Rephrase.ai", description: "AI video generation with digital avatars", category: "Video", votes: 720, pricing: "paid", date: "2019-01-01" },
  { id: 58, letter: "B", name: "Bardeen", description: "AI workflow automation without code", category: "Automation", votes: 700, pricing: "freemium", date: "2020-01-01" },
  { id: 59, letter: "A", name: "Akkio", description: "No-code AI for business analytics", category: "Data", votes: 680, pricing: "freemium", date: "2019-01-01" },
  { id: 60, letter: "M", name: "MonkeyLearn", description: "Text analysis and NLP platform", category: "Data", votes: 660, pricing: "freemium", date: "2014-01-01" },
  { id: 61, letter: "C", name: "Cohere", description: "Enterprise AI language models", category: "Models", votes: 640, pricing: "freemium", date: "2019-01-01" },
  { id: 62, letter: "A", name: "AI21 Labs", description: "Advanced language models for developers", category: "Models", votes: 620, pricing: "freemium", date: "2017-01-01" },
  { id: 63, letter: "S", name: "Scale AI", description: "Data labeling and AI training platform", category: "Data", votes: 600, pricing: "paid", date: "2016-01-01" },
  { id: 64, letter: "R", name: "Roboflow", description: "Computer vision AI platform", category: "Image", votes: 580, pricing: "freemium", date: "2019-01-01" },
  { id: 65, letter: "V", name: "Viso.ai", description: "No-code computer vision platform", category: "Image", votes: 560, pricing: "paid", date: "2018-01-01" },
  { id: 66, letter: "D", name: "D-ID", description: "AI video generation from photos", category: "Video", votes: 540, pricing: "freemium", date: "2017-01-01" },
  { id: 67, letter: "H", name: "HeyGen", description: "AI avatar video creation platform", category: "Video", votes: 520, pricing: "freemium", date: "2020-01-01" },
  { id: 68, letter: "C", name: "Colossyan", description: "AI video creation for training", category: "Video", votes: 500, pricing: "paid", date: "2020-01-01" },
  { id: 69, letter: "S", name: "Sembly AI", description: "AI meeting assistant and notes", category: "Meetings", votes: 480, pricing: "freemium", date: "2019-01-01" },
  { id: 70, letter: "T", name: "Tldv", description: "AI meeting recorder and transcription", category: "Meetings", votes: 460, pricing: "freemium", date: "2021-01-01" },
  { id: 71, letter: "G", name: "Grain", description: "AI video highlights from meetings", category: "Meetings", votes: 440, pricing: "freemium", date: "2019-01-01" },
  { id: 72, letter: "W", name: "Wordtune", description: "AI writing assistant for rewriting", category: "Writing", votes: 420, pricing: "freemium", date: "2020-01-01" },
  { id: 73, letter: "Q", name: "QuillBot", description: "AI paraphrasing and summarization", category: "Writing", votes: 400, pricing: "freemium", date: "2017-01-01" },
  { id: 74, letter: "S", name: "Sudowrite", description: "AI writing partner for fiction", category: "Writing", votes: 380, pricing: "paid", date: "2020-01-01" },
  { id: 75, letter: "N", name: "NovelAI", description: "AI storytelling and writing", category: "Writing", votes: 360, pricing: "paid", date: "2021-01-01" },
  { id: 76, letter: "A", name: "Anyword", description: "AI copywriting for marketers", category: "Marketing", votes: 340, pricing: "paid", date: "2013-01-01" },
  { id: 77, letter: "P", name: "Phrasee", description: "AI marketing language optimization", category: "Marketing", votes: 320, pricing: "paid", date: "2015-01-01" },
  { id: 78, letter: "P", name: "Persado", description: "AI content generation for marketing", category: "Marketing", votes: 300, pricing: "paid", date: "2012-01-01" },
  { id: 79, letter: "A", name: "Albert AI", description: "AI digital marketing platform", category: "Marketing", votes: 280, pricing: "paid", date: "2014-01-01" },
  { id: 80, letter: "C", name: "Clearscope", description: "AI SEO content optimization", category: "SEO", votes: 260, pricing: "paid", date: "2016-01-01" },
  { id: 81, letter: "M", name: "MarketMuse", description: "AI content strategy platform", category: "SEO", votes: 240, pricing: "paid", date: "2013-01-01" },
  { id: 82, letter: "F", name: "Frase", description: "AI SEO content creation", category: "SEO", votes: 220, pricing: "freemium", date: "2016-01-01" },
  { id: 83, letter: "S", name: "Scalenut", description: "AI SEO and content marketing", category: "SEO", votes: 200, pricing: "freemium", date: "2020-01-01" },
  { id: 84, letter: "G", name: "GetGenie", description: "AI writing and SEO assistant", category: "SEO", votes: 180, pricing: "freemium", date: "2022-01-01" },
  { id: 85, letter: "C", name: "Chatfuel", description: "AI chatbot builder for business", category: "Support", votes: 160, pricing: "freemium", date: "2015-01-01" },
  { id: 86, letter: "M", name: "ManyChat", description: "AI chat marketing platform", category: "Support", votes: 140, pricing: "freemium", date: "2015-01-01" },
  { id: 87, letter: "D", name: "Drift", description: "AI conversational marketing platform", category: "Sales", votes: 120, pricing: "paid", date: "2015-01-01" },
  { id: 88, letter: "C", name: "Conversica", description: "AI sales assistant for lead engagement", category: "Sales", votes: 100, pricing: "paid", date: "2007-01-01" },
  { id: 89, letter: "O", name: "Outreach", description: "AI sales engagement platform", category: "Sales", votes: 95, pricing: "paid", date: "2014-01-01" },
  { id: 90, letter: "S", name: "SalesLoft", description: "AI sales engagement and coaching", category: "Sales", votes: 90, pricing: "paid", date: "2011-01-01" },
  { id: 91, letter: "C", name: "Chorus.ai", description: "AI conversation intelligence for sales", category: "Sales", votes: 85, pricing: "paid", date: "2015-01-01" },
  { id: 92, letter: "R", name: "Rev.ai", description: "AI speech recognition API", category: "Voice", votes: 80, pricing: "freemium", date: "2019-01-01" },
  { id: 93, letter: "A", name: "AssemblyAI", description: "AI speech-to-text API", category: "Voice", votes: 75, pricing: "freemium", date: "2017-01-01" },
  { id: 94, letter: "D", name: "Deepgram", description: "AI speech recognition platform", category: "Voice", votes: 70, pricing: "freemium", date: "2015-01-01" },
  { id: 95, letter: "S", name: "Speechify", description: "AI text-to-speech reader", category: "Voice", votes: 65, pricing: "freemium", date: "2017-01-01" },
  { id: 96, letter: "P", name: "Play.ht", description: "AI voice generation platform", category: "Voice", votes: 60, pricing: "freemium", date: "2016-01-01" },
  { id: 97, letter: "R", name: "Resemble AI", description: "AI voice cloning and synthesis", category: "Voice", votes: 55, pricing: "freemium", date: "2019-01-01" },
  { id: 98, letter: "W", name: "WellSaid Labs", description: "AI voice generation for enterprises", category: "Voice", votes: 50, pricing: "paid", date: "2019-01-01" },
  { id: 99, letter: "L", name: "Lovo.ai", description: "AI voice generator and text-to-speech", category: "Voice", votes: 45, pricing: "freemium", date: "2019-01-01" },
  { id: 100, letter: "V", name: "Voicemod", description: "AI voice changer and soundboard", category: "Audio", votes: 40, pricing: "freemium", date: "2014-01-01" },
];

// Featured ads data - 20 spots total (10 visible at a time, flipping every 10s)
const featuredAds = [
  { id: 1, name: "AdTech AI", description: "Smart advertising automation", color: "bg-rose-50" },
  { id: 2, name: "BrandBot", description: "Brand identity generator", color: "bg-sky-50" },
  { id: 3, name: "CloudAI Pro", description: "Cloud-native AI platform", color: "bg-amber-50" },
  { id: 4, name: "DataMind", description: "Data analytics AI", color: "bg-emerald-50" },
  { id: 5, name: "EdgeAI", description: "Edge computing AI", color: "bg-violet-50" },
  { id: 6, name: "FlowAI", description: "Workflow automation", color: "bg-pink-50" },
  { id: 7, name: "GenAI Studio", description: "Creative AI suite", color: "bg-cyan-50" },
  { id: 8, name: "HyperWrite", description: "Advanced writing AI", color: "bg-orange-50" },
  { id: 9, name: "InsightAI", description: "Business intelligence", color: "bg-lime-50" },
  { id: 10, name: "JetBot", description: "Fast conversational AI", color: "bg-indigo-50" },
  { id: 11, name: "KeywordAI", description: "SEO keyword research", color: "bg-fuchsia-50" },
  { id: 12, name: "LearnAI", description: "Educational platform", color: "bg-teal-50" },
  { id: 13, name: "MediaGen", description: "Media generation AI", color: "bg-yellow-50" },
  { id: 14, name: "NeuralDev", description: "AI development tools", color: "bg-blue-50" },
  { id: 15, name: "OptimizeAI", description: "Performance optimizer", color: "bg-red-50" },
  { id: 16, name: "PredictAI", description: "Predictive analytics", color: "bg-green-50" },
  { id: 17, name: "QuickAI", description: "Rapid AI deployment", color: "bg-purple-50" },
  { id: 18, name: "ReachAI", description: "Marketing outreach", color: "bg-stone-100" },
  { id: 19, name: "SpeakAI", description: "Voice synthesis", color: "bg-slate-100" },
  { id: 20, name: "TranslateAI", description: "Real-time translation", color: "bg-zinc-100" },
];

// Mobile Marquee Ad Bar Component - Inside header for top, fixed bottom for bottom
function MobileMarqueeAds({ position }: { position: "top" | "bottom" }) {
  const ads = position === "top" ? featuredAds.slice(0, 10) : featuredAds.slice(10, 20);
  
  if (position === "top") {
    // Top marquee is rendered inside the navbar, not here
    return null;
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 overflow-hidden border-t border-black/10 bg-white py-2 lg:hidden">
      <div className="marquee-container flex">
        <div className="marquee-content flex animate-marquee gap-3">
          {[...ads, ...ads].map((ad, index) => (
            <a 
              key={`${ad.id}-${index}`} 
              href="#"
              className={`flex h-9 min-w-[130px] items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold text-black shadow-sm ${ad.color}`}
            >
              {ad.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// Desktop Rectangle Ad Spot Component with description - handles its own flip and data change
function RectangleAdSpot({ 
  currentAd, 
  nextAd, 
  isFlipping, 
  flipDelay 
}: { 
  currentAd: { name: string; description: string; color: string }; 
  nextAd: { name: string; description: string; color: string }; 
  isFlipping: boolean; 
  flipDelay: number;
}) {
  const [displayedAd, setDisplayedAd] = useState(currentAd);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isFlipping) {
      // Start animation after delay
      const startTimer = setTimeout(() => {
        setIsAnimating(true);
      }, flipDelay);
      
      // Change content at midpoint of this box's flip (400ms after it starts)
      const changeTimer = setTimeout(() => {
        setDisplayedAd(nextAd);
      }, flipDelay + 400);
      
      // Stop animation after flip completes
      const stopTimer = setTimeout(() => {
        setIsAnimating(false);
      }, flipDelay + 800);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(changeTimer);
        clearTimeout(stopTimer);
      };
    }
  }, [isFlipping, flipDelay, nextAd]);

  // Update displayed ad when not flipping and currentAd changes
  useEffect(() => {
    if (!isFlipping) {
      setDisplayedAd(currentAd);
    }
  }, [currentAd, isFlipping]);

  return (
    <a 
      href="#"
      className={`flex h-[calc((100vh-60px)/5-8px)] w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-black/10 px-3 py-2 transition-all hover:border-black/20 hover:shadow-md ${displayedAd.color}`}
      style={{
        animation: isAnimating ? 'flip 0.8s ease-in-out forwards' : 'none',
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="text-center" style={{ backfaceVisibility: 'hidden' }}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/10 text-[9px] font-medium text-black/50 mx-auto">Logo</div>
        <div className="mt-1.5 text-sm font-bold text-black">{displayedAd.name}</div>
        <div className="mt-0.5 text-[10px] text-black/60 line-clamp-2">{displayedAd.description}</div>
      </div>
    </a>
  );
}

// Featured Ads Sidebar Component - Starts below header
function FeaturedAdsSidebar() {
  const [currentSet, setCurrentSet] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipping(true);
      // Stop flipping signal after all animations complete, then switch set for next cycle
      setTimeout(() => {
        setIsFlipping(false);
        setCurrentSet((prev) => (prev === 0 ? 1 : 0));
      }, 1500);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Current ads being displayed
  const currentLeftAds = currentSet === 0 ? featuredAds.slice(0, 5) : featuredAds.slice(10, 15);
  const currentRightAds = currentSet === 0 ? featuredAds.slice(5, 10) : featuredAds.slice(15, 20);
  
  // Next ads to flip to
  const nextLeftAds = currentSet === 0 ? featuredAds.slice(10, 15) : featuredAds.slice(0, 5);
  const nextRightAds = currentSet === 0 ? featuredAds.slice(15, 20) : featuredAds.slice(5, 10);

  return (
    <div className="hidden lg:block">
      {/* Left Side - starts below header */}
      <div className="fixed left-2 top-[52px] flex h-[calc(100vh-52px)] w-48 flex-col justify-start gap-2 py-2 xl:left-3 xl:w-52">
        {currentLeftAds.map((ad, index) => (
          <RectangleAdSpot 
            key={`left-${index}`} 
            currentAd={{ name: ad.name, description: ad.description, color: ad.color }}
            nextAd={{ name: nextLeftAds[index].name, description: nextLeftAds[index].description, color: nextLeftAds[index].color }}
            isFlipping={isFlipping} 
            flipDelay={index * 150} 
          />
        ))}
      </div>
      {/* Right Side - starts below header */}
      <div className="fixed right-2 top-[52px] flex h-[calc(100vh-52px)] w-48 flex-col justify-start gap-2 py-2 xl:right-3 xl:w-52">
        {currentRightAds.map((ad, index) => (
          <RectangleAdSpot 
            key={`right-${index}`} 
            currentAd={{ name: ad.name, description: ad.description, color: ad.color }}
            nextAd={{ name: nextRightAds[index].name, description: nextRightAds[index].description, color: nextRightAds[index].color }}
            isFlipping={isFlipping} 
            flipDelay={index * 150} 
          />
        ))}
      </div>
    </div>
  );
}

// Hero Section Component
function HeroSection() {
  return (
    <section className="px-4 pb-4 pt-4 text-center lg:px-56 xl:px-60">
      <h1 className="text-balance text-xl font-bold tracking-tight text-black md:text-2xl">
        Discover the Best AI Tools
      </h1>
      <p className="mx-auto mt-1.5 max-w-lg text-xs text-black/60 md:text-sm">
        Explore thousands of AI-powered tools to supercharge your productivity, creativity, and workflow.
      </p>

      <div className="mx-auto mt-3 max-w-sm">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black/40" />
            <input
              type="text"
              placeholder="Search AI tools..."
              className="w-full rounded-lg border border-black/10 bg-black/5 py-1.5 pl-8 pr-3 text-sm text-black placeholder:text-black/40 focus:border-black/30 focus:outline-none"
            />
          </div>
          <button className="rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-black/80">
            Search
          </button>
        </div>
      </div>
    </section>
  );
}

// Category Chips Component with Show More/Less on Mobile
function CategoryChips() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);
  
  // On mobile show 20, on desktop show all
  const mobileCategories = showAll ? categories : categories.slice(0, 20);

  return (
    <section className="px-4 pb-4 lg:px-56 xl:px-60">
      {/* Mobile view - with show more/less */}
      <div className="mx-auto max-w-7xl md:hidden">
        <div className="flex flex-wrap justify-center gap-1.5">
          {mobileCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                  activeCategory === category.name
                    ? "bg-black text-white"
                    : "border border-black/10 bg-black/5 text-black/70 hover:border-black/20 hover:text-black"
                }`}
              >
                <Icon className="h-3 w-3" />
                {category.name}
              </button>
            );
          })}
        </div>
        
        {/* Show More/Less Button */}
        {categories.length > 20 && (
          <div className="mt-3 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-1 rounded-full border border-black/20 bg-black/5 px-3 py-1.5 text-xs font-medium text-black/70 transition-colors hover:bg-black/10 hover:text-black"
            >
              {showAll ? (
                <>
                  Show less
                  <ChevronUp className="h-3 w-3" />
                </>
              ) : (
                <>
                  Show more
                  <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Desktop view - show all categories */}
      <div className="mx-auto hidden max-w-7xl flex-wrap justify-center gap-1.5 md:flex">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                activeCategory === category.name
                  ? "bg-black text-white"
                  : "border border-black/10 bg-black/5 text-black/70 hover:border-black/20 hover:text-black"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {category.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}

// Vote Buttons Component with Up and Down
function VoteButtons({ votes }: { votes: number }) {
  const [voteCount, setVoteCount] = useState(votes);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (voted === "up") {
      setVoteCount(votes);
      setVoted(null);
    } else if (voted === "down") {
      setVoteCount(votes + 1);
      setVoted("up");
    } else {
      setVoteCount(votes + 1);
      setVoted("up");
    }
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (voted === "down") {
      setVoteCount(votes);
      setVoted(null);
    } else if (voted === "up") {
      setVoteCount(votes - 1);
      setVoted("down");
    } else {
      setVoteCount(votes - 1);
      setVoted("down");
    }
  };

  return (
    <div className="flex shrink-0 flex-col items-center gap-0 rounded-lg border border-black/20 bg-black/5">
      <button
        onClick={handleUpvote}
        className={`flex items-center justify-center p-1.5 transition-all hover:bg-black/10 ${
          voted === "up" ? "text-black" : "text-black/40"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
          <polygon points="12,4 22,18 2,18" />
        </svg>
      </button>
      <span className="text-xs font-bold text-black">
        {voteCount >= 1000 ? `${(voteCount / 1000).toFixed(1)}k` : voteCount}
      </span>
      <button
        onClick={handleDownvote}
        className={`flex items-center justify-center p-1.5 transition-all hover:bg-black/10 ${
          voted === "down" ? "text-black" : "text-black/40"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
          <polygon points="12,20 2,6 22,6" />
        </svg>
      </button>
    </div>
  );
}

// Slim Tool Box Component - Now clickable
interface SlimToolBoxProps {
  id: number;
  letter: string;
  name: string;
  description: string;
  category: string;
  votes: number;
  pricing: string;
}

function SlimToolBox({ id, letter, name, description, category, votes, pricing }: SlimToolBoxProps) {
  const getPricingStyle = (p: string) => {
    switch (p) {
      case "free":
        return "bg-black text-white font-bold";
      case "freemium":
        return "bg-black text-white font-bold";
      case "paid":
        return "bg-black text-white font-bold";
      default:
        return "bg-black text-white font-bold";
    }
  };

  const handleExternalLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://example.com/tool/${id}`, '_blank');
  };

  return (
    <Link 
      href={`/tool/${id}`}
      className="group flex items-center gap-3 rounded-lg border border-black/10 bg-white p-2.5 transition-all hover:border-black/20 hover:bg-black/5 md:gap-4 md:p-3"
    >
      {/* Logo */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black text-sm font-bold text-white md:h-12 md:w-12 md:text-base">
        {letter}
      </div>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
          <h4 className="text-sm font-semibold text-black">{name}</h4>
          {/* Tags visible on desktop, hidden on mobile */}
          <span className="hidden rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-black/70 md:inline-block">
            {category}
          </span>
          <span className={`hidden rounded-full px-2 py-0.5 text-[10px] uppercase md:inline-block ${getPricingStyle(pricing)}`}>
            {pricing}
          </span>
        </div>
        {/* Description - more prominent on mobile since tags are hidden */}
        <p className="mt-0.5 line-clamp-2 text-xs text-black/60 md:mt-1 md:line-clamp-1">{description}</p>
      </div>

      {/* External Link Button - Desktop only, visible on hover */}
      <button
        onClick={handleExternalLink}
        className="hidden shrink-0 items-center justify-center rounded-lg border border-black/10 bg-black/5 p-2 opacity-0 transition-all hover:bg-black hover:text-white group-hover:opacity-100 md:flex"
        title="Visit website"
      >
        <ExternalLink className="h-4 w-4" />
      </button>

      {/* Vote Buttons */}
      <VoteButtons votes={votes} />
    </Link>
  );
}

// All AI Tools Section with Filters (No Title)
function AllToolsSection() {
  const [activeFilter, setActiveFilter] = useState("popular");
  const [displayCount, setDisplayCount] = useState(50);
  const LOAD_MORE_COUNT = 20;
  
  const filters = [
    { id: "newest", label: "Newest" },
    { id: "popular", label: "Popular" },
    { id: "free", label: "Free" },
    { id: "freemium", label: "Freemium" },
    { id: "paid", label: "Paid" },
  ];

  const getFilteredTools = () => {
    const filtered = [...allTools];
    
    switch (activeFilter) {
      case "newest":
        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case "popular":
        return filtered.sort((a, b) => b.votes - a.votes);
      case "free":
        return filtered.filter(t => t.pricing === "free").sort((a, b) => b.votes - a.votes);
      case "freemium":
        return filtered.filter(t => t.pricing === "freemium").sort((a, b) => b.votes - a.votes);
      case "paid":
        return filtered.filter(t => t.pricing === "paid").sort((a, b) => b.votes - a.votes);
      default:
        return filtered;
    }
  };

  const filteredTools = getFilteredTools();
  const visibleTools = filteredTools.slice(0, displayCount);
  const hasMoreTools = displayCount < filteredTools.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + LOAD_MORE_COUNT);
  };

  // Reset display count when filter changes
  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    setDisplayCount(50);
  };

  return (
    <section className="px-4 pb-16 lg:px-56 xl:px-60">
      <div className="mx-auto max-w-7xl">
        {/* Filter Buttons - Right aligned */}
        <div className="mb-3 flex justify-end">
          <div className="flex flex-wrap gap-1.5">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterChange(filter.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  activeFilter === filter.id
                    ? "bg-black text-white"
                    : "border border-black/10 bg-black/5 text-black/70 hover:border-black/20 hover:text-black"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tools List */}
        <div className="flex flex-col gap-2">
          {visibleTools.map((tool) => (
            <SlimToolBox
              key={tool.id}
              id={tool.id}
              letter={tool.letter}
              name={tool.name}
              description={tool.description}
              category={tool.category}
              votes={tool.votes}
              pricing={tool.pricing}
            />
          ))}
        </div>

        {/* Load More */}
        {hasMoreTools && (
          <div className="mt-6 text-center">
            <button 
              onClick={handleLoadMore}
              className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-black/5 px-5 py-2 text-sm font-medium text-black transition-all hover:bg-black/10"
            >
              Load More Tools
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  const footerLinks = {
    Product: [
      { name: "Submit Tool", href: "#" },
      { name: "Pricing", href: "#" },
    ],
    Resources: [
      { name: "Blog", href: "#" },
      { name: "Newsletter", href: "#" },
      { name: "FAQ", href: "#" },
    ],
    Company: [
      { name: "About Us", href: "#" },
      { name: "Contact", href: "#" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "DMCA", href: "#" },
      { name: "Disclaimer", href: "#" },
    ],
  };

  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-56 xl:px-60">
        {/* Top Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-bold text-black">AI Directory</span>
            </Link>
            <p className="mt-3 max-w-xs text-xs text-black/60">
              The largest directory of AI tools. Discover, compare, and find the best AI solutions for your needs.
            </p>
            {/* Social Links */}
            <div className="mt-4 flex gap-3">
              {/* X (formerly Twitter) */}
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-black/5 text-black/60 transition-all hover:bg-black/10 hover:text-black">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Facebook */}
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-black/5 text-black/60 transition-all hover:bg-black/10 hover:text-black">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-black/5 text-black/60 transition-all hover:bg-black/10 hover:text-black">
                <Linkedin className="h-4 w-4" />
              </a>
              {/* Email */}
              <a href="mailto:contact@aidirectory.com" className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-black/5 text-black/60 transition-all hover:bg-black/10 hover:text-black">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-black">{title}</h4>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-xs text-black/60 transition-colors hover:text-black">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-black/10 pt-6 sm:flex-row">
          <p className="text-xs text-black/40">
            2024 AI Directory. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="text-xs text-black/40 transition-colors hover:text-black">
              Privacy
            </a>
            <a href="#" className="text-xs text-black/40 transition-colors hover:text-black">
              Terms
            </a>
            <a href="#" className="text-xs text-black/40 transition-colors hover:text-black">
              Cookies
            </a>
            <a href="#" className="text-xs text-black/40 transition-colors hover:text-black">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Page Component
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Side Ads - Now starts below header */}
      <FeaturedAdsSidebar />
      
      {/* Main Content */}
      <div className="pb-12 lg:pb-0">
        <main className="mx-auto max-w-7xl">
          <HeroSection />
          <CategoryChips />
          <AllToolsSection />
        </main>
        <Footer />
      </div>
      
      {/* Mobile Marquee Ads - Fixed Bottom */}
      <MobileMarqueeAds position="bottom" />
    </div>
  );
}
