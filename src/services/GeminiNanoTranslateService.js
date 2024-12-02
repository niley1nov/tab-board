import AIService from "./AIService.js";
import { getPrompts } from "./AIConfigData.js";

export default class GeminiNanoTranslateService extends AIService {
	constructor() {
		super();
	}

	async initializeSession(language, name) {
		return null;
	}

	async callModel(node, context) {
		try {
			const chatSession = node.data.session;
			const nodeId = node.data.id;
			if (!chatSession) {
				throw new Error(`Session not initialized`);
			}
			let result = await chatSession.prompt(context);
			return {
				id: nodeId,
				text: result
			};
		} catch (error) {
			this.showWarningPopup(error.message);
			console.error("Error in GeminiNanoTranslateService callModel:", error);
			throw error;
		}
	}
}

// use destroy to destroy session
// sharedContext??