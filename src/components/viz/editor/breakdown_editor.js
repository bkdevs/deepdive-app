import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import BreakdownDrawer from "components/viz/editor/breakdown_drawer";
import { objectsEqual } from "components/viz/spec_helper";
import { useState, useEffect } from "react";

const BreakdownEditor = ({
  breakdown,
  setBreakdown,
  removeBreakdown,
  axes,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [updatedBreakdown, setUpdatedBreakdown] = useState(breakdown);

  useEffect(() => {
    if (!drawerOpen && !objectsEqual(breakdown, updatedBreakdown)) {
      setBreakdown(updatedBreakdown);
    }
  }, [updatedBreakdown, breakdown, setBreakdown, drawerOpen]);

  return (
    <>
      <div className="mt-2 content-start">
        <Button
          type="default"
          className="flex items-start align-middle"
          onClick={() => setDrawerOpen(true)}
          block
        >
          <span className="truncate">{updatedBreakdown.name}</span>
          <Button
            size="small"
            icon={<DeleteOutlined />}
            className="ml-auto"
            type="text"
            onClick={(e) => {
              e.stopPropagation();
              removeBreakdown();
            }}
          />
        </Button>
      </div>
      <BreakdownDrawer
        breakdown={updatedBreakdown}
        setBreakdown={setUpdatedBreakdown}
        axes={axes}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default BreakdownEditor;
