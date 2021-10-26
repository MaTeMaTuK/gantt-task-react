import React, { useState, useEffect } from "react";
import { Modal, Form, Input } from "antd";
import dayjs from "dayjs";
const { TextArea } = Input;
export interface BaselineProps {
  name?: string;
  objectId?: string;
  [propName: string]: any;
}
interface ModalProps {
  visible: boolean;
  handleOk: (value: any) => void;
  handleCancel: () => void;
  currentBaseline: BaselineProps;
}

export const AddEdit: React.FC<ModalProps> = ({
  visible,
  handleOk,
  handleCancel,
  currentBaseline,
}) => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);
  useEffect(() => {
    form.setFieldsValue({
      name: currentBaseline?.name
        ? currentBaseline?.name
        : dayjs(new Date()).format("YYYY-MM-DD hh:mm:ss"),
      description: currentBaseline?.description,
    });
  }, [currentBaseline]);
  const onFinish = () => {};
  const confirmOk = () => {
    form
      .validateFields()
      .then((values: any) => {
        handleOk(Object.assign(currentBaseline, values));
      })
      .catch(info => {
        console.log("Validate Failed:", info);
      });
  };
  return (
    <Modal
      title="新建基线"
      visible={modalVisible}
      onCancel={handleCancel}
      onOk={confirmOk}
      okText="确认"
      cancelText="取消"
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="基线名称"
          name="name"
          rules={[{ required: true, message: "请输入基线名称" }]}
        >
          <Input placeholder="请输入基线名称" />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <TextArea placeholder="请输入基线描述" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default AddEdit;
