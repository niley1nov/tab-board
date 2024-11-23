export default class AIService {
	constructor() {
		if (new.target === AIService) {
			throw new TypeError("Cannot instantiate an abstract class.");
		}
	}

	async callModel(prompt) {
		throw new Error("Method 'callModel()' must be implemented.");
	}
}
