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

  const rootClassName = `editor${darkMode ? " editor--dark" : ""}`;
  const toggleClassName = `toggle${darkMode ? " toggle--dark" : ""}`;
  const inputClassName = `editor__input${darkMode ? " editor__input--dark" : ""}`;
  const previewClassName = `editor__preview${darkMode ? " editor__preview--dark" : ""}`;

  return (
    <div className={rootClassName}>
      <button onClick={() => setDarkMode(!darkMode)} className={toggleClassName}>
        Switch to {darkMode ? "Light" : "Dark"} Mode
      </button>

      <textarea value={text} onChange={handleChange} className={inputClassName} />

      <div className={previewClassName}>{renderMarkdownWithHighlight()}</div>
    </div>
  );
}

export default Editor;
