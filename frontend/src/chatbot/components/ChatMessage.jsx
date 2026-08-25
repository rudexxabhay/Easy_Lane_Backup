import { memo } from 'react';
import { Bot } from 'lucide-react';

const SHOW_DEBUG_SOURCE = import.meta.env.DEV && String(import.meta.env.VITE_CHATBOT_DEBUG_SOURCE || '').toLowerCase() === 'true';

function sourceBadge(source = '') {
  if (source === 'grok_grounded') return 'AI';
  if (source === 'kb_fallback_variant' || source === 'kb_fallback_base' || source === 'kb_unknown') return 'KB';
  if (source === 'demo_intent') return 'DEMO';
  if (source === 'support_intent') return 'SUPPORT';
  return 'RULE';
}

const ChatMessage = memo(function ChatMessage({ message, onCta }) {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`easy-ai__message easy-ai__message--${message.role}`}>
      {isAssistant && <span className="easy-ai__message-avatar" aria-hidden="true"><Bot /></span>}
      <div className={`easy-ai__bubble easy-ai__bubble--${message.role}`}>
        {isAssistant && SHOW_DEBUG_SOURCE && message.source && (
          <span className="mb-1 inline-flex rounded-full border border-slate-300 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
            {sourceBadge(message.source)}
          </span>
        )}
        <p>{message.content}</p>
        {message.ctaLabel && message.ctaTarget && (
          <button type="button" onClick={() => onCta(message.ctaTarget)}>
            {message.ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
});

export default ChatMessage;
