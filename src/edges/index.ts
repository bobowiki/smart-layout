import type { Edge, EdgeTypes } from "@xyflow/react";
import CustomEdge from "./customEdge";

export const initialEdges: Edge[] = [
  {
    id: "a-b",
    source: "a",
    target: "b",
    type: "custom-edge",
  },
  {
    id: "b->c",
    source: "b",
    target: "c",
    type: "custom-edge",
  },
  {
    id: "c->d",
    source: "c",
    target: "d",
    type: "custom-edge",
  },
  {
    id: "a->d",
    source: "a",
    target: "d",
    type: "custom-edge",
  },
  {
    type: "custom-edge",
    markerEnd: {
      type: "arrowclosed",
      color: "red",
    },
    source: "c",
    target: "b",
    animated: true,
    data: {
      isback: true,
      centerYOffset: -67,
    },
    id: "xy-edge__c-b",
    selected: false,
  },
];

export const edgeTypes = {
  // Add your custom edge types here!
  "custom-edge": CustomEdge,
} satisfies EdgeTypes;
