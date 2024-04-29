import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import ColumnDrawer from "components/viz/editor/column_drawer";
import ColumnEditor from "components/viz/editor/column_editor";
import { objectEmpty } from "components/viz/spec_helper";
import update from "immutability-helper";
import { useEffect, useState } from "react";

const ColumnsEditor = ({ yAxises, setYAxises, axes, hasTableBreakdowns }) => {
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
        <p className="font-medium text-sm">Columns</p>
      </div>
      {yAxises.map((yAxis, index) => (
        <ColumnEditor
          key={index}
          yAxis={yAxis}
          setYAxis={(yAxis) =>
            setYAxises(update(yAxises, { [index]: { $merge: yAxis } }))
          }
          removeYAxis={() =>
            setYAxises(update(yAxises, { $splice: [[index, 1]] }))
          }
          axes={axes}
          hasTableBreakdowns={hasTableBreakdowns}
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
      <ColumnDrawer
        yAxis={newYAxis}
        setYAxis={setNewYAxis}
        axes={axes}
        hasGroupBy={hasTableBreakdowns}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default ColumnsEditor;
