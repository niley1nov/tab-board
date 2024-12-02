import AIService from "./AIService.js";
import {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
} from "@google/generative-ai";
import { getGenConfig } from "../utilities/AIUtil.js";
import { models, getPrompts, safety_settings } from "./AIConfigData.js";

export default class GeminiProSummarizeService extends AIService {
	constructor(token) {
		super();
		this.genAI = new GoogleGenerativeAI(token);
	}

	// Initialize a session for a specific node
	async initializeSession() {
		console.log('Initialize Summary Session - pro');
		try {
			const model = this.genAI.getGenerativeModel({
				model: models["pro"],
				systemInstruction: getPrompts("summary_prompt"),
			});
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
	async callModel(node, prompt, title) {
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
			this.showWarningPopup(error.message);
			console.error("Error in GeminiProSummarizeService callModel:", error);
			throw error;
		}
	}
}
