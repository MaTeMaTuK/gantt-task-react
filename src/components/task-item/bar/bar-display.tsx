import React from "react";
import style from "./bar.module.css";
import { SubType, ViewType } from "../../../types/public-types";

const good_tat_threshold = 2.0;
const warning_tat_threshold = 3.0;

type BarDisplayProps = {
  x: number;
  x2: number;
  x3: number;
  x4: number;
  y: number;
  tat_total: number;
  viewType: ViewType;
  subType: SubType;
  width: number;
  height: number;
  isSelected: boolean;
  barCornerRadius: number;
  styles: {
    backgroundColor: string;
    backgroundSelectedColor: string;
    dictationBarColor: string;
    liveCallBarColor: string;
    redTeamBarColor: string;
    redBarColor: string;
    yellowBarColor: string;
    greenBarColor: string;
  };
  onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
};
export const BarDisplay: React.FC<BarDisplayProps> = ({
  x,
  x2,
  x3,
  x4,
  y,
  tat_total,
  viewType,
  subType,
  width,
  height,
  isSelected,
  barCornerRadius,
  styles,
  onMouseDown,
}) => {
  const getBarColor = () => {
    if (viewType === "call_type") {
      switch (subType) {
        case "dictation":
          return styles.dictationBarColor;
        case "live_call":
          return styles.liveCallBarColor;
        case "red_team":
        default:
          return styles.redTeamBarColor;
      }
    } else if (viewType === "tat") {
      if (tat_total < good_tat_threshold) {
        return styles.greenBarColor;
      } else if (tat_total < warning_tat_threshold) {
        return styles.yellowBarColor;
      }
      return styles.redBarColor;
    }
    return isSelected ? styles.backgroundSelectedColor : styles.backgroundColor;
  };

  return (
    <g onMouseDown={onMouseDown}>
      <rect
        x={x}
        width={width}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getBarColor()}
        className={style.barBackground}
      />
      {x3 >= 0 && (
        <React.Fragment>
          <line
            x1={x2}
            y1={y + height / 2}
            x2={x3}
            y2={y + height / 2}
            stroke="lightgray"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          <rect
            x={x3}
            width={x4 - x3}
            y={y}
            height={height}
            ry={barCornerRadius}
            rx={barCornerRadius}
            fill={getBarColor()}
            className={style.barBackground}
          />
        </React.Fragment>
      )}
    </g>
  );
};
