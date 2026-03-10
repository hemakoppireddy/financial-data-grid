import React, { useEffect, useRef, useState } from "react";
import useVirtualScroll from "../hooks/useVirtualScroll";

const ROW_HEIGHT = 40;

function DataGrid() {

  const containerRef = useRef(null);

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const [merchantFilter, setMerchantFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);

  const [selectedRows, setSelectedRows] = useState(new Set());

  // LOAD DATA
  useEffect(() => {
    fetch("/transactions.json")
      .then(res => res.json())
      .then(res => {
        setData(res);
        setFilteredData(res);
      });
  }, []);

  // FILTERING (merchant + status)
  useEffect(() => {

    const timer = setTimeout(() => {

      let result = data;

      if (merchantFilter) {
        const lower = merchantFilter.toLowerCase();

        result = result.filter(row =>
          row.merchant.toLowerCase().includes(lower)
        );
      }

      if (statusFilter) {
        result = result.filter(row =>
          row.status === statusFilter
        );
      }

      setFilteredData(result);

    }, 300);

    return () => clearTimeout(timer);

  }, [merchantFilter, statusFilter, data]);

  // SORT FUNCTION
  function handleSort(key) {

    let direction = "asc";

    if (sortKey === key && sortDirection === "asc") {
      direction = "desc";
    }

    setSortKey(key);
    setSortDirection(direction);

    const sorted = [...filteredData].sort((a, b) => {

      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;

      return 0;
    });

    setFilteredData(sorted);

    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }

  // ROW SELECTION
  function handleRowClick(index, event) {

    const newSelection = new Set(selectedRows);

    if (event.ctrlKey || event.metaKey) {

      if (newSelection.has(index)) {
        newSelection.delete(index);
      } else {
        newSelection.add(index);
      }

    } else {

      newSelection.clear();
      newSelection.add(index);

    }

    setSelectedRows(newSelection);
  }

  const { start, end } = useVirtualScroll({
    rowHeight: ROW_HEIGHT,
    totalRows: filteredData.length,
    containerRef
  });

  const visibleRows = filteredData.slice(start, end);

  const offsetY = start * ROW_HEIGHT;

  return (
    <div>

      {/* FILTER UI */}
      <div style={{ padding: "10px" }}>

        {/* QUICK STATUS FILTERS */}
        <button
          data-test-id="quick-filter-Completed"
          onClick={() => setStatusFilter("Completed")}
        >
          Completed
        </button>

        <button
          data-test-id="quick-filter-Pending"
          onClick={() => setStatusFilter("Pending")}
        >
          Pending
        </button>

        <button onClick={() => setStatusFilter(null)}>
          Clear
        </button>

        <br /><br />

        {/* MERCHANT FILTER */}
        <input
          type="text"
          placeholder="Filter merchant..."
          data-test-id="filter-merchant"
          value={merchantFilter}
          onChange={(e) => setMerchantFilter(e.target.value)}
        />

        <div data-test-id="filter-count">
          Showing {filteredData.length} of {data.length} rows
        </div>

      </div>

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
            height: filteredData.length * ROW_HEIGHT
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
                data-selected={selectedRows.has(actualIndex) ? "true" : undefined}
                onClick={(e) => handleRowClick(actualIndex, e)}
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