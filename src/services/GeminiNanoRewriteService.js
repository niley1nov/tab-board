import AIService from "./AIService.js";
import { getPrompts } from "./AIConfigData.js";

export default class GeminiNanoRewriteService extends AIService {
	constructor() {
		super();
	}

	async initializeSession(name) {
		console.log('Initialize Session');

		//add option to reduce content length
		//make options configurable
		const options = {
			sharedContext: name || "",
			tone: 'neutral',
			format: 'plain-text',
			length: 'medium',
		};

		try {
			const chatSession = await window.ai.rewriter.create(options);
			return chatSession;
		} catch (error) {
			console.error(error);
			this.showWarningPopup(error.message);
			// More informative error message
			throw new Error("Failed to initialize AI Session.");
		}
	}


	async callModel(node, context, prompt) {
		try {
			const chatSession = node.data.session;
			const nodeId = node.data.id;
			if (!chatSession) {
				throw new Error(`Session not initialized`);
			}
			let result = await chatSession.rewrite(context, {
				context: prompt
			});
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