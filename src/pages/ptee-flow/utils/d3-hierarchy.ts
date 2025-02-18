import { stratify, tree } from 'd3-hierarchy';

const g = tree();

const removeCycles = (nodes: any[], edges: any[]) => {
  const visited = new Set();
  const stack = new Set();
  const edgesToRemove = new Set();

  const hasCycle = (nodeId: any) => {
    if (stack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    stack.add(nodeId);

    for (const edge of edges.filter((edge: any) => edge.source === nodeId)) {
      if (hasCycle(edge.target)) {
        edgesToRemove.add(edge);
      }
    }

    stack.delete(nodeId);
    return false;
  };

  nodes.forEach((node: any) => hasCycle(node.id));

  return edges.filter((edge: any) => !edgesToRemove.has(edge));
};

export const getHierarchyLayout = (nodes: any, edges: any, options: any) => {
  if (nodes.length === 0) return { nodes, edges };

  const { width, height } = document?.querySelector(`[data-id="${nodes[0].id}"]`)?.getBoundingClientRect() as any;
  const filteredEdges = removeCycles(nodes, edges);
  const hierarchy = stratify()
    .id((node: any) => node.id)
    .parentId((node: any) => filteredEdges.find((edge: any) => edge.target === node.id)?.source);
  const root = hierarchy(nodes);
  const layout = g.nodeSize([width * 6, height * 3])(root);

  return {
    nodes: layout
      .descendants()
      .map((node: any) => ({ ...node.data, position: { x: node.x, y: node.y } })),
    edges: filteredEdges,
  };
};