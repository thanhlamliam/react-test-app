import { FlowContext } from "@/pages/ptee-flow/PerfectwinFlow";
import { Handle, Position } from "@xyflow/react";
import { Tooltip } from "antd";
import { useContext, useMemo } from "react";

const { Top, Bottom, Left, Right } = Position;

const SelectedNode = ({ data, isConnectable, ...props }: any) => {
  const { selectedNode, setSelectedNode } = useContext(FlowContext);

  const description = useMemo(() => {
    return data.description ?? "No Description"
  }, [data]);

  const handleClick = () => {
    setSelectedNode(selectedNode === props.id ? "" : props.id);
  }

  return <>
    <div className="graph-node text-sm" onClick={handleClick} style={data.style}>
      {/*border-2 border-solid border-[#23a023] shadow-[0px_0px_0px_6px_rgba(35,160,35,0.2)] */}
      <Tooltip title={description}>
        <span className="graph-node__desc">{description}</span>
      </Tooltip>
      <span className="graph-node__tCode">{data.label}</span>
    </div>
    <Handle
      id="a"
      type="source"
      position={Top}
      style={{
        background: "#23a023",
        border: 0,
      }}
    />
    <Handle
      id="b"
      type="source"
      position={Bottom}
      style={{
        background: "#23a023",
        border: 0,
      }}
    />
    <Handle
      id="g"
      type="source"
      position={Right}
      style={{
        background: "#23a023",
        border: 0,
      }}
    />
    <Handle
      id="h"
      type="source"
      position={Left}
      style={{
        background: "#23a023",
        border: 0,
      }}
    />
  </>
}

export default SelectedNode;
