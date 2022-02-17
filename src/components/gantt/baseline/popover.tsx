import React, { useState, useCallback } from "react";
import { Popover } from "antd";
import Panel from "./panel";
import { DownOutlined } from "@ant-design/icons";
import styles from "./index.css";
export const Baseline: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const handleVisibleChange = useCallback((visible: boolean) => {
    setVisible(visible);
  }, []);
  const handelClosePopver = () => {
    setVisible(false);
  };
  return (
    <Popover
      placement="bottomRight"
      content={
        <Panel
          onClosePopver={handelClosePopver}
          setPopoverVisible={setVisible}
        />
      }
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <span className={styles.cursor}>
        基线
        <DownOutlined />
      </span>
    </Popover>
  );
};
export default Baseline;
