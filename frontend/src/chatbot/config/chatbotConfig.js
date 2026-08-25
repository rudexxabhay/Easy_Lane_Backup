import { EASY_AI_SUGGESTIONS } from '../../ai/knowledge.js';

export const CHATBOT_STORAGE_KEY = 'easy-lane-ai-conversation-v1';

export const CHATBOT_CONFIG = {
  chatbotName: 'Easy AI',
  title: 'Ask Easy AI',
  launcherLabel: 'Ask Easy AI',
  badge: 'AI Assistant — Beta',
  status: 'Beta · Knowledge Assistant',
  footerLabel: 'Easy Lane knowledge assistant',
  inputPlaceholder: 'Ask about Easy Lane...',
  notice: 'This assistant is currently under development. Responses are based on approved Easy Lane information and may be limited.',
  welcomeMessage: `Hi 👋

I'm Easy AI.

I can help you understand Easy Lane, explain our modules and guide you to the right solution.`,
  defaultFallbackMessage: "I don't have a verified answer for that yet.\n\nYou can ask about:\n\n• TMS\n• Fleet\n• AMS\n• Finance\n• Tracking\n• Integrations\n• Book Demo",
  fallbackMessages: {
    en: "I don't have a verified Easy Lane answer for that yet.\n\nYou can ask about:\n\n• TMS\n• Fleet\n• AMS\n• Finance\n• Tracking\n• Integrations\n• Book Demo",
    hi: 'मेरे पास अभी उस सवाल का verified Easy Lane जवाब उपलब्ध नहीं है।\n\nआप TMS, Fleet, AMS, Finance, Tracking, Integrations या Demo के बारे में पूछ सकते हैं।',
    hinglish: 'Mere paas abhi us question ka verified Easy Lane answer nahi hai.\n\nAap TMS, Fleet, AMS, Finance, Tracking, Integrations ya Demo ke baare me pooch sakte hain.',
  },
  quickActions: EASY_AI_SUGGESTIONS,
  maxVisibleQuickActions: 4,
  maxMessageLength: 5000,
  typingDelay: 800,
};
