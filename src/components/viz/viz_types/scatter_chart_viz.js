import ChartButtons from "components/viz/buttons/chart_buttons";
import ScatterChartEditor from "components/viz/editor/scatter_chart_editor";
import applyTransforms from "components/viz/transforms/apply_transforms";
import ScatterChartView from "components/viz/views/scatter_chart_view";
import { getSet2DDomain } from "components/viz/viz_types/chart_helper";

class ScatterChartViz {
  static renderView({ schema, rows, spec, setSpec }) {
    return (
      <>
        <ChartButtons spec={spec} setSpec={setSpec} />
        <ScatterChartView
          schema={schema}
          rows={applyTransforms(rows, spec)}
          spec={spec}
          setDomain={getSet2DDomain(spec, setSpec)}
        />
      </>
    );
  }

  static renderEditor({ spec, setSpec }) {
    return <ScatterChartEditor spec={spec} setSpec={setSpec} />;
  }

  static validateSpec(spec) {
    if (!spec.x_axis) {
      return "No horizontal axis configured. Add one to visualize";
    } else if (spec.y_axises.length === 0) {
      return "No vertical axis configured. Add one to visualize";
    } else if (spec.y_axises.length > 1) {
      return "Scatter charts do not support multiple vertical axes. Remove to visualize";
    } else if (spec.breakdowns.length > 0) {
      return "Scatter charts do not support breakdowns. Remove to visualize";
    }
  }
}

export default ScatterChartViz;
