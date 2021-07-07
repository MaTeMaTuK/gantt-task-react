import React, { useEffect, useContext } from "react";
import { Modal, Form, Select, InputNumber } from "antd";
import { GanttConfigContext } from "../../contsxt";
import styles from "./index.module.css";
import { TimeItemProps } from "./time";
const { Option } = Select;
const filterOption = (input: any, option: any) => {
  return option?.children?.toLowerCase().indexOf(input?.toLowerCase()) > -1;
};

interface ItemModalProps {
  visible: boolean;
  handleCancel: () => void;
  handleOk: (values: any) => void;
  currentItem: TimeItemProps;
}
const ItemModal: React.FC<ItemModalProps> = ({
  visible,
  handleCancel,
  handleOk,
  currentItem,
}) => {
  const [form] = Form.useForm();
  const { itemTypeData } = useContext(GanttConfigContext);
  const { customeFieldData } = useContext(GanttConfigContext);
  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue({
        ...currentItem,
      });
    }
  }, [visible, currentItem]);

  const handleConfirm = () => {
    form
      .validateFields()
      .then(values => {
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
          <Select placeholder="请选择" allowClear>
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
          {/* 代码没有抽离，原因是会影响from的校验触发 */}
          <Select
            placeholder="请选择"
            showSearch
            filterOption={filterOption}
            allowClear
          >
            {customeFieldData &&
              customeFieldData.map((ele: any) => {
                return (
                  <Option value={ele.value} key={ele.value}>
                    {ele.label}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item
          label="结束日期"
          name="endDate"
          rules={[{ required: true, message: "请选择结束日期字段" }]}
        >
          <Select placeholder="请选择" allowClear>
            {customeFieldData &&
              customeFieldData.map((ele: any) => {
                return (
                  <Option value={ele.value} key={ele.value}>
                    {ele.label}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item label="基线开始日期" name="baseLineStartDate">
          <Select placeholder="请选择" allowClear>
            {customeFieldData &&
              customeFieldData.map((ele: any) => {
                return (
                  <Option value={ele.value} key={ele.value}>
                    {ele.label}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item label="基线结束日期" name="baseLineEndDate">
          <Select placeholder="请选择" allowClear>
            {customeFieldData &&
              customeFieldData.map((ele: any) => {
                return (
                  <Option value={ele.value} key={ele.value}>
                    {ele.label}
                  </Option>
                );
              })}
          </Select>
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
