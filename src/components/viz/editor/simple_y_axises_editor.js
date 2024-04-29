import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import SimpleYAxisDrawer from "components/viz/editor/simple_y_axis_drawer";
import SimpleYAxisEditor from "components/viz/editor/simple_y_axis_editor";
import { objectEmpty } from "components/viz/spec_helper";
import update from "immutability-helper";
import { useEffect, useState } from "react";

/**
 * Simple y axises editor for scatter chart limiting to a single y axis
 */
const SimpleYAxisesEditor = ({ yAxises, setYAxises, axes }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newYAxis, setNewYAxis] = useState({});

  useEffect(() => {
    if (!drawerOpen && !objectEmpty(newYAxis)) {
      setYAxises([...yAxises, newYAxis]);
      setNewYAxis({});
    }
  }, [newYAxis, yAxises, setYAxises, drawerOpen]);

  return (
    <>
      <div>
        <p className="font-medium text-sm">Vertical axis</p>
      </div>
      {yAxises.length === 1 && (
        <SimpleYAxisEditor
          yAxis={yAxises[0]}
          setYAxis={(yAxis) =>
            setYAxises(update(yAxises, { 0: { $merge: yAxis } }))
          }
          removeYAxis={() => setYAxises(update(yAxises, { $splice: [[0, 1]] }))}
          axes={axes}
        />
      )}
      {yAxises.length === 0 && (
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
      )}
      <SimpleYAxisDrawer
        yAxis={newYAxis}
        setYAxis={setNewYAxis}
        axes={axes}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default SimpleYAxisesEditor;
