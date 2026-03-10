import { useState, useEffect } from "react";

export default function useVirtualScroll({
  rowHeight,
  totalRows,
  containerRef
}) {
  const [range, setRange] = useState({
    start: 0,
    end: 50
  });

  useEffect(() => {
    const container = containerRef.current;

    function onScroll() {
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      const startIndex = Math.floor(scrollTop / rowHeight);
      const visibleRows = Math.ceil(containerHeight / rowHeight);

      const buffer = 10;

      const endIndex = startIndex + visibleRows + buffer;

      setRange({
        start: startIndex,
        end: endIndex
      });
    }

    container.addEventListener("scroll", onScroll);

    return () => container.removeEventListener("scroll", onScroll);
  }, [containerRef, rowHeight]);

  return range;
}