/**
 * Merges two rows by the specified key
 * e.g,
 *   a: { index: 397, MONTH: "1992-01", ORDER_COUNT: 3737 },
 *   b: { index: 398, MONTH: "1992-01", ORDER_COUNT: 3969 },
 *   key: "MONTH"
 * =>
 *   { index: 397, MONTH: "1992-01", ORDER_COUNT: 7706 }
 */
export const mergeRows = (a, b, mergeKey) => {
  if (a[mergeKey] !== b[mergeKey]) {
    throw Error(
      `Trying to merge two rows with different keys! ${a} ${b} ${mergeKey}`,
    );
  }
  for (const key in a) {
    if (key === "index" || key === mergeKey || typeof a[key] !== "number") {
      // as of now, the only columns we can aggregate are number columns
      continue;
    }
    a[key] += b[key];
  }
  return a;
};

export const averageRow = (row, count, mergeKey) => {
  for (const key in row) {
    if (key === "index" || key === mergeKey || typeof row[key] !== "number") {
      continue;
    }
    row[key] = row[key] / count;
  }
  return row;
};

/**
 * Aggregates rows for a given row dictionary: {key: List[Row]}
 * the original set of rows in list order: List[Row]
 * and a key
 *
 * This function preserves the ordering of the original rows list
 * and returns back aggregated rows using mergeRows(key)
 *
 * see: test_helper.js for example calls
 */
export const aggregateRows = (rowDict, mergeKey, aggregateFn = "SUM") => {
  const aggregatedRows = [];
  for (const rows of Object.values(rowDict)) {
    let aggregatedRow = rows.reduce((a, b) => mergeRows(a, b, mergeKey));
    if (aggregateFn === "AVG") {
      aggregatedRow = averageRow(aggregatedRow, rows.length, mergeKey);
    }
    aggregatedRows.push(aggregatedRow);
  }
  return aggregatedRows;
};
