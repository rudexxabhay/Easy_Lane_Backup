import { X } from 'lucide-react';
import { CHATBOT_CONFIG } from '../config/chatbotConfig.js';

export default function ChatHeader({ onClose }) {
  return (
    <header className="easy-ai__header">
      <span className="easy-ai__avatar" aria-hidden="true"><img src="/easylane-logo.svg" alt="" /></span>
      <div className="easy-ai__header-copy">
        <div className="easy-ai__header-top">
          <strong>{CHATBOT_CONFIG.title}</strong>
          <span className="easy-ai__badge">{CHATBOT_CONFIG.badge}</span>
        </div>
        <p className="easy-ai__status">{CHATBOT_CONFIG.status}</p>
      </div>
      <button type="button" onClick={onClose} aria-label="Close assistant">
        <X />
      </button>
    </header>
  );
}
