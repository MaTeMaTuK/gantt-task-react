import React, { useState, useContext, useMemo } from "react";
import { Button, Table, Space, Modal, Tooltip } from "antd";
import { PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import styles from "./index.module.css";
import TimeModal from "./time-modal";
import { ConfigHandleContext, GanttConfigContext } from "../../contsxt";
import { TimeItemProps } from "../../types/public-types";
import WarningIcon from "../icons/warning";
interface TimeProps {}
const Time: React.FC<TimeProps> = () => {
  const [visible, setVisible] = useState(false);
  const columns = [
    {
      title: "事项类型",
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
            <Tooltip title="没有配置的卡片类型将使用默认配置">
              默认 &nbsp;
              <QuestionCircleOutlined />
            </Tooltip>
          )
        );
      },
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      render: (_text: string, record: TimeItemProps, index: number) => (
        <Space>
          <a type="link" onClick={() => editTime(index)}>
            配置
          </a>
          {!record?.isDefault && (
            <a type="link" onClick={() => del(index)}>
              删除
            </a>
          )}
        </Space>
      ),
    },
  ];
  const { configHandle, setItemTypeValue, itemTypeData } = useContext(
    ConfigHandleContext
  );
  const { ganttConfig } = useContext(GanttConfigContext);
  const [currentItem, setCurrentItem] = useState<any>({});
  const [index, setIndex] = useState(0);
  const timeList = useMemo(
    () =>
      ganttConfig?.time?.length ? ganttConfig?.time : [{ isDefault: true }],
    [ganttConfig?.time]
  );
  const handleCancel = () => {
    setVisible(false);
  };
  const handleOk = (values: TimeItemProps) => {
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
  const addTime = () => {
    setVisible(true);
    setCurrentItem({});
    setItemTypeValue("");
  };
  const editTime = (index: number) => {
    setIndex(index);
    setCurrentItem(timeList[index]);
    setVisible(true);
    if (timeList[index]?.["isDefault"]) {
      setItemTypeValue("isDefault");
    } else {
      setItemTypeValue(timeList[index]?.itemType);
    }
  };
  const del = (index: number) => {
    Modal.confirm({
      title: "删除该配置",
      content: "删除后无法恢复。您确定删除吗？",
      okText: "确认",
      cancelText: "取消",
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
  const itemTypeChange = (val: string) => {
    setItemTypeValue(val);
  };
  return (
    <div>
      <TimeModal
        visible={visible}
        handleCancel={handleCancel}
        handleOk={handleOk}
        currentItem={currentItem}
        timeList={timeList} // 做卡片唯一性校验
        itemTypeChange={itemTypeChange}
      />
      <h4 className={`${styles.timeTips}`}>
        <em>
          <WarningIcon />
        </em>
        为了让甘特图正确显示，您需要在这里设置甘特图中时间区块的起止时间对应事项的哪个时间字段
      </h4>
      <Table
        columns={columns}
        dataSource={timeList}
        pagination={false}
        className={styles.mb20}
        rowKey={columns => {
          return columns.itemType || "default";
        }}
      />
      <Button icon={<PlusOutlined />} onClick={addTime}>
        添加事项类型
      </Button>
    </div>
  );
};
export default Time;
