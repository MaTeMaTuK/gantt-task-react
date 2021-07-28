import React, { useEffect, useContext, useMemo } from "react";
import { Form, Select, Button } from "antd";
import styles from "./index.module.css";
import { GanttConfigContext, ConfigHandelContext } from "../../contsxt";
import { omit } from "lodash";
const { Option } = Select;

interface RelationProps {
  currentTab: string;
}
interface RelationValueProps {
  FS: string;
  FF: string;
  SS: string;
  SF: string;
}
const Relation: React.FC<RelationProps> = ({ currentTab }) => {
  const [form] = Form.useForm();
  const { itemRelationData } = useContext(GanttConfigContext);
  const { ganttConfig } = useContext(GanttConfigContext);
  const { configHandle } = useContext(ConfigHandelContext);
  const relationValue = useMemo(
    () => (ganttConfig.relation ? ganttConfig.relation : {}),
    [ganttConfig?.relation]
  );
  useEffect(() => {
    if (currentTab === "relation") {
      form.resetFields();
      form.setFieldsValue({
        ...relationValue,
      });
    }
  }, [currentTab]);
  const onFinish = (values: RelationValueProps) => {
    configHandle({
      ...omit(ganttConfig, [
        "ACl",
        "tennat",
        "updateAt",
        "createdAt",
        "updatedAt",
        "createdBy",
      ]),
      relation: values,
    });
  };
  const relactionCheck = (rule: any, value: any) => {
    const filedData = form.getFieldsValue();
    let isError = false;
    Object.keys(filedData).forEach((ele: any) => {
      if (filedData[ele] === value && rule.field !== ele) {
        isError = true;
      }
    });
    if (isError) {
      return Promise.reject(new Error("关联关系重复， 请重新选择"));
    } else {
      return Promise.resolve();
    }
  };
  return (
    <div>
      <h4 className={styles.mb20}>
        为了让甘特图正确显示，您需要在这里设置甘特图中时间区块的起止时间对应卡片的哪个时间字段
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
          label="完成到开始关系（FS）"
          name="FS"
          rules={[
            { required: true, message: "请选择完成到开始关系（FS）" },
            {
              validator: relactionCheck,
            },
          ]}
        >
          <Select placeholder="请选择">
            {itemRelationData.map((ele: any) => {
              return (
                <Option value={ele.value} key={ele.value}>
                  {ele.label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="完成到完成关系（FF）"
          name="FF"
          rules={[
            { required: true, message: "请选择完成到完成关系（FF）" },
            {
              validator: relactionCheck,
            },
          ]}
        >
          <Select placeholder="请选择">
            {itemRelationData.map((ele: any) => {
              return (
                <Option value={ele.value} key={ele.value}>
                  {ele.label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="开始到开始关系（SS）"
          name="SS"
          rules={[
            { required: true, message: "请选择开始到开始关系（SS）" },
            {
              validator: relactionCheck,
            },
          ]}
        >
          <Select placeholder="请选择">
            {itemRelationData.map((ele: any) => {
              return (
                <Option value={ele.value} key={ele.value}>
                  {ele.label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="开始到完成关系（SF）"
          name="SF"
          rules={[
            { required: true, message: "请选择开始到完成关系（SF）" },
            {
              validator: relactionCheck,
            },
          ]}
        >
          <Select placeholder="请选择">
            {itemRelationData.map((ele: any) => {
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
export default Relation;
