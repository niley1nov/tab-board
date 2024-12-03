import AIService from "./AIService.js";
import { getPrompts } from "./AIConfigData.js";

export default class GeminiNanoTranslateService extends AIService {
	constructor() {
		super();
	}

	async initializeSession(sourceLanguage, targetLanguage) {
		console.log('Initialize Session');

		const options = {
			sourceLanguage: sourceLanguage,
			targetLanguage: targetLanguage
		};

		try {
			const chatSession = await window.translation.createTranslator(options);
			return chatSession;
		} catch (error) {
			console.error(error);
			this.showWarningPopup(error.message);
			// More informative error message
			throw new Error("Failed to initialize AI Session.");
		}
	}

	async callModel(node, context) {
		try {
			const chatSession = node.data.session;
			const nodeId = node.data.id;
			if (!chatSession) {
				throw new Error(`Session not initialized`);
			}
			let result = await chatSession.translate(context);
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