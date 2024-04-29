import { getXAxisText, getYAxisText } from "components/viz/spec_helper";
import moment from "moment";
import { ReferenceArea } from "recharts";

/**
 * Note: for some reason, you can't extract the inner chart or chart components in a ResponsiveContainer
 * e.g,
 * <ResponsiveContainer>
 *   <LineChart />
 * <ResponsiveContainer />
 *
 * into a separate component without it breaking the component
 * e.g,
 * <ResponsiveContainer>
 *   <MyLineChart />
 * <ResponsiveContainer />
 *
 * So instead of composition, we define const variables and expose props for chart layout here
 */
export const CHART_WIDTH = "100%";
export const CHART_HEIGHT = 475;
export const CHART_MARGIN = {
  top: 5,
  right: 0,
  left: 0,
  bottom: 0,
};

export const getXAxisProps = (schema, spec) => ({
  label: {
    value: getXAxisText(spec.x_axis),
    position: "insideBottomRight",
    offset: 0,
  },
  dataKey: resolveAlias(spec.x_axis),
  tickFormatter: dateFormatter(schema, spec),
});

export const computeYAxisDomain = (dataMin, dataMax) => {
  let min = dataMin * 0.8;
  if (dataMin < 0) {
    min = dataMin * 1.1;
  }
  let max = dataMax * 1.1;

  if (dataMin < 10 && dataMax > 100) {
    min = 0;
  }
  if (dataMax < 0.0001) {
    return [min, max];
  }
  if (dataMin > -1 && dataMax < 1) {
    return [min.toFixed(2), max.toFixed(2)];
  }
  if (dataMax < 1) {
    return [dataMin, dataMax];
  }
  return [Math.round(min), Math.round(max)];
};

export const getYAxisProps = (schema, spec) => {
  return {
    label: {
      value: getYAxisText(spec?.y_axises[0]), // choose first y-axis as label if there are many
      position: "top",
      offset: 50,
    },
    type: "number",
    domain: ([dataMin, dataMax]) => computeYAxisDomain(dataMin, dataMax),
    allowDataOverflow: true,
  };
};

export const resolveAlias = (axis) => {
  return axis?.alias || axis?.name;
};

export const getTooltipProps = (schema, spec) => ({
  content: <DeepDiveTooltip spec={spec} />,
});

const renderYAxisTooltipWithBreakdown = (
  yAxis,
  alias,
  entries,
  entriesToColors,
) => {
  return (
    <div key={alias} className="pt-2">
      <p className="text-xs font-medium">{getYAxisText(yAxis)}</p>
      {entries &&
        Object.entries(entries).map(([key, value]) => (
          <p key={key}>
            <span className="inline"> - </span>
            <span className="inline" style={{ color: entriesToColors[key] }}>
              {key}:{" "}
            </span>
            <span className="inline">{value}</span>
          </p>
        ))}
    </div>
  );
};

const renderYAxisTooltip = (yAxis, dataRow, entriesToColors) => {
  const alias = resolveAlias(yAxis);
  const entries = dataRow[alias];

  if (typeof entries === "object") {
    return renderYAxisTooltipWithBreakdown(
      yAxis,
      alias,
      entries,
      entriesToColors,
    );
  } else {
    return (
      <div key={alias} className="text-xs">
        <span className="inline"> - </span>
        <span className="inline" style={{ color: entriesToColors[entries] }}>
          {getYAxisText(yAxis)}:{" "}
        </span>
        <span className="inline">{entries}</span>
      </div>
    );
  }
};

const getEntriesToColors = (payload) => {
  const entriesToColors = {};
  for (const entry of payload) {
    if (entry.name.includes(".")) {
      entriesToColors[entry.name.split(".")[1]] = entry.color;
    } else {
      entriesToColors[entry.name] = entry.color;
    }
  }
  return entriesToColors;
};

const DeepDiveTooltip = ({ spec, active, payload, label }) => {
  if (active && payload && payload.length) {
    // payloads have same data payload repeated in each entry
    // this is what we want, i.e, a single row of data
    const dataRow = payload[0].payload;
    const entriesToColors = getEntriesToColors(payload);

    return (
      <div className="bg-white opacity-95 rounded-lg px-2 pt-2">
        <p className="text-sm font-medium">{label}</p>
        <hr />
        {spec.y_axises.map((yAxis) =>
          renderYAxisTooltip(yAxis, dataRow, entriesToColors),
        )}
      </div>
    );
  }

  return null;
};

/**
 * If the entry name (aka dataKey) is using an aggregate, unwind that:
 * e.g, Total_Hires.Engineering -> Engineering
 */
const formatEntryName = (entryName) => {
  if (entryName?.includes(".")) {
    return entryName.split(".")[1];
  }
  return entryName;
};

export const getLegendProps = (schema, spec) => ({
  formatter: legendFormatter,
  // TODO: custom legend for multi breakdown formats
});

const legendFormatter = (value, entry) => {
  return <span>{formatEntryName(value)}</span>;
};

export const getChartProps = (rows, refArea, setRefArea, zoom) => ({
  data: rows,
  margin: CHART_MARGIN,
  onMouseDown: (e) => e && setRefArea({ ...refArea, left: e.activeLabel }),
  onMouseMove: (e) =>
    e && refArea.left && setRefArea({ ...refArea, right: e.activeLabel }),
  onMouseUp: zoom,
});

export const getZoom = (refArea, setRefArea, setDomain) => {
  return () => {
    let { left, right } = refArea;
    if (left === right || !right) {
      setRefArea({ left: "", right: "" });
      return;
    }

    if (left > right) {
      [left, right] = [right, left];
    }
    setDomain(left, right);
    setRefArea({ left: "", right: "" });
  };
};

export const getReferenceArea = (refArea) =>
  refArea.left && refArea.right ? (
    <ReferenceArea x1={refArea.left} x2={refArea.right} strokeOpacity={0.3} />
  ) : null;

export const getFieldType = (schema, fieldName) => {
  for (const { name, type } of schema.fields) {
    if (fieldName === name) {
      return type;
    }
  }
};

export const isFieldType = (schema, fieldName, fieldType) =>
  getFieldType(schema, fieldName) === fieldType;

export const isDatetimeField = (schema, fieldName) =>
  isFieldType(schema, fieldName, "datetime");

export const isNumericField = (schema, fieldName) =>
  isFieldType(schema, fieldName, "integer") ||
  isFieldType(schema, fieldName, "number");

export const isStringField = (schema, fieldName) =>
  isFieldType(schema, fieldName, "string");

export const dateFormatter = (schema, spec) => {
  return (
    isDatetimeField(schema, spec?.x_axis?.name) &&
    ((unixTime) => moment(unixTime).format("YYYY-MM-DD"))
  );
};

export const hasDomain = (domain) =>
  domain && domain.length === 2 && (domain[0] || domain[1]);

/**
 * We infer data types in the backend, in attempt to come up with reasonable visualizations,
 * and we re-use that information here as guesses as to field types
 *
 * the types used here are ColumnTypes defined in schema
 */
const isColumnType = (spec, fieldName, columnType) =>
  spec?.column_types && spec.column_types[fieldName] === columnType;

export const isDateColumn = (spec, fieldName) =>
  isColumnType(spec, fieldName, "date");

export const isDateLike = (schema, spec, fieldName) =>
  isDatetimeField(schema, fieldName) ||
  (isStringField(schema, fieldName) && isDateColumn(spec, fieldName));

export const SINGLE_HUE_PALETTE = [
  "#004c6d",
  "#005e81",
  "#007195",
  "#0084a8",
  "#0098bb",
  "#00adce",
  "#00c2df",
  "#00d7f0",
  "#00edff",
];

export const EQUIDISTANT_PALETTE = [
  "#003f5c",
  "#2f4b7c",
  "#665191",
  "#a05195",
  "#d45087",
  "#f95d6a",
  "#ff7c43",
  "#ffa600",
];

export const PIE_PALETTE = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#CF69D9",
  "#FF5B8D",
  "#C8D5FF",
  "#FF7B9F",
  "#5F9AFF",
];
