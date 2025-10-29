import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type NodeChange,
  type Edge,
  type EdgeChange,
  type OnConnect,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { getLayoutedElements, ystructuredLayout } from "../utils/Functions";
import type { JSONObject, TreeViewProps } from "../utils/types";

export const TreeView: React.FC<TreeViewProps> = ({ jsonInput }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (!jsonInput) {
      setNodes([]);
      setEdges([]);
      return;
    }

    try {
      const { nodes: rawNodes = [], edges: rawEdges = [] } = ystructuredLayout(
        jsonInput as JSONObject
      );

      const { nodes: layoutedNodes = [], edges: layoutedEdges = [] } =
        getLayoutedElements(rawNodes, rawEdges, "TB");

      if (Array.isArray(layoutedNodes) && Array.isArray(layoutedEdges)) {
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      } else {
        console.warn("Invalid layout output: not arrays", {
          layoutedNodes,
          layoutedEdges,
        });
        setNodes([]);
        setEdges([]);
      }
    } catch (err) {
      console.error("Error generating layout:", err);
      setNodes([]);
      setEdges([]);
    }
  }, [jsonInput]);

  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) =>
      setNodes((ns) => applyNodeChanges(changes, ns)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) =>
      setEdges((es) => applyEdgeChanges(changes, es)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((es) => addEdge(params, es)),
    []
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
};
