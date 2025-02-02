import express, { Request, Response } from "express";
import cors from "cors";
import ollama from "ollama"; // ✅ Import ollama directly (no "new Ollama()")

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/**
 * Fetch all locally available Ollama models.
 */
app.get("/api/models", async (req: Request, res: Response) => {
  try {
    const models = await ollama.list(); // ✅ Use ollama.list() directly
    const modelNames = models.models.map((model) => model.name);
    res.json(modelNames);
  } catch (error) {
    console.error("Error fetching Ollama models:", error);
    res.status(500).json({ error: "Failed to retrieve local Ollama models" });
  }
});

/**
 * Chat with a specific Ollama model.
 */
app.post("/api/chat", async (req: Request, res: Response) => {
  const { model, message } = req.body;

  if (!model || !message) {
    return res.status(400).json({ error: "Model and message are required" });
  }

  try {
    const response = await ollama.chat({
      model,
      messages: [{ role: "user", content: message }],
    });

    res.json({ response: response.message.content });
  } catch (error) {
    console.error(`Error chatting with model ${model}:`, error);
    res.status(500).json({ error: "Failed to communicate with the model" });
  }
});

/**
 * Start the Express server.
 */
app.listen(PORT, () => {
  console.log(`✅ Ollama server running at http://localhost:${PORT}`);
});
