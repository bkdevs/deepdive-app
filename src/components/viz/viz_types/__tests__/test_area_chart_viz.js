import AreaChartViz from "components/viz/viz_types/area_chart_viz";

test("area chart spec not supported, not y-axis", () => {
  const spec = {
    x_axis: {
      name: "created_at",
    },
    y_axises: [],
    breakdowns: [],
  };

  expect(AreaChartViz.validateSpec(spec)).toBeDefined();
});

test("area chart spec supported, multi y-axis", () => {
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

  expect(AreaChartViz.validateSpec(spec)).toBeUndefined();
});

test("area chart spec supported, single y-axis", () => {
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

  expect(AreaChartViz.validateSpec(spec)).toBeUndefined();
});

test("area chart spec supported, single y-axis single breakdown", () => {
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

  expect(AreaChartViz.validateSpec(spec)).toBeUndefined();
});

test("area chart spec not supported, single y-axis multi breakdown", () => {
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

  expect(AreaChartViz.validateSpec(spec)).toBeDefined();
});

test("area chart spec not supported, multi y-axis single breakdown", () => {
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

  expect(AreaChartViz.validateSpec(spec)).toBeDefined();
});

test("area chart spec not supported, no x-axis", () => {
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

  expect(AreaChartViz.validateSpec(spec)).toBeDefined();
});
