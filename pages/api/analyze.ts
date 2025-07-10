import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export default async function handler(req, res) {
  try {
    const { caption, hashtag, metrics, platform, tone } = req.body;

    const prompt = `
Sei un esperto di content marketing per social media.
Analizza questo post per ${platform}:
- Caption: ${caption}
- Hashtag: ${hashtag}
- Risultati ottenuti: ${metrics}
- Tono desiderato: ${tone}

Restituisci:
1. Valutazione (hook, CTA, hashtag)
2. 3 suggerimenti per migliorare l’engagement
3. 2 alternative di caption in tono ${tone}
4. Una strategia alternativa per post simili
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const chat = model.startChat({
      history: [],
      generationConfig: {
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response.text();

    res.status(200).json({ result: response });
  } catch (error) {
    console.error("Errore Gemini AI:", error);
    if(!res.status(200).json){
      ({ error: "Errore durante l'elaborazione AI" });
    }
  }
}