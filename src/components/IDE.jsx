import React from 'react';
import MonacoEditor from '@monaco-editor/react';

const IDE = ({ code, setCode }) => {
  return (
    <div className="h-[500px] border-2 border-gray-300">
      <MonacoEditor
        height="100%"
        defaultLanguage="javascript"
        value={code}
        onChange={(value) => setCode(value)}
      />
    </div>
  );
};

export default IDE;
