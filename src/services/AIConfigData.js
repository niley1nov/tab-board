const safety_settings = [
	{
		category: "HARM_CATEGORY_HARASSMENT",
		threshold: "BLOCK_ONLY_HIGH",
	},
	{
		category: "HARM_CATEGORY_HATE_SPEECH",
		threshold: "BLOCK_ONLY_HIGH",
	},
	{
		category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
		threshold: "BLOCK_ONLY_HIGH",
	},
	{
		category: "HARM_CATEGORY_DANGEROUS_CONTENT",
		threshold: "BLOCK_ONLY_HIGH",
	},
];

const models = {
	pro: "gemini-1.5-pro",
	flash: "gemini-1.5-flash",
};

function getPrompts(key, replacableText = []) {
	const prompts = {
		system_prompt: `You are a helpful assistant.`,
		context_prompt: `You are a helpful assistant. Answer user query related to below context.
Context:
${replacableText[0]}`,
		chat_with_context_prompt: `You are a helpful assistant. Chat with user regarding below context.
Context:
${replacableText[0]}`,
		summary_prompt: `You are a helpful assistant. You will receive some text content (probably scrapped web page data), you need to summarize the text.`,
		translation_prompt: `You are a language translator assistant.
Source Language: ${replacableText[0]}
Target Language: ${replacableText[1]}`,
		rewrite_with_context_system_prompt: `You are a helpful assistant. You will get some content from user regarding "${replacableText[0]}".
You need to rewrite the content according to user instructions.`,
		rewrite_system_prompt: `You are a helpful assistant. You will get some content from user.
You need to rewrite the content according to user instructions.`,
		rewrite_prompt: `Content:
${replacableText[0]}

----------

Instructions:
${replacableText[1]}`,
		write_prompt: `You are a helpful assistant. ${replacableText[0]}`
	};
	return prompts[key];
}

export { safety_settings, models, getPrompts };
