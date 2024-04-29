import { Drawer } from "antd";

const ChartEditorDrawer = ({ title, open, onClose, children }) => {
  return (
    <Drawer
      title={title}
      placement="right"
      width="25%"
      onClose={onClose}
      open={open}
      closable={false}
      maskStyle={{ opacity: 0.4 }}
      getContainer={false}
    >
      {children}
    </Drawer>
  );
};

export default ChartEditorDrawer;
