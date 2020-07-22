import React from 'react';
import '../../style.css';

type BarProgressHandleProps = {
  progressPoint: string;
  onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
};
export const BarProgressHandle: React.FC<BarProgressHandleProps> = ({
  progressPoint,
  onMouseDown,
}) => {
  return (
    <polygon
      className="GanttBar-handle"
      points={progressPoint}
      onMouseDown={onMouseDown}
    ></polygon>
  );
};
