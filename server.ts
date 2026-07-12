import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Emergency counsel endpoint using Gemini
  app.post("/api/emergency-counsel", async (req, res) => {
    try {
      const { trigger, currentStreakDays, userNote } = req.body;
      
      let client;
      try {
        client = getGeminiClient();
      } catch (err: any) {
        return res.status(400).json({
          error: "API_KEY_MISSING",
          message: err.message || "Gemini API key is missing. Please configure it in your environment."
        });
      }

      const prompt = `The user is experiencing a strong temptation or urge to break their purity/sobriety streak.
Trigger state: ${trigger || "General Urge / Temptation"}
Current Streak: ${currentStreakDays ?? 0} days clean.
User note or feelings: "${userNote || "None provided"}"

Provide urgent, powerful, compassionate biblical counseling to help them escape this temptation immediately. 
Use a strong Christian counselor tone who understands the biology of triggers, spiritual warfare, and the grace of Jesus.

Return a JSON object conforming strictly to the requested schema.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an empathetic, powerful Christian therapist and spiritual mentor helping men and women overcome pornography and lust addiction. You provide immediate escape strategies, biblical truths, and short prayers with ultimate care, encouragement, and zero judgment.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              message: { 
                type: Type.STRING, 
                description: "A highly supportive, direct, and understanding counseling response (3-4 sentences) that speaks directly to their trigger." 
              },
              scriptureReference: { 
                type: Type.STRING, 
                description: "The Bible book, chapter, and verse reference (e.g., '1 Corinthians 10:13'). Choose a powerful, relevant verse about fleeing lust, enduring temptation, or finding grace." 
              },
              scriptureText: { 
                type: Type.STRING, 
                description: "The full text of the referenced scripture." 
              },
              prayer: { 
                type: Type.STRING, 
                description: "A direct, short, sincere prayer (2-3 sentences) the user can say aloud right now to invite the Holy Spirit's power." 
              },
              practicalActions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly 3 immediate, physical, and actionable tasks they must do RIGHT NOW to break the cognitive loop (e.g., 'Do 20 pushups immediately', 'Leave your room and walk to a public area', 'Splash freezing cold water on your face')."
              }
            },
            required: ["message", "scriptureReference", "scriptureText", "prayer", "practicalActions"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response received from AI model.");
      }

      const data = JSON.parse(responseText.trim());
      res.json(data);
    } catch (error: any) {
      console.error("Error in /api/emergency-counsel:", error);
      res.status(500).json({
        error: "SERVER_ERROR",
        message: error.message || "An error occurred while generating counsel. Please try again."
      });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
