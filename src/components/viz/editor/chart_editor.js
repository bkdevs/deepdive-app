import { Divider } from "antd";
import BreakdownsEditor from "components/viz/editor/breakdowns_editor";
import FiltersEditor from "components/viz/editor/filters_editor";
import VizTypeSelector from "components/viz/editor/viz_type_selector";
import XAxisEditor from "components/viz/editor/x_axis_editor";
import YAxisesEditor from "components/viz/editor/y_axises_editor";
import { getAllAxes } from "components/viz/spec_helper";
import useSessionContext from "hooks/use_session_context";

/**
 * Editor side panel for charts
 *
 * Charts include:
 *  - viz_type in ("bar", "line", "area", "pie")
 *
 * The spec here _is_ the VizSpec specified in schema, we use that JSON
 * object throughout in state in our editor
 */
const ChartEditor = ({ spec, setSpec }) => {
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
      <YAxisesEditor
        yAxises={spec.y_axises}
        setYAxises={(yAxises) => setSpec({ ...spec, y_axises: yAxises })}
        axes={axes}
      />
      <Divider />
      <BreakdownsEditor
        breakdowns={spec.breakdowns}
        setBreakdowns={(breakdowns) =>
          setSpec({ ...spec, breakdowns: breakdowns })
        }
        breakdownsLimit={1}
        axes={axes}
      />
      <div className="pb-4" />
      <FiltersEditor
        filters={spec.filters}
        setFilters={(filters) => setSpec({ ...spec, filters: filters })}
      />
    </div>
  );
};

export default ChartEditor;
