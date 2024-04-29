import { ExpandAltOutlined } from "@ant-design/icons";
import { Button } from "antd";

const ZoomOutButton = ({ resetDomain }) => {
  return (
    <div className="w-18">
      <Button
        icon={<ExpandAltOutlined />}
        size="small"
        type="text"
        onClick={() => resetDomain()}
      />
    </div>
  );
};
export default ZoomOutButton;
