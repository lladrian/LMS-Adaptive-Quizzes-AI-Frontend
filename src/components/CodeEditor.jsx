import React, { useState } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ value, onChange, language, height }) => {
  const [isEditorReady, setIsEditorReady] = useState(false);

  const handleEditorDidMount = (editor, monaco) => {
    setIsEditorReady(true);

    // Disable copy/paste
    editor.onKeyDown((e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.keyCode === monaco.KeyCode.KeyC ||
          e.keyCode === monaco.KeyCode.KeyV ||
          e.keyCode === monaco.KeyCode.KeyX)
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <Editor
        height={height || "300px"}
        language={language || "python"}
        theme="vs-dark"
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          readOnly: false, // Keep this false so users can still type
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
};

export default CodeEditor;
