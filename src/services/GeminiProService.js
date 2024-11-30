import AIService from "./AIService";
import {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
} from "@google/generative-ai";
import { getGenConfig } from "../utilities/AIUtil.js";
import { models, getPrompts, safety_settings } from "./AIConfigData.js";

export default class GeminiProService extends AIService {
	constructor(token) {
		super();
		this.genAI = new GoogleGenerativeAI(token);
	}

	// Initialize a session for a specific node
	initializeSession(context) {
		console.log('Initialize Session');
		try {
			let model = this.genAI.getGenerativeModel({
				model: models["pro"],
				systemInstruction: getPrompts("system_prompt") + `\n\nContext:\n\n` + context,
			});
			const chatSession = model.startChat({
				generationConfig: getGenConfig(1, "text/plain"),
				safetySettings: safety_settings,
				history: [], // Empty history initially
			});
			return chatSession;
		} catch (error) {
			console.error("Error initializing AI session:", error);
			throw new Error("Failed to initialize AI session");
		}
	}

	// Call the model with a prompt for a specific node
	async callModel(node, prompt) {
		try {
			const chatSession = node.data.session;
			const nodeId = node.data.id;
			if (!chatSession) {
				throw new Error(`Session not initialized`);
			}
			const result = await chatSession.sendMessage(prompt);
			return {
				id: nodeId,
				text: result.response.text()
			};
		} catch (error) {
			console.error("Error in GeminiProService callModel:", error);
			throw error;
		}
	}
}
