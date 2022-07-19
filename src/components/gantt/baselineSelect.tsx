import React from "react";
import styles from "./gantt.module.css";
import { Button } from "antd";
import useI18n from "../../lib/hooks/useI18n";
import { BaselineProps } from "../../types/public-types";
interface BaselineSelectPros {
  OverflowTooltip: (value: string) => JSX.Element;
  currentLog: BaselineProps;
  baselineExit: () => void;
}
const BaselineSelect: React.FC<BaselineSelectPros> = ({
  OverflowTooltip,
  currentLog,
  baselineExit,
}) => {
  const { t } = useI18n();
  return (
    <div>
      <div className={styles.choosedBaselIne}>
        <span className={styles.loaded}>
          {OverflowTooltip(
            `${t("configuration.baseLineConfiguration.loaded")}：${
              currentLog?.name
            }`
          )}
        </span>
        <Button size="small" onClick={baselineExit}>
          {t("global.exit")}
        </Button>
      </div>
    </div>
  );
};

export default BaselineSelect;
