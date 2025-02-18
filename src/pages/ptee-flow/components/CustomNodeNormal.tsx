import { FlowContext } from "@/pages/ptee-flow/PerfectwinFlow";
import { Handle, Position } from "@xyflow/react";
import { Tooltip } from "antd";
import { useContext, useMemo } from "react";

const { Top, Bottom, Left, Right } = Position;

const CustomNodeNormal = ({ data, isConnectable, ...props }: any) => {
  const { setSelectedNode } = useContext(FlowContext);

  const description = useMemo(() => {
    return data.description ?? "No Description"
  }, [data]);

  const handleClick = () => {
    // console.log("Clicked on node", props);
    setSelectedNode(props.id);
  }

  return <>
    <div className="graph-node text-sm" onClick={handleClick}>
      <Tooltip title={description}>
        <span className="graph-node__desc">{description}</span>
      </Tooltip>

      <Tooltip title={data.label}>
        <span className="graph-node__tCode">{data.label}</span>
      </Tooltip>
    </div>
    <Handle
      id="a"
      type="source"
      position={Top}
      style={{
        background: "#3C3C3F",
        border: 0,
      }}
    />
    <Handle
      id="b"
      type="source"
      position={Bottom}
      style={{
        background: "#3C3C3F",
        border: 0,
      }}
    />
    <Handle
      id="c"
      type="source"
      position={Right}
      style={{
        background: "#3C3C3F",
        border: 0,
      }}
    />
    <Handle
      id="d"
      type="source"
      position={Left}
      style={{
        background: "#3C3C3F",
        border: 0,
      }}
    />
  </>
}

export default CustomNodeNormal;
