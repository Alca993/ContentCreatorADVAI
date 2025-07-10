type RawMessage = { role: "user" | "assistant" | "system"; content: string };

export function sanitizeHistory(
  rawMessages: RawMessage[],
  context: string
): { role: "user" | "model"; parts: { text: string }[] }[] {
  const cleaned: { role: "user" | "model"; parts: { text: string }[] }[] = [];

  // Aggiungi contesto iniziale come primo messaggio 'user'
  cleaned.push({
    role: "user",
    parts: [{ text: `Contesto post originale:\n${context}` }],
  });

  // Filtra e converte il resto
  for (const msg of rawMessages) {
    if (msg.role === "system") continue; // ignora eventuali messaggi 'system' doppi
    cleaned.push({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    });
  }

  return cleaned;
}