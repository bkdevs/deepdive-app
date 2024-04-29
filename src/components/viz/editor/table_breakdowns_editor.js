import { Button } from "antd";
import { useEffect, useState } from "react";
import update from "immutability-helper";

import { PlusOutlined } from "@ant-design/icons";
import BreakdownEditor from "components/viz/editor/breakdown_editor";
import BreakdownDrawer from "components/viz/editor/breakdown_drawer";
import { objectEmpty } from "components/viz/spec_helper";

const TableBreakdownsEditor = ({ breakdowns, setBreakdowns, axes }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newBreakdown, setNewBreakdown] = useState({});

  useEffect(() => {
    if (drawerOpen && !objectEmpty(newBreakdown)) {
      setBreakdowns([...breakdowns, newBreakdown]);
      setNewBreakdown({});
    }
  }, [newBreakdown, breakdowns, setBreakdowns, drawerOpen]);

  return (
    <>
      <div className="flex items-center">
        <p className="font-medium text-sm">Breakdowns</p>
        <div className="ml-auto text-[10px] font-subdued text-gray-700">
          Optional
        </div>
      </div>
      {breakdowns.map((breakdown, index) => (
        <BreakdownEditor
          key={index}
          breakdown={breakdown}
          setBreakdown={(breakdown) =>
            setBreakdowns(
              update(breakdowns, { [index]: { $merge: breakdown } }),
            )
          }
          removeBreakdown={() =>
            setBreakdowns(update(breakdowns, { $splice: [[index, 1]] }))
          }
          axes={axes}
        />
      ))}
      <div className="mt-2 content-start">
        <Button
          type="dashed"
          className="flex items-start"
          onClick={() => setDrawerOpen(true)}
          block
        >
          <div className="flex space-x-2">
            <PlusOutlined />
            <span>Add a field</span>
          </div>
        </Button>
      </div>
      <BreakdownDrawer
        breakdown={newBreakdown}
        setBreakdown={setNewBreakdown}
        axes={axes}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default TableBreakdownsEditor;
