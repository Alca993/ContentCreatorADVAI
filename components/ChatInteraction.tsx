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
        { role: "assistant", content: "⚠️ Errore durante la richiesta. Riprova tra qualche secondo." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: "🎵", text: "Adatta per TikTok", action: "Riscrivilo per TikTok con hook coinvolgenti" },
    { icon: "🎯", text: "Nuove CTA", action: "Suggerisci 3 call-to-action diverse e più efficaci" },
    { icon: "📱", text: "Instagram Stories", action: "Crea una versione per Instagram Stories" },
    { icon: "💡", text: "Più engagement", action: "Come posso aumentare l'engagement di questo post?" }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Area messaggi */}
      <div className="mb-6">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto mb-8">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => setUserInput(action.action)}
                  className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-blue-50 hover:to-blue-100 text-slate-700 hover:text-blue-700 rounded-2xl hover:shadow-md transition-all duration-300 font-medium border border-slate-200 hover:border-blue-200"
                >
                  <span className="text-lg mr-2">{action.icon}</span>
                  {action.text}
                </button>
              ))}
            </div>
            <p className="text-slate-500 text-sm">
              Oppure digita una richiesta personalizzata qui sotto
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[50vh] overflow-y-auto p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : "bg-white text-slate-800 border border-slate-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-800 border border-slate-200 p-4 rounded-2xl shadow-sm max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <span className="text-sm text-slate-600 ml-2">AI sta scrivendo...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Area input */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 transition-all duration-300">
        <div className="flex gap-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
            placeholder="Es. riscrivilo per TikTok, oppure: suggerisci CTA diverse..."
            className="flex-1 p-3 bg-transparent focus:outline-none text-slate-800 placeholder-slate-500"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !userInput.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>🚀</span>
            )}
            <span className="hidden sm:inline">
              {loading ? "Invio..." : "Invia"}
            </span>
          </button>
        </div>
      </div>

      {/* Suggerimenti rapidi (sempre visibili) */}
      {messages.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {quickActions.slice(0, 2).map((action, index) => (
            <button
              key={index}
              onClick={() => setUserInput(action.action)}
              className="text-xs px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all duration-200 border border-slate-200"
            >
              {action.icon} {action.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}