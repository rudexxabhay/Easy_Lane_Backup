import { ArrowUp } from 'lucide-react';
import { CHATBOT_CONFIG } from '../config/chatbotConfig.js';

export default function ChatInput({ input, typing, onChange, onSubmit }) {
  return (
    <form className="easy-ai__composer" onSubmit={onSubmit}>
      <input
        value={input}
        onChange={(event) => onChange(event.target.value)}
        placeholder={CHATBOT_CONFIG.inputPlaceholder}
        aria-label={`Message ${CHATBOT_CONFIG.chatbotName}`}
        maxLength={CHATBOT_CONFIG.maxMessageLength}
      />
      <button type="submit" disabled={!input.trim() || typing} aria-label="Send message">
        <ArrowUp />
      </button>
    </form>
  );
}
