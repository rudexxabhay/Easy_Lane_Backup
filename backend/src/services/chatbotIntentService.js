import { normalizeText } from './assistantService.js';

const GREETING_PATTERNS = [
  'hi', 'hello', 'hey', 'namaste', 'good morning', 'good afternoon', 'good evening',
  'kaise ho', 'kaise ho?', 'kya haal hai', 'kese ho', 'hola',
];

const DEMO_PATTERNS = [
  'book demo', 'book a demo', 'i want a demo', 'schedule a demo', 'can i schedule a demo',
  'demo chahiye', 'mujhe demo chahiye', 'mujhe demo lena hai', 'mujhe demo book karna hai',
  'mera demo book krdo', 'mera demo book kar do', 'demo arrange kro', 'demo karwa do',
];

const SUPPORT_PATTERNS = [
  'i need support', 'contact support', 'support chahiye', 'mujhe support chahiye',
  'mujhe help chahiye', 'team se baat karni hai', 'issue report karna hai',
  'support kaise milega', 'help me with support',
];

function includesPattern(text = '', patterns = []) {
  return patterns.some((pattern) => text === pattern || text.includes(pattern));
}

export function detectChatbotIntent(message = '') {
  const normalized = normalizeText(message);

  if (!normalized) {
    return { intent: 'empty', label: 'Empty' };
  }

  if (includesPattern(normalized, DEMO_PATTERNS)) {
    return { intent: 'book_demo', label: 'Book Demo' };
  }

  if (includesPattern(normalized, SUPPORT_PATTERNS)) {
    return { intent: 'contact_support', label: 'Contact Support' };
  }

  if (includesPattern(normalized, GREETING_PATTERNS)) {
    return { intent: 'greeting', label: 'Greeting' };
  }

  return { intent: 'knowledge_question', label: 'Knowledge Question' };
}

export function getGreetingMessage(language = 'en') {
  return {
    en: 'Hi! I can help with Easy Lane, TMS, Fleet Management, Bill Discounting, demos and support. What would you like to know?',
    hi: 'नमस्ते! मैं Easy Lane, TMS, Fleet Management, Bill Discounting, डेमो और सपोर्ट से जुड़े सवालों में मदद कर सकता हूँ। आप क्या जानना चाहेंगे?',
    hinglish: 'Hi! Main Easy Lane, TMS, Fleet Management, Bill Discounting, demo aur support se related help kar sakta hoon. Aap kya jaanna chahenge?',
  }[language] || 'Hi! I can help with Easy Lane, TMS, Fleet Management, Bill Discounting, demos and support. What would you like to know?';
}

export function getDemoIntentResponse(language = 'en') {
  return {
    en: {
      message: 'You can book an Easy Lane demo to explore the platform and relevant modules for your workflow.',
      ctaLabel: 'Book Demo',
      ctaTarget: '#contact',
    },
    hi: {
      message: 'आप Easy Lane डेमो बुक करके प्लेटफ़ॉर्म और अपनी जरूरत के modules को देख सकते हैं।',
      ctaLabel: 'Book Demo',
      ctaTarget: '#contact',
    },
    hinglish: {
      message: 'Aap Easy Lane demo book karke platform aur apne workflow ke relevant modules dekh sakte hain.',
      ctaLabel: 'Book Demo',
      ctaTarget: '#contact',
    },
  }[language] || {
    message: 'You can book an Easy Lane demo to explore the platform and relevant modules for your workflow.',
    ctaLabel: 'Book Demo',
    ctaTarget: '#contact',
  };
}

export function getSupportIntentResponse(language = 'en') {
  return {
    en: {
      message: 'You can contact the Easy Lane team through our support/contact section for help with your operations or product questions.',
      ctaLabel: 'Contact Support',
      ctaTarget: '#contact',
    },
    hi: {
      message: 'आप अपनी operations या product-related मदद के लिए Easy Lane टीम से support/contact section के माध्यम से संपर्क कर सकते हैं।',
      ctaLabel: 'Contact Support',
      ctaTarget: '#contact',
    },
    hinglish: {
      message: 'Aap apni operations ya product-related help ke liye Easy Lane team se support/contact section ke through contact kar sakte hain.',
      ctaLabel: 'Contact Support',
      ctaTarget: '#contact',
    },
  }[language] || {
    message: 'You can contact the Easy Lane team through our support/contact section for help with your operations or product questions.',
    ctaLabel: 'Contact Support',
    ctaTarget: '#contact',
  };
}

