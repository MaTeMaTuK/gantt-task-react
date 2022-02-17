import React, { memo } from "react";
import { GridBody, GridBodyProps } from "./grid-body";
export type GridProps = GridBodyProps;
export const Grid: React.FC<GridProps> = memo(props => {
  return (
    <g className="grid">
      <GridBody {...props} />
    </g>
  );
});
