import AIService from "./AIService.js";
import { getPrompts } from "./AIConfigData.js";

export default class GeminiNanoPromptService extends AIService {
	constructor() {
		super();
	}

	async initializeSummarySession(context) {
		console.log('Initialize Summary Session - nano');

		const options = {
			sharedContext: 'This is either scraped content of a web page or a chatbot summary',
			type: 'tl;dr',
			format: 'plain-text',
			length: 'medium',
		  };

		try {
			const chatSession = await window.ai.summarizer.create(options);
			return chatSession;
		} catch (error) {
			console.error(error);
			this.showWarningPopup(error.message);
			// More informative error message
			throw new Error("Failed to initialize AI Summary Session.");
		}
	}

	async initializePromptSession(context) {
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
			console.error(error);
			this.showWarningPopup(error.message);
			// More informative error message
			throw new Error("Failed to initialize AI session.");
		}
	}

	async initializeTranslationSession(language, name) {
		return "";
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
			this.showWarningPopup(error.message);
			console.error("Error in GeminiNanoPromptService callModel:", error);
			throw error;
		}
	}

	async summarize(node, prompt, title) {
		try {
			const chatSession = node.data.session;
			const nodeId = node.data.id;
			if (!chatSession) {
				throw new Error(`Session not initialized`);
			}
			let result = await chatSession.summarize(prompt, {context: title});

			return {
				id: nodeId,
				text: result
			};
		} catch (error) {
			this.showWarningPopup(error.message);
			console.error("Error in GeminiNanoPromptService callModel:", error);
			throw error;
		}
	}

	async translate(node, context) {
		return "";
	}
}

// use destroy to destroy session
// sharedContext??