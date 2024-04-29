import ColumnsEditor from "components/viz/editor/columns_editor";
import FiltersEditor from "components/viz/editor/filters_editor";
import TableBreakdownsEditor from "components/viz/editor/table_breakdowns_editor";
import VizTypeSelector from "components/viz/editor/viz_type_selector";
import { getAllAxes, objectsEqual } from "components/viz/spec_helper";
import useSessionContext from "hooks/use_session_context";
import { useEffect, useState } from "react";

const getTableBreakdowns = (spec) => {
  if (spec.x_axis) {
    return [spec.x_axis, ...spec.breakdowns];
  }
  return spec.breakdowns;
};

const useTableUpdate = (tableBreakdowns, spec, setSpec) => {
  useEffect(() => {
    if (!objectsEqual(getTableBreakdowns(spec), tableBreakdowns)) {
      if (tableBreakdowns.length) {
        setSpec({
          ...spec,
          x_axis: tableBreakdowns[0],
          breakdowns: tableBreakdowns.slice(1),
          y_axises: spec.y_axises,
        });
      } else {
        setSpec({ ...spec, x_axis: undefined, breakdowns: [] });
      }
    }
  }, [tableBreakdowns, spec, setSpec]);
};

const TableEditor = ({ spec, setSpec }) => {
  const [tableBreakdowns, setTableBreakdowns] = useState(
    getTableBreakdowns(spec),
  );
  const { databaseSchema } = useSessionContext();
  const axes = getAllAxes(databaseSchema);
  useTableUpdate(tableBreakdowns, spec, setSpec);

  return (
    <div>
      <VizTypeSelector
        vizType={spec.visualization_type}
        setVizType={(vizType) =>
          setSpec({ ...spec, visualization_type: vizType })
        }
      />
      <div className="pb-4" />
      <ColumnsEditor
        yAxises={spec.y_axises}
        setYAxises={(yAxises) => setSpec({ ...spec, y_axises: yAxises })}
        axes={axes}
        hasTableBreakdowns={tableBreakdowns.length > 0}
      />
      <div className="pb-4" />
      <TableBreakdownsEditor
        breakdowns={tableBreakdowns}
        setBreakdowns={setTableBreakdowns}
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

export default TableEditor;
