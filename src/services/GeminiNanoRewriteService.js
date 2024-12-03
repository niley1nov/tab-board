import AIService from "./AIService.js";
import { getPrompts } from "./AIConfigData.js";
import { handleError } from "./ErrorHandling.js"

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
			const errorMessage = handleError(error)
			this.showWarningPopup(errorMessage);
			throw new Error("Failed to initialize GEMINI Session.");
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
			const errorMessage = handleError(error)
			this.showWarningPopup(errorMessage);
			throw new Error("Failed to initialize GEMINI Session.");
		}
	}
}
