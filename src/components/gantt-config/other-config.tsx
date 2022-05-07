import React, { useState, useContext, useMemo, useEffect } from "react";
import { Switch, Modal, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { GanttConfigContext, ConfigHandleContext } from "../../contsxt";

import styles from "./index.module.css";

const { confirm } = Modal;

const OtherConfig: React.FC = () => {
  const [checked, setChecked] = useState(false);
  const { ganttConfig } = useContext(GanttConfigContext);
  const { configHandle } = useContext(ConfigHandleContext);
  const otherConfig = useMemo(() => ganttConfig?.otherConfig, [
    ganttConfig?.otherConfig,
  ]);
  useEffect(() => {
    setChecked(otherConfig?.autoPatch);
  }, [otherConfig?.autoPatch]);
  const onChange = (value: boolean) => {
    if (!value) {
      setChecked(value);
      configHandle({
        ...ganttConfig,
        otherConfig: {
          ...ganttConfig.otherConfig,
          ...{ autoPatch: value },
        },
      });
      return;
    }
    confirm({
      title: "自动编排",
      okText: "确定",
      cancelText: "取消",
      content:
        "开启自动编排时，将按当前的事项关系自动调整所有事项的时间。确认开启？",
      onOk() {
        setChecked(value);
        configHandle({
          ...ganttConfig,
          otherConfig: {
            ...ganttConfig.otherConfig,
            ...{ autoPatch: value },
          },
        });
      },
      onCancel() {
        setChecked(false);
      },
    });
  };
  return (
    <div className={styles.otherConfig}>
      <div>
        自动编排
        <span className={styles.question}>
          <Tooltip title="根据卡片之间的关系，自动调整卡片时间，避免出现逻辑错误">
            <QuestionCircleOutlined />
          </Tooltip>
        </span>
      </div>
      <div>
        <Switch onChange={onChange} checked={checked} />
      </div>
    </div>
  );
};

export default OtherConfig;
