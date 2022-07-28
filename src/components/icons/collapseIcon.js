import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
  <svg
    width="16px"
    height="16px"
    viewBox="0 0 16 16"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>切片</title>
    <g id="方案" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g
        id="#6.详情页间距标注"
        transform="translate(-744.000000, -1064.000000)"
      >
        <g
          id="4.数据展示/5.Collapse折叠面板/标题备份-3"
          transform="translate(744.000000, 1060.000000)"
        >
          <g
            id="1.通用/2.图标/2.填充/collapse-down"
            transform="translate(0.000000, 4.000000)"
          >
            <rect
              id="矩形"
              fill="#FFFFFF"
              opacity="0"
              x="0"
              y="0"
              width="16"
              height="16"
            ></rect>
            <rect
              id="矩形"
              fill="#F1F2F4"
              x="0"
              y="0"
              width="16"
              height="16"
              rx="8"
            ></rect>
            <path
              d="M4.24726739,5.72183194 C3.9842442,5.96094393 3.9842442,6.35723789 4.24726739,6.59634988 L8.29726739,10.2781681 C8.54928757,10.5072773 8.95071243,10.5072773 9.20273261,10.2781681 L13.2527326,6.59634988 C13.5157558,6.35723789 13.5157558,5.96094393 13.2527326,5.72183194 L13.1636023,5.65394772 C12.9133514,5.4955512 12.5712853,5.51817927 12.3472674,5.72183194 L8.75,8.992 L5.15273261,5.72183194 C4.90071243,5.49272269 4.49928757,5.49272269 4.24726739,5.72183194 Z"
              id="路径"
              fill="#213053"
              transform="translate(8.750000, 8.000000) rotate(-90.000000) translate(-8.750000, -8.000000) "
            ></path>
          </g>
        </g>
      </g>
    </g>
  </svg>
);
const IconComponent = props => <Icon component={Svg} {...props} />;
export default IconComponent;