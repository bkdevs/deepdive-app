import BarChartViz from "components/viz/viz_types/bar_chart_viz";

test("bar chart spec without y-axis not supported", () => {
  const spec = {
    x_axis: {
      name: "created_at",
    },
    y_axises: [],
  };

  expect(BarChartViz.validateSpec(spec)).toBeDefined();
});

test("bar chart spec supported, multi y-axis", () => {
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

  expect(BarChartViz.validateSpec(spec)).toBeUndefined();
});

test("bar chart spec supported, single y-axis", () => {
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

  expect(BarChartViz.validateSpec(spec)).toBeUndefined();
});

test("bar chart spec supported, single y-axis single breakdown", () => {
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

  expect(BarChartViz.validateSpec(spec)).toBeUndefined();
});

test("bar chart spec supported, single y-axis multi breakdown", () => {
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

  expect(BarChartViz.validateSpec(spec)).toBeUndefined();
});

test("bar chart spec not supported, multiple y-axis multi breakdown", () => {
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
      {
        name: "COUNTRY",
      },
    ],
  };

  expect(BarChartViz.validateSpec(spec)).toBeDefined();
});

test("bar chart spec supported, multi y-axis single breakdown", () => {
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

  expect(BarChartViz.validateSpec(spec)).toBeUndefined();
});

test("bar chart spec not supported, single y-axis many breakdown", () => {
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
      {
        name: "CITY",
      },
    ],
  };

  expect(BarChartViz.validateSpec(spec)).toBeDefined();
});

test("bar chart spec not supported, no x-axis", () => {
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

  expect(BarChartViz.validateSpec(spec)).toBeDefined();
});
