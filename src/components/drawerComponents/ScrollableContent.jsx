const ScrollableContent = ({ children }) => (
	<div
		style={{
			overflowY: "auto",
			height: "100%",
			padding: "8px",
		}}
	>
		{children}
	</div>
);

export default ScrollableContent;
