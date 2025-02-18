import { BezierEdge, EdgeProps, StepEdge, getBezierPath, getStraightPath, useInternalNode } from "@xyflow/react";
import { getEdgeParams } from "../utils";

const CustomEdgeNormal = ({
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
    
    {/* <StepEdge
      sourceX={sourceX}
      sourceY={sourceY}
      targetX={targetX}
      targetY={targetY}
      sourcePosition={sourcePosition}
      targetPosition={targetPosition}
      markerEnd={markerEnd}
      style={style}
    /> */}

    {/* <EdgeLabelRenderer>
      <div
        className="w-[60px] h-5 flex items-center justify-center bg-[#1E1E20] border border-solid border-[#636369] rounded-full text-[#D8D8DC] text-xs"
        style={{
          position: 'absolute',
          transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          pointerEvents: 'all',
        }}>2h 12m</div>
    </EdgeLabelRenderer> */}
  </>
}

export default CustomEdgeNormal