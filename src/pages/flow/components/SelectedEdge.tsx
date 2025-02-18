import { BezierEdge, EdgeLabelRenderer, EdgeProps, StepEdge, getBezierPath, getStraightPath, useInternalNode } from "@xyflow/react";
import { getEdgeParams } from "../utils";

const SelectedEdge = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode,
  );

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  // const [edgePath, labelX, labelY] = getStraightPath({
  //   sourceX,
  //   sourceY,
  //   targetX,
  //   targetY,
  // });

  return <>
    {/* <StepEdge
      sourceX={sx}
      sourceY={sy}
      targetX={tx}
      targetY={ty}
      sourcePosition={sourcePos}
      targetPosition={targetPos}
      markerEnd={markerEnd}
      style={style}
    /> */}

    <BezierEdge
      sourceX={sx}
      sourceY={sy}
      targetX={tx}
      targetY={ty}
      sourcePosition={sourcePos}
      targetPosition={targetPos}
      markerEnd={markerEnd}
      style={style}
    />
  </>
}

export default SelectedEdge