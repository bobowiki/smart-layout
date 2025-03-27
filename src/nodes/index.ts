import { Position, type NodeTypes } from "@xyflow/react";

import { PositionLoggerNode } from "./PositionLoggerNode";
import { AppNode } from "./types";

export const initialNodes: AppNode[] = [
  {
    id: "a",
    position: { x: 0, y: 0 },
    data: { label: "start" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "b",
    position: { x: 200, y: 0 },
    data: { label: "b" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "c",
    position: { x: 400, y: 0 },
    data: { label: "c" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "d",
    position: { x: 600, y: 0 },
    data: { label: "d" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "f",
    type: "output",
    position: { x: 800, y: 0 },
    data: { label: "f" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
];

export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;
