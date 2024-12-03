import AIService from "./AIService.js";
import {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
} from "@google/generative-ai";
import { getGenConfig } from "../utilities/AIUtil.js";
import { models, getPrompts, safety_settings } from "./AIConfigData.js";
import { handleError } from "./ErrorHandling.js"

export default class GeminiProRewriteService extends AIService {
	constructor(token) {
		super();
		this.genAI = new GoogleGenerativeAI(token);
	}

	// Initialize a session for a specific node
	async initializeSession(name) {
		console.log('Initialize prompt Session - pro');
		try {
			let system_prompt;
			if (!!name) {
				system_prompt = getPrompts("rewrite_with_context_system_prompt", [name]);
			} else {
				system_prompt = getPrompts("rewrite_system_prompt");
			}
			const model = this.genAI.getGenerativeModel({
				model: models["pro"],
				systemInstruction: system_prompt,
			});
			const chatSession = model.startChat({
				generationConfig: getGenConfig(1, "text/plain"),
				safetySettings: safety_settings,
				history: [],
			});
			return chatSession;
		} catch (error) {
			const errorMessage = handleError(error)
			this.showWarningPopup(errorMessage);
			throw new Error("Failed to initialize GEMINI Session.");
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
			const result = await chatSession.sendMessage(getPrompts("rewrite_prompt", [context, prompt]));
			return {
				id: nodeId,
				text: result.response.text()
			};
		} catch (error) {
			const errorMessage = handleError(error)
			this.showWarningPopup(errorMessage);
			throw new Error("Failed to call GeminiProRewriteService.");
		}
	}
}
