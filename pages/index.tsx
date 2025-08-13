import React, { useState } from "react";
import Result from "../components/Result";
import CreatableSelect from "react-select/creatable";
import type { MultiValue } from "react-select";

export default function Home() {
  const [caption, setCaption] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [metrics, setMetrics] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [result, setResult] = useState("");
  //const [tone, setTone] = useState("Coinvolgente");
  const [loading, setLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [tone, setTone] = useState<OptionType[]>([]);

    type OptionType = {
    value: string;
    label: string;
  };

const defaultToneOptions: OptionType[] = [
  { value: "Coinvolgente", label: "🤝 Coinvolgente" },
  { value: "Professionale", label: "💼 Professionale" },
  { value: "Creativo", label: "🎨 Creativo" },
  { value: "Ironico", label: "😄 Ironico" },
  { value: "Motivazionale", label: "💪 Motivazionale" },
  { value: "Energico", label: "🏎️ Energico"},
  { value: "Serioso", label: "🥸 Serioso"},
  { value: "Tecnico", label: "💻 Tecnico"},
  { value: "Coinvolgente 70%, Professionale 30%", label: "🕶️ Coinvolgente 70%, Professionale 30%"},
];

const [options, setOptions] = useState<OptionType[]>(defaultToneOptions);

const handleChange = (newValue: MultiValue<OptionType>) => {
    setTone([...newValue]); // 👈 Copia per trasformare readonly → mutabile
  };

 const handleCreate = (inputValue: string) => {
    const newOption = { value: inputValue, label: inputValue };
    setOptions((prev) => [...prev, newOption]); // aggiunge alla lista globale
    setTone((prev) => [...prev, newOption]);   // aggiunge anche ai selezionati
 };  


  function stripMarkdown(text: string): string {
  return text
    .replace(/^>+\s?/gm, "")                // blocchi quote
    .replace(/[*_~`]+/g, "")                // *, _, ~, `
    .replace(/#+\s?/g, "")                  // titoli #, ##, ###
    .replace(/-{3,}/g, "")                  // --- separatori
    .replace(/\n{2,}/g, "\n\n")             // normalizza spazi
    .trim();
}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHasResult(true);
    setResult("");
    const toneText = tone.map(t => t.value).join(", ");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption, hashtag, metrics, platform, tone: toneText }),
      });
      const data = await res.json();
      const cleaned = stripMarkdown(data.result);
      setResult(cleaned || "Errore durante l'analisi");
    } catch (error) {
      setResult("Errore di connessione");
    }
    
    setLoading(false);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(false);
    setHasResult(false);
    setResult("");
    setCaption("");
    setHashtag("");
    setMetrics("");
    setPlatform("Instagram");
    setTone(([]));
  };

  const handleRegenerate = () => {
    setLoading(true);
    setResult("");
    // Simula rigenerazione con nuovo tono
    setTimeout(async () => {
      try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption, hashtag, metrics, platform, tone }),
      });
      const data = await res.json();
      const cleaned = stripMarkdown(data.result);
      setResult(cleaned || "Errore durante l'analisi");
    } catch (error) {
      setResult("Errore di connessione");
    }
      setLoading(false);
    }, 1500);
  };



return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2 sm:p-4 lg:p-8">
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
      `}</style>
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Mobile First */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
            <span className="text-2xl sm:text-3xl">🎯</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-2 sm:mb-4 tracking-tight px-4">
            Social Content Advisor AI
          </h1>
          <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-medium px-4">
            Migliora le tue strategie social con l'intelligenza artificiale
          </p>
        </div>

        {/* Main Form Card - Fully Responsive */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-slate-200/50">
          <div className="space-y-6 sm:space-y-8">
            {/* Form Grid - Mobile Stacked */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              
              {/* Caption Field - Always Full Width */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xs sm:text-sm font-bold z-10 shadow-lg">
                    1
                  </div>
                  <label className="block text-sm sm:text-base font-bold text-slate-800 mb-3 sm:mb-4 flex items-center">
                    <span className="text-xl sm:text-2xl mr-2 sm:mr-3">✍️</span>
                    Caption del post
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={3}
                    className="w-full p-3 sm:p-4 lg:p-5 border-2 border-slate-200 rounded-xl sm:rounded-2xl shadow-sm focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 focus:outline-none transition-all duration-300 bg-slate-50/80 hover:bg-white hover:shadow-md resize-none text-sm sm:text-base"
                    placeholder="Scrivi la caption originale del post..."
                  />
                </div>
              </div>

              {/* Hashtag Field - Responsive Grid */}
              <div className="lg:col-span-1">
                <div className="relative">
                  <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-xs sm:text-sm font-bold z-10 shadow-lg">
                    2
                  </div>
                  <label className="block text-sm sm:text-base font-bold text-slate-800 mb-3 sm:mb-4 flex items-center">
                    <span className="text-xl sm:text-2xl mr-2 sm:mr-3">#️⃣</span>
                    Hashtag utilizzati
                  </label>
                  <input
                    type="text"
                    value={hashtag}
                    onChange={(e) => setHashtag(e.target.value)}
                    className="w-full p-3 sm:p-4 lg:p-5 border-2 border-slate-200 rounded-xl sm:rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-slate-50/80 hover:bg-white hover:shadow-md text-sm sm:text-base"
                    placeholder="#marketing #growth #social"
                  />
                </div>
              </div>

              {/* Metrics Field */}
              <div className="lg:col-span-1">
                <div className="relative">
                  <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white text-xs sm:text-sm font-bold z-10 shadow-lg">
                    3
                  </div>
                  <label className="block text-sm sm:text-base font-bold text-slate-800 mb-3 sm:mb-4 flex items-center">
                    <span className="text-xl sm:text-2xl mr-2 sm:mr-3">📊</span>
                    Metriche ottenute
                  </label>
                  <input
                    type="text"
                    value={metrics}
                    onChange={(e) => setMetrics(e.target.value)}
                    className="w-full p-3 sm:p-4 lg:p-5 border-2 border-slate-200 rounded-xl sm:rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all duration-300 bg-slate-50/80 hover:bg-white hover:shadow-md text-sm sm:text-base"
                    placeholder="300 like, 20 commenti, 2500 reach"
                  />
                </div>
              </div>

              {/* Platform Field */}
              <div className="lg:col-span-1">
                <div className="relative">
                  <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-xs sm:text-sm font-bold z-10 shadow-lg">
                    4
                  </div>
                  <label className="block text-sm sm:text-base font-bold text-slate-800 mb-3 sm:mb-4 flex items-center">
                    <span className="text-xl sm:text-2xl mr-2 sm:mr-3">📱</span>
                    Piattaforma
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full p-3 sm:p-4 lg:p-5 border-2 border-slate-200 rounded-xl sm:rounded-2xl shadow-sm focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 focus:outline-none transition-all duration-300 bg-slate-50/80 hover:bg-white hover:shadow-md cursor-pointer text-sm sm:text-base"
                  >
                    <option value="Instagram">📸 Instagram</option>
                    <option value="TikTok">🎵 TikTok</option>
                    <option value="LinkedIn">💼 LinkedIn</option>
                    <option value="YouTube">📺 YouTube</option>
                    <option value="Facebook">📘 Facebook</option>
                  </select>
                </div>
              </div>

              {/* Tone Field */}
              <div className="lg:col-span-1">
                <div className="relative">
                  <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white text-xs sm:text-sm font-bold z-10 shadow-lg">
                    5
                  </div>
                  <label className="block text-sm sm:text-base font-bold text-slate-800 mb-3 sm:mb-4 flex items-center">
                    <span className="text-xl sm:text-2xl mr-2 sm:mr-3">🎭</span>
                    Tono di voce
                  </label>
                  <CreatableSelect<OptionType, true>
                    isMulti
                    options={options}
                    value={tone}
                    onChange={handleChange}
                    onCreateOption={handleCreate}
                    className="w-full p-3 sm:p-4 lg:p-5 border-2 border-slate-200 rounded-xl sm:rounded-2xl shadow-sm focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all duration-300 bg-slate-50/80 hover:bg-white hover:shadow-md cursor-pointer text-sm sm:text-base"
                    placeholder="Seleziona o scrivi toni personalizzati..."
                    isClearable
                  />
                </div>
              </div>
            </div>

            {/* Submit Button Section - Mobile Optimized */}
            <div className="pt-4 sm:pt-6">
              <div className="flex flex-col gap-3 sm:gap-4">
                {/* Primary Actions Row */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base sm:text-lg shadow-xl border border-slate-700"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent mr-2 sm:mr-3"></div>
                        <span className="text-sm sm:text-base">Analisi in corso...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="text-xl sm:text-2xl mr-2 sm:mr-3">🚀</span>
                        <span className="text-sm sm:text-base">Analizza il post</span>
                      </div>
                    )}
                  </button>

                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto sm:min-w-[120px] bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl text-base sm:text-lg shadow-xl border border-slate-500"
                  >
                    <div className="flex items-center justify-center">
                      <span className="text-xl sm:text-2xl mr-2 sm:mr-3">🧹</span>
                      <span className="text-sm sm:text-base">Reset</span>
                    </div>
                  </button>
                </div>

                {/* Regenerate Button - Only when has result */}
                {hasResult && (
                  <button
                    onClick={handleRegenerate}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base sm:text-lg shadow-xl border border-orange-400 animate-fade-in"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent mr-2 sm:mr-3"></div>
                        <span className="text-sm sm:text-base">Rigenerando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="text-xl sm:text-2xl mr-2 sm:mr-3">🔄</span>
                        <span className="text-sm sm:text-base">Rigenera Analisi</span>
                      </div>
                    )}
                  </button>
                )}
              </div>

              {/* Tip Message - Mobile Optimized */}
              {hasResult && (
                <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl animate-fade-in">
                  <p className="text-xs sm:text-sm text-orange-700 font-medium text-center">
                    💡 Prova un tono diverso per ottenere suggerimenti alternativi
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section - Full Component */}
        {result && <Result result={result} />}

        {/* Footer - Mobile Responsive */}
        <div className="text-center mt-6 sm:mt-8 lg:mt-12 text-slate-400 px-4">
          <p className="text-xs sm:text-sm font-medium">
            Powered by AI • Made with <span className="text-red-400 animate-pulse">❤️</span> for better social content
          </p>
        </div>
      </div>
    </div>
  );
};