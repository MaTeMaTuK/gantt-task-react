import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import styles from "./gantt.module.css";
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
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);
  const toConfig = () => {
    toPanel();
  };
  const handleCancel = () => {
    toCancel();
  };
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
        还没有配置甘特图中卡片的时间字段，
        <span onClick={toConfig} className={styles.clickThis}>
          点此
        </span>
        进行配置
      </span>
    </Modal>
  );
};

export default GuideModal;
