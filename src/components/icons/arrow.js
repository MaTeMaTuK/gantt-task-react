import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
  <svg
    t="1671023066193"
    class="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="5702"
    width="1em"
    height="1em"
  >
    <path
      d="M689.664 844.416a41.6 41.6 0 0 1-58.048 57.984l-5.12-4.352-355.328-355.2L266.88 537.6a41.28 41.28 0 0 1-6.08-12.352 41.536 41.536 0 0 1 5.568-37.568l4.416-5.12L625.92 127.36a41.6 41.6 0 0 1 63.232 53.632l-4.416 5.12-326.272 326.272 326.72 326.848 4.416 5.12z"
      p-id="5703"
    ></path>
  </svg>
);
const IconComponent = props => <Icon component={Svg} {...props} />;
export default IconComponent;
