export interface ChatTool {
  id: string;
  name: string;
  description: string;
  category: string;
  pricing: "FREE" | "FREEMIUM" | "PAID";
  votes: number;
  initial: string;
}

export interface FeaturedTool {
  id: string;
  name: string;
  description: string;
  bgColor: string;
}

export const featuredToolsLeft: FeaturedTool[] = [
  { id: "f1", name: "KeywordAI", description: "SEO keyword research", bgColor: "bg-rose-50" },
  { id: "f2", name: "LearnAI", description: "Educational platform", bgColor: "bg-slate-100" },
  { id: "f3", name: "MediaGen", description: "Media generation AI", bgColor: "bg-amber-50" },
  { id: "f4", name: "NeuralDev", description: "AI development tools", bgColor: "bg-sky-50" },
  { id: "f5", name: "OptimizeAI", description: "Performance optimizer", bgColor: "bg-purple-50" },
];

export const featuredToolsRight: FeaturedTool[] = [
  { id: "f6", name: "PredictAI", description: "Predictive analytics", bgColor: "bg-orange-50" },
  { id: "f7", name: "QuickAI", description: "Rapid AI deployment", bgColor: "bg-slate-100" },
  { id: "f8", name: "ReachAI", description: "Marketing outreach", bgColor: "bg-emerald-50" },
  { id: "f9", name: "SpeakAI", description: "Voice synthesis", bgColor: "bg-rose-50" },
  { id: "f10", name: "TranslateAI", description: "Real-time translation", bgColor: "bg-blue-50" },
];

export const allChatTools: ChatTool[] = [
  { id: "1", name: "ChatGPT", description: "Advanced conversational AI for writing, analysis, and coding assistance", category: "CHAT", pricing: "FREEMIUM", votes: 15400, initial: "C" },
  { id: "2", name: "Claude", description: "Anthropic AI assistant focused on helpfulness and nuanced reasoning", category: "CHAT", pricing: "FREEMIUM", votes: 12800, initial: "C" },
  { id: "3", name: "Gemini", description: "Google's multimodal AI for text, image, and code understanding", category: "CHAT", pricing: "FREEMIUM", votes: 11200, initial: "G" },
  { id: "4", name: "Copilot", description: "Microsoft AI assistant integrated with Office and Windows", category: "CHAT", pricing: "FREEMIUM", votes: 10500, initial: "C" },
  { id: "5", name: "Perplexity", description: "AI-powered search engine with real-time web browsing", category: "CHAT", pricing: "FREEMIUM", votes: 9800, initial: "P" },
  { id: "6", name: "Pi", description: "Personal AI companion for meaningful conversations", category: "CHAT", pricing: "FREE", votes: 8900, initial: "P" },
  { id: "7", name: "Poe", description: "Platform for chatting with multiple AI models", category: "CHAT", pricing: "FREEMIUM", votes: 8200, initial: "P" },
  { id: "8", name: "Character.AI", description: "Create and chat with AI characters and personalities", category: "CHAT", pricing: "FREEMIUM", votes: 7800, initial: "C" },
  { id: "9", name: "Jasper Chat", description: "AI chat assistant for marketing and business content", category: "CHAT", pricing: "PAID", votes: 7500, initial: "J" },
  { id: "10", name: "YouChat", description: "AI search assistant with cited sources", category: "CHAT", pricing: "FREE", votes: 7200, initial: "Y" },
  { id: "11", name: "Replika", description: "AI companion for emotional support and conversation", category: "CHAT", pricing: "FREEMIUM", votes: 6900, initial: "R" },
  { id: "12", name: "Chatsonic", description: "AI chatbot with real-time data and voice capabilities", category: "CHAT", pricing: "FREEMIUM", votes: 6600, initial: "C" },
  { id: "13", name: "HuggingChat", description: "Open-source AI chat powered by community models", category: "CHAT", pricing: "FREE", votes: 6300, initial: "H" },
  { id: "14", name: "Bing Chat", description: "Microsoft's AI-powered search and chat experience", category: "CHAT", pricing: "FREE", votes: 6100, initial: "B" },
  { id: "15", name: "Llama Chat", description: "Meta's open-source large language model chat interface", category: "CHAT", pricing: "FREE", votes: 5900, initial: "L" },
  { id: "16", name: "Mistral Chat", description: "European AI chat with strong reasoning capabilities", category: "CHAT", pricing: "FREEMIUM", votes: 5700, initial: "M" },
  { id: "17", name: "Cohere Chat", description: "Enterprise AI chat with customizable responses", category: "CHAT", pricing: "PAID", votes: 5500, initial: "C" },
  { id: "18", name: "AI21 Chat", description: "Powerful AI chat with Jurassic language models", category: "CHAT", pricing: "PAID", votes: 5300, initial: "A" },
  { id: "19", name: "DeepSeek", description: "Chinese AI chat assistant for coding and reasoning", category: "CHAT", pricing: "FREE", votes: 5100, initial: "D" },
  { id: "20", name: "Groq Chat", description: "Ultra-fast AI inference for instant responses", category: "CHAT", pricing: "FREE", votes: 4900, initial: "G" },
  { id: "21", name: "Anthropic Console", description: "Direct access to Claude models for developers", category: "CHAT", pricing: "PAID", votes: 4700, initial: "A" },
  { id: "22", name: "OpenRouter", description: "Access multiple AI models through one interface", category: "CHAT", pricing: "FREEMIUM", votes: 4500, initial: "O" },
  { id: "23", name: "Together AI", description: "Open-source AI models with fast inference", category: "CHAT", pricing: "FREEMIUM", votes: 4300, initial: "T" },
  { id: "24", name: "Anyscale", description: "Scalable AI chat infrastructure for enterprises", category: "CHAT", pricing: "PAID", votes: 4100, initial: "A" },
  { id: "25", name: "Forefront", description: "AI assistant with internet access and personas", category: "CHAT", pricing: "FREEMIUM", votes: 3900, initial: "F" },
  { id: "26", name: "Phind", description: "AI search engine optimized for developers", category: "CHAT", pricing: "FREEMIUM", votes: 3800, initial: "P" },
  { id: "27", name: "Khanmigo", description: "Khan Academy's AI tutor for education", category: "CHAT", pricing: "PAID", votes: 3700, initial: "K" },
  { id: "28", name: "Woebot", description: "AI chatbot for mental health support", category: "CHAT", pricing: "FREE", votes: 3600, initial: "W" },
  { id: "29", name: "Wysa", description: "AI-powered mental wellness companion", category: "CHAT", pricing: "FREEMIUM", votes: 3500, initial: "W" },
  { id: "30", name: "Drift", description: "Conversational AI for sales and marketing", category: "CHAT", pricing: "PAID", votes: 3400, initial: "D" },
  { id: "31", name: "Intercom Fin", description: "AI customer support agent for businesses", category: "CHAT", pricing: "PAID", votes: 3300, initial: "I" },
  { id: "32", name: "Ada", description: "AI-powered customer service automation", category: "CHAT", pricing: "PAID", votes: 3200, initial: "A" },
  { id: "33", name: "Tidio", description: "Live chat with AI-powered chatbot", category: "CHAT", pricing: "FREEMIUM", votes: 3100, initial: "T" },
  { id: "34", name: "Zendesk AI", description: "AI-enhanced customer support platform", category: "CHAT", pricing: "PAID", votes: 3000, initial: "Z" },
  { id: "35", name: "Freshdesk AI", description: "AI assistant for customer service teams", category: "CHAT", pricing: "PAID", votes: 2900, initial: "F" },
  { id: "36", name: "Chatfuel", description: "No-code chatbot builder for businesses", category: "CHAT", pricing: "FREEMIUM", votes: 2800, initial: "C" },
  { id: "37", name: "ManyChat", description: "Chat marketing platform for social media", category: "CHAT", pricing: "FREEMIUM", votes: 2700, initial: "M" },
  { id: "38", name: "Botpress", description: "Open-source conversational AI platform", category: "CHAT", pricing: "FREEMIUM", votes: 2600, initial: "B" },
  { id: "39", name: "Rasa", description: "Open-source machine learning for chatbots", category: "CHAT", pricing: "FREEMIUM", votes: 2500, initial: "R" },
  { id: "40", name: "Dialogflow", description: "Google's natural language understanding platform", category: "CHAT", pricing: "FREEMIUM", votes: 2400, initial: "D" },
  { id: "41", name: "Amazon Lex", description: "AWS conversational interfaces service", category: "CHAT", pricing: "PAID", votes: 2300, initial: "A" },
  { id: "42", name: "IBM Watson", description: "Enterprise AI assistant with deep learning", category: "CHAT", pricing: "PAID", votes: 2200, initial: "I" },
  { id: "43", name: "Kuki AI", description: "Award-winning conversational AI chatbot", category: "CHAT", pricing: "FREE", votes: 2100, initial: "K" },
  { id: "44", name: "Cleverbot", description: "Classic AI chat that learns from conversations", category: "CHAT", pricing: "FREE", votes: 2000, initial: "C" },
  { id: "45", name: "SimSimi", description: "Fun AI chatbot for casual conversations", category: "CHAT", pricing: "FREE", votes: 1900, initial: "S" },
  { id: "46", name: "Chai", description: "Platform for AI chat entertainment", category: "CHAT", pricing: "FREEMIUM", votes: 1800, initial: "C" },
  { id: "47", name: "Crushon AI", description: "AI companion for roleplay conversations", category: "CHAT", pricing: "FREEMIUM", votes: 1700, initial: "C" },
  { id: "48", name: "Candy AI", description: "Virtual AI girlfriend/boyfriend companion", category: "CHAT", pricing: "FREEMIUM", votes: 1600, initial: "C" },
  { id: "49", name: "Inflection AI", description: "Personal AI with emotional intelligence", category: "CHAT", pricing: "FREE", votes: 1500, initial: "I" },
  { id: "50", name: "xAI Grok", description: "Elon Musk's AI with real-time X integration", category: "CHAT", pricing: "PAID", votes: 1400, initial: "X" },
  // Additional tools for "Load More"
  { id: "51", name: "Anthropic API", description: "Direct API access to Claude models", category: "CHAT", pricing: "PAID", votes: 1350, initial: "A" },
  { id: "52", name: "OpenAI API", description: "API access to GPT models for developers", category: "CHAT", pricing: "PAID", votes: 1300, initial: "O" },
  { id: "53", name: "Vercel AI SDK", description: "Build AI-powered apps with streaming responses", category: "CHAT", pricing: "FREE", votes: 1250, initial: "V" },
  { id: "54", name: "LangChain", description: "Framework for building LLM applications", category: "CHAT", pricing: "FREE", votes: 1200, initial: "L" },
  { id: "55", name: "AutoGPT", description: "Autonomous AI agent that completes tasks", category: "CHAT", pricing: "FREE", votes: 1150, initial: "A" },
  { id: "56", name: "AgentGPT", description: "Browser-based autonomous AI agents", category: "CHAT", pricing: "FREE", votes: 1100, initial: "A" },
  { id: "57", name: "BabyAGI", description: "AI-powered task management system", category: "CHAT", pricing: "FREE", votes: 1050, initial: "B" },
  { id: "58", name: "SuperAGI", description: "Open-source autonomous AI framework", category: "CHAT", pricing: "FREE", votes: 1000, initial: "S" },
  { id: "59", name: "Claude Dev", description: "AI coding assistant in VS Code", category: "CHAT", pricing: "FREEMIUM", votes: 950, initial: "C" },
  { id: "60", name: "Cursor", description: "AI-first code editor with chat", category: "CHAT", pricing: "FREEMIUM", votes: 900, initial: "C" },
  { id: "61", name: "Codeium", description: "Free AI code completion and chat", category: "CHAT", pricing: "FREE", votes: 850, initial: "C" },
  { id: "62", name: "Tabnine", description: "AI assistant for software developers", category: "CHAT", pricing: "FREEMIUM", votes: 800, initial: "T" },
  { id: "63", name: "Sourcegraph Cody", description: "AI coding assistant with codebase context", category: "CHAT", pricing: "FREEMIUM", votes: 750, initial: "S" },
  { id: "64", name: "Replit AI", description: "AI pair programmer in the browser", category: "CHAT", pricing: "FREEMIUM", votes: 700, initial: "R" },
  { id: "65", name: "GitHub Copilot", description: "AI pair programmer from GitHub", category: "CHAT", pricing: "PAID", votes: 650, initial: "G" },
  { id: "66", name: "Amazon Q", description: "AWS AI assistant for developers", category: "CHAT", pricing: "FREEMIUM", votes: 600, initial: "A" },
  { id: "67", name: "Notion AI", description: "AI writing assistant in Notion", category: "CHAT", pricing: "PAID", votes: 550, initial: "N" },
  { id: "68", name: "Grammarly AI", description: "AI writing and grammar assistant", category: "CHAT", pricing: "FREEMIUM", votes: 500, initial: "G" },
  { id: "69", name: "Writesonic", description: "AI content writing and chatbot", category: "CHAT", pricing: "FREEMIUM", votes: 450, initial: "W" },
  { id: "70", name: "Copy AI", description: "AI copywriting and content generation", category: "CHAT", pricing: "FREEMIUM", votes: 400, initial: "C" },
];
