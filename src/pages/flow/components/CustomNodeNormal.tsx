import { Handle, Position } from "@xyflow/react";

const CustomNodeNormal = ({ data, isConnectable }: any) => {
  return <>
    <Handle
      id="a"
      type="target"
      position={Position.Top}
      isConnectable={isConnectable}
      style={{
        background: "#3C3C3F",
        border: 0,
      }}
    />
    <div className="job-node text-sm">
      <span className="font-medium">Create Purchase Order</span>
      <span className="font-semibold text-white">{data.label}</span>
    </div>
    <Handle
      id="b"
      type="source"
      position={Position.Bottom}
      isConnectable={isConnectable}
      style={{
        background: "#3C3C3F",
        border: 0,
      }}
    />
  </>
}

export default CustomNodeNormal;
