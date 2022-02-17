import React, { useState, useContext, useCallback } from "react";
import {
  PlusOutlined,
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Menu, Dropdown, Button, Modal } from "antd";
import AddEdit from "./add-edit";
import { BaseLineContext } from "../../../contsxt";
import { BaselineProps } from "../../../types/public-types";
import { omit } from "lodash";
import dayjs from "dayjs";

import styles from "./index.css";
interface panelProps {
  onClosePopver: () => void;
  setPopoverVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}
export const Panel: React.FC<panelProps> = ({
  onClosePopver,
  setPopoverVisible,
}) => {
  const deleteBaseline = () => {
    Modal.confirm({
      title: "删除基线",
      content: "删除的基线无法恢复，确认删除？",
      okText: "确认",
      cancelText: "取消",
      onOk: () => baseLineHandle(currentBaseline),
    });
  };
  const handleMenuClick = (e: any) => {
    onClosePopver?.();
    switch (e.key) {
      case "edit":
        setVisible(true);
        break;
      case "del":
        deleteBaseline();
        break;
    }
  };
  const BaselineConfig = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="edit">
        <span>
          <EditOutlined />
          <span className={styles.ml8}>编辑基线</span>
        </span>
      </Menu.Item>
      <Menu.Item key="del">
        <span>
          <DeleteOutlined />
          <span className={styles.ml8}>删除基线</span>
        </span>
      </Menu.Item>
    </Menu>
  );
  const {
    baseLineHandle,
    baselineList,
    setCurrentLog,
    currentLog,
  } = useContext(BaseLineContext);
  const [visible, setVisible] = useState(false);
  const [currentBaseline, setCurrentBaseline] = useState<any>({});
  const addBaseline = () => {
    setVisible(true);
    setCurrentBaseline({});
    onClosePopver?.();
  };
  const handleOk = useCallback(
    async (value: BaselineProps) => {
      await baseLineHandle(value, value.objectId ? "edit" : "add");
      setVisible(false);
    },
    [baseLineHandle]
  );
  const handleCancel = () => {
    setVisible(false);
  };
  const chooseLog = (infor: BaselineProps) => {
    setCurrentLog(infor);
    setPopoverVisible?.(false);
  };
  return (
    <div className={styles.panel}>
      <div className={styles.createBaseline}>
        <Button
          type="link"
          icon={<PlusOutlined />}
          onClick={addBaseline}
          disabled={baselineList.length >= 10}
        >
          {`创建基线（${baselineList?.length}/10）`}
        </Button>
      </div>
      {visible && (
        <AddEdit
          visible={visible}
          handleOk={handleOk}
          handleCancel={handleCancel}
          currentBaseline={currentBaseline}
        />
      )}
      <ul className={styles.list}>
        {baselineList.map((ele: BaselineProps) => {
          return (
            <li
              key={ele.objectId}
              className={
                currentLog && ele.objectId === currentLog.objectId
                  ? styles.activeBaseline
                  : undefined
              }
            >
              <div
                className={`${styles.content} ${styles.cursor}`}
                onClick={() => chooseLog(ele)}
              >
                <div className={styles.name}>{ele.name}</div>
                <div className={styles.time}>
                  创建于：
                  {dayjs(new Date(ele.createdAt)).format("YYYY-MM-DD HH:mm:ss")}
                </div>
              </div>
              <Dropdown
                overlay={BaselineConfig}
                placement="bottomRight"
                trigger={["click"]}
              >
                <span
                  className={styles.dot}
                  onClick={() => {
                    setCurrentBaseline(omit(ele, ["createdAt", "updatedAt"]));
                  }}
                >
                  <EllipsisOutlined />
                </span>
              </Dropdown>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Panel;
