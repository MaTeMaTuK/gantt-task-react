import React, { useEffect, useState } from "react";
import { Popover, Button, Switch, Row, Col } from "antd";
import { GanttConfigProps } from "../../types/public-types";
import styles from "./gantt.module.css";
interface DisplayProps {
  ganttConfig?: GanttConfigProps;
  configHandle?: (value: GanttConfigProps) => void;
  visibleChange?: (value: GanttConfigProps) => void;
}
const Panel: React.FC<DisplayProps> = ({ ganttConfig, visibleChange }) => {
  const [config, setConfig] = useState<any>({});
  useEffect(() => {
    setConfig(ganttConfig);
  }, [ganttConfig]);
  const handleChange = (value: boolean, type: string) => {
    setConfig({
      ...config,
      otherConfig: { ...config.otherConfig, [type]: value },
    });
    visibleChange?.({
      ...config,
      otherConfig: { ...config.otherConfig, [type]: value },
    });
  };
  return (
    <div className={styles.displayPopover}>
      <Row className={styles.displayRow}>
        <Col span={14}>关键路径</Col>
        <Col span={10} className={styles.textAlignR}>
          <Switch
            onChange={checked => handleChange(checked, "pivotalPath")}
            checked={config?.otherConfig?.pivotalPath}
          />
        </Col>
      </Row>
      <Row>
        <Col span={14}>逾期的事项</Col>
        <Col span={10} className={styles.textAlignR}>
          <Switch
            onChange={checked => handleChange(checked, "overdue")}
            checked={config?.otherConfig?.overdue}
          />
        </Col>
      </Row>
    </div>
  );
};
export const Display: React.FC<DisplayProps> = ({
  ganttConfig,
  configHandle,
}) => {
  const [currentValue, setCurrentValue] = useState<any>(ganttConfig);
  const handleVisibleChange = (value: boolean) => {
    if (!value) {
      configHandle?.(currentValue);
    }
  };

  return (
    <Popover
      placement="bottomRight"
      content={
        <Panel ganttConfig={ganttConfig} visibleChange={setCurrentValue} />
      }
      trigger="click"
      onVisibleChange={handleVisibleChange}
    >
      <Button>显示</Button>
    </Popover>
  );
};

export default Display;
