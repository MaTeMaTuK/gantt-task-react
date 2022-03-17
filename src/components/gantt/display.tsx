import React, { useEffect, useState, useCallback } from "react";
import { Popover, Button, Switch, Row, Col } from "antd";
import { GanttConfigProps } from "../../types/public-types";
import styles from "./gantt.module.css";
interface DisplayProps {
  ganttConfig?: GanttConfigProps;
  configHandle?: (value: GanttConfigProps) => void;
  visibleChange?: (value: GanttConfigProps) => void;
}
export const Display: React.FC<DisplayProps> = ({
  ganttConfig,
  configHandle,
}) => {
  const [currentValue, setCurrentValue] = useState<any>(null);
  useEffect(() => {
    setCurrentValue({ ...ganttConfig, isChanged: false });
  }, [ganttConfig]);
  const handleVisibleChange = useCallback(
    (value: boolean) => {
      // 如果配置没变 不触发修改配置接口
      if (!value && currentValue?.isChanged) {
        configHandle?.(currentValue);
      }
    },
    [configHandle, currentValue]
  );
  const handleChange = (value: boolean, type: string) => {
    setCurrentValue({
      ...currentValue,
      otherConfig: { ...currentValue.otherConfig, [type]: value },
      isChanged: true,
    });
  };
  const content = () => {
    return (
      <div className={styles.displayPopover}>
        <Row className={styles.displayRow}>
          <Col span={14}>关键路径</Col>
          <Col span={10} className={styles.textAlignR}>
            <Switch
              onChange={checked => handleChange(checked, "pivotalPath")}
              checked={currentValue?.otherConfig?.pivotalPath}
            />
          </Col>
        </Row>
        <Row>
          <Col span={14}>逾期的事项</Col>
          <Col span={10} className={styles.textAlignR}>
            <Switch
              onChange={checked => handleChange(checked, "overdue")}
              checked={currentValue?.otherConfig?.overdue}
            />
          </Col>
        </Row>
      </div>
    );
  };
  return (
    <Popover
      placement="bottomRight"
      content={content}
      trigger="click"
      onVisibleChange={handleVisibleChange}
    >
      <Button>显示</Button>
    </Popover>
  );
};

export default Display;
