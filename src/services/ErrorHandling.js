function handleError(error) {
	const errorMappings = {
	  "400": "Unauthorized: Invalid API key or authentication credentials.",
	  "403": "Forbidden: Access denied due to insufficient permissions.",
	  "404": "Not Found: The requested resource (summarizer model) might be unavailable.",
	  "500": "Internal Server Error: An unexpected error occurred on the server.",
	};
  
	for (const key in errorMappings) {
	  if (String(error).includes(key)) {
		return errorMappings[key];
	  }
	}
  
	return "An unexpected error occurred. Please try again later.";
}

export { handleError };