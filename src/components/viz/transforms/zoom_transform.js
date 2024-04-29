import { hasDomain, resolveAlias } from "components/viz/views/chart_helper";

/**
 * filters rows by the specified zoom parameters:
 *  - spec.x_axis.domain
 *
 * note that we don't rely on recharts <XAxis domain> as it only supports numerical axes
 * instead, we process rows in this transform and re-render the chart with as such
 */
const zoomTransform = (rows, spec) => {
  if (!spec?.x_axis?.domain) {
    return rows;
  }
  const { domain } = spec.x_axis;
  const name = resolveAlias(spec.x_axis);
  if (!hasDomain(domain)) {
    return rows;
  }

  const start = domain[0];
  const end = domain[1];

  // sorts strings using comparison operators, datetime works with that
  return rows.filter(
    (row) =>
      (start ? row[name] >= start : true) && (end ? row[name] <= end : true),
  );
};

export default zoomTransform;
