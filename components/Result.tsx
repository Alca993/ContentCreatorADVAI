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
    // Feedback visivo per il copy
    const button = document.activeElement as HTMLElement;
    if (button) {
      const originalText = button.textContent;
      button.textContent = "✅ Copiato!";
      setTimeout(() => {
        button.textContent = originalText;
      }, 1500);
    }
  };

  const handleSave = () => {
    const savedResults = JSON.parse(localStorage.getItem("aiResults") || "[]");
    savedResults.push({ result, timestamp: new Date().toISOString() });
    localStorage.setItem("aiResults", JSON.stringify(savedResults));
    
    // Feedback visivo migliorato
    const button = document.activeElement as HTMLElement;
    if (button) {
      const originalText = button.textContent;
      button.textContent = "✅ Salvato!";
      button.classList.add("from-green-500", "to-green-600");
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("from-green-500", "to-green-600");
      }, 2000);
    }
  };

  const handleShareAll = () => {
    const fullText = parsedSections.map(section => {
      const [heading, ...body] = section.split(/\n/);
      return `${heading}\n${body.join("\n").trim()}`;
    }).join("\n\n");
    
    navigator.clipboard.writeText(fullText);
    alert("📤 Tutto il contenuto copiato per la condivisione!");
  };

  return (
    <>
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        /* Scrollbar personalizzata */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
      
      <div className="max-w-6xl mx-auto">
        {/* Finestra Unica per i Risultati */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
          
          {/* Header della finestra */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-3xl">🎯</span>
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">
                    Risultati Analisi
                  </h2>
                  <p className="text-slate-300 text-lg font-medium">
                    Contenuto generato e ottimizzato per il tuo social media
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleSave}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl shadow-xl border border-white/20 flex items-center gap-2 backdrop-blur-sm"
                >
                  <span>💾</span> Salva
                </button>
                <button
                  onClick={handleShareAll}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl shadow-xl border border-white/20 flex items-center gap-2 backdrop-blur-sm"
                >
                  <span>📤</span> Condividi
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl shadow-xl border border-white/20 flex items-center gap-2 backdrop-blur-sm"
                >
                  <span>{isExpanded ? "📄" : "📋"}</span> 
                  {isExpanded ? "Comprimi" : "Espandi"}
                </button>
              </div>
            </div>
          </div>

          {/* Contenuto scrollabile */}
          <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="p-8 space-y-8">
              {parsedSections.map((section, index) => {
                const [heading, ...body] = section.split(/\n/);
                const content = body.join("\n").trim();
                const icon = getIconForHeading(heading);
                const revealed = revealedSections.includes(index);
                
                return (
                  <div
                    key={index}
                    className={`group ${
                      revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    } transition-all duration-500 ease-out animate-fade-in`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                      
                      {/* Background decorativo */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -translate-y-16 translate-x-16"></div>
                      
                      {/* Header della sezione */}
                      <div className="flex items-start justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold z-10 shadow-lg">
                              {index + 1}
                            </div>
                            <div className="w-16 h-16 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                              {icon}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-800 leading-tight">
                              {heading.trim()}
                            </h3>
                            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2"></div>
                          </div>
                        </div>
                        
                        {/* Pulsante copia */}
                        <button
                          onClick={() => handleCopy(content)}
                          className="bg-white/80 hover:bg-white hover:shadow-md text-slate-600 p-3 rounded-xl border border-slate-200 transition-all duration-300 shadow-sm opacity-0 group-hover:opacity-100"
                          title="Copia questa sezione"
                        >
                          📋
                        </button>
                      </div>

                      {/* Contenuto */}
                      <div className={`
                        ${!isExpanded && content.length > 300 ? 'line-clamp-6' : ''}
                        text-slate-700 leading-relaxed whitespace-pre-line text-base relative z-10
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

                      {/* Statistiche mockup per sezioni di valutazione */}
                      {/valutazione/i.test(heading) && (
                        <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 relative z-10">
                          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                            <div className="text-xl font-bold text-green-600">8.5</div>
                            <div className="text-sm text-slate-600 font-medium">Engagement</div>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                            <div className="text-xl font-bold text-blue-600">9.2</div>
                            <div className="text-sm text-slate-600 font-medium">Clarity</div>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                            <div className="text-xl font-bold text-purple-600">8.8</div>
                            <div className="text-sm text-slate-600 font-medium">Impact</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sezione Chat separata */}
        <div className="mt-8 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8">
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-2xl">💬</span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Perfeziona il tuo contenuto
                </h3>
                <p className="text-slate-300 font-medium">
                  Chiedi modifiche, variazioni o consigli aggiuntivi per ottimizzare i tuoi post
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <ChatInteraction context={result} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Result;