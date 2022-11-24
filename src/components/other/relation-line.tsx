import React from "react";

import styles from './relation-line.module.css';

type RelationLineProps = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

export const RelationLine: React.FC<RelationLineProps> = ({
  x1,
  x2,
  y1,
  y2,
}) => {
  return (
    <line
      x1={x1}
      x2={x2}
      y1={y1}
      y2={y2}
      className={styles.relationLine}
    />
  );
};
