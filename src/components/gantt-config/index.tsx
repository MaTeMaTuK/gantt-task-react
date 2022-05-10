import React, { memo, useEffect, useState } from "react";
import { Drawer, Collapse } from "antd";
import Time from "./time";
import OtherConfig from "./other-config";
import Baseline from "./baseline";
import Display from "./display";
import { GanttConfigProps } from "../../types/public-types";
import CollapseIcon from "../icons/collapseIcon";
import { QuestionCircleOutlined } from "@ant-design/icons";

import styles from "./index.module.css";

const { Panel } = Collapse;

const GanttConfig: React.FC<GanttConfigProps> = ({
  toGantt,
  visible,
  currentPanel,
  configHandle,
  ganttConfig,
}) => {
  const [activeKey, setActiveKey] = useState<string[]>([]);
  useEffect(() => {
    if (currentPanel) {
      setActiveKey([currentPanel]);
    } else {
      setActiveKey([]);
    }
  }, [currentPanel]);
  const onChange = (val: any) => {
    setActiveKey([...val]);
  };
  const genExtra = () => (
    <span className={styles.collapseExtra}>
      <QuestionCircleOutlined />
      <span>（点击基线卡片可选择显示基线）</span>
    </span>
  );
  return (
    <Drawer
      visible={visible}
      onClose={() => toGantt()}
      width="50%"
      getContainer={false}
      className={styles.settingsModalContainer}
      contentWrapperStyle={{ maxWidth: "721px" }}
      style={{ position: "absolute" }}
      maskClosable={false}
      mask={false}
    >
      <h3 className={styles.settingModalTitle} onClick={() => toGantt()}>
        甘特图设置
      </h3>
      <Collapse
        activeKey={activeKey}
        onChange={onChange}
        expandIcon={({ isActive }) => (
          <CollapseIcon className={isActive ? styles.activeRotate : ""} />
        )}
        className={styles.collapse}
      >
        <Panel header="基线" key="baseLine" extra={genExtra()}>
          <Baseline />
        </Panel>

        <Panel header="显示项" key="display">
          <Display ganttConfig={ganttConfig} configHandle={configHandle} />
        </Panel>
        <Panel header="时间字段配置" key="time">
          <Time />
        </Panel>
        <Panel header="其他配置" key="other">
          <OtherConfig />
        </Panel>
      </Collapse>
    </Drawer>
  );
};
export default memo(GanttConfig);
