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
		summary_prompt: `You are a helpful assistant. You will receive content of a web page, you need to summarize the text.`,
	};
	return prompts[key];
}

export { safety_settings, models, getPrompts };
