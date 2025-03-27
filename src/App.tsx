import { ReactNode, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
  type Node,
  type Edge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";
import dagre from "@dagrejs/dagre";
/**
 * 检测图中的所有回流边（形成环路的边）
 * @param edges 边数组
 * @param nodes 节点数组（用于验证节点存在性）
 * @returns 返回回流边的ID数组
 */
/**
 * 基于图的连接关系（非坐标）识别回流边（形成环路的边）
 * @param edges 所有边
 * @param nodes 所有节点（用于验证节点存在性）
 * @returns 回流边的ID数组
 */
/**
 * 识别并仅标记形成闭环的最后一条边（如 A→B→C→A 中的 C→A）
 * @param edges 所有边
 * @param nodes 所有节点
 * @returns 返回需要标记的回流边ID数组（如 ["c-a"]）
 */
/**
 * 识别严格有向闭环的最后一条边（如 A→B→C→A 中的 C→A）
 * @param edges 所有边
 * @param nodes 所有节点
 * @returns 返回闭环边的ID数组（如 ["c-a"] 或 ["d-a"]）
 */
// function findDirectedCycleClosingEdges(edges: Edge[], nodes: Node[]): string[] {
//   const nodeIds = new Set(nodes.map((n) => n.id));
//   const graph = new Map<string, string[]>(); // 邻接表：source → target[]
//   const edgeIdMap = new Map<string, string>(); // 边唯一标识（如 "a-b"） → 边ID

//   // 1. 构建邻接表和边映射
//   edges.forEach((edge) => {
//     if (nodeIds.has(edge.source) && nodeIds.has(edge.target)) {
//       if (!graph.has(edge.source)) graph.set(edge.source, []);
//       graph.get(edge.source)!.push(edge.target);
//       edgeIdMap.set(`${edge.source}-${edge.target}`, edge.id);
//     }
//   });

//   const closingEdges = new Set<string>();
//   const visited = new Set<string>();
//   const recursionStack = new Set<string>();

//   const dfs = (nodeId: string, path: string[]): string[] | null => {
//     if (recursionStack.has(nodeId)) {
//       // 找到闭环，提取闭环路径（如 ["a", "b", "c", "a"]）
//       const cycleStartIndex = path.indexOf(nodeId);
//       const cycle = path.slice(cycleStartIndex);
//       cycle.push(nodeId); // 闭合路径（A→B→C→A）
//       return cycle;
//     }
//     if (visited.has(nodeId)) return null;

//     visited.add(nodeId);
//     recursionStack.add(nodeId);
//     path.push(nodeId);

//     for (const neighbor of graph.get(nodeId) || []) {
//       const cycle = dfs(neighbor, [...path]);
//       if (cycle) {
//         // 提取闭环的最后一条边（如 "c-a"）
//         const lastEdgeKey = `${cycle[cycle.length - 2]}-${
//           cycle[cycle.length - 1]
//         }`;
//         if (edgeIdMap.has(lastEdgeKey)) {
//           closingEdges.add(edgeIdMap.get(lastEdgeKey)!);
//         }
//         return cycle;
//       }
//     }

//     recursionStack.delete(nodeId);
//     path.pop();
//     return null;
//   };

//   // 2. 遍历所有未访问节点
//   for (const nodeId of graph.keys()) {
//     if (!visited.has(nodeId)) dfs(nodeId, []);
//   }

//   return Array.from(closingEdges);
// }
const layout = (nodes: Node[], edges: Edge[]) => {
  const g = new dagre.graphlib.Graph({
    directed: true,
  });
  g.setGraph({
    rankdir: "LR",
    ranksep: 100, //水平node间距
    nodesep: 100, //垂直node间距
    edgesep: 200,
    ranker: "network-simplex",
    // acyclicer: "greedy",
  });
  g.setDefaultEdgeLabel(() => ({}));
  // 2. 智能识别回流边（不依赖 data.isback）
  // const backEdgeIds = findDirectedCycleClosingEdges(edges, nodes);
  nodes.forEach((n) => {
    g.setNode(n.id, {
      width: n.measured?.width,
      height: n.measured?.height,
    });
  });
  edges.forEach((e) => {
    if (e.data?.isback) {
      return;
    }
    g.setEdge(e.source, e.target);
  });
  dagre.layout(g);
  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { addNodes } = useReactFlow();
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      edges={edges}
      edgeTypes={edgeTypes}
      onEdgesChange={onEdgesChange}
      onConnect={(connection) => {
        const { source, target } = connection;
        const sourceNode = nodes.find((node) => node.id === source);
        const targetNode = nodes.find((node) => node.id === target);
        const newConnect = {
          ...connection,
          type: "custom-edge",
        };
        if (sourceNode?.position.x > targetNode?.position.x) {
          newConnect.animated = true;
          newConnect.data = { isback: true };
        }

        onConnect(newConnect);
      }}
      defaultEdgeOptions={{
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed, color: "red" },
      }}
      fitView
    >
      <Background />
      <MiniMap />
      <Controls />
      <Panel position="top-center">
        <button
          onClick={() => {
            addNodes([
              {
                id: new Date().getTime().toString(),
                data: { label: "input" },
                position: { x: 100, y: 100 },
                sourcePosition: "right",
                targetPosition: "left",
              },
            ]);
          }}
        >
          input
        </button>
        <button
          onClick={() => {
            const layouted = layout(nodes, edges);
            setNodes(layouted.nodes);
            setEdges(layouted.edges);
          }}
        >
          layout
        </button>
        <button onClick={() => console.log(edges, "edges")}>console</button>
      </Panel>
    </ReactFlow>
  );
}

export default function AppWrapper() {
  return (
    <ReactFlowProvider>
      <App></App>
    </ReactFlowProvider>
  );
}
