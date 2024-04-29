import { Select } from "antd";
import ChartEditorDrawer from "components/viz/editor/chart_editor_drawer";

const SimpleYAxisDrawer = ({ yAxis, setYAxis, axes, open, onClose }) => {
  return (
    <ChartEditorDrawer title="Vertical axis" open={open} onClose={onClose}>
      <p className="text-sm font-normal">Column</p>
      <Select
        placeholder="Select column"
        size="middle"
        className="w-full pb-4"
        showSearch
        options={axes}
        value={!yAxis.unparsed ? yAxis.name : undefined}
        onChange={(value) => {
          setYAxis({ name: value, unparsed: false });
        }}
      />
    </ChartEditorDrawer>
  );
};

export default SimpleYAxisDrawer;
