import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const SYSTEM_CONTEXT = `
🎯 Sei un assistente AI specializzato esclusivamente in content marketing per i social media.
👉 Se la richiesta dell'utente non riguarda la scrittura, l’analisi o l’ottimizzazione di contenuti per social media come Instagram, TikTok, LinkedIn, YouTube, Facebook, allora rifiuta gentilmente con un messaggio come:

"Posso aiutarti solo se la tua richiesta è legata al mondo dei social media (caption, hashtag, engagement, ecc.). Riformula per favore 🙂"

✔️ Altrimenti, rispondi normalmente, mantenendo il tono specificato dall’utente.
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Formato dei messaggi non valido o mancante" });
    }

    const userMessage = messages[messages.length - 1];
    const history = messages.slice(0, -1);
    const userMessageWithContext = {
      ...userMessage,
      content: `${SYSTEM_CONTEXT}\n\n${history}\n\n${userMessage.content}`,
    };

    if (userMessage.role !== "user") {
      return res.status(400).json({ error: "L'ultimo messaggio deve avere ruolo 'user'" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


    // Converte la cronologia nel formato richiesto da Gemini
    const geminiHistory = [
    {
    role: "user",
    parts: [{ text: SYSTEM_CONTEXT }],
    },
    ...history.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
      })),
    ];

    const chat = model.startChat({
      history: geminiHistory,
      generationConfig: {
        temperature: 0.7,
      },
    });

    // Invia il messaggio dell'utente nel formato corretto
    const result = await chat.sendMessage(userMessageWithContext.content);
    const reply = await result.response.text();

    return res.status(200).json({ result: reply });
 } catch (error: any) {
  console.error("Errore durante la generazione AI:", error.message || error);
  return res.status(500).json({ error: "Errore interno del server" });
 }
    
}