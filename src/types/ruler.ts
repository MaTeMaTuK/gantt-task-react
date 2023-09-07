import { rulerLine } from "./public-types";

export interface rulerTask extends rulerLine {
    index: number;
    x1: number;
    x2: number;
    x: number;
    end: Date;
  }