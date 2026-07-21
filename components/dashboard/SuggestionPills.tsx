export default function SuggestionPills() {
  const suggestions = [
    { text: "Skin Analysis", icon: "✨" },
    { text: "Outfit Ideas", icon: "👔" },
    { text: "Hairstyle Advice", icon: "💇" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-5">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.text}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#ECE8E2] shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-sm font-medium text-[#1D1D1F] hover:border-[#C98766]/40 hover:shadow-[0_4px_12px_rgba(201,135,102,0.08)] transition-all duration-200"
        >
          <span>{suggestion.icon}</span>
          <span>{suggestion.text}</span>
        </button>
      ))}
    </div>
  );
}
