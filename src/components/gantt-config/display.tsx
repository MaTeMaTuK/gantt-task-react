import React, { useEffect, useState } from "react";
import { Switch, Row, Col } from "antd";
import { GanttConfigProps } from "../../types/public-types";
import styles from "./index.module.css";
interface DisplayProps {
  ganttConfig?: GanttConfigProps;
  configHandle?: (value: GanttConfigProps) => void;
  visibleChange?: (value: GanttConfigProps) => void;
}
export const Display: React.FC<DisplayProps> = ({
  ganttConfig,
  configHandle,
}) => {
  const [currentValue, setCurrentValue] = useState<GanttConfigProps>({});
  useEffect(() => {
    setCurrentValue({ ...ganttConfig, isChanged: false });
  }, [ganttConfig]);
  const handleChange = (value: boolean, type: string) => {
    const newConfig = {
      ...currentValue,
      otherConfig: { ...currentValue.otherConfig, [type]: value },
      isChanged: true,
    };
    setCurrentValue(newConfig);
    configHandle?.(newConfig);
  };

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

export default Display;