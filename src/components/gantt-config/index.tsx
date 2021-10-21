import React, { useState, useEffect } from "react";
import { Tabs, Drawer } from "antd";
import Time from "./time";
import MileStone from "./milestone";
import OtherConfig from "./other-config";
import styles from "./index.module.css";
const { TabPane } = Tabs;
interface GanttConfigProps {
  toGantt: () => void;
  visible: boolean;
  currentPanel?: string | undefined;
}

const GanttConfig: React.FC<GanttConfigProps> = ({
  toGantt,
  visible,
  currentPanel,
}) => {
  const [tabs, setTabs] = useState("time");
  const tabChange = (val: string) => {
    setTabs(val);
  };
  useEffect(() => {
    setTabs(currentPanel ? currentPanel : "time");
  }, [currentPanel]);
  return (
    <Drawer
      visible={visible}
      onClose={() => toGantt()}
      width="50%"
      getContainer={false}
      className={styles.settingsModalContainer}
      contentWrapperStyle={{ maxWidth: "721px" }}
    >
      <h3 className={styles.settingModalTitle} onClick={() => toGantt()}>
        甘特图配置
      </h3>
      <Tabs onChange={tabChange} activeKey={tabs}>
        <TabPane tab="时间字段配置" key="time">
          <Time />
        </TabPane>
        <TabPane tab="里程碑配置" key="mileStone">
          <MileStone currentTab={tabs} />
        </TabPane>
        <TabPane tab="其他配置" key="otherConfig">
          <OtherConfig currentTab={tabs} />
        </TabPane>
      </Tabs>
    </Drawer>
  );
};
export default GanttConfig;
