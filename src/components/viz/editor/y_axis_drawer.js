import { QuestionCircleOutlined } from "@ant-design/icons";
import { Input, Segmented, Select, Tooltip } from "antd";
import ChartEditorDrawer from "components/viz/editor/chart_editor_drawer";
import InlineSqlEditor from "components/viz/editor/inline_sql_editor";
import { useEffect, useState } from "react";

const Y_AXIS_TYPES = [
  { value: "aggregate", label: "Aggregate" },
  { value: "computed", label: "Computed column" },
];

const YAxisAggregateFunction = ({ yAxis, setYAxis, optional }) => {
  const aggregation = yAxis?.aggregation;
  const setAggregation = (aggregation) =>
    setYAxis({
      ...yAxis,
      aggregation: aggregation,
    });

  return (
    <div>
      <div className="flex">
        <div className="text-sm font-normal">Function</div>
        {optional && (
          <div className="ml-auto text-xs font-subdued text-gray-700">
            Optional
          </div>
        )}
      </div>
      <Select
        placeholder="Select an aggregation function"
        options={[
          { value: "COUNT", label: "COUNT" },
          { value: "SUM", label: "SUM" },
          { value: "AVG", label: "AVG" },
          { value: "MIN", label: "MIN" },
          { value: "MAX", label: "MAX" },
        ]}
        className="w-full"
        value={aggregation}
        onChange={(value) => setAggregation(value)}
        allowClear={optional}
      />
    </div>
  );
};

export const YAxisAggregate = ({ yAxis, setYAxis, axes }) => {
  const isAggregate =
    !yAxis.unparsed && axes.some((axe) => axe.value === yAxis?.name);

  return (
    <>
      <p className="text-sm font-normal">Column</p>
      <Select
        placeholder="Select column"
        size="middle"
        className="w-full pb-4"
        showSearch
        options={axes}
        value={isAggregate ? yAxis.name : undefined}
        onChange={(value) => {
          const defaultAggregate = value === "*" ? "COUNT" : "SUM";
          setYAxis({
            name: value,
            aggregation: defaultAggregate,
            unparsed: false,
          });
        }}
      />
      {isAggregate && (
        <YAxisAggregateFunction
          yAxis={yAxis}
          setYAxis={setYAxis}
          optional={false}
        />
      )}
    </>
  );
};

export const YAxisComputedColumn = ({ yAxis, setYAxis }) => {
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
      <YAxisAggregateFunction
        yAxis={yAxis}
        setYAxis={setYAxis}
        optional={true}
      />
    </>
  );
};

const YAxisDrawer = ({ yAxis, setYAxis, axes, open, onClose }) => {
  const [yAxisType, setYAxisType] = useState("aggregate");

  // reset which tab is active upon drawer close
  useEffect(() => {
    if (!open) {
      setYAxisType(yAxis?.unparsed ? "computed" : "aggregate");
    }
    // eslint-disable-next-line
  }, [open, setYAxisType]);

  return (
    <ChartEditorDrawer title="Vertical axis" open={open} onClose={onClose}>
      <p className="text-sm font-normal">Type</p>
      <Segmented
        size="default"
        options={Y_AXIS_TYPES}
        value={yAxisType}
        onChange={setYAxisType}
      />
      <div className="pb-4" />
      {yAxisType === "aggregate" ? (
        <YAxisAggregate yAxis={yAxis} setYAxis={setYAxis} axes={axes} />
      ) : (
        <YAxisComputedColumn yAxis={yAxis} setYAxis={setYAxis} />
      )}
    </ChartEditorDrawer>
  );
};

export default YAxisDrawer;
