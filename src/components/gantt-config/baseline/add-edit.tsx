import React, { useState, useEffect, useContext, useMemo } from "react";
import { Modal, Form, Input } from "antd";
import { BaselineProps } from "../../../types/public-types";
import { BaseLineContext } from "../../../contsxt";
import dayjs from "dayjs";

const { TextArea } = Input;
interface ModalProps {
  visible: boolean;
  handleOk: (value: BaselineProps) => void;
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
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { baselineList } = useContext(BaseLineContext);
  console.log(currentBaseline, "currentBaseline");
  const isEdit = useMemo(() => {
    return !!currentBaseline?.objectId;
  }, [currentBaseline]);
  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);
  useEffect(() => {
    form.setFieldsValue({
      name: currentBaseline?.name
        ? currentBaseline?.name
        : dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      description: currentBaseline?.description,
    });
  }, [currentBaseline, form]);
  const onFinish = () => {};
  const confirmOk = () => {
    form
      .validateFields()
      .then(async (values: BaselineProps) => {
        setConfirmLoading(true);
        await handleOk(Object.assign(currentBaseline, values));
        setConfirmLoading(false);
      })
      .catch(info => {
        console.log("Validate Failed:", info);
      });
  };
  const nameValidator = (
    {},
    value: string,
    callback: (error?: string) => void
  ) => {
    if (!value) {
      callback();
    } else {
      const findRepeat = baselineList?.filter(
        (ele: BaselineProps) => ele.name === value
      );
      if (
        findRepeat.length &&
        currentBaseline &&
        currentBaseline.name !== value
      ) {
        callback("该名称已存在");
      } else {
        callback();
      }
    }
  };
  return (
    <Modal
      title={`${isEdit ? "编辑" : "新建"}基线`}
      visible={modalVisible}
      onCancel={handleCancel}
      onOk={confirmOk}
      okText="确认"
      cancelText="取消"
      confirmLoading={confirmLoading}
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
          rules={[
            { required: true, message: "请输入基线名称" },
            { validator: nameValidator },
          ]}
        >
          <Input
            placeholder="请输入基线名称，最大长度32个字符"
            maxLength={32}
          />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <TextArea placeholder="请输入基线描述" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default AddEdit;
