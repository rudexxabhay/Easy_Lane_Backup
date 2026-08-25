export default function QuickActions({ suggestions, onSelect }) {
  return (
    <div className="easy-ai__suggestions" aria-label="Suggested questions">
      {suggestions.map((suggestion) => (
        <button key={suggestion} type="button" onClick={() => onSelect(suggestion)}>
          {suggestion}
        </button>
      ))}
    </div>
  );
}
