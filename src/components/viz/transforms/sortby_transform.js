import { getSorter } from "components/app/helper";
import { getFieldType } from "components/viz/views/chart_helper";

/**
 * sorts rows by the specified column and direction
 *
 * if no direction is provided, do nothing, regardless of the column specified
 */
const sortByTransform = (rows, schema, spec) => {
  if (!spec?.transforms?.sort_by) {
    return rows;
  }
  const { column, direction } = spec.transforms.sort_by;
  let sortedRows = rows
    .slice()
    .sort(getSorter(column, getFieldType(schema, column)));

  return direction === "descending" ? sortedRows.reverse() : sortedRows;
};

export default sortByTransform;
