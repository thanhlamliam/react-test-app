import Cell from "@/pages/caro/components/Cell";
import { useMemo } from "react";

interface BoardProps {
  loading: boolean;
  board: (string | null)[][];
  onClick: (row: number, col: number) => void;
}

const Board = ({
  loading,
  board,
  onClick,
}: BoardProps) => {
  return useMemo(
    () => (
      <div
        className="caro-board grid"
        style={{
          gridTemplateColumns: `repeat(${board.length}, 1fr)`
        }}
      >
        {
          !loading && board.map((row, rowIndex) =>
            <div className="caro-board__row" key={rowIndex}>
              {
                row.map((cell, colIndex) =>
                  <Cell value={cell} onClick={() => onClick(rowIndex, colIndex)} key={colIndex} />
                )
              }
            </div>
          )
        }
      </div>
    )
    , [board, loading]
  )
}

export default Board