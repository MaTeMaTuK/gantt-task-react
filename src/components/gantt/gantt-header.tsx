import React, { memo } from "react";
import { Space, Tooltip } from "antd";
import styles from "./gantt.module.css";

import SettingsIcon from "../icons/settings";

interface GanttHeaderProps {
  toConfig: () => void;
}
export const GanttHeader: React.FC<GanttHeaderProps> = ({ toConfig }) => {
  const handleOperation = () => {
    toConfig();
  };
  return (
    <div className={styles.ganttHeader}>
      <Space size={20} className="ganttHeaderGlobal">
        <Tooltip placement="top" title="甘特图设置">
          <span className={styles.cursor} onClick={handleOperation}>
            <SettingsIcon />
          </span>
        </Tooltip>
      </Space>
    </div>
  );
};
export default memo(GanttHeader);
