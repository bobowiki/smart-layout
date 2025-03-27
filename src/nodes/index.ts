import { Position, type NodeTypes } from "@xyflow/react";

import { PositionLoggerNode } from "./PositionLoggerNode";
import { AppNode } from "./types";

export const initialNodes: AppNode[] = [
  {
    id: "a",
    position: {
      x: 0,
      y: 100,
    },
    data: {
      label: "start",
    },
    sourcePosition: "right",
    targetPosition: "left",
    measured: {
      width: 150,
      height: 40,
    },
  },
  {
    id: "b",
    position: {
      x: 250,
      y: 0,
    },
    data: {
      label: "b",
    },
    sourcePosition: "right",
    targetPosition: "left",
    measured: {
      width: 150,
      height: 40,
    },
  },
  {
    id: "c",
    position: {
      x: 500,
      y: 0,
    },
    data: {
      label: "c",
    },
    sourcePosition: "right",
    targetPosition: "left",
    measured: {
      width: 150,
      height: 40,
    },
  },
  {
    id: "d",
    position: {
      x: 750,
      y: 100,
    },
    data: {
      label: "d",
    },
    sourcePosition: "right",
    targetPosition: "left",
    measured: {
      width: 150,
      height: 40,
    },
  },
  {
    id: "f",
    type: "output",
    position: {
      x: 0,
      y: 240,
    },
    data: {
      label: "f",
    },
    sourcePosition: "right",
    targetPosition: "left",
    measured: {
      width: 150,
      height: 40,
    },
  },
];

export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;
