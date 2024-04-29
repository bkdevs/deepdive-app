import {
  CHART_HEIGHT,
  CHART_MARGIN,
  CHART_WIDTH,
  resolveAlias,
} from "components/viz/views/chart_helper";
import { useState } from "react";
import {
  CartesianGrid,
  ReferenceArea,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DEFAULT_ZOOM = { x1: null, y1: null, x2: null, y2: null };

const ScatterTooltip = ({ xDataKey, yDataKey, active, payload }) => {
  if (active && payload && payload.length) {
    // payloads have same data payload repeated in each entry
    // this is what we want, i.e, a single row of data
    const dataRow = payload[0].payload;
    const nonDataKeyValues = Object.keys(dataRow).filter(
      (key) => key !== xDataKey && key !== yDataKey && key !== "index",
    );

    return (
      <div className="bg-white opacity-95 rounded-lg px-2 pt-2">
        <p className="text-sm font-medium">
          {xDataKey + ":" + dataRow[xDataKey]}
        </p>
        <p className="text-sm font-medium">
          {yDataKey + ":" + dataRow[yDataKey]}
        </p>
        <hr />
        {nonDataKeyValues.map((dataKey) => (
          <p className="text-xs">{dataKey + ":" + dataRow[dataKey]}</p>
        ))}
      </div>
    );
  }

  return null;
};

const ScatterChartView = ({ schema, rows, spec, setDomain }) => {
  const [zoomArea, setZoomArea] = useState(DEFAULT_ZOOM);
  const [isZooming, setIsZooming] = useState(false);

  const xDataKey = resolveAlias(spec.x_axis);
  const yDataKey = resolveAlias(spec.y_axises[0]);

  const handleMouseDown = (e) => {
    setIsZooming(true);
    const { xValue, yValue } = e || {};
    setZoomArea({ x1: xValue, y1: yValue, x2: xValue, y2: yValue });
  };

  const handleMouseMove = (e) => {
    if (isZooming) {
      setZoomArea((prev) => ({ ...prev, x2: e?.xValue, y2: e?.yValue }));
    }
  };

  const handleMouseUp = (e) => {
    if (isZooming) {
      setIsZooming(false);
      let { x1, y1, x2, y2 } = zoomArea;

      // ensure x1 <= x2 and y1 <= y2
      if (x1 > x2) [x1, x2] = [x2, x1];
      if (y1 > y2) [y1, y2] = [y2, y1];

      setDomain(x1, x2, y1, y2);
      setZoomArea(DEFAULT_ZOOM);
    }
  };

  return (
    <div className="select-none">
      <ResponsiveContainer width={CHART_WIDTH} height={CHART_HEIGHT}>
        <ScatterChart
          data={rows}
          margin={CHART_MARGIN}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {/* refactor, don't hard code type */}
          <XAxis type="number" dataKey={xDataKey} domain={["auto", "auto"]} />
          <YAxis type="number" dataKey={yDataKey} domain={["auto", "auto"]} />
          <Tooltip
            content={<ScatterTooltip xDataKey={xDataKey} yDataKey={yDataKey} />}
          />
          <Scatter data={rows} fill="#8884d8" />
          {isZooming && (
            <ReferenceArea
              x1={zoomArea?.x1}
              x2={zoomArea?.x2}
              y1={zoomArea?.y1}
              y2={zoomArea?.y2}
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterChartView;
