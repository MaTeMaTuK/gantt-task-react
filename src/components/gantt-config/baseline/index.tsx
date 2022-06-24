import React, { useState, useContext, useCallback } from "react";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import AddEdit from "./add-edit";
import { BaseLineContext } from "../../../contsxt";
import { BaselineProps } from "../../../types/public-types";
import Checked from "../../icons/checked";
import { omit } from "lodash";
import { dayTimeFormat } from "../../../helpers/dicts";
import useI18n from "../../../lib/hooks/useI18n";

import dayjs from "dayjs";

import styles from "./index.css";
export const BaseLine: React.FC = () => {
  const { t } = useI18n();
  const {
    baseLineHandle,
    baselineList,
    setCurrentLog,
    currentLog,
    OverflowTooltip,
    setLogTasks,
  } = useContext(BaseLineContext);
  const deleteBaseline = () => {
    Modal.confirm({
      title: t("configuration.baseLineConfiguration.deleteBaseline"),
      content: `${t("configuration.baseLineConfiguration.deleteDescription")}?`,
      okText: t("global.complete"),
      cancelText: t("global.cancle"),
      onOk: () => baseLineHandle(currentBaseline),
    });
  };
  const handleMenuClick = (
    type: string,
    e: React.SyntheticEvent,
    currentBaseLine: BaselineProps
  ) => {
    setCurrentBaseline(omit(currentBaseLine, ["createdAt", "updatedAt"]));
    e.stopPropagation();
    switch (type) {
      case "edit":
        setVisible(true);
        break;
      case "del":
        deleteBaseline();
        break;
    }
  };
  const [visible, setVisible] = useState(false);
  const [currentBaseline, setCurrentBaseline] = useState<any>({});
  const addBaseline = () => {
    setVisible(true);
    setCurrentBaseline({});
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
    // 取消选中基线
    if (currentLog?.objectId === infor?.objectId) {
      setCurrentLog(null);
      setLogTasks([]);
    } else {
      setCurrentLog(infor);
    }
  };
  return (
    <div className={styles.panel}>
      <div className={styles.createBaseline}>
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={addBaseline}
          disabled={baselineList?.length >= 10}
        >
          {`${t("configuration.baseLineConfiguration.createBaseline")}（${
            baselineList?.length
          }/10）`}
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
              {ele.objectId === currentLog?.objectId && (
                <div className={styles.checkedIcon}>
                  <Checked />
                </div>
              )}
              <div
                className={`${styles.content} ${styles.cursor}`}
                onClick={() => chooseLog(ele)}
              >
                <div className={styles.name}>{OverflowTooltip(ele.name)}</div>
                <div className={styles.time}>
                  <div className={styles.createTime}>
                    {t("global.updatedAt")}：
                    {dayjs(new Date(ele.createdAt)).format(dayTimeFormat)}
                  </div>
                  <div className={styles.handleIcon}>
                    <EditOutlined
                      onClick={e => handleMenuClick("edit", e, ele)}
                    />
                    <DeleteOutlined
                      onClick={e => handleMenuClick("del", e, ele)}
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BaseLine;
