import {
  CHART_HEIGHT,
  CHART_WIDTH,
  EQUIDISTANT_PALETTE,
  SINGLE_HUE_PALETTE,
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
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const getLines = (spec, yAxises, breakdowns) => {
  if (!yAxises) {
    return <></>;
  }

  const lines = [];
  yAxises.forEach((yAxis, yIndex) => {
    if (breakdowns?.length) {
      spec.breakdownValues.forEach((breakdownValue, breakdownIndex) => {
        lines.push(
          <Line
            key={resolveAlias(yAxis) + "." + breakdownValue}
            dataKey={resolveAlias(yAxis) + "." + breakdownValue}
            type="monotone"
            stroke={
              EQUIDISTANT_PALETTE[breakdownIndex % EQUIDISTANT_PALETTE.length]
            }
            strokeWidth={1}
            activeDot={{ r: 4 }}
            dot={false}
            connectNulls={true}
          />,
        );
      });
    } else {
      lines.push(
        <Line
          key={resolveAlias(yAxis)}
          dataKey={resolveAlias(yAxis)}
          type="monotone"
          stroke={SINGLE_HUE_PALETTE[yIndex % SINGLE_HUE_PALETTE.length]}
          strokeWidth={2}
          activeDot={{ r: 8 }}
          dot={false}
          connectNulls={true}
        />,
      );
    }
  });

  return <>{lines}</>;
};

const LineChartView = ({ schema, rows, spec, setDomain }) => {
  const [refArea, setRefArea] = useState({
    left: "",
    right: "",
  });
  const zoom = getZoom(refArea, setRefArea, setDomain);

  return (
    <div className="select-none">
      <ResponsiveContainer width={CHART_WIDTH} height={CHART_HEIGHT}>
        <LineChart {...getChartProps(rows, refArea, setRefArea, zoom)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis {...getXAxisProps(schema, spec)} />
          <YAxis {...getYAxisProps(schema, spec)} />
          <Tooltip {...getTooltipProps(schema, spec)} />
          <Legend {...getLegendProps(schema, spec)} />
          {getLines(spec, spec?.y_axises, spec?.breakdowns)}
          {getReferenceArea(refArea)}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartView;
