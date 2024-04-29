import {
  aggregateRows,
  averageRow,
  mergeRows,
} from "components/viz/transforms/helper";

test("merge rows", () => {
  const a = { index: 397, MONTH: "1992-01", ORDER_COUNT: 3737 };
  const b = { index: 398, MONTH: "1992-01", ORDER_COUNT: 3969 };
  expect(mergeRows(a, b, "MONTH")).toEqual({
    index: 397,
    MONTH: "1992-01",
    ORDER_COUNT: 7706,
  });
});

test("average rows", () => {
  const a = { index: 397, X_AXIS: 100, ORDER_COUNT: 3737 };
  expect(averageRow(a, 10, "X_AXIS")).toEqual({
    index: 397,
    X_AXIS: 100,
    ORDER_COUNT: 3737 / 10,
  });
});

test("aggregate rows", () => {
  const rowDict = {
    "1992-01": [
      { index: 397, MONTH: "1992-01", ORDER_COUNT: 3737 },
      { index: 398, MONTH: "1992-01", ORDER_COUNT: 3969 },
    ],
    "1992-02": [{ index: 399, MONTH: "1992-02", ORDER_COUNT: 4020 }],
  };
  expect(aggregateRows(rowDict, "MONTH")).toEqual([
    { index: 397, MONTH: "1992-01", ORDER_COUNT: 7706 },
    { index: 399, MONTH: "1992-02", ORDER_COUNT: 4020 },
  ]);
});
