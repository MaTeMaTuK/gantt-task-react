import React from "react";
import { Space, Dropdown, Menu, Select } from "antd";
// import { AimOutlined } from "@ant-design/icons";
import styles from "./gantt.module.css";
import { viewModeOptions, ViewMode } from "../../types/public-types";
const { Option } = Select;
interface GanttHeaderProps {
  toToday: () => void;
  toConfig: () => void;
  modeChange: (val: ViewMode) => void;
}
export const GanttHeader: React.FC<GanttHeaderProps> = ({
  toToday,
  toConfig,
  modeChange,
}) => {
  // const [viewMode, setViewMode] = useState("Day");
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
  const handleChange = (value: ViewMode) => {
    modeChange(value);
  };
  return (
    <div className={styles.ganttHeader}>
      <Space>
        <Select
          style={{ width: 60 }}
          onChange={handleChange}
          defaultValue={ViewMode.Month}
        >
          {viewModeOptions.map(ele => {
            return (
              <Option key={ele.value} value={ele.value}>
                {ele.label}
              </Option>
            );
          })}
        </Select>
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
