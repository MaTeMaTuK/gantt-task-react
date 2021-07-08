import React, { useState, useContext, useMemo } from "react";
import { Button, Table, Space, Modal } from "antd";
import styles from "./index.module.css";
import TimeModal from "./time-modal";
import { ConfigHandelContext, GanttConfigContext } from "../../contsxt";
import { omit } from "lodash";
interface TimeProps {}
export interface TimeItemProps {
  itemType?: string;
  startDate?: string;
  endDate?: string;
  baseLineStartDate?: string;
  baseLineEndDate?: string;
  percentage?: number;
  isDefault?: boolean;
}
const Time: React.FC<TimeProps> = () => {
  const [visible, setVisible] = useState(false);
  const columns = [
    {
      title: "卡片类型",
      dataIndex: "itemType",
      key: "name",
      render: (text: string) => {
        const res =
          itemTypeData &&
          itemTypeData.filter((ele: { label: string; value: string }) => {
            return ele.value === text;
          });
        console.log(res, "res");
        return res[0]?.label || "默认";
      },
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      // @ts-ignore
      render: (text: string, record: TimeItemProps, index: number) => (
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
  const { configHandle } = useContext(ConfigHandelContext);
  const { ganttConfig } = useContext(GanttConfigContext);
  const { itemTypeData } = useContext(GanttConfigContext);
  const [currentItem, setCurrentItem] = useState({});
  const [index, setIndex] = useState(0);
  const timeList = useMemo(
    () => (ganttConfig?.time ? ganttConfig?.time : [{ isDefault: true }]),
    [ganttConfig?.time]
  );
  const handleCancel = () => {
    setVisible(false);
  };
  const handleOk = (values: TimeItemProps) => {
    let newTimeList;
    if (Object.keys(currentItem).length) {
      newTimeList = [...timeList];
      // @ts-ignore
      if (currentItem?.isDefault) {
        // @ts-ignore
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
      ...omit(ganttConfig, [
        "ACl",
        "tennat",
        "updateAt",
        "createdAt",
        "updatedAt",
        "createdBy",
      ]),
      time: newTimeList,
    });
  };
  const addTime = () => {
    setVisible(true);
    setCurrentItem({});
  };
  const editTime = (index: number) => {
    setIndex(index);
    setCurrentItem(timeList[index]);
    setVisible(true);
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
      ...omit(ganttConfig, [
        "ACl",
        "tennat",
        "updateAt",
        "createdAt",
        "updatedAt",
        "createdBy",
      ]),
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
      />
      <h4 className={styles.mb20}>
        为了让甘特图正确显示，您需要在这里设置甘特图中时间区块的起止时间对应卡片的哪个时间字段
      </h4>
      <Table
        columns={columns}
        dataSource={timeList}
        pagination={false}
        className={styles.mb20}
      />
      <Button type="primary" onClick={addTime}>
        添加卡片类型
      </Button>
    </div>
  );
};
export default Time;
