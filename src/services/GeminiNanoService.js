import AIService from "./AIService";
import { getPrompts } from "./AIConfigData.js";

export default class GeminiNanoService extends AIService {
	async callModel(prompt) {
		try {
			let chatSession = await window.ai.languageModel.create({
				systemPrompt: getPrompts("system_prompt"),
			});
			let result = await chatSession.prompt(prompt);
			return result;
		} catch (error) {
			console.error(error);
		}
	}
}
