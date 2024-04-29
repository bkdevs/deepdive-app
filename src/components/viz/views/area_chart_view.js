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
  CartesianGrid,
  Legend,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const getAreas = (spec, yAxises, breakdowns) => {
  if (!yAxises) {
    return <></>;
  }

  const areas = [];
  yAxises.forEach((yAxis, yIndex) => {
    if (breakdowns?.length) {
      spec.breakdownValues.forEach((breakdownValue, breakdownIndex) => {
        areas.push(
          <Area
            key={resolveAlias(yAxis) + "." + breakdownValue}
            dataKey={resolveAlias(yAxis) + "." + breakdownValue}
            stroke={EQUIDISTANT_PALETTE[breakdownIndex]}
            fill={EQUIDISTANT_PALETTE[breakdownIndex]}
            stackId={resolveAlias(yAxis)}
            type="monotone"
            strokeWidth={1}
            activeDot={{ r: 4 }}
            dot={false}
          />,
        );
      });
    } else {
      areas.push(
        <Area
          key={resolveAlias(yAxis)}
          dataKey={resolveAlias(yAxis)}
          stroke={EQUIDISTANT_PALETTE[yIndex]}
          fill={EQUIDISTANT_PALETTE[yIndex]}
          type="monotone"
          strokeWidth={1}
          activeDot={{ r: 4 }}
          dot={false}
        />,
      );
    }
  });

  return <>{areas}</>;
};

const AreaChartView = ({ schema, rows, spec, setDomain }) => {
  const [refArea, setRefArea] = useState({
    left: "",
    right: "",
  });
  const zoom = getZoom(refArea, setRefArea, setDomain);

  return (
    <div className="select-none">
      <ResponsiveContainer width={CHART_WIDTH} height={CHART_HEIGHT}>
        <AreaChart {...getChartProps(rows, refArea, setRefArea, zoom)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis {...getXAxisProps(schema, spec)} />
          <YAxis {...getYAxisProps(schema, spec)} />
          <Tooltip {...getTooltipProps(schema, spec)} />
          <Legend {...getLegendProps(schema, spec)} />
          {getAreas(spec, spec?.y_axises, spec?.breakdowns)}
          {getReferenceArea(refArea)}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartView;
