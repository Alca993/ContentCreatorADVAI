import { useState } from "react";

interface ChatInteractionProps {
  context: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInteraction({ context }: ChatInteractionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const initialPrompt = messages.length === 0
      ? `Contesto post originale:\n${context}\n\n${userInput}`
      : userInput;

    const newMessages: Message[] = [...messages, { role: "user", content: initialPrompt }];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (data.result) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.result }]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Errore durante la richiesta." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 max-w-4xl mx-auto bg-white/90 rounded-2xl p-6 border border-slate-200 shadow-xl animate-fade-in">
      <h3 className="text-xl font-bold text-slate-800 mb-4">💬 Continua la conversazione con l'AI</h3>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 mb-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl ${
              msg.role === "user"
                ? "bg-blue-100 text-blue-800 self-end"
                : "bg-slate-100 text-slate-800"
            }`}
          >
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Es. riscrivilo per TikTok, oppure: suggerisci CTA diverse..."
          className="flex-1 p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold disabled:opacity-50"
        >
          {loading ? "..." : "Invia"}
        </button>
      </div>
    </div>
  );
}
