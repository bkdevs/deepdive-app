import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import XAxisDrawer from "components/viz/editor/x_axis_drawer";
import {
  getXAxisText,
  objectEmpty,
  objectsEqual,
} from "components/viz/spec_helper";
import { useEffect, useState } from "react";

/**
 * Explanation of state:
 * XAxisEditor is _not_ the only component to modify spec.x_axis: zooming a graph in/out modifies the XAxis as well
 * see: ChartView and getSetDomain
 *
 * That makes things difficult, because we are unsure of whether an edit we make (diff between updatedXAxis and xAxis)
 * is because:
 *  1. a change was made to updatedXAxis
 *  2. a change was made to xAxis (through zoom)
 *
 * so, to figure out which is which, we have a variable baseXAxis that is kept consistent with zoom changes
 * and we use that to diff against updatedXAxis
 */
const XAxisEditor = ({ xAxis, setXAxis, axes }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [baseXAxis, setBaseXAxis] = useState(xAxis);
  const [updatedXAxis, setUpdatedXAxis] = useState(xAxis || {});

  useEffect(() => {
    if (xAxis) {
      setBaseXAxis(xAxis);
      setUpdatedXAxis(xAxis);
    }
  }, [xAxis]);

  useEffect(() => {
    if (drawerOpen) {
      return;
    }

    if (!baseXAxis && !objectEmpty(updatedXAxis)) {
      setXAxis(updatedXAxis);
    }
    if (baseXAxis && objectEmpty(updatedXAxis)) {
      setXAxis(undefined);
    } else if (baseXAxis && !objectsEqual(baseXAxis, updatedXAxis)) {
      setXAxis(updatedXAxis);
    }
  }, [baseXAxis, updatedXAxis, setXAxis, drawerOpen]);

  return (
    <>
      <div>
        <p className="font-medium text-sm">Horizonal axis</p>
      </div>
      <div className="mt-2 content-start">
        {!objectEmpty(updatedXAxis) ? (
          <Button
            type="default"
            className="flex items-start align-middle"
            onClick={() => setDrawerOpen(true)}
            block
          >
            <span className="truncate">{getXAxisText(updatedXAxis)}</span>
            <Button
              size="small"
              icon={<DeleteOutlined />}
              className="ml-auto"
              type="text"
              onClick={(e) => {
                e.stopPropagation();
                setUpdatedXAxis({});
              }}
            />
          </Button>
        ) : (
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
        )}
      </div>
      <XAxisDrawer
        xAxis={updatedXAxis}
        setXAxis={setUpdatedXAxis}
        axes={axes}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default XAxisEditor;
