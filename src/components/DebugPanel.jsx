import React, { useEffect, useState } from "react";

function DebugPanel({ start, renderedRows, totalRows }) {

  const [fps, setFps] = useState(0);

  useEffect(() => {

    let frameCount = 0;
    let lastTime = performance.now();

    function measureFPS() {

      frameCount++;

      const now = performance.now();

      if (now >= lastTime + 1000) {

        setFps(frameCount);

        frameCount = 0;
        lastTime = now;

      }

      requestAnimationFrame(measureFPS);
    }

    requestAnimationFrame(measureFPS);

  }, []);

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
        FPS: {fps}
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