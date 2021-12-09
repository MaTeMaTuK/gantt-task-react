import React, { useEffect, useContext, useState } from "react";
import { Modal, Form, Select } from "antd";
import { ConfigHandleContext } from "../../contsxt";
import { TimeItemProps } from "../../types/public-types";
import styles from "./index.module.css";
import { find } from "lodash";
const { Option } = Select;
const filterOption = (input: any, option: any) => {
  return option?.children?.toLowerCase().indexOf(input?.toLowerCase()) > -1;
};
// 筛选某一类型的字段
export const filterFields = (type: string, customeFieldData: any) => {
  return customeFieldData.filter((ele: any) => {
    return ele?.fieldType?.key === type;
  });
};
// 过滤不存在的字段
export const filterDeleteFields = (
  id: string | undefined,
  customeFieldData: any
) => {
  const filterData = find(customeFieldData, { objectId: id });
  return filterData ? filterData.objectId : null;
};
interface ItemModalProps {
  visible: boolean;
  handleCancel: () => void;
  handleOk: (values: any) => void;
  currentItem: TimeItemProps;
  timeList?: TimeItemProps[];
  itemTypeChange: (value: string) => void;
}
const ItemModal: React.FC<ItemModalProps> = ({
  visible,
  handleCancel,
  handleOk,
  currentItem,
  timeList,
  itemTypeChange,
}) => {
  const [form] = Form.useForm();
  const { itemTypeData, customeFieldData } = useContext(ConfigHandleContext);
  // 设置isSelected变量，避免切换事项类型变化时引起form.setFieldsValue触发
  const [isSelected, setIsSelected] = useState(false);
  // 筛选字段类型为日期和数值的字段
  useEffect(() => {
    if (visible) {
      if (isSelected) {
        return;
      }
      form.resetFields();
      form.setFieldsValue({
        endDate: filterDeleteFields(currentItem.endDate, customeFieldData),
        itemType: filterDeleteFields(`${currentItem.itemType}`, itemTypeData),
        percentage: filterDeleteFields(
          currentItem.percentage,
          customeFieldData
        ),
        startDate: filterDeleteFields(currentItem.startDate, customeFieldData),
        isDefault: currentItem.isDefault,
      });
    }
  }, [visible, currentItem, form, customeFieldData, itemTypeData, isSelected]);
  useEffect(() => {
    if (!visible) {
      setIsSelected(false);
    }
  }, [visible]);
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
  const itemCheck = (_: any, value: any) => {
    if (value) {
      const itemFilter = timeList?.filter(item => item.itemType === value);
      if (itemFilter?.length && currentItem.itemType !== value) {
        return Promise.reject(new Error("该事项类型已选择， 请重新选择"));
      }
      return Promise.resolve();
    } else {
      return Promise.resolve();
    }
  };
  const handelChange = (val: string) => {
    setIsSelected(true);
    itemTypeChange(val);
    form.setFieldsValue({
      startDate: undefined,
      endDate: undefined,
      percentage: undefined,
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
        {!currentItem?.isDefault && (
          <Form.Item
            label="事项类型"
            name="itemType"
            rules={[
              { required: true, message: "请选择事项类型" },
              {
                validator: itemCheck,
              },
            ]}
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
        )}

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
            {filterFields("Date", customeFieldData).map((ele: any) => {
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
          <Select
            placeholder="请选择"
            allowClear
            showSearch
            filterOption={filterOption}
          >
            {filterFields("Date", customeFieldData).map((ele: any) => {
              return (
                <Option value={ele.value} key={ele.value}>
                  {ele.label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="完成占比" name="percentage">
          <Select
            placeholder="请选择"
            allowClear
            showSearch
            filterOption={filterOption}
          >
            {filterFields("Number", customeFieldData).map((ele: any) => {
              return (
                <Option value={ele.value} key={ele.value}>
                  {ele.label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ItemModal;
