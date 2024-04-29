import ChartButtons from "components/viz/buttons/chart_buttons";
import ChartEditor from "components/viz/editor/chart_editor";
import applyTransforms from "components/viz/transforms/apply_transforms";
import PieChartView from "components/viz/views/pie_chart_view";

class PieChartViz {
  static renderView({ schema, rows, spec, setSpec }) {
    return (
      <>
        <ChartButtons spec={spec} setSpec={setSpec} />
        <PieChartView
          schema={schema}
          rows={applyTransforms(rows, spec)}
          spec={spec}
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
    } else if (spec.y_axises.length > 1) {
      return "Pie charts only support a single vertical axis. Remove one to visualize.";
    } else if (spec.breakdowns.length > 0) {
      return "Pie charts do not support breakdowns. Remove to visualize.";
    }
  }
}

export default PieChartViz;
