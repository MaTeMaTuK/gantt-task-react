import React from "react";
import { GridBody, GridBodyProps } from "./grid-body";
import { GridHeader, GridHeaderProps } from "./grid-header";

export type GridProps = GridBodyProps & GridHeaderProps;
export const Grid: React.FC<GridProps> = props => {
  return (
    <g className="grid">
      <GridHeader {...props} />
      <GridBody {...props} />
    </g>
  );
};
