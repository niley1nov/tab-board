import AIService from "./AIService.js";
import {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
} from "@google/generative-ai";
import { getGenConfig } from "../utilities/AIUtil.js";
import { models, getPrompts, safety_settings } from "./AIConfigData.js";
import { handleError } from "./ErrorHandling.js"

export default class GeminiProPromptService extends AIService {
	constructor(token) {
		super();
		this.genAI = new GoogleGenerativeAI(token);
	}

	async initializeSession(context) {
		console.log('Initialize Session');
		try {
			let system_prompt;
			if (!!context) {
				system_prompt = getPrompts("context_prompt", [context]);
			} else {
				system_prompt = getPrompts("system_prompt");
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
			const errorMessage = handleError(error)
			this.showWarningPopup(errorMessage);
			throw new Error("Failed to call GeminiProPromptService.");
		}
	}
}