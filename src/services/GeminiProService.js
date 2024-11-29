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
		this.sessions = {}; // Store sessions for each node
	}

	// Initialize a session for a specific node
	initializeSession(nodeId) {
		console.log('initializeSession');
		if (this.sessions[nodeId]) {
			// Session already exists
			return;
		}

		try {
			let model = this.genAI.getGenerativeModel({
				model: models["pro"],
				systemInstruction: getPrompts("system_prompt"),
			});
			let chatSession = model.startChat({
				generationConfig: getGenConfig(1, "text/plain"),
				safetySettings: safety_settings,
				history: [],
			});
			this.sessions[nodeId] = chatSession;
		} catch (error) {
			console.error("Error initializing AI session:", error);
			throw new Error("Failed to initialize AI session");
		}
	}

	// Call the model with a prompt for a specific node
	async callModel(nodeId, prompt) {
		try {
			if (!this.sessions[nodeId]) {
				throw new Error(`Session not initialized for node ${nodeId}`);
			}
			const chatSession = this.sessions[nodeId];
			const result = await chatSession.sendMessage(prompt);
			return {
				id: nodeId,
				text: result.response.text()
			};
		} catch (error) {
			console.error("Error in GeminiProService callModel:", error);
			throw new Error("Failed to fetch response from Gemini Pro model");
		}
	}

	// Clear a session for a specific node (optional, for cleanup)
	clearSession(nodeId) {
		if (this.sessions[nodeId]) {
			delete this.sessions[nodeId];
		}
	}
}
