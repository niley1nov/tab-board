import AIService from "./AIService.js";
import { getPrompts } from "./AIConfigData.js";

export default class GeminiNanoWriteService extends AIService {
	constructor() {
		super();
	}

	async initializeSession(context) {
		console.log('Initialize Session');

		const options = {
			sharedContext: context || "",
			tone: 'neutral',
			format: 'plain-text',
			length: 'medium',
		  };

		try {
			const chatSession = await window.ai.writer.create(options);
			return chatSession;
		} catch (error) {
			console.error(error);
			this.showWarningPopup(error.message);
			// More informative error message
			throw new Error("Failed to initialize AI Session.");
		}
	}

	async callModel(node, prompt) {
		try {
			const chatSession = node.data.session;
			const nodeId = node.data.id;
			if (!chatSession) {
				throw new Error(`Session not initialized`);
			}
			let result = await chatSession.write(prompt);
			return {
				id: nodeId,
				text: result
			};
		} catch (error) {
			this.showWarningPopup(error.message);
			console.error(error);
			throw error;
		}
	}
}

// use destroy to destroy session
// sharedContext??