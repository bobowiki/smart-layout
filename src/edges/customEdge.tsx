import { BaseEdge, getSmoothStepPath, useReactFlow } from "@xyflow/react";
import React, { useEffect } from "react";

export default function CustomEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
}) {
  const { getNode, updateEdgeData } = useReactFlow();

  // // Memoize the isReback function and its result
  // const isback = React.useMemo(() => {
  //   const sourceNode = getNode(source);
  //   const targetNode = getNode(target);
  //   return sourceNode?.position.x > targetNode?.position.x;
  // }, [source, target, getNode]);
  // console.log(data, "data");
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    ...(data?.isback && {
      centerX: (sourceX + targetX) / 2,
      centerY: (sourceY + targetY) / 2 - 100,
    }),
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: "red",
          strokeWidth: 2,
        }}
      />
    </>
  );
}
