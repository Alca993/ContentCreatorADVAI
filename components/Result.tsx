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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2 sm:p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header principale - Responsivo */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
            <span className="text-2xl sm:text-3xl">🎯</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-2 sm:mb-4 px-4">
            Analisi Completata
          </h1>
          <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
            Esplora i risultati e perfeziona il tuo contenuto
          </p>
        </div>

        {/* Contenitore principale - Completamente responsivo */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
          
          {/* Header della finestra - Mobile First */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
              
              {/* Tab Navigation - Responsivo */}
              <div className="flex bg-white/10 rounded-xl sm:rounded-2xl p-1 backdrop-blur-sm w-full sm:w-auto">
                <button
                  onClick={() => setShowChat(false)}
                  className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all duration-300 text-sm sm:text-base ${
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
                  className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all duration-300 text-sm sm:text-base ${
                    showChat
                      ? "bg-white text-slate-800 shadow-lg"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <span className="mr-2">💬</span>
                  Chat AI
                </button>
              </div>
              
              {/* Action Buttons - Stack su mobile */}
              <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={handleSave}
                  className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 text-white font-bold py-2 sm:py-3 px-3 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/20 text-sm sm:text-base"
                >
                  <span className="mr-1 sm:mr-2">💾</span>
                  <span className="hidden xs:inline">Salva</span>
                </button>
                <button
                  onClick={handleShareAll}
                  className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 text-white font-bold py-2 sm:py-3 px-3 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/20 text-sm sm:text-base"
                >
                  <span className="mr-1 sm:mr-2">📤</span>
                  <span className="hidden xs:inline">Condividi</span>
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 text-white font-bold py-2 sm:py-3 px-3 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/20 text-sm sm:text-base"
                >
                  <span className="mr-1 sm:mr-2">{isExpanded ? "📄" : "📋"}</span>
                  <span className="hidden sm:inline">{isExpanded ? "Comprimi" : "Espandi"}</span>
                </button>
              </div>
            </div>

            {/* Indicatori di stato - Responsive */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-white/70 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                <span>Analisi completata</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                <span className="hidden sm:inline">AI disponibile per domande</span>
                <span className="sm:hidden">AI attiva</span>
              </div>
              {copyFeedback && (
                <div className="flex items-center gap-2 bg-green-500/20 px-2 py-1 rounded-lg">
                  <span className="text-green-400 font-medium">{copyFeedback}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contenuto dinamico - Altezza ottimizzata */}
          <div className="transition-all duration-500 ease-in-out">
            {!showChat ? (
              // Sezione Risultati - Mobile Optimized
              <div className="max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
                <div className="p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
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
                        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                          
                          {/* Background decorativo - Responsive */}
                          <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -translate-y-10 sm:-translate-y-16 translate-x-10 sm:translate-x-16"></div>
                          
                          {/* Header sezione - Mobile First */}
                          <div className="flex items-start justify-between mb-3 sm:mb-4 relative z-10">
                            <div className="flex items-start gap-3 sm:gap-4 flex-1">
                              <div className="relative flex-shrink-0">
                                <div className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                  {index + 1}
                                </div>
                                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white border-2 border-slate-200 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl shadow-sm">
                                  {icon}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight mb-2 break-words">
                                  {heading.trim()}
                                </h3>
                                <div className="w-8 sm:w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleCopy(content)}
                              className="bg-white/80 hover:bg-white text-slate-600 p-2 rounded-lg sm:rounded-xl border border-slate-200 transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 flex-shrink-0 ml-2"
                              title="Copia questa sezione"
                            >
                              <span className="text-sm">📋</span>
                            </button>
                          </div>

                          {/* Contenuto - Typography responsive */}
                          <div className={`
                            ${!isExpanded && content.length > 200 ? 'line-clamp-4 sm:line-clamp-6' : ''}
                            text-slate-700 leading-relaxed whitespace-pre-line relative z-10 text-sm sm:text-base
                          `}>
                            <div
                              dangerouslySetInnerHTML={{ __html: highlightText(content) }}
                            />
                          </div>

                          {/* Expand button - Mobile optimized */}
                          {!isExpanded && content.length > 200 && (
                            <button
                              onClick={() => setIsExpanded(true)}
                              className="mt-3 sm:mt-4 text-blue-600 hover:text-blue-800 font-bold transition-colors duration-200 relative z-10 text-sm sm:text-base"
                            >
                              Mostra di più →
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              // Sezione Chat - Mobile First
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl">🤖</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
                    Perfeziona il tuo contenuto
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto px-4">
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