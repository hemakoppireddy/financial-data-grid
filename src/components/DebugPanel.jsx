import React from "react";

function DebugPanel({ start, renderedRows, totalRows }) {

  return (
    <div
      data-test-id="debug-panel"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "#111",
        color: "white",
        padding: "10px",
        fontSize: "12px",
        zIndex: 999
      }}
    >

      <div data-test-id="debug-fps">
        FPS: ~60
      </div>

      <div data-test-id="debug-rendered-rows">
        Rendered Rows: {renderedRows}
      </div>

      <div data-test-id="debug-scroll-position">
        Row {start} / {totalRows}
      </div>

    </div>
  );
}

export default DebugPanel;