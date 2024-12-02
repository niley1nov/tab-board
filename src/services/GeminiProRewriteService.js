import AIService from "./AIService.js";
import {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
} from "@google/generative-ai";
import { getGenConfig } from "../utilities/AIUtil.js";
import { models, getPrompts, safety_settings } from "./AIConfigData.js";

export default class GeminiProRewriteService extends AIService {
	constructor(token) {
		super();
		this.genAI = new GoogleGenerativeAI(token);
	}

	// Initialize a session for a specific node
	async initializeSession(name) {
		console.log('Initialize prompt Session - pro');
		try {
			const model = this.genAI.getGenerativeModel({
				model: models["pro"],
				systemInstruction: getPrompts("rewrite_prompt") + `\n\nContext:\n\n` + name,
			}); //add rewrite_prompt
			const chatSession = model.startChat({
				generationConfig: getGenConfig(1, "text/plain"),
				safetySettings: safety_settings,
				history: [],
			});
			return chatSession;
		} catch (error) {
			this.showWarningPopup(error.message);
			console.error("Error initializing AI session:", error);
			throw new Error("Failed to initialize AI session");
		}
	}

	// Call the model with a prompt for a specific node
	async callModel(node, context, prompt) {
		try {
			const chatSession = node.data.session;
			const nodeId = node.data.id;
			if (!chatSession) {
				throw new Error(`Session not initialized`);
			}
			const result = await chatSession.sendMessage(context + '\n\n----------\n\n' + prompt);
			return {
				id: nodeId,
				text: result.response.text()
			};
		} catch (error) {
			this.showWarningPopup(error.message);
			console.error("Error in GeminiProRewriteService callModel:", error);
			throw error;
		}
	}
}
