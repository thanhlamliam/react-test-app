import {
  ConnectionMode,
  Controls,
  MarkerType,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { Dispatch, SetStateAction, createContext, useCallback, useEffect, useMemo, useState } from "react";
import NodeStart from "../flow/components/NodeStart";
import NodeEnd from "../flow/components/NodeEnd";
import { highlightData, highlightData2, highlightData3, newResponse, tempData, tempData2, tempData3 } from "../flow/data/tempData";
import CustomNodeActive from "./components/CustomNodeActive";
import CustomNodeNormal from "./components/CustomNodeNormal";
import '../flow/flow.scss';
import { getDagreLayout } from "./utils/dagre";
import { Button, Popover, Spin } from "antd";
import { useElkLayout } from "./utils/elk";
import { getHierarchyLayout } from "./utils/d3-hierarchy";
import SelectedNode from "../flow/components/SelectedNode";
import SelectedEdge from "../flow/components/SelectedEdge";
import { patternData } from "../flow/data/pattern";
import CustomEdgeActive from "./components/CustomEdgeActive";
import CustomEdgeNormal from "./components/CustomEdgeNormal";

interface FlowContextProps {
  selectedNode: string;
  setSelectedNode: Dispatch<SetStateAction<string>>;
}

export const FlowContext = createContext<FlowContextProps>({
  selectedNode: "",
  setSelectedNode: () => { },
});

const flowData = tempData;
const { pattern: highlightNodes, edges: highlightEdges } = highlightData;

const PerfectwinFlow = () => {
  const { getElkLayoutedElements } = useElkLayout()

  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string>("");
  const [pathFromSelectedNode, setPathFromSelectedNode] = useState<string[] | null>([]);

  const contextValue: FlowContextProps = {
    selectedNode,
    setSelectedNode
  }

  const nodeTypes = {
    'custom-node-active': CustomNodeActive,
    'custom-node-normal': CustomNodeNormal,
    'selected-node': SelectedNode,
    'node-start': NodeStart,
    'node-end': NodeEnd,
  };
  const edgeTypes = {
    'custom-edge-active': CustomEdgeActive,
    'custom-edge-normal': CustomEdgeNormal,
    'selected-edge': SelectedEdge,
  };

  // Utils
  // const mapNodes = (tempNodes: any[], highlightNodes: string[], selectedNodeId?: string) => {
  //   return tempNodes.map((node: any) => {
  //     const isHighlight = highlightNodes.includes(node.id);
  //     let nodeType;

  //     if (node.id === "S") {
  //       nodeType = 'node-start';
  //     } else if (node.id === "E") {
  //       nodeType = 'node-end';
  //     } else if (isHighlight) {
  //       nodeType = 'custom-node-active';
  //     } else {
  //       nodeType = 'custom-node-normal';
  //     }

  //     return {
  //       ...node,
  //       id: node.id,
  //       type: nodeType,
  //       data: { label: node.id, description: node.description },
  //     };
  //   });
  // };

  // const mapEdges = (flowData: any, highlightEdges: any[], selectedPath?: any[]) => {
  //   return flowData?.edges.map((edge: any) => {
  //     const highlightEdge = highlightEdges.find(
  //       (highlightEdge: any) =>
  //         highlightEdge.source === edge.source && highlightEdge.target === edge.target
  //     );

  //     const isHighlight = !!highlightEdge;

  //     return {
  //       id: `${edge.source}-${edge.target}`,
  //       source: edge.source,
  //       target: edge.target,
  //       label: highlightEdge?.durationAvg ?? "",
  //       type: isHighlight ? 'custom-edge-active' : 'custom-edge-normal',
  //       markerEnd: {
  //         type: MarkerType.ArrowClosed,
  //         color: isHighlight ? '#6866FA' : '#636369',
  //       },
  //       style: {
  //         strokeWidth: 1,
  //         stroke: isHighlight ? '#6866FA' : '#636369',
  //         strokeDasharray: isHighlight ? 0 : 3.5
  //       },
  //     };
  //   }) ?? [];
  // };

  const mapNodes = (tempNodes: any[], highlightNodes: string[], selectedNodeId?: string) => {
    const highlightedNodes = tempNodes.filter(node => highlightNodes.includes(node.id));
    const nonHighlightedNodes = tempNodes.filter(node => !highlightNodes.includes(node.id));

    const mapNode = (node: any) => {
      const isHighlight = highlightNodes.includes(node.id);
      const isSelected = selectedNodeId && node.id === selectedNodeId;
      let nodeType;

      if (node.id === "S") {
        nodeType = 'node-start';
      } else if (node.id === "E") {
        nodeType = 'node-end';
      } else if (isHighlight) {
        nodeType = 'custom-node-active';
      } else if (isSelected) {
        nodeType = 'selected-node';
      } else {
        nodeType = 'custom-node-normal';
      }

      return {
        ...node,
        id: node.id,
        type: nodeType,
        data: {
          label: node.id,
          description: node.description,
        },
      };
    };

    return [
      ...highlightedNodes.map(mapNode),
      ...nonHighlightedNodes.map(mapNode),
    ];
  };

  const mapEdges = (flowData: any, highlightEdges: any[], selectedPath?: any[]) => {
    return flowData?.edges.map((edge: any) => {
      const highlightEdge = highlightEdges.find(
        (highlightEdge: any) =>
          highlightEdge.source === edge.source && highlightEdge.target === edge.target
      );

      const selectedEdge = selectedPath?.find(
        (selectedEdge: any) =>
          selectedEdge.source === edge.source && selectedEdge.target === edge.target
      );

      const isHighlight = !!highlightEdge;
      const isSelected = !!selectedEdge;

      return {
        id: `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        label: highlightEdge?.durationAvg ?? "",
        type: isHighlight ? 'custom-edge-active' : isSelected ? 'selected-edge' : 'custom-edge-normal',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isHighlight ? '#6866FA' : isSelected ? '#23a023' : '#636369',
        },
        style: {
          strokeWidth: 1,
          stroke: isHighlight ? '#6866FA' : isSelected ? '#23a023' : '#636369',
          strokeDasharray: isHighlight || isSelected ? 0 : 3.5
        },
      };
    }) ?? [];
  };

  const onFitView = () => {
    onLoading();
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        fitView();
      });
    }, 500);
  }

  const onLoading = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const findPath = (nodes: any[], edges: any[], selectedNode: string) => {
    const graph: { [key: string]: string[] } = {};

    // Build the graph
    nodes.forEach(node => {
      graph[node.id] = [];
    });

    edges.forEach(edge => {
      if (graph[edge.source]) {
        graph[edge.source].push(edge.target);
      } else {
        graph[edge.source] = [edge.target];
      }
    });

    const visited = new Set<string>();
    let selectedNodeFound = false;

    const dfs = (current: string, target: string): boolean => {
      if (current === selectedNode) {
        selectedNodeFound = true;
      }

      if (current === target && selectedNodeFound) {
        visited.add(target);
        return true;
      }

      visited.add(current);

      if (!graph[current]) {
        return false;
      }

      for (const neighbor of graph[current]) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor, target)) {
            return true;
          }
        }
      }

      visited.delete(current);
      return false;
    };

    if (dfs('S', 'E') && selectedNodeFound) {
      return Array.from(visited);
    }

    return null;
  };

  const generateEdges = (nodes: string[]) => {
    const edges = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      edges.push({ source: nodes[i], target: nodes[i + 1], durationAvg: null });
    }
    return edges;
  };

  // Actions
  const onOriginalLayout = () => {
    let tempNodes = flowData.vertices;
    let y = 0;
    let yHighlight = 0;

    if (nodes.length) {
      tempNodes = nodes;
    } else {
      const length = tempNodes.length;
      if (length > 2 && tempNodes[0].id !== "S") {
        const startNode = tempNodes[length - 2];
        tempNodes.splice(length - 2, 1); // Remove the second-to-last node
        tempNodes.unshift(startNode); // Add it to the start of the array
      }
    }

    setNodes(mapNodes(tempNodes, highlightNodes, selectedNode).map((node, index) => {
      const isHighlight = highlightNodes.includes(node.id);
      let x = 0;
      if (isHighlight) {
        x = node.id === "S" || node.id === "E" ? 90 : 0;
        yHighlight = node.id === "E" ? tempNodes.length / 2 * 120 : yHighlight + 120;
      } else {
        // switch (index % 4) {
        //   case 1:
        //     x = -560;
        //     y += 120;
        //     break;
        //   case 2:
        //     x = -280;
        //     break;
        //   case 3:
        //     x = 280;
        //     break;
        //   case 0:
        //     x = 560;
        //     break;
        // }

        if (index === highlightNodes.length) {
          y += 120;
        }

        switch (index % 3) {
          case 1:
            x = -280;
            y += 120;
            break;
          case 2:
            x = 280;
            break;
          case 0:
            x = 280;
            y += 120;
            break
        }
      }
      return {
        ...node,
        position: { x, y: isHighlight ? yHighlight : y }
      };
    }));

    if (pathFromSelectedNode) {
      const pathEdges = generateEdges(pathFromSelectedNode);
      setEdges(mapEdges(flowData, highlightEdges, pathEdges));
    } else {
      setEdges(mapEdges(flowData, highlightEdges));
    }

    onFitView();
  }

  const onDagreLayout = useCallback(
    (direction: any) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getDagreLayout(nodes, edges, direction);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);

      onFitView();
    },
    [nodes, edges],
  );

  const onElkLayout = (algorithm: string, direction?: string) => {
    const layoutOptions: any = { 'elk.algorithm': algorithm };
    if (direction) {
      layoutOptions['elk.direction'] = direction;
    }
    getElkLayoutedElements(layoutOptions, onLoading);
  };

  const onHierarchyLayout = useCallback(
    (direction: any) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getHierarchyLayout(nodes, edges, {
          direction,
        });

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);

      onFitView();
    },
    [nodes, edges],
  );

  useEffect(() => {
    onOriginalLayout();
  }, []);

  useEffect(() => {
    // const paths = patternData.filter((pattern) => {
    //   return pattern.includes(selectedNode);
    // })
    // console.log(paths)
    setNodes((prev) => mapNodes(prev, highlightNodes, selectedNode));
    const path = findPath(nodes, edges, selectedNode);
    setPathFromSelectedNode(path);
    if (path) {
      const pathEdges = generateEdges(path);
      setEdges(mapEdges(flowData, highlightEdges, pathEdges));
    } else {
      setEdges(mapEdges(flowData, highlightEdges));
    }
  }, [selectedNode]);

  // console.log(nodes, edges);

  return useMemo(() => (
    <FlowContext.Provider value={contextValue}>
      <div className="flow h-full w-full bg-[#1E1E20] rounded-md">
        <Spin spinning={loading}>
          {!loading && <ReactFlow
            fitView
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            connectionMode={ConnectionMode.Loose}
          >
            <Controls />
            <Panel position="top-right">
              <div className="flex gap-2">
                <Button onClick={onOriginalLayout}>Original</Button>

                <Popover
                  content={(
                    <div className="flex flex-col gap-2">
                      <Button onClick={() => onDagreLayout("TB")}>Vertical</Button>
                      <Button onClick={() => onDagreLayout("LR")}>Horizontal</Button>
                    </div>
                  )}
                >
                  <Button>Dagree</Button>
                </Popover>

                <Popover
                  content={(
                    <div className="flex flex-col gap-2">
                      <Button onClick={() => onElkLayout('layered', 'DOWN')}>Vertical</Button>
                      <Button onClick={() => onElkLayout('layered', 'RIGHT')}>Horizontal</Button>
                      {/* <Button onClick={() => onElkLayout('org.eclipse.elk.radial')}>Radial</Button> */}
                      <Button onClick={() => onElkLayout('org.eclipse.elk.force')}>Force</Button>
                    </div>
                  )}
                >
                  <Button>ELK</Button>
                </Popover>

                <Button onClick={() => onHierarchyLayout('')}>Hierarchy</Button>
              </div>
            </Panel>
          </ReactFlow>}
        </Spin>
      </div>
    </FlowContext.Provider>
  ), [contextValue]);
}

export default function () {
  return (
    <ReactFlowProvider>
      <PerfectwinFlow />
    </ReactFlowProvider>
  );
};
