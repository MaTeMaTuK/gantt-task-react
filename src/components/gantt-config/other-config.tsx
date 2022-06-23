import React, { useState, useContext, useMemo, useEffect } from "react";
import { Switch, Modal, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { GanttConfigContext, ConfigHandleContext } from "../../contsxt";
import useI18n from "../../lib/hooks/useI18n";

import styles from "./index.module.css";

const { confirm } = Modal;

const OtherConfig: React.FC = () => {
  const [checked, setChecked] = useState(false);
  const { ganttConfig } = useContext(GanttConfigContext);
  const { configHandle } = useContext(ConfigHandleContext);
  const otherConfig = useMemo(() => ganttConfig?.otherConfig, [
    ganttConfig?.otherConfig,
  ]);
  const { t } = useI18n();
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
      title: t("ganttconfiguration.otherConfiguration.automaticScheduling"),
      okText: t("global.complete"),
      cancelText: t("global.cancel"),
      content: t(
        "ganttconfiguration.otherConfiguration.otherConfigurationTips"
      ),
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
        {t("ganttconfiguration.otherConfiguration.automaticScheduling")}
        <span className={styles.question}>
          <Tooltip
            title={t(
              "ganttconfiguration.otherConfiguration.otherConfigurationDescription"
            )}
          >
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
