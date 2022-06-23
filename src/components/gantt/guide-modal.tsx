import React, { useState, useEffect, useCallback, memo } from "react";
import { Modal } from "antd";
import styles from "./gantt.module.css";
import useI18n from "../../lib/hooks/useI18n";
interface ModaProps {
  visible: boolean;
  toPanel: () => void;
  toCancel: () => void;
}
export const GuideModal: React.FC<ModaProps> = ({
  visible,
  toPanel,
  toCancel,
}) => {
  const { t } = useI18n();
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);
  const toConfig = useCallback(() => {
    toPanel();
  }, [toPanel]);
  const handleCancel = useCallback(() => {
    toCancel();
  }, [toCancel]);
  return (
    <Modal
      closable={false}
      visible={modalVisible}
      footer={null}
      width={300}
      className="guide-modal"
      onCancel={handleCancel}
    >
      <span className={styles.guideInfor}>
        {t("ganttconfiguration.unconfigurationModal.unconfigurationTip")}，
        <span onClick={toConfig} className={styles.clickThis}>
          {t("ganttconfiguration.unconfigurationModal.clickHere")}
        </span>
        {t("ganttconfiguration.unconfigurationModal.performConfiguration")}
      </span>
    </Modal>
  );
};

export default memo(GuideModal);
