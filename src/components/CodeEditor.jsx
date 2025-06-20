import React, { useState } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({
  value,
  onChange,
  language,
  height,
  disabled = true, // Default to true (copy/paste disabled)
  readOnly = false, // Separate from disabled prop
}) => {
  const [isEditorReady, setIsEditorReady] = useState(false);

  const handleEditorDidMount = (editor, monaco) => {
    setIsEditorReady(true);

    if (disabled) {
      // Disable copy/paste keyboard shortcuts
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

      // Disable right-click context menu
      editor.onContextMenu((e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    }
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
          readOnly: readOnly, // Truly prevents any editing
          contextmenu: !disabled, // Disable context menu if copy/paste is disabled
          copyWithSyntaxHighlighting: false,
        }}
        onMount={handleEditorDidMount}
      />
      {disabled && (
        <div className="text-xs text-gray-500 p-2 bg-gray-50">
          Note: Copy/paste is disabled for this editor
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
