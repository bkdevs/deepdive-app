import { DownOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Dropdown, Input, Radio, Segmented, Select, Tooltip } from "antd";
import ChartEditorDrawer from "components/viz/editor/chart_editor_drawer";
import InlineSqlEditor from "components/viz/editor/inline_sql_editor";
import { getColumnType } from "components/viz/spec_helper";
import useSessionContext from "hooks/use_session_context";
import { useEffect, useState } from "react";

const X_AXIS_TYPES = [
  { value: "field", label: "Field" },
  { value: "computed", label: "Computed field" },
];

const RADIO_TIME_UNITS = ["day", "week", "month", "year"];
const OTHER_TIME_UNITS = [
  {
    key: "second",
    label: "Second",
  },
  {
    key: "minute",
    label: "Minute",
  },
  {
    key: "hour",
    label: "Hour",
  },
  {
    key: "hour_of_day",
    label: "Hour of day",
  },
  {
    key: "day_of_week",
    label: "Day of week",
  },
  {
    key: "day_of_month",
    label: "Day of month",
  },
  {
    key: "month_of_year",
    label: "Month of year",
  },
  {
    key: "week_of_year",
    label: "Week of year",
  },
  {
    key: "week_of_year_long",
    label: "Week of year qualified",
  },
];
const OTHER_TIME_UNITS_LABELS = Object.fromEntries(
  OTHER_TIME_UNITS.map((entry) => [entry.key, entry.label]),
);

const timeUnitRadioValue = (timeUnit) => {
  if (timeUnit) {
    return RADIO_TIME_UNITS.includes(timeUnit) ? timeUnit : "other";
  }
  return undefined;
};

const XAxisDatetimeBinner = ({ xAxis, setXAxis }) => {
  const timeUnit = xAxis?.binner?.time_unit;
  const setTimeUnit = (timeUnit) =>
    setXAxis({
      ...xAxis,
      binner: {
        binner_type: "datetime",
        time_unit: timeUnit,
      },
    });

  return (
    <div className="pb-4">
      <p className="text-sm font-normal">Time unit</p>
      <Radio.Group
        value={timeUnitRadioValue(timeUnit)}
        size="middle"
        optionType="button"
        onChange={(e) =>
          RADIO_TIME_UNITS.includes(e.target.value) &&
          setTimeUnit(e.target.value)
        }
      >
        <Radio.Button value={"day"}>Day</Radio.Button>
        <Radio.Button value={"week"}>Week</Radio.Button>
        <Radio.Button value={"month"}>Month</Radio.Button>
        <Radio.Button value={"year"}>Year</Radio.Button>
        <Dropdown
          menu={{
            items: OTHER_TIME_UNITS,
            onClick: ({ key }) => {
              setTimeUnit(key);
            },
          }}
        >
          <Radio.Button value={"other"}>
            {OTHER_TIME_UNITS_LABELS[timeUnit]}
            <DownOutlined />
          </Radio.Button>
        </Dropdown>
      </Radio.Group>
    </div>
  );
};

const XAxisDomainSelector = ({ xAxis, setXAxis }) => {
  const domain = xAxis?.domain || ["", ""];
  const setDomain = (domain) => {
    setXAxis({
      ...xAxis,
      domain: domain,
    });
  };

  return (
    <div>
      <p className="text-sm font-normal">Domain</p>
      <div
        style={{
          display: "inline-block",
          width: "calc(50% - 8px)",
          marginBottom: "0px",
        }}
      >
        <span>Start</span>
        <Input
          placeholder="start..."
          value={domain[0]}
          onChange={(e) => setDomain([e.target.value, domain[1]])}
        />
      </div>
      <div
        style={{
          display: "inline-block",
          width: "calc(50% - 8px)",
          margin: "0 8px",
        }}
      >
        <span>End</span>
        <Input
          placeholder="end..."
          value={domain[1]}
          onChange={(e) => setDomain([domain[0], e.target.value])}
        />
      </div>
    </div>
  );
};

const XAxisField = ({ xAxis, setXAxis, axes }) => {
  const { databaseSchema } = useSessionContext();
  const xAxisType = getColumnType(databaseSchema, xAxis.name);
  const isDatetime = xAxisType === "date" || xAxisType === "time";

  return (
    <>
      <p className="text-sm font-normal">Column</p>
      <Select
        placeholder="Select column"
        size="middle"
        className="w-full pb-4"
        showSearch
        options={axes}
        value={xAxis.unparsed ? undefined : xAxis.name}
        onChange={(value) => setXAxis({ name: value })}
      />
      {isDatetime && <XAxisDatetimeBinner xAxis={xAxis} setXAxis={setXAxis} />}
      <XAxisDomainSelector xAxis={xAxis} setXAxis={setXAxis} />
    </>
  );
};

const XAxisComputedColumn = ({ xAxis, setXAxis }) => {
  return (
    <>
      <p className="text-sm font-normal">Name</p>
      <div className="pb-2">
        <Input
          placeholder="value..."
          value={xAxis.alias}
          onChange={(e) => setXAxis({ ...xAxis, alias: e.target.value })}
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
          name="xaxis-formula-sql-editor"
          value={xAxis.unparsed ? xAxis.name : ""}
          setValue={(value) =>
            setXAxis({ ...xAxis, unparsed: true, name: value })
          }
        />
      </div>
      <XAxisDomainSelector xAxis={xAxis} setXAxis={setXAxis} />
    </>
  );
};

const XAxisDrawer = ({ xAxis, setXAxis, axes, open, onClose }) => {
  const [xAxisType, setXAxisType] = useState("field");
  useEffect(() => {
    if (!open) {
      setXAxisType(xAxis?.unparsed ? "computed" : "field");
    }
    // eslint-disable-next-line
  }, [open, setXAxisType]);

  return (
    <ChartEditorDrawer title="Horizontal axis" open={open} onClose={onClose}>
      <p className="text-sm font-normal">Type</p>
      <Segmented
        size="default"
        options={X_AXIS_TYPES}
        value={xAxisType}
        onChange={setXAxisType}
      />
      <div className="pb-4" />
      {xAxisType === "field" ? (
        <XAxisField xAxis={xAxis} setXAxis={setXAxis} axes={axes} />
      ) : (
        <XAxisComputedColumn xAxis={xAxis} setXAxis={setXAxis} />
      )}
    </ChartEditorDrawer>
  );
};

export default XAxisDrawer;
