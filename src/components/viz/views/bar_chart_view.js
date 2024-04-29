import {
  CHART_HEIGHT,
  CHART_WIDTH,
  EQUIDISTANT_PALETTE,
  getChartProps,
  getLegendProps,
  getReferenceArea,
  getTooltipProps,
  getXAxisProps,
  getYAxisProps,
  getZoom,
  resolveAlias,
} from "components/viz/views/chart_helper";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const getBars = (spec, yAxises, breakdowns) => {
  if (!yAxises) {
    return <></>;
  }

  const bars = [];
  yAxises.forEach((yAxis, yIndex) => {
    if (breakdowns?.length) {
      spec.breakdownValues.forEach((breakdownValue, breakdownIndex) => {
        bars.push(
          <Bar
            key={resolveAlias(yAxis) + "." + breakdownValue}
            dataKey={resolveAlias(yAxis) + "." + breakdownValue}
            fill={
              EQUIDISTANT_PALETTE[breakdownIndex % EQUIDISTANT_PALETTE.length]
            }
            stackId={resolveAlias(yAxis)}
          />,
        );
      });
    } else {
      bars.push(
        <Bar
          key={resolveAlias(yAxis)}
          dataKey={resolveAlias(yAxis)}
          fill={EQUIDISTANT_PALETTE[yIndex % EQUIDISTANT_PALETTE.length]}
        />,
      );
    }
  });

  return <>{bars}</>;
};

const BarChartView = ({ schema, rows, spec, setDomain }) => {
  const [refArea, setRefArea] = useState({
    left: "",
    right: "",
  });

  const zoom = getZoom(refArea, setRefArea, setDomain);
  return (
    <div className="select-none">
      <ResponsiveContainer width={CHART_WIDTH} height={CHART_HEIGHT}>
        <BarChart {...getChartProps(rows, refArea, setRefArea, zoom)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis {...getXAxisProps(schema, spec)} />
          <YAxis {...getYAxisProps(schema, spec)} />
          <Tooltip {...getTooltipProps(schema, spec)} />
          <Legend {...getLegendProps(schema, spec)} />
          {getBars(spec, spec?.y_axises, spec?.breakdowns)}
          {getReferenceArea(refArea)}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartView;
