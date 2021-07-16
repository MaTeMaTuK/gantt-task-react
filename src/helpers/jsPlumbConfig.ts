// 是否允许改变流程图的布局（包括大小、连线、节点删除等）
export const canChangeLayout = true;

// 很多连接线都是相同设置的情况下，可以将配置抽离出来，作为一个单独的变量，作为connect的第二个参数传入。
// 实际上connect的第二个参数会和第一个参数merge，作为一个整体。
export const commonConfig = {
  /**
   * 如果你将isSource和isTarget设置成true，那么久可以用户在拖动时，自动创建链接。
   */
  // 是否可以拖动（作为连线起点）
  isSource: canChangeLayout,
  // 是否可以放置（连线终点）
  isTarget: canChangeLayout,
  // 设置连接点最多可以连接几条线
  // -1不限制，默认限制一条线
  maxConnections: -1,
  // 设置锚点位置，按照[target, source]的顺序进行设置
  // 可以有 Bottom Top Right Left四种方位
  // 还可以是BottomLeft BottomRight BottomCenter TopLeft TopRight TopCenter LeftMiddle RightMiddle的组合
  // 默认值 ['Bottom', 'Bottom']
  // anchor: ['Bottom', 'Bottom'],
  // 端点类型，形状（区分大小写），Rectangle-正方形 Dot-圆形 Blank-空
  endpoint: [
    canChangeLayout ? "Dot" : "Blank",
    {
      radius: 4,
    },
  ],
  // 设置端点的样式
  endpointStyle: {
    fill: "#159CEE", // 填充颜色
    outlineStroke: "blank", // 边框颜色
    outlineWidth: 0, // 边框宽度
  },
  // 设置连接线的样式 Bezier-贝瑟尔曲线 Flowchart-流程图 StateMachine-弧线 Straight-直线
  connector: ["Flowchart"],
  // 设置连接线的样式
  connectorStyle: {
    stroke: "#c0c0c0", // 实线颜色
    strokeWidth: 2, // 实线宽度
    // outlineStroke: "#c0c0c0", // 边框颜色
    // outlineWidth: 1, // 边框宽度
  },
  // 设置连接线悬浮样式
  connectorHoverStyle: {
    stroke: "#8573ff",
  },
  // 设置连接线的箭头
  // 可以设置箭头的长宽以及箭头的位置，location 0.5表示箭头位于中间，location 1表示箭头设置在连接线末端。 一根连接线是可以添加多个箭头的。
  connectorOverlays: [
    [
      "Arrow",
      {
        width: 10,
        length: 10,
        location: 1,
      },
    ],
  ],
};
export const offsetCalculators = {
  CIRCLE: function (el: any) {
    const cx = parseInt(el.getAttribute("cx"), 10);
    const cy = parseInt(el.getAttribute("cy"), 10);
    const r = parseInt(el.getAttribute("r"), 10);
    return {
      left: cx - r,
      top: cy - r,
    };
  },
  ELLIPSE: function (el: any) {
    // @ts-ignore
    const cx = parseInt(el.getAttribute("cx"), 10);
    const cy = parseInt(el.getAttribute("cy"), 10);
    const rx = parseInt(el.getAttribute("rx"), 10);
    const ry = parseInt(el.getAttribute("ry"), 10);
    return {
      left: cx - rx,
      top: cy - ry,
    };
  },
  RECT: function (el: any) {
    const x = parseInt(el.getAttribute("x"), 10);
    const y = parseInt(el.getAttribute("y"), 10);
    return {
      left: x,
      top: y,
    };
  },
};
// custom size calculators for SVG shapes.
export const sizeCalculators = {
  CIRCLE: function (el: any) {
    const r = parseInt(el.getAttribute("r"), 10);
    return [r * 2, r * 2];
  },
  ELLIPSE: function (el: any) {
    const rx = parseInt(el.getAttribute("rx"), 10);
    const ry = parseInt(el.getAttribute("ry"), 10);
    return [rx * 2, ry * 2];
  },
  RECT: function (el: any) {
    const w = parseInt(el.getAttribute("width"), 10);
    const h = parseInt(el.getAttribute("height"), 10);
    return [w, h];
  },
};
export const relationInit = {
  FS: ["Right", "Left"],
  FF: ["Right", "Right"],
  SS: ["Left", "Left"],
  SF: ["Left", "Right"],
};
export const relationReverse = (start: string, end: string) => {
  if (start === "Right" && end === "Left") {
    return "FS";
  }
  if (start === "Right" && end === "Right") {
    return "FF";
  }
  if (start === "Left" && end === "Left") {
    return "SS";
  }
  if (start === "Left" && end === "Right") {
    return "SF";
  }
  return "SS";
};
