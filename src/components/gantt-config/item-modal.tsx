import React, { useEffect, useContext } from "react";
import { Modal, Form, Select, DatePicker, InputNumber } from "antd";
import { OptionContext } from "../../contsxt";
import styles from "./index.module.css";
const { Option } = Select;
interface ItemModalProps {
  visible: boolean;
  handleCancel: () => void;
  handleOk: (values: any) => void;
}
const ItemModal: React.FC<ItemModalProps> = ({
  visible,
  handleCancel,
  handleOk,
}) => {
  const [form] = Form.useForm();
  const { itemTypeData } = useContext(OptionContext);
  useEffect(() => {
    console.log(visible, "visible");
    console.log(form, "form");
    if (visible) {
      form.resetFields();
      form.setFieldsValue({
        itemType: undefined,
      });
    }
  }, [visible]);

  const handleConfirm = () => {
    form
      .validateFields()
      .then(values => {
        console.log(values, "values");
        console.log(values.startDate.valueOf());
        handleOk(values);
      })
      .catch(info => {
        console.log("Validate Failed:", info);
      });
  };
  return (
    <Modal
      title="时间字段配置"
      visible={visible}
      onOk={handleConfirm}
      onCancel={handleCancel}
      cancelText="取消"
      okText="确定"
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout="vertical"
      >
        <Form.Item
          label="卡片类型"
          name="itemType"
          rules={[{ required: true, message: "请选择卡片类型" }]}
        >
          <Select placeholder="请选择">
            {itemTypeData.map((ele: any) => {
              return (
                <Option value={ele.value} key={ele.value}>
                  {ele.label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="开始日期"
          name="startDate"
          rules={[{ required: true, message: "请选择开始日期字段" }]}
        >
          <DatePicker
            placeholder="请选择开始日期字段"
            className={styles.width100}
          />
        </Form.Item>
        <Form.Item
          label="结束日期"
          name="endDate"
          rules={[{ required: true, message: "请选择结束日期字段" }]}
        >
          <DatePicker
            placeholder="请选择结束日期字段"
            className={styles.width100}
          />
        </Form.Item>
        <Form.Item label="基线开始日期" name="baseLineStartDate">
          <DatePicker
            placeholder="请选择基线开始日期"
            className={styles.width100}
          />
        </Form.Item>
        <Form.Item label="基线结束日期" name="baseLineEndDate">
          <DatePicker
            placeholder="请选择基线结束日期"
            className={styles.width100}
          />
        </Form.Item>
        <Form.Item label="完成占比" name="percentage">
          <InputNumber
            className={styles.width100}
            max={100}
            min={0}
            placeholder="请输入占比"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ItemModal;
