import React from "react";
import Editor from "./Editor";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">Real-Time Markdown Editor</h1>
        <Editor />
      </div>
    </div>
  );
}

export default App;
