import React, { useState, useEffect, useContext, useMemo } from "react";
import { Modal, Form, Input } from "antd";
import { BaselineProps } from "../../../types/public-types";
import { BaseLineContext } from "../../../contsxt";
import useI18n from "../../../lib/hooks/useI18n";
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
  const { t } = useI18n();
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { baselineList } = useContext(BaseLineContext);
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
        callback(t("errorMessage.nameAlreadyExists"));
      } else {
        callback();
      }
    }
  };
  return (
    <Modal
      title={
        isEdit
          ? t("configuration.baseLineConfiguration.newBaseline")
          : t("configuration.baseLineConfiguration.editBaseline")
      }
      visible={modalVisible}
      onCancel={handleCancel}
      onOk={confirmOk}
      okText={t("global.complete")}
      cancelText={t("global.cancel")}
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
          label={t("configuration.baseLineConfiguration.baselineName")}
          name="name"
          rules={[
            { required: true, message: t("errorMessage.baselineNameError") },
            { validator: nameValidator },
          ]}
        >
          <Input
            placeholder={t("placeholder.baselineNamePlaceholder")}
            maxLength={32}
          />
        </Form.Item>
        <Form.Item
          label={t("configuration.baseLineConfiguration.baselineDescription")}
          name="description"
        >
          <TextArea
            placeholder={t("placeholder.baselineDescriptionPlaceholder")}
            maxLength={300}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default AddEdit;
