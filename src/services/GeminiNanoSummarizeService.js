import AIService from "./AIService.js";
import { getPrompts } from "./AIConfigData.js";
import { handleError } from "./ErrorHandling.js"

export default class GeminiNanoSummarizeService extends AIService {
	constructor() {
		super();
	}

	async initializeSession(context) {
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
			const errorMessage = handleError(error)
			this.showWarningPopup(errorMessage);
			throw new Error("Failed to initialize GEMINI Session.");
		}
	}

	async callModel(node, prompt, title) {
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
			const errorMessage = handleError(error)
			this.showWarningPopup(errorMessage);
			throw new Error("Failed to initialize GEMINI Session.");
		}
	}
}

// use destroy to destroy session
// sharedContext??