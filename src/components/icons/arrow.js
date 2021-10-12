import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
  <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1">
    <title>1.通用/2.Icon图标/Line/Down</title>
    <defs>
      <rect id="path-1" x="260" y="226" width="396" height="611"></rect>
      <filter
        x="-0.9%"
        y="-0.9%"
        width="102.8%"
        height="101.8%"
        filterUnits="objectBoundingBox"
        id="filter-2"
      >
        <feOffset
          dx="2"
          dy="0"
          in="SourceAlpha"
          result="shadowOffsetOuter1"
        ></feOffset>
        <feGaussianBlur
          stdDeviation="1.5"
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
        ></feGaussianBlur>
        <feColorMatrix
          values="0 0 0 0 0.0352941176   0 0 0 0 0.117647059   0 0 0 0 0.258823529  0 0 0 0.162778628 0"
          type="matrix"
          in="shadowBlurOuter1"
          result="shadowMatrixOuter1"
        ></feColorMatrix>
        <feOffset
          dx="0"
          dy="0"
          in="SourceAlpha"
          result="shadowOffsetOuter2"
        ></feOffset>
        <feGaussianBlur
          stdDeviation="0.5"
          in="shadowOffsetOuter2"
          result="shadowBlurOuter2"
        ></feGaussianBlur>
        <feColorMatrix
          values="0 0 0 0 0.0352941176   0 0 0 0 0.117647059   0 0 0 0 0.258823529  0 0 0 0.34099104 0"
          type="matrix"
          in="shadowBlurOuter2"
          result="shadowMatrixOuter2"
        ></feColorMatrix>
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
          <feMergeNode in="shadowMatrixOuter2"></feMergeNode>
        </feMerge>
      </filter>
      <filter color-interpolation-filters="auto" id="filter-3">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="0 0 0 0 0.180392 0 0 0 0 0.250980 0 0 0 0 0.368627 0 0 0 1.000000 0"
        ></feColorMatrix>
      </filter>
      <filter color-interpolation-filters="auto" id="filter-4">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="0 0 0 0 0.180392 0 0 0 0 0.250980 0 0 0 0 0.368627 0 0 0 1.000000 0"
        ></feColorMatrix>
      </filter>
    </defs>
    <g
      id="页面-1"
      stroke="none"
      stroke-width="1"
      fill="none"
      fill-rule="evenodd"
    >
      <g id="甘特图-未设置" transform="translate(-648.000000, -515.000000)">
        <rect fill="#FFFFFF" x="0" y="0" width="1440" height="900"></rect>
        <g id="矩形">
          <use
            fill="black"
            fill-opacity="1"
            filter="url(#filter-2)"
            id="#path-1"
          ></use>
          <use fill="#FFFFFF" fill-rule="evenodd" id="#path-2"></use>
        </g>
        <g id="数据配置" transform="translate(260.000000, 486.000000)"></g>
        <g id="数据配置" transform="translate(260.000000, 530.000000)"></g>
        <rect
          id="矩形"
          stroke="#ECEDF0"
          x="260.5"
          y="225.5"
          width="1159"
          height="612"
        ></rect>
        <g id="编组-13" transform="translate(640.000000, 507.000000)">
          <circle
            id="椭圆形"
            stroke="#ECEDF0"
            fill="#FFFFFF"
            cx="16"
            cy="16"
            r="15.5"
          ></circle>
          <g
            id="展开"
            transform="translate(8.000000, 8.000000)"
            filter="url(#filter-3)"
          >
            <g transform="translate(8.000000, 8.000000) rotate(90.000000) translate(-8.000000, -8.000000) ">
              <rect
                id="矩形"
                fill="#D8D8D8"
                opacity="0"
                x="0"
                y="0"
                width="16"
                height="16"
              ></rect>
              <path
                d="M12.9757359,6.15975994 C13.2100505,5.94674669 13.5899495,5.94674669 13.8242641,6.15975994 C14.0585786,6.37277319 14.0585786,6.7181359 13.8242641,6.93114915 L8.42426407,11.8402401 C8.18994949,12.0532533 7.81005051,12.0532533 7.57573593,11.8402401 L2.17573593,6.93114915 C1.94142136,6.7181359 1.94142136,6.37277319 2.17573593,6.15975994 C2.41005051,5.94674669 2.78994949,5.94674669 3.02426407,6.15975994 L8,10.6831562 L12.9757359,6.15975994 Z"
                id="Rectangle-2备份"
                fill="#1E2A3D"
              ></path>
            </g>
          </g>
          <g filter="url(#filter-4)" id="展开">
            <g transform="translate(16.000000, 16.000000) rotate(90.000000) translate(-16.000000, -16.000000) translate(8.000000, 8.000000)">
              <rect
                id="矩形"
                fill="#D8D8D8"
                opacity="0"
                x="0"
                y="0"
                width="16"
                height="16"
              ></rect>
              <path
                d="M12.9757359,6.15975994 C13.2100505,5.94674669 13.5899495,5.94674669 13.8242641,6.15975994 C14.0585786,6.37277319 14.0585786,6.7181359 13.8242641,6.93114915 L8.42426407,11.8402401 C8.18994949,12.0532533 7.81005051,12.0532533 7.57573593,11.8402401 L2.17573593,6.93114915 C1.94142136,6.7181359 1.94142136,6.37277319 2.17573593,6.15975994 C2.41005051,5.94674669 2.78994949,5.94674669 3.02426407,6.15975994 L8,10.6831562 L12.9757359,6.15975994 Z"
                id="Rectangle-2备份"
                fill="#1E2A3D"
              ></path>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);
const IconComponent = props => <Icon component={Svg} {...props} />;
export default IconComponent;
