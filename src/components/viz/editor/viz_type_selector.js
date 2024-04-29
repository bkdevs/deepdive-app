import {
  AreaChartOutlined,
  BarChartOutlined,
  DotChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Select } from "antd";
import EditorActions from "components/viz/editor/editor_actions";
import { VizResponseContext } from "components/viz/viz_response";
import { useContext } from "react";

// maps from schema.VizType
const VIZ_TYPES = [
  {
    value: "table",
    label: (
      <span className="flex space-x-1">
        <TableOutlined />
        <span className="inline text-sm font-medium">Table</span>
      </span>
    ),
  },
  {
    value: "bar",
    label: (
      <span className="flex space-x-1">
        <BarChartOutlined />
        <span className="inline text-sm font-medium">Bar chart</span>
      </span>
    ),
  },
  {
    value: "line",
    label: (
      <span className="flex space-x-1">
        <LineChartOutlined />
        <span className="inline text-sm font-medium">Line chart</span>
      </span>
    ),
  },
  {
    value: "area",
    label: (
      <span className="flex space-x-1">
        <AreaChartOutlined />
        <span className="inline text-sm font-medium">Area chart</span>
      </span>
    ),
  },
  {
    value: "pie",
    label: (
      <span className="flex space-x-1">
        <PieChartOutlined />
        <span className="inline text-sm font-medium">Pie chart</span>
      </span>
    ),
  },
  {
    value: "scatter",
    label: (
      <span className="flex space-x-1">
        <DotChartOutlined />
        <span className="inline text-sm font-medium">Scatter chart</span>
      </span>
    ),
  },
];

const VizTypeSelector = ({ vizType, setVizType }) => {
  const { mode } = useContext(VizResponseContext);

  return (
    <div className="flex space-x-1">
      <Select
        value={vizType}
        className="w-9/12"
        options={VIZ_TYPES}
        onChange={(value) => setVizType(value)}
      />
      {mode === "edit" && (
        <div className="w-3/12">
          <EditorActions />
        </div>
      )}
    </div>
  );
};

export default VizTypeSelector;
