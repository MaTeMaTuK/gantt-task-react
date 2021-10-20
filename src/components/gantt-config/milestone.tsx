import React, { useEffect, useContext, useMemo } from "react";
import { Form, Select, Button } from "antd";
import styles from "./index.module.css";
import { GanttConfigContext, ConfigHandleContext } from "../../contsxt";
import { filterFields } from "./time-modal";
import { TabConfigProps } from "../../types/public-types";
const { Option } = Select;
interface RelationValueProps {
  itemType: string;
  startDate: string;
}
const MileStone: React.FC<TabConfigProps> = ({ currentTab }) => {
  const [form] = Form.useForm();
  const { ganttConfig, itemTypeData, customeFieldData } = useContext(
    GanttConfigContext
  );
  const { configHandle, setItemTypeValue } = useContext(ConfigHandleContext);
  const milestone = useMemo(() => ganttConfig?.milestone, [
    ganttConfig?.milestone,
  ]);

  useEffect(() => {
    if (currentTab === "mileStone") {
      setItemTypeValue(milestone?.itemType);
      form.setFieldsValue({
        ...milestone,
      });
    }
  }, [currentTab]);
  const onFinish = (values: RelationValueProps) => {
    configHandle({
      ...ganttConfig,
      milestone: values,
    });
  };
  const handelChange = (val: string) => {
    setItemTypeValue(val);
    form.setFieldsValue({
      startDate: undefined,
    });
  };
  return (
    <div>
      <h4 className={styles.mb20}>
        为了让甘特图正确显示，您需要在这里设置里程碑对应的卡片类型
      </h4>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 12 }}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="里程碑卡片类型"
          tooltip="在甘特图中，被设置为里程碑的卡片将显示为菱形，并隐藏其子卡片"
          name="itemType"
          rules={[{ required: true, message: "请选择里程碑卡片类型" }]}
        >
          <Select placeholder="请选择" allowClear onChange={handelChange}>
            {itemTypeData.map((ele: any) => {
              return (
                <Option value={ele.value} key={ele.value}>
                  {ele.icon ? (
                    <img src={ele.icon} className={styles.icon} />
                  ) : null}
                  {ele.label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="里程碑时间字段"
          name="startDate"
          rules={[{ required: true, message: "请选择里程碑时间字段" }]}
        >
          <Select placeholder="请选择" allowClear>
            {filterFields("Date", customeFieldData).map((ele: any) => {
              return (
                <Option value={ele.value} key={ele.value}>
                  {ele.label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            更新
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default MileStone;
