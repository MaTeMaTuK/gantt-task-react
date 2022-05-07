import React, { memo } from "react";
import { Drawer, Collapse } from "antd";
import Time from "./time";
import OtherConfig from "./other-config";
import Baseline from "./baseline";
import Display from "./display";
import { GanttConfigProps } from "../../types/public-types";
//import imgURL from "../../static/img/mile-stone.png";

import styles from "./index.module.css";
const { Panel } = Collapse;
// const { TabPane } = Tabs;
// interface GanttConfigProps {
//   toGantt?: () => void;
//   visible: boolean;
//   currentPanel?: string | undefined;
//   configHandle?: (value: GanttConfigProps) => void;
// }

const GanttConfig: React.FC<GanttConfigProps> = ({
  toGantt,
  visible,
  // currentPanel,
  configHandle,
  ganttConfig,
}) => {
  // const [tabs, setTabs] = useState("time");
  // const tabChange = (val: string) => {
  //   setTabs(val);
  // };
  // useEffect(() => {
  //   setTabs(currentPanel ? currentPanel : "time");
  // }, [currentPanel]);
  const onChange = () => {};
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
      <img src="img/mile-stone.png" alt="" />
      {/* <Tabs onChange={tabChange} activeKey={tabs}>
        <TabPane tab="时间字段配置" key="time">
          <Time />
        </TabPane>
        <TabPane tab="里程碑配置" key="mileStone">
          <MileStone currentTab={tabs} />
        </TabPane>
        <TabPane tab="其他配置" key="otherConfig">
          <OtherConfig currentTab={tabs} />
        </TabPane>
      </Tabs> */}
      <Collapse defaultActiveKey={["1"]} onChange={onChange}>
        <Panel header="基线" key="baseLine">
          <Baseline />
        </Panel>
        <Panel header="显示项" key="display">
          <Display ganttConfig={ganttConfig} configHandle={configHandle} />
        </Panel>
        <Panel header="时间字段配置" key="timeFieldConfig">
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
