import { ICell } from "@/pages/caro/Caro";

interface CellProps {
  cell: ICell;
  onClick: () => void;
}

const Cell = ({
  cell,
  onClick
}: CellProps) => {
  return (
    <div className={`caro-cell ${cell.isWin ? 'win' : ''}`} onClick={onClick}>
      <span>
        {cell.value}
      </span>
    </div>
  )
}

export default Cell