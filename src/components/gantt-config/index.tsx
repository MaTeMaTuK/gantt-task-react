import React, { useState } from "react";
import { Tabs, Drawer } from "antd";
import Time from "./time";
import Relation from "./relation";
import styles from "./index.module.css";
const { TabPane } = Tabs;
interface GanttConfigProps {
  toGantt: () => void;
  visible: boolean;
}

const GanttConfig: React.FC<GanttConfigProps> = ({ toGantt, visible }) => {
  const [tabs, setTabs] = useState("time");
  const tabChange = (val: string) => {
    setTabs(val);
  };
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
      <Tabs defaultActiveKey="time" onChange={tabChange}>
        <TabPane tab="时间字段配置" key="time">
          <Time />
        </TabPane>
        <TabPane tab="关联关系配置" key="relation">
          <Relation currentTab={tabs} />
        </TabPane>
      </Tabs>
    </Drawer>
  );
};
export default GanttConfig;
