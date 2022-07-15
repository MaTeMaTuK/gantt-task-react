import React from "react";
import { BaselineProps } from "../../../types/public-types";
interface ModalProps {
    visible: boolean;
    handleOk: (value: BaselineProps) => void;
    handleCancel: () => void;
    currentBaseline: BaselineProps;
}
export declare const AddEdit: React.FC<ModalProps>;
export default AddEdit;
