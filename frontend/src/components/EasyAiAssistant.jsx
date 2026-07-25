import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, Bot, MessageCircle, Sparkles, X } from 'lucide-react';
import logo from '../assets/logo.png';
import { EASY_AI_SUGGESTIONS } from '../ai/knowledge.js';
import { findKnowledgeResponse } from '../ai/knowledgeEngine.js';
import { getInitialKnowledgeEntries, loadKnowledgeEntries } from '../ai/knowledgeService.js';
import {
  buildLocalMatch,
  endAssistantConversation,
  readConversationMeta,
  startAssistantConversation,
  startOrResumeConversation,
  submitAssistantQuestion,
  trackAssistantEvent,
  writeConversationMeta,
} from '../ai/assistantClient.js';

const STORAGE_KEY = 'easy-lane-ai-conversation-v1';
const WELCOME = `Hi 👋

I'm Easy AI.

I can help you understand Easy Lane, explain our modules and guide you to the right solution.`;
const INITIAL_MESSAGE = { id: 'welcome', role: 'assistant', text: WELCOME };

function restoreMessages() {
  if (typeof window === 'undefined') return [INITIAL_MESSAGE];
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
    return Array.isArray(stored) && stored.length ? stored : [INITIAL_MESSAGE];
  } catch {
    return [INITIAL_MESSAGE];
  }
}

function persistMessages(messages) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Ignore storage failures.
  }
}

const ChatMessage = memo(function ChatMessage({ message, onCta }) {
  const isAssistant = message.role === 'assistant';
  return (
    <div className={`easy-ai__message easy-ai__message--${message.role}`}>
      {isAssistant && <span className="easy-ai__message-avatar" aria-hidden="true"><Bot /></span>}
      <div className={`easy-ai__bubble easy-ai__bubble--${message.role}`}>
        <p>{message.text}</p>
        {message.ctaLabel && message.ctaTarget && (
          <button type="button" onClick={() => onCta(message.ctaTarget)}>
            {message.ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
});

function ChatWindow({ knowledgeEntries, onClose }) {
  const [messages, setMessages] = useState(restoreMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [hiddenSuggestions, setHiddenSuggestions] = useState([]);
  const scrollRef = useRef(null);
  const responseTimerRef = useRef(0);
  useEffect(() => {
    persistMessages(messages);
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => () => window.clearTimeout(responseTimerRef.current), []);

  const handleCta = useCallback((target) => {
    const destination = document.querySelector(target);
    if (destination) destination.scrollIntoView({ behavior: 'smooth', block: 'start' });
    onClose();
  }, [onClose]);

  const send = useCallback(async (rawQuestion, messageType = 'text') => {
    const question = String(rawQuestion || '').trim();
    if (!question || typing) return;
    const userMessage = { id: `user-${Date.now()}`, role: 'user', text: question };
    setMessages((current) => [...current, userMessage]);
    setInput('');
    setTyping(true);

    const meta = readConversationMeta();
    if (!meta.conversationId) {
      await startAssistantConversation({ entryPoint: 'assistant-widget', source: 'widget' }).catch(() => {});
    }

    const request = submitAssistantQuestion(question, { messageType, metadata: { source: 'widget' } })
      .then((response) => ({
        answer: response?.answer?.messageText || response?.answer?.text || response?.answer?.message || response?.answer || '',
        ctaLabel: response?.answer?.ctaLabel || response?.match?.entry?.ctaLabel || '',
        ctaTarget: response?.answer?.ctaTarget || response?.match?.entry?.ctaTarget || '',
        fallbackUsed: response?.match?.matchType === 'fallback',
        matchType: response?.match?.matchType || 'fallback',
      }))
      .catch(() => {
        const local = buildLocalMatch(question, knowledgeEntries);
        return {
          answer: local.answer || '',
          ctaLabel: local.ctaLabel || '',
          ctaTarget: local.ctaTarget || '',
          fallbackUsed: local.matchType === 'fallback',
          matchType: local.matchType || 'fallback',
        };
      });

    responseTimerRef.current = window.setTimeout(async () => {
      const result = await request;
      setMessages((current) => [...current, {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: result.answer || findKnowledgeResponse(question, knowledgeEntries).answer,
        ctaLabel: result.ctaLabel,
        ctaTarget: result.ctaTarget,
      }]);
      setTyping(false);
    }, 800);
  }, [knowledgeEntries, typing]);

  const submit = (event) => {
    event.preventDefault();
    send(input);
  };

  const quickQuestions = useMemo(() => EASY_AI_SUGGESTIONS, []);
  const visibleSuggestions = useMemo(
    () => quickQuestions.filter((question) => !hiddenSuggestions.includes(question)).slice(0, 4),
    [hiddenSuggestions, quickQuestions],
  );

  const sendSuggestion = useCallback((question) => {
    setHiddenSuggestions((current) => (current.includes(question) ? current : [...current, question]));
    void send(question, 'quick-question');
  }, [send]);

  return (
    <section className="easy-ai__window" role="dialog" aria-modal="false" aria-label="Ask Easy AI">
      <header className="easy-ai__header">
        <span className="easy-ai__avatar" aria-hidden="true"><img src={logo} alt="" /></span>
        <div className="easy-ai__header-copy">
          <div className="easy-ai__header-top">
            <strong>Ask Easy AI</strong>
            <span className="easy-ai__badge">AI Assistant — Beta</span>
          </div>
          <p className="easy-ai__status">Beta · Knowledge Assistant</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close assistant">
          <X />
        </button>
      </header>

      <div className="easy-ai__notice">
        This assistant is currently under development. Responses are based on approved Easy Lane information and may be limited.
      </div>

      <div ref={scrollRef} className="easy-ai__messages" aria-live="polite">
        {messages.map((message) => <ChatMessage key={message.id} message={message} onCta={handleCta} />)}
        {typing && (
          <div className="easy-ai__typing" aria-label="Easy AI is typing">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      <form className="easy-ai__composer" onSubmit={submit}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about Easy Lane..."
          aria-label="Message Easy AI"
        />
        <button type="submit" disabled={!input.trim() || typing} aria-label="Send message">
          <ArrowUp />
        </button>
      </form>

      <div className="easy-ai__suggestions" aria-label="Suggested questions">
        {visibleSuggestions.map((suggestion) => (
          <button key={suggestion} type="button" onClick={() => sendSuggestion(suggestion)}>
            {suggestion}
          </button>
        ))}
      </div>

      <footer className="easy-ai__footer">
        <Sparkles />
        Easy Lane knowledge assistant
      </footer>
    </section>
  );
}

export default function EasyAiAssistant() {
  const [open, setOpen] = useState(false);
  const [knowledgeEntries, setKnowledgeEntries] = useState(() => getInitialKnowledgeEntries());
  const previousOpenRef = useRef(false);
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    let alive = true;
    if (readConversationMeta().conversationId) {
      (async () => {
        try {
          await startOrResumeConversation({
            metadata: { entryPoint: 'assistant-widget' },
          });
          if (!alive) return;
          await trackAssistantEvent('widget_displayed', { metadata: { entryPoint: 'assistant-widget' } }).catch(() => {});
        } catch {
          // Best effort only; the local assistant still works if the backend is unavailable.
        }
      })();
    }
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  useEffect(() => {
    let alive = true;
    loadKnowledgeEntries().then(({ entries }) => {
      if (alive && Array.isArray(entries) && entries.length) setKnowledgeEntries(entries);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (previousOpenRef.current === open) return;
    if (open) {
      const eventType = hasOpenedRef.current ? 'widget_reopened' : 'widget_opened';
      hasOpenedRef.current = true;
      if (readConversationMeta().conversationId) {
        trackAssistantEvent(eventType, { metadata: { source: 'launcher' } }).catch(() => {});
      }
    } else if (previousOpenRef.current) {
      if (readConversationMeta().conversationId) {
        trackAssistantEvent('widget_closed', { metadata: { source: 'launcher' } }).catch(() => {});
        endAssistantConversation('inactive').catch(() => {});
      }
    }
    previousOpenRef.current = open;
  }, [open]);

  return (
    <aside className={`easy-ai ${open ? 'is-open' : ''}`}>
      {open && <ChatWindow knowledgeEntries={knowledgeEntries} onClose={() => setOpen(false)} />}
      <button
        type="button"
        className="easy-ai__launcher"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Ask Easy AI"
      >
        <MessageCircle />
        <span>Ask Easy AI</span>
      </button>
    </aside>
  );
}
