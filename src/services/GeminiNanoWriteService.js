import AIService from "./AIService.js";
import { getPrompts } from "./AIConfigData.js";
import { handleError } from "./ErrorHandling.js"

export default class GeminiNanoWriteService extends AIService {
	constructor() {
		super();
	}

	async initializeSession(context) {
		console.log('Initialize Session');

		//make options configurable
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
			let result = await chatSession.write(prompt);
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