import AIService from "./AIService.js";
import {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
} from "@google/generative-ai";
import { getGenConfig } from "../utilities/AIUtil.js";
import { models, getPrompts, safety_settings } from "./AIConfigData.js";

export default class GeminiProTranslateService extends AIService {
	constructor(token) {
		super();
		this.genAI = new GoogleGenerativeAI(token);
	}

	// Initialize a session for a specific node
	async initializeSession(language, name) {
		return null;
	}

	// Call the model with a prompt for a specific node
	async callModel(node, context) {
		try {
			const chatSession = node.data.session;
			const nodeId = node.data.id;
			if (!chatSession) {
				throw new Error(`Session not initialized`);
			}
			const result = await chatSession.sendMessage(context);
			return {
				id: nodeId,
				text: result.response.text()
			};
		} catch (error) {
			this.showWarningPopup(error.message);
			console.error("Error in GeminiProTranslateService callModel:", error);
			throw error;
		}
	}
}
