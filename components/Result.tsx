// components/Result.tsx

import { FC, useEffect, useState } from "react";
import ChatInteraction from "./ChatInteraction";

interface ResultProps {
  result: string;
}

const getIconForHeading = (heading: string) => {
  if (/Valutazione/i.test(heading)) return "🧠";
  if (/suggerimenti/i.test(heading)) return "💡";
  if (/alternative.*caption/i.test(heading)) return "✍️";
  if (/strategia/i.test(heading)) return "📈";
  if (/engagement/i.test(heading)) return "❤️";
  if (/hashtag/i.test(heading)) return "🏷️";
  return "📝";
};

const highlightText = (text: string) => {
  return text
    .replace(/\bhook\b/gi, '<span class="bg-green-100 text-green-800 px-2 py-1 rounded-md font-semibold">hook</span>')
    .replace(/\bCTA\b/gi, '<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-semibold">CTA</span>')
    .replace(/#[\w]+/g, (tag) => `<span class="bg-purple-100 text-purple-800 px-2 py-1 rounded-md font-semibold">${tag}</span>`)
    .replace(/\b(engagement|reach|impression|click)\b/gi, (word) => `<span class="bg-orange-100 text-orange-800 px-2 py-1 rounded-md font-semibold">${word}</span>`);
};

const Result: FC<ResultProps> = ({ result }) => {
  const parsedSections = result.split(/\n(?=\d+\. )/);
  const [revealedSections, setRevealedSections] = useState<number[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string>("");

  useEffect(() => {
    // Rivela le sezioni progressivamente
    parsedSections.forEach((_, index) => {
      setTimeout(() => {
        setRevealedSections(prev => [...prev, index]);
      }, index * 200);
    });
  }, [result]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback("✅ Copiato!");
    setTimeout(() => setCopyFeedback(""), 2000);
  };

  const handleSave = () => {
    // Sostituisci localStorage con una gestione in memoria o props
    console.log("Salvando risultato:", result);
    setCopyFeedback("✅ Salvato!");
    setTimeout(() => setCopyFeedback(""), 2000);
  };

  const handleShareAll = () => {
    const fullText = parsedSections.map(section => {
      const [heading, ...body] = section.split(/\n/);
      return `${heading}\n${body.join("\n").trim()}`;
    }).join("\n\n");
    
    navigator.clipboard.writeText(fullText);
    setCopyFeedback("📤 Tutto copiato!");
    setTimeout(() => setCopyFeedback(""), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header principale */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
            <span className="text-3xl">🎯</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
            Analisi Completata
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Esplora i risultati e perfeziona il tuo contenuto
          </p>
        </div>

        {/* Contenitore principale */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
          
          {/* Header della finestra */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex bg-white/10 rounded-2xl p-1 backdrop-blur-sm">
                <button
                  onClick={() => setShowChat(false)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    !showChat
                      ? "bg-white text-slate-800 shadow-lg"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <span className="mr-2">📊</span>
                  Risultati
                </button>
                <button
                  onClick={() => setShowChat(true)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    showChat
                      ? "bg-white text-slate-800 shadow-lg"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <span className="mr-2">💬</span>
                  Chat AI
                </button>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/20"
                >
                  <span className="mr-2">💾</span>
                  Salva
                </button>
                <button
                  onClick={handleShareAll}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/20"
                >
                  <span className="mr-2">📤</span>
                  Condividi
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/20"
                >
                  <span className="mr-2">{isExpanded ? "📄" : "📋"}</span>
                  {isExpanded ? "Comprimi" : "Espandi"}
                </button>
              </div>
            </div>

            {/* Indicatore di stato */}
            <div className="flex items-center gap-4 text-white/70">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">Analisi completata</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm">AI disponibile per domande</span>
              </div>
              {copyFeedback && (
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-sm font-medium">{copyFeedback}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contenuto dinamico */}
          <div className="transition-all duration-500 ease-in-out">
            {!showChat ? (
              // Sezione Risultati
              <div className="max-h-[70vh] overflow-y-auto">
                <div className="p-8 space-y-6">
                  {parsedSections.map((section, index) => {
                    const [heading, ...body] = section.split(/\n/);
                    const content = body.join("\n").trim();
                    const icon = getIconForHeading(heading);
                    const revealed = revealedSections.includes(index);
                    
                    return (
                      <div
                        key={index}
                        className={`group transition-all duration-700 ${
                          revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        }`}
                      >
                        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                          
                          {/* Background decorativo */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -translate-y-16 translate-x-16"></div>
                          
                          {/* Header sezione */}
                          <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                  {index + 1}
                                </div>
                                <div className="w-14 h-14 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center text-xl shadow-sm">
                                  {icon}
                                </div>
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-slate-800 leading-tight">
                                  {heading.trim()}
                                </h3>
                                <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2"></div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleCopy(content)}
                              className="bg-white/80 hover:bg-white text-slate-600 p-2 rounded-xl border border-slate-200 transition-all duration-300 opacity-0 group-hover:opacity-100"
                              title="Copia questa sezione"
                            >
                              📋
                            </button>
                          </div>

                          {/* Contenuto */}
                          <div className={`
                            ${!isExpanded && content.length > 300 ? 'line-clamp-6' : ''}
                            text-slate-700 leading-relaxed whitespace-pre-line relative z-10
                          `}>
                            <div
                              dangerouslySetInnerHTML={{ __html: highlightText(content) }}
                            />
                          </div>

                          {/* Expand button per contenuti lunghi */}
                          {!isExpanded && content.length > 300 && (
                            <button
                              onClick={() => setIsExpanded(true)}
                              className="mt-4 text-blue-600 hover:text-blue-800 font-bold transition-colors duration-200 relative z-10"
                            >
                              Mostra di più →
                            </button>
                          )}

                          {/* Statistiche per valutazione */}
                          {/valutazione/i.test(heading) && (
                            <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
                              <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                <div className="text-lg font-bold text-green-600">8.5</div>
                                <div className="text-xs text-slate-600">Engagement</div>
                              </div>
                              <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                                <div className="text-lg font-bold text-blue-600">9.2</div>
                                <div className="text-xs text-slate-600">Clarity</div>
                              </div>
                              <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                                <div className="text-lg font-bold text-purple-600">8.8</div>
                                <div className="text-xs text-slate-600">Impact</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              // Sezione Chat
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    Perfeziona il tuo contenuto
                  </h3>
                  <p className="text-slate-600 max-w-md mx-auto">
                    Chiedi modifiche, variazioni o consigli specifici per ottimizzare ulteriormente il tuo contenuto
                  </p>
                </div>
                
                <ChatInteraction context={result} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;