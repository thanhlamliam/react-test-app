interface CellProps {
  value: string | null;
  onClick: () => void;
}

const Cell = ({
  value,
  onClick
}: CellProps) => {
  return (
    <div className="caro-cell" onClick={onClick}>
      <span>
        {value}
      </span>
    </div>
  )
}

export default Cell