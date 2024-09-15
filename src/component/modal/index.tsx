import React, {
  Children,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import Dialog from "rc-dialog";
import "rc-dialog/assets/index.css";
import classNames from "classnames";

interface ModalProps {
  title?: String | React.ReactElement | undefined;
  content?: string | React.ReactNode | undefined;
  className?: string;
  style?: Object;
  closeIcon?: React.ReactNode;
  onClose?: () => void;
  width?: number;
  closable?: boolean;
  comeBack?: string;
  titleBack?: string;
  img?: string;
  routerBack?: string;
  children?: any;
}
export interface PopUpRef {
  open?: () => void;
  onCloseModal: () => void;
}
const ModalMessage = React.forwardRef<PopUpRef, ModalProps>((props, ref) => {
  const { className, title, width = 400, onClose, children } = props;
  const [visible, setVisible] = useState(false);
  const open = () => {
    setVisible(true);
  };

  useImperativeHandle(ref, () => ({ open, onCloseModal }));
  const onCloseModal = () => {
    setVisible(false);
    onClose && onClose();
  };

  return (
    <Dialog
      visible={visible}
      width={width}
      wrapClassName={classNames(className)}
      animation=""
      onClose={onCloseModal}
      keyboard={false}
      destroyOnClose={true}
    >
      <h2>{title}</h2>
      {children}
    </Dialog>
  );
});
ModalMessage.displayName = "ModalMessage";
export default ModalMessage;
