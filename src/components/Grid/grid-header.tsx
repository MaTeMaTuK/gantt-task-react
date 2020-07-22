import React from 'react';
import '../../style.css';

export type GridHeaderProps = {
  gridWidth: number;
  headerHeight: number;
};
export const GridHeader: React.FC<GridHeaderProps> = ({
  gridWidth,
  headerHeight,
}) => {
  return (
    <rect
      x="0"
      y="0"
      width={gridWidth}
      height={headerHeight}
      className="GanttGrid-header"
    ></rect>
  );
};
