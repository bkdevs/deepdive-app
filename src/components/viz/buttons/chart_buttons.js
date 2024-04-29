import SortButton from "components/viz/buttons/sort_button";
import ZoomOutButton from "components/viz/buttons/zoom_out_button";
import update from "immutability-helper";
import { VizResponseContext } from "components/viz/viz_response";
import { useContext } from "react";
import { objectsEqual } from "components/viz/spec_helper";

const ChartButtons = ({ spec, setSpec }) => {
  const { mode } = useContext(VizResponseContext);
  if (mode === "viewReport") {
    return;
  }

  const resetDomain = () => {
    let updatedXAxis = spec.x_axis;
    let updatedFilters = spec.filters;

    if (spec?.x_axis?.name) {
      updatedXAxis = {
        ...spec.x_axis,
        domain: undefined,
      };
    }
    if (spec?.visualization_type === "scatter" && spec?.y_axises.length === 1) {
      const yAxisName = spec.y_axises[0].name;
      const filterIndex = spec.filters.findIndex(
        (filter) =>
          filter.name === yAxisName && filter.filter_type === "numeric",
      );

      if (filterIndex !== -1) {
        updatedFilters = update(updatedFilters, {
          $splice: [[filterIndex, 1]],
        });
      }
    }

    if (
      !objectsEqual(spec.x_axis, updatedXAxis) ||
      !objectsEqual(spec.filters, updatedFilters)
    ) {
      // TODO: not necessary if react batches state updates?
      setSpec({ ...spec, x_axis: updatedXAxis, filters: updatedFilters });
    }
  };

  return (
    <div className="flex flex-row flex-nowrap justify-end gap-1">
      {("edit", "editReport").includes(mode) && (
        <div className="w-18">
          <SortButton spec={spec} setSpec={setSpec} />
        </div>
      )}
      <div className="w-18">
        <ZoomOutButton resetDomain={resetDomain} />
      </div>
    </div>
  );
};

export default ChartButtons;
