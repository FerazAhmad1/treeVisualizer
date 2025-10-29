import { type Node, type Edge, Position } from "@xyflow/react";
import dagre from "dagre"
import type { JSONValue, JSONObject } from "./types.ts"

// type JSONValue = string | number | boolean | null | JSONObject | JSONArray;

// interface JSONObject {
//     [Key: string]: JSONValue
// }

// type JSONArray = Array<JSONValue>
const nodeWidth = 160;
const nodeHeight = 50;





export function getLayoutedElements(
    nodes: Node[],
    edges: Edge[],
    direction: "LR" | "TB" = "LR" // LR = left→right, TB = top→bottom
) {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodesep: 60 });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };
        node.targetPosition = isHorizontal ? Position.Left : Position.Top;
        node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
        return node;
    });

    return { nodes: layoutedNodes, edges };
}



export function ystructuredLayout(jsonData: JSONObject) {
    let nodeId = 0;
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const xSpacing = 180; // horizontal distance between siblings
    const ySpacing = 120; // vertical distance between levels

    // Helper to create nodes
    function createNode(label: string, x: number, y: number, color: string, path: string) {
        const id = `node-${nodeId++}`;
        nodes.push({
            id,
            data: { label, path },
            position: { x, y },
            style: {
                border: `2px solid ${color}`,
                borderRadius: 8,
                padding: 6,
                background: "white",
                fontSize: 13,
                minWidth: 50,
                textAlign: "center",
            },
        });
        return id;
    }

    // Recursive traversal
    function traverse(value: JSONValue, x: number, y: number, parentId: string | null, path: string) {
        const colorKey = "#60a5fa";   // key = blue
        const colorValue = "#fbbf24"; // primitive value = orange
        const colorRoot = "#818cf8";  // root or object key = purple

        if (typeof value === "object" && value !== null) {
            const entries = Array.isArray(value)
                ? value.map((v, i) => [`[${i}]`, v])
                : Object.entries(value);

            // determine horizontal spread (siblings)
            const totalWidth = (entries.length - 1) * xSpacing;
            const startX = x - totalWidth / 2;

            // create parent node (if root)
            const parentNodeId =
                parentId === null
                    ? createNode("root", x, y, colorRoot, "$")
                    : parentId;

            // go through each key/value
            entries.forEach(([key, val], index) => {
                const keyX = startX + index * xSpacing; // horizontal sibling spread
                const keyY = y + ySpacing; // one level deeper vertically
                const newPath = Array.isArray(value) ? `${path}${key}` : `${path}.${key}`
                const keyId = createNode(String(key), keyX, keyY, colorKey, newPath);

                edges.push({
                    id: `edge-${parentNodeId}-${keyId}`,
                    source: parentNodeId,
                    target: keyId,
                    type: "smoothstep",
                });

                if (typeof val === "object" && val !== null) {
                    // recurse deeper
                    traverse(val, keyX, keyY + ySpacing, keyId, newPath);
                } else {
                    // primitive → value node directly below key
                    const valId = createNode(String(val), keyX, keyY + ySpacing, colorValue, newPath);
                    edges.push({
                        id: `edge-${keyId}-${valId}`,
                        source: keyId,
                        target: valId,
                        type: "smoothstep",
                    });
                }
            });
        }
    }

    // Start traversal from root
    traverse(jsonData, 0, 0, null, "$");

    return { nodes, edges };
}