import { BezierEdge, EdgeLabelRenderer, EdgeProps, StepEdge, getBezierPath, getStraightPath, useInternalNode } from "@xyflow/react";
import { getEdgeParams } from "../utils";

const CustomEdgeActive = ({
  id,
  label,
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

    <EdgeLabelRenderer>
      {
        !!label &&
        <div
          className="w-[60px] h-5 flex items-center justify-center bg-[#1E1E20] border border-solid border-[#6866FA] rounded-full text-[#D8D8DC] text-xs"
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}>{label}</div>
      }
    </EdgeLabelRenderer>
  </>
}

export default CustomEdgeActive