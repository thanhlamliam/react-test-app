import {
  Background,
  ConnectionLineType,
  Controls,
  MarkerType,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useCallback } from "react";
import CustomNodeActive from "./components/CustomNodeActive";
import CustomEdgeActive from "./components/CustomEdgeActive";
import CustomNodeNormal from "./components/CustomNodeNormal";
import CustomEdgeNormal from "./components/CustomEdgeNormal";
import dagre from 'dagre';
import { tempData, tempData2 } from "./data/tempData";

import '@xyflow/react/dist/style.css';
import './flow.scss';
import NodeStart from "./components/NodeStart";
import NodeEnd from "./components/NodeEnd";
import FloatingEdge from "./components/FloatingEdge";
import FloatingConnectionLine from "./components/FloatingConnectionLine";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 200;
const nodeHeight = 64;

const getLayoutElements = (nodes: any, edges: any) => {
  const isHorizontal = true;
  dagreGraph.setGraph({ rankdir: "TB" });

  nodes.forEach((node: any) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge: any) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node: any, index: number) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    let nodeType;
    if (node.id === "S") {
      nodeType = 'node-start';
    } else if (node.id === "E") {
      nodeType = 'node-end';
    } else if (index % 2 === 0) {
      nodeType = 'custom-node-active';
    } else {
      nodeType = 'custom-node-normal';
    }

    const newNode = {
      id: node.id,
      type: nodeType,
      data: { label: node.id },
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

const nodesData = tempData.vertices;
const edgesData = tempData.edges.map((edge: any, index: number) => (
  {
    id: `${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    // type: 'floating',
    type: index % 2 === 0 ? 'custom-edge-active' : 'custom-edge-normal',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: index % 2 === 0 ? '#6866FA' : '#636369',
    },
    style: {
      strokeWidth: 1,
      stroke: index % 2 === 0 ? '#6866FA' : '#636369',
    },
    // animated: index % 2 !== 0,
  }
))

const { nodes: initialNodes, edges: initialEdges } = getLayoutElements(nodesData, edgesData);

export default function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = {
    'custom-node-active': CustomNodeActive,
    'custom-node-normal': CustomNodeNormal,
    'node-start': NodeStart,
    'node-end': NodeEnd,
  };
  const edgeTypes = {
    'custom-edge-active': CustomEdgeActive,
    'custom-edge-normal': CustomEdgeNormal,
    'floating': FloatingEdge,
  };

  const onConnect = useCallback(
    (connection: any) => {
      setEdges((eds) => addEdge({
        ...connection,
      }, eds));
    },
    [],
  );

  return (
    <div className="flow floatingedges h-full w-full bg-[#1E1E20] rounded-md">
      <ReactFlow
        fitView
        onConnect={onConnect}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        connectionLineComponent={FloatingConnectionLine}
      >
        {/* <Background /> */}
        <Controls />
      </ReactFlow>
    </div>
  );
}
