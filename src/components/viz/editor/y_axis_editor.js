import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import YAxisDrawer from "components/viz/editor/y_axis_drawer";
import { getYAxisText, objectsEqual } from "components/viz/spec_helper";
import { useEffect, useState } from "react";

const YAxisEditor = ({ yAxis, setYAxis, removeYAxis, axes }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [updatedYAxis, setUpdatedYAxis] = useState(yAxis);

  useEffect(() => {
    if (!drawerOpen && !objectsEqual(yAxis, updatedYAxis)) {
      setYAxis(updatedYAxis);
    }
  }, [updatedYAxis, yAxis, setYAxis, drawerOpen]);

  return (
    <>
      <div className="mt-2 content-start">
        <Button
          type="default"
          className="flex items-start align-middle"
          onClick={() => setDrawerOpen(true)}
          block
        >
          <span className="truncate">{getYAxisText(updatedYAxis)}</span>
          <Button
            size="small"
            icon={<DeleteOutlined />}
            className="ml-auto"
            type="text"
            onClick={(e) => {
              e.stopPropagation();
              removeYAxis();
            }}
          />
        </Button>
      </div>
      <YAxisDrawer
        yAxis={updatedYAxis}
        setYAxis={setUpdatedYAxis}
        axes={axes}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default YAxisEditor;
