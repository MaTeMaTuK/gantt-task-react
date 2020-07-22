import React, { useRef, useState, useEffect } from 'react';
import '../../style.css';

type BarDisplayProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  progressWidth: number;
  barCornerRadius: number;
  text: string;
  hasChild: boolean;
  arrowIndent: number;
  styles?: {
    backgroundColor?: string;
    backgroundSelectedColor?: string;
    progressColor?: string;
    progressSelectedColor?: string;
  };
  onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
};
export const BarDisplay: React.FC<BarDisplayProps> = ({
  x,
  y,
  width,
  height,
  isSelected,
  progressWidth,
  barCornerRadius,
  text,
  hasChild,
  arrowIndent,
  styles,
  onMouseDown,
}) => {
  const textRef = useRef<SVGTextElement>(null);
  const [isTextInside, setIsTextInside] = useState(true);

  useEffect(() => {
    if (textRef.current)
      setIsTextInside(textRef.current.getBBox().width < width);
  }, [textRef, width]);

  const getProcessColor = () => {
    if (isSelected) {
      return styles?.progressSelectedColor || '#8282f5';
    } else {
      return styles?.progressColor || '#a3a3ff';
    }
  };

  const getBarColor = () => {
    if (isSelected) {
      return styles?.backgroundSelectedColor || '#aeb8c2';
    } else {
      return styles?.backgroundColor || '#b8c2cc';
    }
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
        className="GanttBar"
      />
      <rect
        x={x}
        width={progressWidth}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getProcessColor()}
      />
      <text
        x={
          isTextInside
            ? x + width * 0.5
            : x + width + arrowIndent * +hasChild + arrowIndent * 0.2
        }
        y={y + height * 0.5}
        className={`GanttBar-label ${
          isTextInside ? '' : 'GanttBar-label-outside'
        }`}
        ref={textRef}
      >
        {text}
      </text>
    </g>
  );
};
