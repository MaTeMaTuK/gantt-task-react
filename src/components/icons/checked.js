import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="方案" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g id="#17-甘特图配置" transform="translate(-864.000000, -336.000000)">
        <g id="编组-12" transform="translate(840.000000, 201.000000)">
          <g id="基线备份-2" transform="translate(24.000000, 135.000000)">
            <g id="编组-13" transform="translate(-0.000844, -0.000844)">
              <polygon
                id="路径"
                fill="#0C62FF"
                points="27.943 0 0 27.943 0.000844122713 0.000844122712"
              ></polygon>
              <g
                id="勾选"
                transform="translate(1.000844, 0.000844)"
                fill="#FFFFFF"
              >
                <path
                  d="M11.8295143,4.29289322 C12.2200386,3.90236893 12.8532036,3.90236893 13.2437279,4.29289322 C13.6042118,4.65337718 13.6319414,5.22060824 13.3269165,5.61289944 L13.2437279,5.70710678 L7.30919533,11.6416393 C6.76002054,12.1908141 5.89095813,12.2251375 5.30179739,11.7446096 L5.18787498,11.6416393 L2.29289322,8.74665756 C1.90236893,8.35613327 1.90236893,7.72296829 2.29289322,7.332444 C2.65337718,6.97196004 3.22060824,6.9442305 3.61289944,7.24925539 L3.70710678,7.332444 L6.248,9.873 L11.8295143,4.29289322 Z"
                  id="路径-4"
                ></path>
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);
const IconComponent = props => <Icon component={Svg} {...props} />;
export default IconComponent;
