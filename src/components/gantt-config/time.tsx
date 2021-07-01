import React, { useState } from "react";
import { Button, Table, Space } from "antd";
import styles from "./index.module.css";
import ItemModal from "./item-modal";
interface TimeProps {}
const Time: React.FC<TimeProps> = () => {
  const [visible, setVisible] = useState(false);
  const columns = [
    {
      title: "卡片类型",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      render: () => (
        <Space>
          <a>配置</a>
          <a>删除</a>
        </Space>
      ),
    },
  ];
  const data = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      tags: ["loser"],
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sidney No. 1 Lake Park",
      tags: ["cool", "teacher"],
    },
  ];
  const handleCancel = () => {
    setVisible(false);
  };
  const handleOk = () => {};
  return (
    <div>
      <ItemModal
        visible={visible}
        handleCancel={handleCancel}
        handleOk={handleOk}
      />
      <h4 className={styles.mb20}>
        为了让甘特图正确显示，您需要在这里设置甘特图中时间区块的起止时间对应卡片的哪个时间字段
      </h4>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        className={styles.mb20}
      />
      <Button type="primary" onClick={() => setVisible(true)}>
        添加卡片类型
      </Button>
    </div>
  );
};
export default Time;
