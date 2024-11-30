import AIService from "./AIService";
import { getPrompts } from "./AIConfigData.js";

export default class GeminiNanoService extends AIService {
	constructor() {
		super();
	}

	async initializeSession(context) {
		console.log('Initialize Session');
		try {
			const chatSession = await window.ai.languageModel.create({
				systemPrompt: getPrompts("system_prompt") + `\n\nContext:\n\n` + context,
			});
			return chatSession;
		} catch (error) {
			console.error(error);
			throw new Error("Failed to initialize AI session");
		}
	}

	async callModel(node, prompt) {
		try {
			const chatSession = node.data.session;
			const nodeId = node.data.id;
			if (!chatSession) {
				throw new Error(`Session not initialized`);
			}
			let result = await chatSession.prompt(prompt);
			return {
				id: nodeId,
				text: result
			};
		} catch (error) {
			console.error("Error in GeminiProService callModel:", error);
			throw error;
		}
	}
}
