import breakdownTransform from "components/viz/transforms/breakdown_transform";
import zoomTransform from "components/viz/transforms/zoom_transform";

/**
 * Applies specified transforms in VisualizationSpec
 *
 * Note that the ordering in which these transforms applies matters
 */
const applyTransforms = (rawRows, spec) => {
  let rows = JSON.parse(JSON.stringify(rawRows));
  if (spec?.breakdowns) {
    rows = breakdownTransform(rows, spec);
  }
  if (spec?.x_axis?.domain) {
    rows = zoomTransform(rows, spec);
  }
  return rows;
};

export default applyTransforms;
