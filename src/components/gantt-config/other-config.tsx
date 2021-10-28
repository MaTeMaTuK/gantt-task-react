import React, { useState, useContext, useMemo, useEffect } from "react";
import { Form, Button, Switch, Modal } from "antd";
import { GanttConfigContext, ConfigHandleContext } from "../../contsxt";
import { TabConfigProps } from "../../types/public-types";
const { confirm } = Modal;
interface OtherCofigProps {
  autoPatch: boolean;
}
const OtherConfig: React.FC<TabConfigProps> = ({ currentTab }) => {
  const [form] = Form.useForm();
  const [checked, setChecked] = useState(false);
  const { ganttConfig } = useContext(GanttConfigContext);
  const { configHandle } = useContext(ConfigHandleContext);
  const otherConfig = useMemo(() => ganttConfig?.otherConfig, [
    ganttConfig?.otherConfig,
  ]);
  useEffect(() => {
    if (currentTab === "otherConfig") {
      setChecked(otherConfig?.autoPatch);
    }
  }, [currentTab]);
  const onFinish = (values: OtherCofigProps) => {
    configHandle({
      ...ganttConfig,
      otherConfig: values,
    });
  };
  const onChange = (value: boolean) => {
    if (!value) {
      setChecked(value);
      return;
    }
    confirm({
      title: "自动编排",
      okText: "确定",
      cancelText: "取消",
      content:
        "开启自动编排时，将按当前的事项关系自动调整所有事项的时间。确认开启？",
      onOk() {
        setChecked(value);
      },
      onCancel() {
        setChecked(false);
      },
    });
  };
  return (
    <div>
      <Form form={form} name="basic" onFinish={onFinish}>
        <Form.Item
          label="自动编排"
          name="autoPatch"
          tooltip="根据卡片之间的关系，自动调整卡片时间，避免出现逻辑错误"
        >
          <Switch onChange={onChange} checked={checked} />
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

export default OtherConfig;
