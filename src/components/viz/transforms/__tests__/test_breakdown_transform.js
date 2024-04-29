import breakdownTransform from "components/viz/transforms/breakdown_transform";

test("does nothing if breakdown not specified", () => {
  const rows = [
    {
      index: 397,
      MONTH: "1992-01",
      ORDER_COUNT: 3737,
    },
    {
      index: 398,
      MONTH: "1992-01",
      ORDER_COUNT: 3969,
    },
  ];

  const spec = {
    x_axis: {
      name: "MONTH",
    },
    y_axises: [
      {
        name: "ORDER_COUNT",
      },
    ],
  };

  expect(breakdownTransform(rows, spec)).toEqual(rows);
});

test("does nothing if y_axises not specified", () => {
  const rows = [
    {
      index: 397,
      MONTH: "1992-01",
      ORDER_COUNT: 3737,
      C_MKTSEGMENT: "MACHINERY",
    },
    {
      index: 398,
      MONTH: "1992-01",
      ORDER_COUNT: 3969,
      C_MKTSEGMENT: "AUTOMOBILE",
    },
  ];

  const spec = {
    x_axis: {
      name: "MONTH",
    },
    breakdowns: [
      {
        name: "C_MKTSEGMENT",
      },
    ],
  };

  expect(breakdownTransform(rows, spec)).toEqual(rows);
});

test("breaks down rows by segment", () => {
  const rows = [
    {
      index: 397,
      MONTH: "1992-01",
      C_MKTSEGMENT: "MACHINERY",
      ORDER_COUNT: 3737,
    },
    {
      index: 398,
      MONTH: "1992-01",
      C_MKTSEGMENT: "AUTOMOBILE",
      ORDER_COUNT: 3969,
    },
    {
      index: 399,
      MONTH: "1992-01",
      C_MKTSEGMENT: "FURNITURE",
      ORDER_COUNT: 3743,
    },
    {
      index: 400,
      MONTH: "1992-02",
      C_MKTSEGMENT: "FURNITURE",
      ORDER_COUNT: 3895,
    },
    {
      index: 401,
      MONTH: "1992-02",
      C_MKTSEGMENT: "AUTOMOBILE",
      ORDER_COUNT: 3798,
    },
    {
      index: 402,
      MONTH: "1992-02",
      C_MKTSEGMENT: "MACHINERY",
      ORDER_COUNT: 3996,
    },
  ];

  const spec = {
    x_axis: {
      name: "MONTH",
    },
    y_axises: [
      {
        name: "ORDER_COUNT",
      },
    ],
    breakdowns: [
      {
        name: "C_MKTSEGMENT",
      },
    ],
  };

  expect(breakdownTransform(rows, spec)).toEqual([
    {
      index: 0,
      MONTH: "1992-01",
      ORDER_COUNT: {
        MACHINERY: 3737,
        AUTOMOBILE: 3969,
        FURNITURE: 3743,
      },
    },
    {
      index: 1,
      MONTH: "1992-02",
      ORDER_COUNT: {
        MACHINERY: 3996,
        AUTOMOBILE: 3798,
        FURNITURE: 3895,
      },
    },
  ]);
});

test("breaks down rows by segment two y-axises", () => {
  const rows = [
    {
      index: 397,
      MONTH: "1992-01",
      C_MKTSEGMENT: "MACHINERY",
      ORDER_COUNT: 3737,
      ORDER_AVG: 10,
    },
    {
      index: 398,
      MONTH: "1992-01",
      C_MKTSEGMENT: "AUTOMOBILE",
      ORDER_COUNT: 3969,
      ORDER_AVG: 20,
    },
    {
      index: 399,
      MONTH: "1992-01",
      C_MKTSEGMENT: "FURNITURE",
      ORDER_COUNT: 3743,
      ORDER_AVG: 30,
    },
    {
      index: 400,
      MONTH: "1992-02",
      C_MKTSEGMENT: "FURNITURE",
      ORDER_COUNT: 3895,
      ORDER_AVG: 10,
    },
    {
      index: 401,
      MONTH: "1992-02",
      C_MKTSEGMENT: "AUTOMOBILE",
      ORDER_COUNT: 3798,
      ORDER_AVG: 25,
    },
    {
      index: 402,
      MONTH: "1992-02",
      C_MKTSEGMENT: "MACHINERY",
      ORDER_COUNT: 3996,
      ORDER_AVG: 35,
    },
  ];

  const spec = {
    x_axis: {
      name: "MONTH",
    },
    y_axises: [
      {
        name: "ORDER_COUNT",
      },
      {
        name: "ORDER_AVG",
      },
    ],
    breakdowns: [
      {
        name: "C_MKTSEGMENT",
      },
    ],
  };

  expect(breakdownTransform(rows, spec)).toEqual([
    {
      index: 0,
      MONTH: "1992-01",
      ORDER_COUNT: {
        MACHINERY: 3737,
        AUTOMOBILE: 3969,
        FURNITURE: 3743,
      },
      ORDER_AVG: {
        MACHINERY: 10,
        AUTOMOBILE: 20,
        FURNITURE: 30,
      },
    },
    {
      index: 1,
      MONTH: "1992-02",
      ORDER_COUNT: {
        MACHINERY: 3996,
        AUTOMOBILE: 3798,
        FURNITURE: 3895,
      },
      ORDER_AVG: {
        MACHINERY: 35,
        AUTOMOBILE: 25,
        FURNITURE: 10,
      },
    },
  ]);
});
