import { ColDef, ColGroupDef, GridReadyEvent } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Button } from "antd";
import { useCallback, useMemo, useState } from "react";

export interface IOlympicData {
  athlete: string,
  age: number,
  country: string,
  year: number,
  date: string,
  sport: string,
  gold: number,
  silver: number,
  bronze: number,
  total: number
}

const Library = () => {
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<(ColDef | ColGroupDef)[]>([
    {
      headerName: "Name & Country",
      children: [{ field: "athlete" }, { field: "country" }],
    },
    {
      headerName: "Sports Results",
      children: [
        { columnGroupShow: "closed", field: "total" },
        { columnGroupShow: "closed", field: "gold" },
        { columnGroupShow: "open", field: "silver" },
        { columnGroupShow: "open", field: "bronze" },
      ],
    },
  ]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  return (
    <div className="h-full w-full flex flex-col gap-4">
      <div className="flex justify-between items-center gap-4">
        <h1 className="font-bold">Library</h1>
        <div className="flex gap-2">
          <Button type="primary">Download Excel</Button>
        </div>
      </div>
      <div className="flex-1">
        <div
          style={gridStyle}
          className={
            "ag-theme-quartz"
          }
        >
          <AgGridReact<IOlympicData>
            rowData={rowData}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
          />
        </div>
      </div>
    </div>
  )
}

export default Library