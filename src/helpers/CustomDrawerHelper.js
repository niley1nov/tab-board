export const updatePromptNodeDetails = (
	prevDetails,
	nodeId,
	tabNodeId,
	promptText,
	context,
	response,
) => ({
	...prevDetails,
	[nodeId]: {
		...(prevDetails[nodeId] || {}),
		[tabNodeId]: {
			[`subprompt`]: promptText,
			[`context`]: context,
			[`response`]: response || "No response available",
		},
	},
});

export const addFinalPrompt = (prevDetails, nodeId, finalPrompt) => ({
	...prevDetails,
	[nodeId]: {
		...(prevDetails[nodeId] || {}),
		finalPrompt,
	},
});
