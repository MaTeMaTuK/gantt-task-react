import Icon from "@ant-design/icons";
import React from "react";
import CollapseIcon1 from "./CollapseIcon.svg";
const CollapseIcon2 = () => CollapseIcon1;
export const CollapseIcon = props => (
  <Icon component={CollapseIcon2} {...props} />
);
