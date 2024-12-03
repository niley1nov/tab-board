import AIService from "./AIService.js";
import { getPrompts } from "./AIConfigData.js";
import { handleError } from "./ErrorHandling.js"

export default class GeminiNanoChatService extends AIService {
	constructor() {
		super();
	}

	async initializeSession(context) {
		console.log('Initialize Prompt Session - nano');
		const maxTokens = 4800;
		const systemPrompt = getPrompts("system_prompt");

		// Optimize: Calculate systemPrompt tokens only once
		const systemPromptTokens = this.approximateTokenCount(systemPrompt);
		let contextTokens = this.approximateTokenCount(context);
		let combinedTokens = systemPromptTokens + contextTokens;

		if (combinedTokens > maxTokens) {
			context = this.trimContext(context, maxTokens, systemPrompt);
			contextTokens = this.approximateTokenCount(context); // Recalculate after trimming
			combinedTokens = systemPromptTokens + contextTokens;
		}

		try {
			const chatSession = await window.ai.languageModel.create({
				systemPrompt: systemPrompt + `\n\nContext:\n\n` + context,
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
			let result = await chatSession.prompt(prompt);
			return {
				id: nodeId,
				text: result
			};
		} catch (error) {
			const errorMessage = handleError(error)
			this.showWarningPopup(errorMessage);
			throw new Error("Failed to initialize GEMINI Session.");
		}
	}
}
