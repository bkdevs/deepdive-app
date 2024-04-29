import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import YAxisDrawer from "components/viz/editor/y_axis_drawer";
import YAxisEditor from "components/viz/editor/y_axis_editor";
import { objectEmpty } from "components/viz/spec_helper";
import update from "immutability-helper";
import { useEffect, useState } from "react";

const YAxisesEditor = ({ yAxises, setYAxises, axes }) => {
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
      {yAxises.map((yAxis, index) => (
        <YAxisEditor
          key={index}
          yAxis={yAxis}
          setYAxis={(yAxis) =>
            setYAxises(update(yAxises, { [index]: { $merge: yAxis } }))
          }
          removeYAxis={() =>
            setYAxises(update(yAxises, { $splice: [[index, 1]] }))
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
      <YAxisDrawer
        yAxis={newYAxis}
        setYAxis={setNewYAxis}
        axes={axes}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default YAxisesEditor;
