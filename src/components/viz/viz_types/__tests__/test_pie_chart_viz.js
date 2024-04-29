import PieChartViz from "components/viz/viz_types/pie_chart_viz";

test("pie chart spec without y-axis not supported", () => {
  const spec = {
    x_axis: {
      name: "created_at",
    },
    y_axises: [],
  };

  expect(PieChartViz.validateSpec(spec)).toBeDefined();
});

test("pie chart spec not supported, multi y-axis", () => {
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

  expect(PieChartViz.validateSpec(spec)).toBeDefined();
});

test("pie chart spec supported, single y-axis", () => {
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

  expect(PieChartViz.validateSpec(spec)).toBeUndefined();
});

test("pie chart spec not supported, single y-axis single breakdown", () => {
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

  expect(PieChartViz.validateSpec(spec)).toBeDefined();
});

test("pie chart spec not supported, single y-axis multi breakdown", () => {
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

  expect(PieChartViz.validateSpec(spec)).toBeDefined();
});

test("pie chart spec not supported, multiple y-axis multi breakdown", () => {
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

  expect(PieChartViz.validateSpec(spec)).toBeDefined();
});

test("pie chart spec not supported, multi y-axis single breakdown", () => {
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

  expect(PieChartViz.validateSpec(spec)).toBeDefined();
});

test("pie chart spec not supported, single y-axis many breakdown", () => {
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

  expect(PieChartViz.validateSpec(spec)).toBeDefined();
});

test("pie chart spec not supported, no x-axis", () => {
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

  expect(PieChartViz.validateSpec(spec)).toBeDefined();
});
