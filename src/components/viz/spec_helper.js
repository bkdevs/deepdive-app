import Ajv2020 from "ajv/dist/2020";
import { VizSpecSchema } from "components/viz/spec_schema";

const TIME_UNIT_SUFFIXES = {
  second: "in seconds",
  minute: "in minutes",
  hour: "by hour",
  day: "by day",
  week: "by week",
  month: "by month",
  month_of_year: "by month of year",
  year: "by year",
  hour_of_day: "by hour of day",
  day_of_week: "by day of week",
  day_of_month: "by day of month",
  week_of_year: "by week of year",
  week_of_year_long: "by week of year",
};

const AGGREGATION_PREFIXES = {
  COUNT: "Count of",
  SUM: "Sum of",
  AVG: "Average of",
  MIN: "Min of",
  MAX: "Max of",
};

/**
 * Returns human-readable text for the given X Axis
 */
export const getXAxisText = (xAxis) => {
  if (xAxis?.binner?.time_unit) {
    return `${xAxis.name} ${TIME_UNIT_SUFFIXES[xAxis.binner.time_unit]}`;
  }
  return xAxis.name;
};

/**
 * Returns human-readable text for the given Y Axis
 */
export const getYAxisText = (yAxis) => {
  if (yAxis.unparsed) {
    return yAxis.alias || yAxis.name;
  } else if (yAxis.aggregation) {
    const yAxisName = yAxis.name === "*" ? "rows" : yAxis.name;
    return `${AGGREGATION_PREFIXES[yAxis.aggregation]} ${yAxisName}`;
  } else if (yAxis.name === "*") {
    return "All columns";
  }

  return yAxis.name;
};

/**
 * Returns human-readable text for a filter
 */
export const getFilterText = (filter) => {
  if (filter.filter_type === "comparison" && filter.values?.length === 1) {
    if (filter.negate) {
      return `${filter.name} is not ${filter.values[0]}`;
    } else {
      return `${filter.name} is ${filter.values[0]}`;
    }
  } else if (filter.filter_type === "comparison" && filter.values?.length > 1) {
    if (filter.negate) {
      return `${filter.name} not in ${filter.values.join(", ")}`;
    } else {
      return `${filter.name} in ${filter.values.join(", ")}`;
    }
  } else if (filter.filter_type === "numeric") {
    const domain = filter.domain;
    if (domain && domain[0] && domain[1]) {
      if (filter.negate) {
        return `${filter.name} not in [${domain[0]} to ${domain[1]}]`;
      } else {
        return `${filter.name} in [${domain[0]} to ${domain[1]}]`;
      }
    } else if (domain && domain[0]) {
      if (filter.negate) {
        return `not ${filter.name} > ${domain[0]}`;
      } else {
        return `${filter.name} > ${domain[0]}`;
      }
    } else if (domain && domain[1]) {
      if (filter.negate) {
        return `not ${filter.name} < ${domain[1]}`;
      } else {
        return `${filter.name} < ${domain[1]}`;
      }
    }
  } else if (filter.filter_type === "like") {
    if (filter.negate) {
      return `${filter.name} not like '${filter.values[0]}'`;
    } else {
      return `${filter.name} like '${filter.values[0]}'`;
    }
  } else if (filter.filter_type === "complex") {
    return filter.expression;
  }

  return filter.name;
};

export const getActiveFields = (spec) => {
  const activeAxes = [];
  if (spec?.x_axis?.name) {
    activeAxes.push(spec.x_axis.name);
  }
  if (spec?.y_axises) {
    activeAxes.push(...spec.y_axises.map((yAxis) => yAxis.name));
  }
  if (spec?.breakdowns) {
    activeAxes.push(...spec.breakdowns.map((breakdown) => breakdown.name));
  }
  return activeAxes;
};

export const getAllAxes = (databaseSchema) => {
  const axes = [];

  // note: disregards session tables
  for (const table of databaseSchema.tables) {
    for (const column of table.columns) {
      axes.push({
        value: column.name,
        label: column.name,
      });
    }
  }

  axes.sort((a, b) => a.label.localeCompare(b.label));
  return [{ value: "*", label: "All fields" }, ...axes];
};

export const getAxes = (spec, databaseSchema) => {
  const fields = new Set();

  // note: disregards session tables
  for (const table of databaseSchema.tables) {
    for (const column of table.columns) {
      fields.add(column.name);
    }
  }
  getActiveFields(spec).forEach((field) => fields.delete(field));

  const sortedFields = Array.from(fields).sort();

  return [
    { value: "*", label: "All fields" },
    ...sortedFields.map((field) => ({
      value: field,
      label: field,
    })),
  ];
};

export const getColumnType = (databaseSchema, columnName) => {
  for (const table of databaseSchema.tables) {
    for (const column of table.columns) {
      if (column.name === columnName) {
        return column.column_type;
      }
    }
  }
};

const ajv = new Ajv2020();
const VALIDATE_VIZ_SPEC = ajv.compile(VizSpecSchema);

export const objectsEqual = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

export const objectEmpty = (a) => {
  return !a || Object.keys(a).length === 0;
};

/**
 * Our code works on a valid spec, as defined in VizSpec.schema.py
 *
 * So we shouldn't munge or make any edits to spec that disagree with that
 * This code serves as a soft-guarantee of that fact
 */
export const validateSpec = (spec) => {
  const valid = VALIDATE_VIZ_SPEC(spec);
  if (!valid) {
    console.error(VALIDATE_VIZ_SPEC.errors);
  }
};
