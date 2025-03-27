import { BaseEdge, getSmoothStepPath, useReactFlow } from "@xyflow/react";
import React, { useState, useCallback, useEffect } from "react";

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
  style,
  selected,
}) {
  const { getNode, updateEdgeData } = useReactFlow();
  const [isDragging, setIsDragging] = useState(false);

  // 初始化 centerY 偏移量（从 edge.data 或默认 -100）
  const initialCenterYOffset = data?.centerYOffset || -100;
  const [centerYOffset, setCenterYOffset] = useState(initialCenterYOffset);

  // 生成路径（根据 isback 和 centerYOffset）
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    ...(data?.isback && {
      centerX: (sourceX + targetX) / 2,
      centerY: (sourceY + targetY) / 2 + centerYOffset,
    }),
  });

  // 拖动控件的回调
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDrag = useCallback(
    (event) => {
      if (!isDragging) return;
      const deltaY = event.movementY; // 获取鼠标垂直移动距离
      setCenterYOffset((prev) => prev + deltaY);
      updateEdgeData(id, { ...data, centerYOffset: centerYOffset + deltaY });
    },
    [isDragging]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    // 保存偏移量到 edge.data
    updateEdgeData(id, { ...data, centerYOffset });
  }, [id, data, centerYOffset, updateEdgeData]);

  // 监听全局鼠标事件
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", handleDragEnd);
      return () => {
        window.removeEventListener("mousemove", handleDrag);
        window.removeEventListener("mouseup", handleDragEnd);
      };
    }
  }, [isDragging, handleDrag, handleDragEnd]);

  if (!data?.isback) {
    return (
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: "red",
          strokeWidth: 2,
          // zIndex: 1,
        }}
      />
    );
  }
  // 计算横线位置和长度
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2 + centerYOffset;
  const lineLength = 40; // 横线长度为边长的80%

  // 只有 isback 时才显示拖动控件
  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: data?.isback ? "red" : "#b1b1b7",
          strokeWidth: 2,
          // zIndex: 1,
        }}
      />
      {/* 可拖动的高亮横线 */}
      {selected && (
        <g
          transform={`translate(${centerX - lineLength / 2}, ${centerY})`}
          onMouseDown={handleDragStart}
          style={{ cursor: "ns-resize" }}
        >
          <line
            x1={0}
            y1={0}
            x2={lineLength}
            y2={0}
            stroke="#10b981" // 高亮绿色
            strokeWidth={4}
            // strokeDasharray="5,3"
          />
          {/* 横线两端的装饰点（可选） */}
          <circle cx={0} cy={0} r={3} fill="#10b981" />
          <circle cx={lineLength} cy={0} r={3} fill="#10b981" />
        </g>
      )}
    </>
  );
}
