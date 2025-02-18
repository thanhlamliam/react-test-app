import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

export const useElkLayout = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
  const defaultOptions = {
    'elk.algorithm': 'layered',
    'elk.layered.spacing.nodeNodeBetweenLayers': 100,
    'elk.spacing.nodeNode': 80,
  };

  const getElkLayoutedElements = useCallback((options: any, callbackFn?: Function) => {
    const layoutOptions = { ...defaultOptions, ...options };
    const graph: any = {
      id: 'root',
      layoutOptions: layoutOptions,
      children: getNodes().map((node) => ({
        ...node,
        width: node.measured?.width,
        height: node.measured?.height,
      })),
      edges: getEdges(),
    };

    elk.layout(graph).then(({ children }: any) => {
      // By mutating the children in-place we saves ourselves from creating a
      // needless copy of the nodes array.
      children?.forEach((node: any) => {
        node.position = { x: node.x, y: node.y };
      });

      setNodes(children);
      window.requestAnimationFrame(() => {
        fitView();
      });
    }).then(() => {
      callbackFn?.()
    });
  }, []);

  return { getElkLayoutedElements };
};
