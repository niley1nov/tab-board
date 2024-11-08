import AIService from './AIService';

export default class GeminiNanoService extends AIService {
    async callModel(prompt) {
        console.log('callModel', prompt);
    }
}
