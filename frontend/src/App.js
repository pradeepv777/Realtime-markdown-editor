import React from "react";
import Editor from "./Editor";

function App() {
  return (
    <div className="app">
      <div className="app__container">
        <h1 className="app__title">Real-Time Markdown Editor</h1>
        <Editor />
      </div>
    </div>
  );
}

export default App;
