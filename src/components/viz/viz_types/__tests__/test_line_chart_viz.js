import LineChartViz from "components/viz/viz_types/line_chart_viz";

test("line chart spec not supported, not y-axis", () => {
  const spec = {
    x_axis: {
      name: "created_at",
    },
    y_axises: [],
    breakdowns: [],
  };

  expect(LineChartViz.validateSpec(spec)).toBeDefined();
});

test("line chart spec supported, multi y-axis", () => {
  const spec = {
    x_axis: {
      name: "created_at",
    },
    y_axises: [
      {
        name: "COUNT",
      },
      {
        name: "AVG",
      },
    ],
    breakdowns: [],
  };

  expect(LineChartViz.validateSpec(spec)).toBeUndefined();
});

test("line chart spec supported, single y-axis", () => {
  const spec = {
    x_axis: {
      name: "created_at",
    },
    y_axises: [
      {
        name: "COUNT",
      },
    ],
    breakdowns: [],
  };

  expect(LineChartViz.validateSpec(spec)).toBeUndefined();
});

test("line chart spec supported, single y-axis single breakdown", () => {
  const spec = {
    x_axis: {
      name: "created_at",
    },
    y_axises: [
      {
        name: "COUNT",
      },
    ],
    breakdowns: [
      {
        name: "MARKET_SEGMENT",
      },
    ],
  };

  expect(LineChartViz.validateSpec(spec)).toBeUndefined();
});

test("line chart spec not supported, single y-axis multi breakdown", () => {
  const spec = {
    x_axis: {
      name: "created_at",
    },
    y_axises: [
      {
        name: "COUNT",
      },
    ],
    breakdowns: [
      {
        name: "MARKET_SEGMENT",
      },
      {
        name: "COUNTRY",
      },
    ],
  };

  expect(LineChartViz.validateSpec(spec)).toBeDefined();
});

test("line chart spec not supported, multi y-axis single breakdown", () => {
  const spec = {
    x_axis: {
      name: "created_at",
    },
    y_axises: [
      {
        name: "COUNT",
      },
      {
        name: "AVG",
      },
    ],
    breakdowns: [
      {
        name: "MARKET_SEGMENT",
      },
    ],
  };

  expect(LineChartViz.validateSpec(spec)).toBeDefined();
});

test("line chart spec not supported, no x-axis", () => {
  const spec = {
    y_axises: [
      {
        name: "COUNT",
      },
      {
        name: "AVG",
      },
    ],
    breakdowns: [],
  };

  expect(LineChartViz.validateSpec(spec)).toBeDefined();
});
