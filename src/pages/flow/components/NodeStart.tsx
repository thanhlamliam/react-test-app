import { Handle, Position } from "@xyflow/react"

const NodeStart = ({ isConnectable }: any) => {
  return (
    <>
      <div className="w-[20px] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full bg-[#6866FA]">
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{
          background: "transparent",
          border: 0,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        style={{
          background: "transparent",
          border: 0,
        }}
      />
      <Handle
        type="source"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{
          background: "transparent",
          border: 0,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{
          background: "transparent",
          border: 0,
        }}
      />
    </>
  )
}

export default NodeStart