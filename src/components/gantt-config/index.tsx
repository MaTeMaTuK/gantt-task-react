import React, { memo, useEffect, useState } from "react";
import { Drawer, Collapse } from "antd";
import Time from "./time";
import OtherConfig from "./other-config";
import Baseline from "./baseline";
import Display from "./display";
import { GanttConfigProps } from "../../types/public-types";
import CollapseIcon from "../icons/collapseIcon";
import { drawerWidth } from "../../helpers/dicts";
import { isArray } from "lodash";
import useI18n from "../../lib/hooks/useI18n";

import styles from "./index.module.css";

const { Panel } = Collapse;

const GanttConfig: React.FC<GanttConfigProps> = ({
  toGantt,
  visible,
  currentPanel,
  configHandle,
  ganttConfig,
}) => {
  const { t } = useI18n();
  const [activeKey, setActiveKey] = useState<string[]>([]);
  useEffect(() => {
    if (currentPanel) {
      setActiveKey([currentPanel]);
    } else {
      setActiveKey([]);
    }
  }, [currentPanel]);
  const onChange = (val: string | string[]) => {
    if (isArray(val)) {
      setActiveKey([...val]);
    }
  };
  const genHeader = () => (
    <span className={styles.extraHeader}>
      <span className={styles.title}>
        {t("configuration.baseLineConfiguration.baseline")}
      </span>
      <span className={styles.des}>
        （{t("configuration.baseLineConfiguration.baseLineTitleDescription")}）
      </span>
    </span>
  );
  return (
    <Drawer
      title={t("configuration.title")}
      visible={visible}
      onClose={() => toGantt()}
      width={drawerWidth}
      getContainer={false}
      className={styles.settingsModalContainer}
      contentWrapperStyle={{ maxWidth: "721px" }}
      style={{ position: "absolute" }}
      maskClosable={false}
      mask={false}
    >
      <Collapse
        activeKey={activeKey}
        onChange={onChange}
        expandIcon={({ isActive }) => (
          <CollapseIcon className={isActive ? styles.activeRotate : ""} />
        )}
        className={styles.collapse}
      >
        <Panel header={genHeader()} key="baseLine">
          <Baseline />
        </Panel>

        <Panel
          header={t("configuration.displayItemsConfiguration.displayItems")}
          key="display"
        >
          <Display ganttConfig={ganttConfig} configHandle={configHandle} />
        </Panel>
        <Panel
          header={t(
            "configuration.timeFieldConfiguration.timeFieldConfigurationTitle"
          )}
          key="time"
        >
          <Time />
        </Panel>
        <Panel
          header={t("configuration.otherConfiguration.otherConfigurationTitle")}
          key="other"
        >
          <OtherConfig />
        </Panel>
      </Collapse>
    </Drawer>
  );
};
export default memo(GanttConfig);
