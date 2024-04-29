import { Divider } from "antd";
import FiltersEditor from "components/viz/editor/filters_editor";
import SimpleYAxisesEditor from "components/viz/editor/simple_y_axises_editor";
import VizTypeSelector from "components/viz/editor/viz_type_selector";
import XAxisEditor from "components/viz/editor/x_axis_editor";
import { getAllAxes } from "components/viz/spec_helper";
import useSessionContext from "hooks/use_session_context";

/**
 * Editor side panel for scatter charts only
 */
const ScatterChartEditor = ({ spec, setSpec }) => {
  const { databaseSchema } = useSessionContext();
  const axes = getAllAxes(databaseSchema);

  return (
    <div>
      <VizTypeSelector
        vizType={spec.visualization_type}
        setVizType={(vizType) =>
          setSpec({ ...spec, visualization_type: vizType })
        }
      />
      <Divider />
      <XAxisEditor
        xAxis={spec.x_axis}
        setXAxis={(xAxis) => setSpec({ ...spec, x_axis: xAxis })}
        axes={axes}
      />
      <div className="pb-4" />
      <SimpleYAxisesEditor
        yAxises={spec.y_axises}
        setYAxises={(yAxises) => setSpec({ ...spec, y_axises: yAxises })}
        axes={axes}
      />
      <Divider />
      <FiltersEditor
        filters={spec.filters}
        setFilters={(filters) => setSpec({ ...spec, filters: filters })}
      />
    </div>
  );
};

export default ScatterChartEditor;
