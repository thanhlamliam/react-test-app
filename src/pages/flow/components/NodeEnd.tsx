import { Handle, Position } from "@xyflow/react"

const NodeEnd = ({ isConnectable }: any) => {
  return (
    <>
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
      <div className="w-[20px] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full bg-[#6866FA] shadow-[0_0_0_4px_rgba(104,102,250,0.2)]">
        </div>
      </div>
    </>
  )
}

export default NodeEnd