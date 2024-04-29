import { Select } from "antd";
import ChartEditorDrawer from "components/viz/editor/chart_editor_drawer";

const BreakdownDrawer = ({ breakdown, setBreakdown, axes, open, onClose }) => {
  return (
    <ChartEditorDrawer title="Breakdown" open={open} onClose={onClose}>
      <p className="text-sm font-normal">Column</p>
      <Select
        placeholder="Select column"
        size="middle"
        className="w-full pb-4"
        showSearch
        options={axes}
        value={breakdown.name}
        onChange={(value) => setBreakdown({ name: value })}
      />
    </ChartEditorDrawer>
  );
};

export default BreakdownDrawer;
