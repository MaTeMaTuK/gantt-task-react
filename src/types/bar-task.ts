import { Task } from "./public-types";

export interface BarTask extends Task {
  index: number;
  x1: number;
  x2: number;
  y: number;
  height: number;
  barCornerRadius: number;
  handleWidth: number;
  barChildren: number[];
  styles: {
    backgroundColor: string;
    backgroundSelectedColor: string;
    progressColor: string;
    progressSelectedColor: string;
  };
}
