import React from "react";
import { TimeItemProps, FieldAndItemProps } from "../../types/public-types";
export declare const filterFields: (type: string, customField: FieldAndItemProps[]) => FieldAndItemProps[];
export declare const filterDeleteFields: (id: string | undefined, customField: FieldAndItemProps[]) => string | null | undefined;
interface ItemModalProps {
    visible: boolean;
    handleCancel: () => void;
    handleOk: (values: TimeItemProps) => void;
    currentItem: TimeItemProps;
    timeList?: TimeItemProps[];
}
declare const ItemModal: React.FC<ItemModalProps>;
export default ItemModal;
