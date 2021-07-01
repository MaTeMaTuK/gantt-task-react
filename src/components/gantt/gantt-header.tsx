import React from "react";
import { Space, Dropdown, Menu } from "antd";
// import { AimOutlined } from "@ant-design/icons";
import styles from "./gantt.module.css";
interface GanttHeaderProps {
  toToday: () => void;
  toConfig: () => void;
}
export const GanttHeader: React.FC<GanttHeaderProps> = ({
  toToday,
  toConfig,
}) => {
  const handleOperation = (e: any) => {
    console.log(e);
    // 配置
    if (e.key === "config") {
      toConfig();
    }
  };
  const handleMenu = (
    <Menu onClick={e => handleOperation(e)}>
      <Menu.Item key="config">配置</Menu.Item>
    </Menu>
  );
  return (
    <div className={styles.ganttHeader}>
      <Space>
        {/* <AimOutlined className={styles.cursor} onClick={toToday} /> */}
        <span className={styles.cursor} onClick={toToday}>
          今天
        </span>
        <Dropdown overlay={handleMenu}>
          <span className={styles.cursor}>更多操作</span>
        </Dropdown>
      </Space>
    </div>
  );
};
export default GanttHeader;
