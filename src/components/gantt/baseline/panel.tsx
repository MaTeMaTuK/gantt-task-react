import React, { useState, useContext } from "react";
import { PlusOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
import AddEdit from "./add-edit";
import { BaseLineContext } from "../../../contsxt";
import { omit } from "lodash";
import styles from "./index.css";
interface panelProps {
  onClosePopver: () => void;
}
interface BaselineConfigProps {
  baseline?: any;
}
export const Panel: React.FC<panelProps> = ({ onClosePopver }) => {
  const BaselineConfig: React.FC<BaselineConfigProps> = () => {
    const edit = () => {
      setVisible(true);
      // 关闭popover
      onClosePopver?.();
      // 关闭configpopover
      setConfigVisible(false);
    };
    const del = () => {
      onClosePopver?.();
      setConfigVisible(false);
      baseLineHandle(currentBaseline);
    };
    return (
      <div>
        <p className={styles.cursor} onClick={edit}>
          编辑基线
        </p>
        <p className={styles.cursor} onClick={del}>
          删除基线
        </p>
      </div>
    );
  };
  const { baseLineHandle, baselineList, setCurrentLog } = useContext(
    BaseLineContext
  );
  const [visible, setVisible] = useState(false);
  const [configVisible, setConfigVisible] = useState(false);
  const [currentBaseline, setCurrentBaseline] = useState<any>({});
  const addBaseline = () => {
    setVisible(true);
    onClosePopver?.();
  };
  const handleOk = (value: any) => {
    setVisible(false);
    baseLineHandle(value, value.objectId ? "edit" : "add");
  };
  const handleCancel = () => {
    setVisible(false);
  };
  const handleConfigVisible = (visible: boolean, item: any) => {
    setCurrentBaseline(omit(item, ["createdAt", "updatedAt"]));
    setConfigVisible(visible);
  };
  const chooseLog = (infor: any) => {
    setCurrentLog(infor);
  };
  return (
    <div className={styles.panel}>
      <div>
        <Button type="text" icon={<PlusOutlined />} onClick={addBaseline}>
          创建基线
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
        {baselineList.map((ele: any) => {
          return (
            <li key={ele.objectId} onClick={() => chooseLog(ele)}>
              {ele.name}
              <Popover
                key={ele.objectId}
                content={<BaselineConfig baseline={currentBaseline} />}
                trigger="click"
                visible={
                  configVisible && currentBaseline?.objectId === ele.objectId
                }
                onVisibleChange={(e: boolean) => {
                  handleConfigVisible(e, ele);
                }}
              >
                <span className={styles.dot}>
                  <EllipsisOutlined />
                </span>
              </Popover>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Panel;
