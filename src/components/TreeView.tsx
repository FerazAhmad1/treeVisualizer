import {
  ReactFlow,
  type Node,
  type OnEdgesChange,
  type OnNodesChange,
  type Edge,
  type OnConnect,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface TreeViewProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange<Node> | undefined;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  fitView: boolean | undefined;
}

export const TreeView: React.FC<TreeViewProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  fitView,
}) => {
  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView={fitView}
      />
    </>
  );
};
