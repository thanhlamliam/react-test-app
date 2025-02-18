import { getEdgeParams } from "@/pages/ptee-flow/utils/floatingEdge";
import { BezierEdge, EdgeLabelRenderer, EdgeProps, SmoothStepEdge, StepEdge, StepEdgeProps, getBezierPath, getStraightPath, useInternalNode } from "@xyflow/react";

const CustomEdgeActive = ({
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
  label,
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

  // ! Do not delete edgePath, labelX, labelY
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  return <>
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
      strokeWidth={5}
      markerEnd={markerEnd}
      style={style}
    />
    {/* <BezierEdge
      id={id}
      sourceX={sourceX}
      sourceY={sourceY}
      targetX={targetX}
      targetY={targetY}
      sourcePosition={sourcePosition}
      targetPosition={targetPosition}
      markerEnd={markerEnd}
      style={{ ...style, zIndex: 1 }}
    /> */}

    <EdgeLabelRenderer>
      {
        !!label && <div
          className="graph-edge"
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
            zIndex: 1,
          }}>
          {label}
        </div>
      }
    </EdgeLabelRenderer>
  </>
}

export default CustomEdgeActive