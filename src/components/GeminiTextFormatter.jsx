const renderFormattedText = (text) => {
  if (!text) return null;

  // Clean unwanted markdown language tags (like ```python)
  const cleanedText = text.replace(/```(?:\w+)?/g, "```");

  const lines = cleanedText.split("\n");

  const formattedElements = [];
  let inCodeBlock = false;
  let codeLines = [];

  lines.forEach((line, idx) => {
    if (line.trim() === "```") {
      if (inCodeBlock) {
        // Closing code block
        formattedElements.push(
          <pre key={`code-${idx}`} className="bg-gray-100 border border-gray-300 rounded p-4 whitespace-pre-wrap text-sm font-mono text-black">
            {codeLines.join("\n")}
          </pre>
        );
        codeLines = [];
      }
      inCodeBlock = !inCodeBlock;
    } else if (inCodeBlock) {
      codeLines.push(line);
    } else {
      const parts = line
        .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
        .filter(Boolean);

      formattedElements.push(
        <p key={idx} className="mb-2 text-gray-800">
          {parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={i} className="font-semibold text-black">
                  {part.slice(2, -2)}
                </strong>
              );
            } else if (part.startsWith("`") && part.endsWith("`")) {
              return (
                <code key={i} className="bg-gray-200 rounded px-1 py-0.5 text-sm font-mono">
                  {part.slice(1, -1)}
                </code>
              );
            } else {
              return <span key={i}>{part}</span>;
            }
          })}
        </p>
      );
    }
  });

  return formattedElements;
};

export default renderFormattedText;
