function getGenConfig(
	temperature,
	response_mime_type,
	max_output_tokens = 8192,
	top_p = 0.95,
	top_k = 64
) {
	return {
		temperature: temperature,
		topP: top_p,
		topK: top_k,
		maxOutputTokens: max_output_tokens,
		responseMimeType: response_mime_type,
	};
}

export { getGenConfig };