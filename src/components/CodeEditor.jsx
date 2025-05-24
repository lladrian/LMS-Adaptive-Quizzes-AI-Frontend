import React, { useState } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ value, onChange, language, height }) => {
  const [isEditorReady, setIsEditorReady] = useState(false);

  const handleEditorDidMount = () => {
    setIsEditorReady(true);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <Editor
        height={height || "300px"}
        language={language || "javascript"}
        theme="vs-dark"
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
};

export default CodeEditor;
