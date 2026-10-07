import { lazy, Suspense, useCallback, useState } from 'react';
import { MessageCircle } from 'lucide-react';

const ChatbotWidget = lazy(() => import('../chatbot/components/ChatbotWidget.jsx'));

function ChatbotLoadingFallback({ onClose }) {
  return (
    <section className="easy-ai__window" role="dialog" aria-modal="false" aria-label="Ask Easy AI" aria-busy="true">
      <header className="easy-ai__header">
        <span className="easy-ai__avatar" aria-hidden="true"><MessageCircle /></span>
        <div className="easy-ai__header-copy">
          <strong>Ask Easy AI</strong>
          <p className="easy-ai__status">Knowledge Assistant</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close assistant">×</button>
      </header>
      <div className="easy-ai__messages" role="status">Loading assistant…</div>
    </section>
  );
}

export default function EasyAiAssistant() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const closeChat = useCallback(() => setOpen(false), []);

  const openChat = () => {
    setLoaded(true);
    setOpen(true);
  };

  return (
    <aside className={`easy-ai ${open ? 'is-open' : ''}`}>
      {loaded && (
        <Suspense fallback={<ChatbotLoadingFallback onClose={closeChat} />}>
          <ChatbotWidget open={open} onClose={closeChat} />
        </Suspense>
      )}
      <button
        type="button"
        className="easy-ai__launcher"
        onClick={openChat}
        aria-expanded={open}
        aria-label="Ask Easy AI"
      >
        <MessageCircle />
        <span>Ask Easy AI</span>
      </button>
    </aside>
  );
}
