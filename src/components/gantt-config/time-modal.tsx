import React, { useEffect, useContext, useState } from "react";
import { Modal, Form, Select } from "antd";
import { ConfigHandleContext } from "../../contsxt";
import { TimeItemProps, FieldAndItemProps } from "../../types/public-types";
import styles from "./index.module.css";
import { find, omit } from "lodash";
import { OptionData, OptionGroupData } from "rc-select/lib/interface";
import useI18n from "../../lib/hooks/useI18n";
const { Option } = Select;

const filterOption = (
  input: string,
  option: OptionData | OptionGroupData | undefined
): boolean => {
  return option?.name?.toLowerCase().indexOf(input?.toLowerCase()) > -1;
};
// 筛选某一类型的字段
export const filterFields = (
  type: string,
  customField: FieldAndItemProps[]
) => {
  return customField.filter((ele: FieldAndItemProps) => {
    return ele?.fieldType?.key === type;
  });
};
// 过滤不存在的字段
export const filterDeleteFields = (
  id: string | undefined,
  customField: FieldAndItemProps[]
) => {
  const filterData = find(customField, { objectId: id });
  return filterData ? filterData.objectId : null;
};
interface ItemModalProps {
  visible: boolean;
  handleCancel: () => void;
  handleOk: (values: TimeItemProps) => void;
  currentItem: TimeItemProps;
  timeList?: TimeItemProps[];
}
const ItemModal: React.FC<ItemModalProps> = ({
  visible,
  handleCancel,
  handleOk,
  currentItem,
  timeList,
}) => {
  const { t } = useI18n();
  const [form] = Form.useForm();
  const { itemTypeData, getCustomFields } = useContext(ConfigHandleContext);
  // 设置isSelected变量，避免切换事项类型变化时引起form.setFieldsValue触发
  const [isSelected, setIsSelected] = useState(false);
  const [customField, setCustomField] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  // 筛选字段类型为日期和数值的字段
  useEffect(() => {
    if (visible) {
      if (isSelected) {
        return;
      }
      form.resetFields();
      form.setFieldsValue({
        endDate: filterDeleteFields(currentItem.endDate, customField),
        itemType: filterDeleteFields(`${currentItem.itemType}`, itemTypeData),
        percentage: filterDeleteFields(currentItem.percentage, customField),
        startDate: filterDeleteFields(currentItem.startDate, customField),
        isDefault: currentItem.isDefault,
      });
    }
  }, [visible, currentItem, form, customField, itemTypeData, isSelected]);
  useEffect(() => {
    const fetch = async (currentItem: TimeItemProps) => {
      const fields = await getCustomFields(currentItem);
      setCustomField(fields);
    };
    if (visible) {
      fetch(currentItem);
    }
  }, [visible, getCustomFields, currentItem]);
  useEffect(() => {
    if (!visible) {
      setIsSelected(false);
    }
  }, [visible]);
  const handleConfirm = () => {
    form
      .validateFields()
      .then(async values => {
        // 保存时对已经删除的字段清空处理
        const fields = await getCustomFields(currentItem);
        Object.keys(omit(values, ["itemType"])).forEach(ele => {
          const fileldFilter = fields.filter(
            (f: FieldAndItemProps) => f.objectId === values[ele]
          );
          if (!fileldFilter.length) {
            const obj = {};
            obj[ele] = null;
            form.setFieldsValue(obj);
          }
        });
        form.validateFields().then(async () => {
          setConfirmLoading(true);
          await handleOk(values);
          setConfirmLoading(false);
        });
      })
      .catch(info => {
        console.log("Validate Failed:", info);
      });
  };
  const itemCheck = (_: any, value: string) => {
    if (value) {
      const itemFilter = timeList?.filter(item => item.itemType === value);
      if (itemFilter?.length && currentItem.itemType !== value) {
        return Promise.reject(
          new Error(`${t("errorMessage.itemTypeAlreadyExists")}`)
        );
      }
      return Promise.resolve();
    } else {
      return Promise.resolve();
    }
  };
  const handelChange = async (val: string) => {
    setIsSelected(true);
    const fields = await getCustomFields({ itemType: val });
    setCustomField(fields);
    form.setFieldsValue({
      startDate: undefined,
      endDate: undefined,
      percentage: undefined,
    });
  };
  return (
    <Modal
      title={t("configuration.timeFieldConfiguration.timeFieldConfiguration")}
      visible={visible}
      onOk={handleConfirm}
      onCancel={handleCancel}
      cancelText={t("global.cancle")}
      okText={t("global.complete")}
      confirmLoading={confirmLoading}
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
            label={t("configuration.timeFieldConfiguration.itemType")}
            name="itemType"
            rules={[
              {
                required: true,
                message: t("errorMessage.mattersTypeError"),
              },
              {
                validator: itemCheck,
              },
            ]}
          >
            <Select
              placeholder={t("placeholder.pleaseSelect")}
              onChange={handelChange}
            >
              {itemTypeData.map((ele: FieldAndItemProps) => {
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
          label={t("configuration.timeFieldConfiguration.startTime")}
          name="startDate"
          rules={[
            { required: true, message: t("errorMessage.startTimeError") },
          ]}
        >
          {/* 代码没有抽离，原因是会影响from的校验触发 */}
          <Select
            placeholder="请选择"
            showSearch
            filterOption={filterOption}
            allowClear
          >
            {filterFields("Date", customField).map((ele: FieldAndItemProps) => {
              return (
                <Option value={ele.value} key={ele.value} name={ele.label}>
                  {ele.label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label={t("configuration.timeFieldConfiguration.endTime")}
          name="endDate"
          rules={[{ required: true, message: t("errorMessage.endTimeError") }]}
        >
          <Select
            placeholder="请选择"
            allowClear
            showSearch
            filterOption={filterOption}
          >
            {filterFields("Date", customField).map((ele: FieldAndItemProps) => {
              return (
                <Option value={ele.value} key={ele.value} name={ele.label}>
                  {ele.label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label={t(
            "configuration.timeFieldConfiguration.percentageOfCompletion"
          )}
          name="percentage"
        >
          <Select
            placeholder="请选择"
            allowClear
            showSearch
            filterOption={filterOption}
          >
            {filterFields("Number", customField).map(
              (ele: FieldAndItemProps) => {
                return (
                  <Option value={ele.value} key={ele.value} name={ele.label}>
                    {ele.label}
                  </Option>
                );
              }
            )}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ItemModal;
