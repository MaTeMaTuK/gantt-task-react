import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import styles from "./gantt.module.css";
interface ModaProps {
  visible: boolean;
  toPanel: () => void;
}
export const GuideModal: React.FC<ModaProps> = ({ visible, toPanel }) => {
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);
  const toConfig = () => {
    setModalVisible(false);
    toPanel();
  };
  return (
    <Modal visible={modalVisible} footer={null}>
      <span className={styles.guideInfor}>
        还没有配置甘特图中卡片的时间字段，
        <span onClick={toConfig} className={styles.clickThis}>
          点此
        </span>{" "}
        进行配置
      </span>
    </Modal>
  );
};

export default GuideModal;
