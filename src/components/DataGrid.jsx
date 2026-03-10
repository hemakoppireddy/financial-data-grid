import React, { useEffect, useRef, useState } from "react";
import useVirtualScroll from "../hooks/useVirtualScroll";

const ROW_HEIGHT = 40;

function DataGrid() {

  const containerRef = useRef(null);

  const [data, setData] = useState([]);

  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    fetch("/transactions.json")
      .then(res => res.json())
      .then(setData);
  }, []);

  // SORT FUNCTION
  function handleSort(key) {

    let direction = "asc";

    if (sortKey === key && sortDirection === "asc") {
      direction = "desc";
    }

    setSortKey(key);
    setSortDirection(direction);

    const sorted = [...data].sort((a, b) => {

      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;

      return 0;
    });

    setData(sorted);

    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }

  const { start, end } = useVirtualScroll({
    rowHeight: ROW_HEIGHT,
    totalRows: data.length,
    containerRef
  });

  const visibleRows = data.slice(start, end);

  const offsetY = start * ROW_HEIGHT;

  return (
    <div>

      {/* GRID HEADER */}
      <div className="grid-header">

        <div
          className="cell header"
          data-test-id="header-id"
          onClick={() => handleSort("id")}
        >
          ID
        </div>

        <div
          className="cell header"
          data-test-id="header-date"
          onClick={() => handleSort("date")}
        >
          Date
        </div>

        <div className="cell header">
          Merchant
        </div>

        <div className="cell header">
          Category
        </div>

        <div
          className="cell header"
          data-test-id="header-amount"
          onClick={() => handleSort("amount")}
        >
          Amount
        </div>

        <div className="cell header">
          Status
        </div>

      </div>

      {/* GRID CONTAINER */}
      <div
        className="grid-container"
        ref={containerRef}
        style={{
          height: "600px",
          overflowY: "auto",
          position: "relative"
        }}
      >

        {/* SIZER */}
        <div
          style={{
            height: data.length * ROW_HEIGHT
          }}
        />

        {/* WINDOW */}
        <div
          style={{
            position: "absolute",
            top: 0,
            transform: `translateY(${offsetY}px)`
          }}
        >

          {visibleRows.map((row, index) => {

            const actualIndex = start + index;

            return (
              <div
                key={row.id}
                className="row"
                data-test-id={`virtual-row-${actualIndex}`}
                style={{ height: ROW_HEIGHT }}
              >

                <div className="cell">{row.id}</div>

                <div className="cell">{row.date}</div>

                <div
                  className="cell"
                  data-test-id={`cell-${actualIndex}-merchant`}
                >
                  {row.merchant}
                </div>

                <div className="cell">{row.category}</div>

                <div className="cell">{row.amount}</div>

                <div className="cell">{row.status}</div>

              </div>
            );

          })}

        </div>

      </div>

    </div>
  );
}

export default DataGrid;