import { useEffect, useState } from "react";

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

    let ticking = false;

    function updateVisibleRows() {

      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      const startIndex = Math.floor(scrollTop / rowHeight);
      const visibleCount = Math.ceil(containerHeight / rowHeight);

      const buffer = 10;

      const endIndex = Math.min(
        totalRows,
        startIndex + visibleCount + buffer
      );

      setRange({
        start: startIndex,
        end: endIndex
      });

      ticking = false;
    }

    function onScroll() {

      if (!ticking) {

        window.requestAnimationFrame(updateVisibleRows);

        ticking = true;

      }

    }

    container.addEventListener("scroll", onScroll);

    updateVisibleRows();

    return () => {
      container.removeEventListener("scroll", onScroll);
    };

  }, [containerRef, rowHeight, totalRows]);

  return range;
}