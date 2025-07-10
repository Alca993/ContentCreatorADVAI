import React, { useState } from "react";
import Result from "../components/Result";

export default function Home() {
  const [caption, setCaption] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [metrics, setMetrics] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [result, setResult] = useState("");
  const [tone, setTone] = useState("Coinvolgente");
  const [loading, setLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHasResult(true);
    setResult("");
    
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption, hashtag, metrics, platform, tone }),
      });
      const data = await res.json();
      setResult(data.result || "Errore durante l'analisi");
    } catch (error) {
      setResult("Errore di connessione");
    }
    
    setLoading(false);
  };

  const handleRegenerate = () => {
    setLoading(true);
    // Simula rigenerazione con nuovo tono
    setTimeout(async () => {
      try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption, hashtag, metrics, platform, tone }),
      });
      const data = await res.json();
      setResult(data.result || "Errore durante l'analisi");
    } catch (error) {
      setResult("Errore di connessione");
    }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8 sm:px-6 lg:px-8">
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
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
            <span className="text-3xl">🎯</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4 tracking-tight">
            Social Content Advisor AI
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto font-medium">
            Migliora le tue strategie social con l'intelligenza artificiale
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-slate-200/50">
          <div className="space-y-8">
            {/* Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Caption Field */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-sm font-bold z-10 shadow-lg">
                    1
                  </div>
                  <label className="block text-sm font-bold text-slate-800 mb-4 items-center">
                    <span className="text-2xl mr-3">✍️</span>
                    Caption del post
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={4}
                    className="w-full p-5 border-2 border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 focus:outline-none transition-all duration-300 bg-slate-50/80 hover:bg-white hover:shadow-md resize-none"
                    placeholder="Scrivi la caption originale del post..."
                  />
                </div>
              </div>

              {/* Hashtag Field */}
              <div className="lg:col-span-1">
                <div className="relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-sm font-bold z-10 shadow-lg">
                    2
                  </div>
                  <label className="block text-sm font-bold text-slate-800 mb-4 items-center">
                    <span className="text-2xl mr-3">#️⃣</span>
                    Hashtag utilizzati
                  </label>
                  <input
                    type="text"
                    value={hashtag}
                    onChange={(e) => setHashtag(e.target.value)}
                    className="w-full p-5 border-2 border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-slate-50/80 hover:bg-white hover:shadow-md"
                    placeholder="#marketing #growth #socialmedia"
                  />
                </div>
              </div>

              {/* Metrics Field */}
              <div className="lg:col-span-1">
                <div className="relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white text-sm font-bold z-10 shadow-lg">
                    3
                  </div>
                  <label className="block text-sm font-bold text-slate-800 mb-4 items-center">
                    <span className="text-2xl mr-3">📊</span>
                    Metriche ottenute
                  </label>
                  <input
                    type="text"
                    value={metrics}
                    onChange={(e) => setMetrics(e.target.value)}
                    className="w-full p-5 border-2 border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all duration-300 bg-slate-50/80 hover:bg-white hover:shadow-md"
                    placeholder="Es. 300 like, 20 commenti, 2500 reach"
                  />
                </div>
              </div>

              {/* Platform Field */}
              <div className="lg:col-span-1">
                <div className="relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-sm font-bold z-10 shadow-lg">
                    4
                  </div>
                  <label className="block text-sm font-bold text-slate-800 mb-4 items-center">
                    <span className="text-2xl mr-3">📱</span>
                    Piattaforma
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full p-5 border-2 border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 focus:outline-none transition-all duration-300 bg-slate-50/80 hover:bg-white hover:shadow-md cursor-pointer"
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
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white text-sm font-bold z-10 shadow-lg">
                    5
                  </div>
                  <label className="block text-sm font-bold text-slate-800 mb-4 items-center">
                    <span className="text-2xl mr-3">🎭</span>
                    Tono di voce
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full p-5 border-2 border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all duration-300 bg-slate-50/80 hover:bg-white hover:shadow-md cursor-pointer"
                  >
                    <option value="Coinvolgente">🤝 Coinvolgente</option>
                    <option value="Professionale">💼 Professionale</option>
                    <option value="Creativo">🎨 Creativo</option>
                    <option value="Ironico">😄 Ironico</option>
                    <option value="Motivazionale">💪 Motivazionale</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg shadow-xl border border-slate-700"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                      Analisi in corso...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="text-2xl mr-3">🚀</span>
                      Analizza il post
                    </div>
                  )}
                </button>

                {hasResult && (
                  <button
                    onClick={handleRegenerate}
                    disabled={loading}
                    className="flex-1 sm:flex-none sm:min-w-[200px] bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg shadow-xl border border-orange-400 animate-fade-in"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                        Rigenerando...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="text-2xl mr-3">🔄</span>
                        Rigenera
                      </div>
                    )}
                  </button>
                )}
              </div>

              {hasResult && (
                <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl animate-fade-in">
                  <p className="text-sm text-orange-700 font-medium text-center">
                    💡 Prova un tono diverso per ottenere suggerimenti alternativi
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

        {/* Results Section */}
        {result && <Result result={result} />}

        {/* Footer */}
        <div className="text-center mt-12 text-slate-400">
          <p className="text-sm font-medium">
            Powered by AI • Made with <span className="text-red-400 animate-pulse">❤️</span> for better social content
          </p>
        </div>
      </div>
  );
}
