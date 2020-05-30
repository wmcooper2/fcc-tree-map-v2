import React from "react";
import "./App.css";
import "./myd3.js";

function App() {
  return (
    <div className="App">
      <div id="body">
        <div>
          <div id="title">
            <h1>Kickstarter Projects</h1>
          </div>
          <div id="description">(size based on revenue generated)</div>
          <div id="chartarea">
            <div id="graph"></div>
            <div id="legendbox">
              <div id="legendtitle">
                <h2>Legend</h2>
              </div>
              <div id="legend"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
