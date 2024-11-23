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

	async callModel(prompt) {
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
			const result = await chatSession.sendMessage(prompt);
			return result.response.text();
		} catch (error) {
			console.error("Error in GeminiProService callModel:", error);
			throw new Error("Failed to fetch response from Gemini Pro model");
		}
	}
}
