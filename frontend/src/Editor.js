import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { marked } from "marked";
import Highlight from "./Highlight";

const socket = io("http://localhost:5000");

function Editor() {
  const [text, setText] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const docId = "default-doc";
    socket.emit("get-document", docId);
    socket.on("load-document", content => setText(content));
    socket.on("receive-changes", delta => setText(delta));

    return () => socket.disconnect();
  }, []);

  const handleChange = e => {
    setText(e.target.value);
    socket.emit("send-changes", e.target.value);
    socket.emit("save-document", e.target.value);
  };

  const renderMarkdownWithHighlight = () => {
    const parts = text.split(/```/g);

    return parts.map((part, idx) => {
      if (idx % 2 === 0) {
        return (
          <div
            key={idx}
            dangerouslySetInnerHTML={{ __html: marked(part) }}
          />
        );
      } else {
        const firstLineBreak = part.indexOf("\n");
        let language = "";
        let code = part;
        if (firstLineBreak !== -1) {
          language = part.slice(0, firstLineBreak).trim();
          code = part.slice(firstLineBreak + 1);
        }
        return (
          <Highlight
            key={idx}
            language={language || "text"}
            value={code}
            isDarkMode={darkMode} // Pass darkMode here
          />
        );
      }
    });
  };

  return (
    <div className={`grid grid-cols-2 gap-4 ${darkMode ? "bg-gray-900" : "bg-gray-100"} min-h-screen p-4`}>
      {/* Toggle Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`col-span-2 mb-2 p-2 rounded ${
          darkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
        }`}
      >
        Switch to {darkMode ? "Light" : "Dark"} Mode
      </button>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={handleChange}
        className={`w-full h-[70vh] p-3 border rounded-lg focus:outline-none ${
          darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-300"
        }`}
      />

      {/* Markdown Preview */}
      <div
        className={`prose p-3 border rounded-lg overflow-auto ${
          darkMode ? "prose-invert bg-gray-800 text-white border-gray-700" : "bg-gray-50 text-black border-gray-300"
        }`}
      >
        {renderMarkdownWithHighlight()}
      </div>
    </div>
  );
}

export default Editor;
