import AIService from "./AIService.js";
import { getPrompts } from "./AIConfigData.js";
import { handleError } from "./ErrorHandling.js"

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
			const errorMessage = handleError(error)
			this.showWarningPopup(errorMessage);
			throw new Error("Failed to initialize GEMINI Session.");
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
			const errorMessage = handleError(error)
			this.showWarningPopup(errorMessage);
			throw new Error("Failed to initialize GEMINI Session.");
		}
	}
}