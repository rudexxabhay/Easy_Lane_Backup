import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { getInitialKnowledgeEntries, loadKnowledgeEntries } from '../../ai/knowledgeService.js';
import {
  endAssistantConversation,
  readConversationMeta,
  startOrResumeConversation,
  trackAssistantEvent,
} from '../../ai/assistantClient.js';
import { CHATBOT_CONFIG } from '../config/chatbotConfig.js';
import { buildUserMessage, processChatMessage } from '../services/chatbotService.js';
import { persistMessages, restoreMessages, sanitizeUserMessage } from '../utils/chatbotHelpers.js';
import ChatHeader from './ChatHeader.jsx';
import ChatInput from './ChatInput.jsx';
import ChatMessages from './ChatMessages.jsx';
import QuickActions from './QuickActions.jsx';

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
    const question = sanitizeUserMessage(rawQuestion);
    if (!question || typing) return;

    const userMessage = buildUserMessage(question, messageType);
    if (!userMessage) return;

    setMessages((current) => [...current, userMessage]);
    setInput('');
    setTyping(true);

    responseTimerRef.current = window.setTimeout(async () => {
      const result = await processChatMessage(question, { knowledgeEntries, messageType, history: messages });
      if (result?.assistantMessage) {
        setMessages((current) => [...current, result.assistantMessage]);
      }
      setTyping(false);
    }, CHATBOT_CONFIG.typingDelay);
  }, [knowledgeEntries, messages, typing]);

  const submit = useCallback((event) => {
    event.preventDefault();
    void send(input);
  }, [input, send]);

  const visibleSuggestions = useMemo(
    () => CHATBOT_CONFIG.quickActions
      .filter((question) => !hiddenSuggestions.includes(question))
      .slice(0, CHATBOT_CONFIG.maxVisibleQuickActions),
    [hiddenSuggestions],
  );

  const sendSuggestion = useCallback((question) => {
    setHiddenSuggestions((current) => (current.includes(question) ? current : [...current, question]));
    void send(question, 'quick-question');
  }, [send]);

  return (
    <section className="easy-ai__window" role="dialog" aria-modal="false" aria-label={CHATBOT_CONFIG.title}>
      <ChatHeader onClose={onClose} />

      <div className="easy-ai__notice">
        {CHATBOT_CONFIG.notice}
      </div>

      <ChatMessages messages={messages} typing={typing} scrollRef={scrollRef} onCta={handleCta} />
      <ChatInput input={input} typing={typing} onChange={setInput} onSubmit={submit} />
      <QuickActions suggestions={visibleSuggestions} onSelect={sendSuggestion} />

      <footer className="easy-ai__footer">
        <Sparkles />
        {CHATBOT_CONFIG.footerLabel}
      </footer>
    </section>
  );
}

export default function ChatbotWidget({ open, onClose }) {
  const [knowledgeEntries, setKnowledgeEntries] = useState(() => getInitialKnowledgeEntries());
  const knowledgeRequestedRef = useRef(false);
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
    if (!open) return undefined;
    const closeOnEscape = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || knowledgeRequestedRef.current) return undefined;
    knowledgeRequestedRef.current = true;
    loadKnowledgeEntries().then(({ entries }) => {
      if (Array.isArray(entries) && entries.length) setKnowledgeEntries(entries);
    }).catch(() => {});
    return undefined;
  }, [open]);

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

  return open ? <ChatWindow knowledgeEntries={knowledgeEntries} onClose={onClose} /> : null;
}
