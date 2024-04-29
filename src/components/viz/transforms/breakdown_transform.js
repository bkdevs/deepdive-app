import { resolveAlias } from "components/viz/views/chart_helper";

/**
 * Groups rows by the specified breakdowns, e.g:
 *
 * Example input:
 * [
 *  {index: 397, MONTH: '1992-01', C_MKTSEGMENT: 'MACHINERY', ORDER_COUNT: 3737}
 *  {index: 398, MONTH: '1992-01', C_MKTSEGMENT: 'AUTOMOBILE', ORDER_COUNT: 3969}
 *  {index: 399, MONTH: '1992-01', C_MKTSEGMENT: 'FURNITURE', ORDER_COUNT: 3743}
 *  {index: 400, MONTH: '1992-02', C_MKTSEGMENT: 'FURNITURE', ORDER_COUNT: 3895}
 *  {index: 401, MONTH: '1992-02', C_MKTSEGMENT: 'AUTOMOBILE', ORDER_COUNT: 3798}
 *  {index: 402, MONTH: '1992-02', C_MKTSEGMENT: 'MACHINERY', ORDER_COUNT: 3996}
 * ], spec = (x_axis: MONTH, y_axis: ORDER_COUNT, breakdowns: [C_MKTSEGMENT])
 *
 * returns
 *  { index: 0, MONTH: "1992-01", ORDER_COUNT: { MACHINERY: 3737, AUTOMOBILE: 3969, FURNITURE: 3743, }, },
 *  { index: 1, MONTH: "1992-02", ORDER_COUNT: { MACHINERY: 3996, AUTOMOBILE: 3798, FURNITURE: 3895, }, },
 *
 */
const breakdownTransform = (rows, spec) => {
  if (
    !spec.x_axis ||
    !spec.y_axises ||
    !spec.breakdowns ||
    spec.breakdowns.length === 0
  ) {
    return rows;
  }

  if (spec.breakdowns.length > 1) {
    // TODO: fix this
    // upstream bar chart, line chart should all work - if we continue enumerating in spec.breakdownValues
    // e.g, two breakdowns: Korea.Seoul.CUSTOMER_COUNT
    // should just be fine? a few things might be ugly / need to change in the UI though
    alert("More than one breakdown not supported!");
    return rows;
  }

  const xAxis = resolveAlias(spec.x_axis);
  const yAxises = spec.y_axises.map(resolveAlias);
  const breakdown = resolveAlias(spec.breakdowns[0]);

  const breakdownValues = new Set();
  const rowDict = {};
  for (const row of rows) {
    rowDict[row[xAxis]] ||= {};
    for (const yAxis of yAxises) {
      rowDict[row[xAxis]][yAxis] ||= {};
      rowDict[row[xAxis]][yAxis][row[breakdown]] = row[yAxis];
      breakdownValues.add(row[breakdown]);
    }
  }

  spec.breakdownValues = [...breakdownValues].slice(0, 10);

  let index = 0;
  const newRows = [];
  const addedRows = new Set();

  for (const row of rows) {
    // attempt to preserve original row order in case query contains an order by
    const xVal = row[xAxis];
    if (!addedRows.has(xVal)) {
      addedRows.add(xVal);
      newRows.push({
        ...rowDict[xVal],
        index: index++,
        [xAxis]: xVal,
      });
    }
  }

  return newRows;
};

export default breakdownTransform;
