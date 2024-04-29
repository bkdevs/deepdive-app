import { QuestionCircleOutlined } from "@ant-design/icons";
import { Input, Segmented, Select, Tooltip } from "antd";
import ChartEditorDrawer from "components/viz/editor/chart_editor_drawer";
import InlineSqlEditor from "components/viz/editor/inline_sql_editor";
import {
  YAxisAggregate,
  YAxisComputedColumn,
} from "components/viz/editor/y_axis_drawer";
import { useEffect, useState } from "react";

const COLUMN_TYPES = [
  { value: "field", label: "Field" },
  { value: "computed", label: "Computed column" },
];

const ColumnField = ({ yAxis, setYAxis, axes }) => {
  return (
    <>
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
    </>
  );
};

const ColumnComputed = ({ yAxis, setYAxis }) => {
  return (
    <>
      <p className="text-sm font-normal">Name</p>
      <div className="pb-2">
        <Input
          placeholder="value..."
          value={yAxis.alias}
          onChange={(e) => setYAxis({ ...yAxis, alias: e.target.value })}
        />
      </div>
      <div className="flex">
        <div className="text-sm font-normal">Formula</div>
        <div className="ml-auto">
          <Tooltip title="Any valid SQL expression is supported. e.g, where field1 = 'foo' or field2 = 'bar'">
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
      </div>
      <div className="pb-2">
        <InlineSqlEditor
          name="yaxis-formula-sql-editor"
          value={yAxis.unparsed ? yAxis.name : ""}
          setValue={(value) =>
            setYAxis({ ...yAxis, unparsed: true, name: value })
          }
        />
      </div>
    </>
  );
};

const ColumnDrawer = ({ yAxis, setYAxis, axes, hasGroupBy, open, onClose }) => {
  const [columnType, setColumnType] = useState("field");

  // reset which tab is active upon drawer close
  useEffect(() => {
    if (!open) {
      setColumnType(yAxis?.unparsed ? "computed" : "field");
    }
    // eslint-disable-next-line
  }, [open, setColumnType]);

  let content;
  if (columnType === "field" && hasGroupBy) {
    content = <YAxisAggregate yAxis={yAxis} setYAxis={setYAxis} axes={axes} />;
  } else if (columnType === "field" && !hasGroupBy) {
    content = <ColumnField yAxis={yAxis} setYAxis={setYAxis} axes={axes} />;
  } else if (columnType === "computed" && hasGroupBy) {
    content = <YAxisComputedColumn yAxis={yAxis} setYAxis={setYAxis} />;
  } else if (columnType === "computed" && !hasGroupBy) {
    content = <ColumnComputed yAxis={yAxis} setYAxis={setYAxis} />;
  }

  return (
    <ChartEditorDrawer title="Table column" open={open} onClose={onClose}>
      <p className="text-sm font-normal">Type</p>
      <Segmented
        size="default"
        options={COLUMN_TYPES}
        value={columnType}
        onChange={setColumnType}
      />
      <div className="pb-4" />
      {content}
    </ChartEditorDrawer>
  );
};

export default ColumnDrawer;
