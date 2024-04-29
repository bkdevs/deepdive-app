import {
  CHART_HEIGHT,
  CHART_WIDTH,
  PIE_PALETTE,
  resolveAlias,
} from "components/viz/views/chart_helper";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const RADIAN = Math.PI / 180;
const renderPercentLabel = (props) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, value } = props;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <>
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={"middle"}
        dominantBaseline="central"
      >
        {`${value}`}
      </text>
      <text
        x={x}
        y={y + 12}
        fill="white"
        textAnchor={"middle"}
        dominantBaseline="central"
      >
        {`(${(percent * 100).toFixed(0)}%)`}
      </text>
    </>
  );
};

const getPie = (spec, rows, yAxises) => {
  if (!yAxises) {
    return <></>;
  }
  const yAxis = yAxises[0];

  return (
    <Pie
      data={rows}
      dataKey={resolveAlias(yAxis)}
      nameKey={resolveAlias(spec.x_axis)}
      label={renderPercentLabel}
      labelLine={false}
    >
      {rows.map((entry, index) => (
        <Cell
          key={`cell-${index}`}
          fill={PIE_PALETTE[index % PIE_PALETTE.length]}
        />
      ))}
    </Pie>
  );
};

const PieChartView = ({ schema, rows, spec }) => {
  return (
    <div className="select-none">
      <ResponsiveContainer width={CHART_WIDTH} height={CHART_HEIGHT}>
        <PieChart>
          <Tooltip />
          <Legend />
          {getPie(spec, rows, spec?.y_axises)}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartView;
