import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { marked } from "marked";

const socket = io("http://localhost:5000");

function Editor() {
  const [text, setText] = useState("");

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

  return (
    <div className="grid grid-cols-2 gap-4">
      <textarea
        value={text}
        onChange={handleChange}
        className="w-full h-[70vh] p-3 border rounded-lg focus:outline-none"
      />
      <div
        className="prose p-3 border rounded-lg bg-gray-50 overflow-auto"
        dangerouslySetInnerHTML={{ __html: marked(text) }}
      />
    </div>
  );
}

export default Editor;
