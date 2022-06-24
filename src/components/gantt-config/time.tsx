import React, { useState, useContext, useMemo, useCallback } from "react";
import { Button, Table, Space, Modal, Tooltip } from "antd";
import { PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import styles from "./index.module.css";
import TimeModal from "./time-modal";
import { ConfigHandleContext, GanttConfigContext } from "../../contsxt";
import { TimeItemProps } from "../../types/public-types";
import WarningIcon from "../icons/warning";
import useI18n from "../../lib/hooks/useI18n";

interface TimeProps {}
const Time: React.FC<TimeProps> = () => {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const columns = [
    {
      title: t("configuration.timeFieldConfiguration.relatedItems"),
      dataIndex: "itemType",
      key: "name",
      render: (text: string) => {
        const res =
          itemTypeData &&
          itemTypeData.filter((ele: { label: string; value: string }) => {
            return ele.value === text;
          });
        return (
          res[0]?.label || (
            <Tooltip
              title={t(
                "configuration.timeFieldConfiguration.noConfigurationTip"
              )}
            >
              {t("global.default")} &nbsp;
              <QuestionCircleOutlined />
            </Tooltip>
          )
        );
      },
    },
    {
      title: t("configuration.timeFieldConfiguration.configuration"),
      key: "action",
      width: 120,
      render: (_text: string, record: TimeItemProps, index: number) => (
        <Space>
          <a type="link" onClick={() => editTime(index)}>
            {t("configuration.timeFieldConfiguration.configuration")}
          </a>
          {!record?.isDefault && (
            <a type="link" onClick={() => del(index)}>
              {t("global:delete")}
            </a>
          )}
        </Space>
      ),
    },
  ];
  const { configHandle, itemTypeData } = useContext(ConfigHandleContext);
  const { ganttConfig } = useContext(GanttConfigContext);
  const [currentItem, setCurrentItem] = useState<any>({});
  const [index, setIndex] = useState(0);
  const timeList = useMemo(
    () =>
      ganttConfig?.time?.length ? ganttConfig?.time : [{ isDefault: true }],
    [ganttConfig?.time]
  );
  const handleCancel = useCallback(() => {
    setVisible(false);
  }, []);
  const handleOk = async (values: TimeItemProps) => {
    let newTimeList;
    if (Object.keys(currentItem).length) {
      newTimeList = [...timeList];
      if (currentItem?.isDefault) {
        values.isDefault = currentItem?.isDefault;
      }
      newTimeList[index] = values;
      // 编辑
    } else {
      // 新增
      newTimeList = [...timeList, values];
    }
    setVisible(false);
    configHandle({
      ...ganttConfig,
      time: newTimeList,
    });
  };
  const addTime = useCallback(() => {
    setVisible(true);
    setCurrentItem({});
  }, []);
  const editTime = useCallback(
    (index: number) => {
      setIndex(index);
      setCurrentItem(timeList[index]);
      setVisible(true);
    },
    [timeList]
  );
  const del = (index: number) => {
    Modal.confirm({
      title: t("configuration.timeFieldConfiguration.deleteTitle"),
      content: t("configuration.timeFieldConfiguration.deleteTip"),
      okText: t("global:complete"),
      cancelText: t("global:cancel"),
      onOk: () => delConfig(index),
    });
  };
  const delConfig = (index: number) => {
    const newTimeList = [...timeList];
    newTimeList.splice(index, 1);
    configHandle({
      ...ganttConfig,
      time: newTimeList,
    });
  };
  return (
    <div>
      <TimeModal
        visible={visible}
        handleCancel={handleCancel}
        handleOk={handleOk}
        currentItem={currentItem}
        timeList={timeList} // 做卡片唯一性校验
      />
      <div className={`${styles.timeTips}`}>
        <em>
          <WarningIcon style={{ color: "red" }} />
        </em>
        {t(
          "configuration.timeFieldConfiguration.timeFieldConfigurationDescription"
        )}
      </div>
      <Table
        columns={columns}
        dataSource={timeList}
        pagination={false}
        className={styles.timeConfigTable}
        rowKey={columns => {
          return columns.itemType || "default";
        }}
      />
      <div className={styles.timeConfigAddBtn}>
        <Button icon={<PlusOutlined />} type="link" onClick={addTime}>
          {t("configuration.timeFieldConfiguration.addConfiguration")}
        </Button>
      </div>
    </div>
  );
};
export default Time;
