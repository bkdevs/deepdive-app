import zoomTransform from "components/viz/transforms/zoom_transform";

test("zoom numeric x-axis", () => {
  const rows = [
    { index: 0, Age: 25, Number_of_Hires: 22 },
    { index: 1, Age: 26, Number_of_Hires: 17 },
    { index: 2, Age: 27, Number_of_Hires: 26 },
    { index: 3, Age: 28, Number_of_Hires: 29 },
    { index: 4, Age: 29, Number_of_Hires: 27 },
    { index: 5, Age: 30, Number_of_Hires: 29 },
    { index: 6, Age: 31, Number_of_Hires: 26 },
    { index: 7, Age: 32, Number_of_Hires: 20 },
    { index: 8, Age: 33, Number_of_Hires: 26 },
    { index: 9, Age: 34, Number_of_Hires: 23 },
    { index: 10, Age: 35, Number_of_Hires: 18 },
  ];

  const spec = {
    x_axis: {
      name: "Age",
      domain: [20, 30],
    },
  };

  expect(zoomTransform(rows, spec)).toEqual([
    { index: 0, Age: 25, Number_of_Hires: 22 },
    { index: 1, Age: 26, Number_of_Hires: 17 },
    { index: 2, Age: 27, Number_of_Hires: 26 },
    { index: 3, Age: 28, Number_of_Hires: 29 },
    { index: 4, Age: 29, Number_of_Hires: 27 },
    { index: 5, Age: 30, Number_of_Hires: 29 },
  ]);
});

test("zoom datetime x-axis", () => {
  const rows = [
    { index: 0, O_ORDERDATE: "1992-01-01T00:00:00.000", NUM_ORDERS: 6222 },
    { index: 1, O_ORDERDATE: "1992-01-02T00:00:00.000", NUM_ORDERS: 6179 },
    { index: 2, O_ORDERDATE: "1992-01-03T00:00:00.000", NUM_ORDERS: 6156 },
    { index: 3, O_ORDERDATE: "1992-01-04T00:00:00.000", NUM_ORDERS: 6317 },
    { index: 4, O_ORDERDATE: "1992-01-05T00:00:00.000", NUM_ORDERS: 6272 },
    { index: 5, O_ORDERDATE: "1992-01-06T00:00:00.000", NUM_ORDERS: 6142 },
    { index: 6, O_ORDERDATE: "1992-01-07T00:00:00.000", NUM_ORDERS: 6207 },
    { index: 7, O_ORDERDATE: "1992-01-08T00:00:00.000", NUM_ORDERS: 6209 },
    { index: 8, O_ORDERDATE: "1992-01-09T00:00:00.000", NUM_ORDERS: 6379 },
    { index: 9, O_ORDERDATE: "1992-01-10T00:00:00.000", NUM_ORDERS: 6336 },
    { index: 10, O_ORDERDATE: "1992-01-11T00:00:00.000", NUM_ORDERS: 6248 },
  ];

  const spec = {
    x_axis: {
      name: "O_ORDERDATE",
      domain: ["1992-01-01T00:00:00.000", "1992-01-05T00:00:00.000"],
    },
  };

  expect(zoomTransform(rows, spec)).toEqual([
    { index: 0, O_ORDERDATE: "1992-01-01T00:00:00.000", NUM_ORDERS: 6222 },
    { index: 1, O_ORDERDATE: "1992-01-02T00:00:00.000", NUM_ORDERS: 6179 },
    { index: 2, O_ORDERDATE: "1992-01-03T00:00:00.000", NUM_ORDERS: 6156 },
    { index: 3, O_ORDERDATE: "1992-01-04T00:00:00.000", NUM_ORDERS: 6317 },
    { index: 4, O_ORDERDATE: "1992-01-05T00:00:00.000", NUM_ORDERS: 6272 },
  ]);
});
