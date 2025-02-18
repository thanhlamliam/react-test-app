import { Handle, Position } from "@xyflow/react";

const CustomNodeActive = ({ data, isConnectable }: any) => {
  return <>
    <Handle
      id="a"
      type="target"
      position={Position.Top}
      isConnectable={isConnectable}
      style={{
        background: "#44e444",
        border: 0,
      }}
    />
    <div className="job-node job-node-active text-sm">
      <span className="w-[86%] font-medium truncate">Create Purchase Order</span>
      <span className="font-semibold text-white">{data.label}</span>
    </div>
    <Handle
      id="b"
      type="source"
      position={Position.Bottom}
      isConnectable={isConnectable}
      style={{
        background: "#44e444",
        border: 0,
      }}
    />
  </>
}

export default CustomNodeActive;
