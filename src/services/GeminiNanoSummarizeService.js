import AIService from "./AIService.js";
import { getPrompts } from "./AIConfigData.js";

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
			console.error(error);
			this.showWarningPopup(error.message);
			// More informative error message
			throw new Error("Failed to initialize AI Summary Session.");
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
			this.showWarningPopup(error.message);
			console.error("Error in GeminiNanoSummarizeService callModel:", error);
			throw error;
		}
	}
}

// use destroy to destroy session
// sharedContext??