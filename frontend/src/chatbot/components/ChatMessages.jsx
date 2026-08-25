import ChatMessage from './ChatMessage.jsx';

export default function ChatMessages({ messages, typing, scrollRef, onCta }) {
  return (
    <div ref={scrollRef} className="easy-ai__messages" aria-live="polite">
      {messages.map((message) => <ChatMessage key={message.id} message={message} onCta={onCta} />)}
      {typing && (
        <div className="easy-ai__typing" aria-label="Easy AI is typing">
          <span />
          <span />
          <span />
        </div>
      )}
    </div>
  );
}
