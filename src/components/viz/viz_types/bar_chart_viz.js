import ChartButtons from "components/viz/buttons/chart_buttons";
import ChartEditor from "components/viz/editor/chart_editor";
import applyTransforms from "components/viz/transforms/apply_transforms";
import BarChartView from "components/viz/views/bar_chart_view";
import { getSetDomain } from "components/viz/viz_types/chart_helper";

class BarChartViz {
  static renderView({ schema, rows, spec, setSpec }) {
    return (
      <>
        <ChartButtons spec={spec} setSpec={setSpec} />
        <BarChartView
          schema={schema}
          rows={applyTransforms(rows, spec)}
          spec={spec}
          setDomain={getSetDomain(spec, setSpec)}
        />
      </>
    );
  }

  static renderEditor({ spec, setSpec }) {
    return <ChartEditor spec={spec} setSpec={setSpec} />;
  }

  static validateSpec(spec) {
    if (!spec.x_axis) {
      return "No horizontal axis configured. Add one to visualize";
    } else if (spec.y_axises.length === 0) {
      return "No vertical axis configured. Add one to visualize";
    } else if (spec.y_axises.length > 1 && spec.breakdowns?.length > 1) {
      return "Bar charts do not support multiple vertical axes and multiple breakdowns. Remove one to visualize";
    } else if (spec.breakdowns.length > 2) {
      return "Bar charts do not support more than two breakdowns. Remove one to visualize";
    }
  }
}

export default BarChartViz;
