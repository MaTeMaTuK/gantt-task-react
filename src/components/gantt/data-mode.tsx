import React, { useMemo } from "react";
import { Tabs, Button } from "antd";
import { viewModeOptions, ViewMode } from "../../types/public-types";

import styles from "./gantt.module.css";
const { TabPane } = Tabs;

interface DateModeProps {
  toToday: () => void;
  modeChange: (val: ViewMode) => void;
  todayX: number;
  svgContainerWidth: number;
  refScrollX: number;
}
const DataMode: React.FC<DateModeProps> = ({
  toToday,
  modeChange,
  todayX,
  svgContainerWidth,
  refScrollX,
}) => {
  const handleChange = (value: string) => {
    modeChange(value as ViewMode);
  };
  const isShowToday = useMemo(() => {
    return (
      refScrollX + svgContainerWidth - 20 < todayX || refScrollX > todayX - 20
    );
  }, [refScrollX, svgContainerWidth, todayX]);
  return (
    <div className={styles.viewMode}>
      {isShowToday && (
        <Button className={styles.todayBtn} onClick={toToday}>
          今天
        </Button>
      )}

      <div className={styles.dataMode}>
        <Tabs
          defaultActiveKey={ViewMode.Day}
          tabPosition="top"
          onChange={handleChange}
        >
          {viewModeOptions.map(ele => (
            <TabPane tab={ele.label} key={ele.value} />
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default DataMode;
