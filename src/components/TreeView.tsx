import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
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
import Toast from "./Toast";
import { toast } from "react-toastify";

export const TreeView: React.FC<TreeViewProps> = ({ jsonInput }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [searchTerm, setsearchTerm] = useState("");
  const [originalNodes, setOriginalNodes] = useState<Node[]>([]);
  const { setCenter, fitView } = useReactFlow();
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
  useEffect(() => {
    if (nodes.length && !originalNodes.length) {
      setOriginalNodes(nodes);
    }
  }, [nodes, originalNodes]);

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
  const searchHandler = () => {
    let foundNode: Node | undefined;
    const updatedNodes = nodes.map((n: Node) => {
      const isMatch =
        n.data?.path &&
        typeof n.data.path === "string" &&
        n.data.path.toLowerCase() === searchTerm.toLowerCase().trim();
      if (isMatch) foundNode = n;
      return {
        ...n,
        style: {
          ...n.style,
          border: `3px solid ${isMatch ? "#22c55e" : "#ccc"}`,
          background: isMatch ? "#bbf7d0" : "white",
        },
      };
    });
    setNodes(updatedNodes);
    if (foundNode) {
      const { x, y } = foundNode.position;
      setCenter(x, y, { zoom: 1.5, duration: 800 });

      toast.success("Match found");
    } else {
      setNodes(originalNodes);
      toast.success("No match found");
      setCenter(0, 0);
      fitView({ duration: 800 });
    }
  };
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setsearchTerm(e.target.value.trim());
  };
  return (
    <div className="flex flex-1 flex-col">
      <div className=" flex text-center w-3xl  ">
        <input
          onChange={changeHandler}
          type="text"
          className=" outline-none flex-1 border border-blue-700 rounded-md rounded-r-none px-2 py-1 border-r-0 "
          value={searchTerm}
        />
        <button
          onClick={searchHandler}
          className="bg-blue-700 text-white border-0 outline-0 text-center px-2 rounded-r-md "
        >
          search
        </button>
      </div>
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        />
      </div>

      <Toast />
    </div>
  );
};
