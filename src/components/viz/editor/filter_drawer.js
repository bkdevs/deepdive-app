import {
  DeleteOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Input,
  InputNumber,
  Segmented,
  Select,
  Tooltip,
} from "antd";
import ChartEditorDrawer from "components/viz/editor/chart_editor_drawer";
import InlineSqlEditor from "components/viz/editor/inline_sql_editor";
import update, { extend } from "immutability-helper";
import { useState } from "react";
import useSessionContext from "hooks/use_session_context";
import { getColumnType } from "components/viz/spec_helper";

extend("$autoArray", function (value, object) {
  return object ? update(object, value) : update([], value);
});

const FILTER_TYPES = [
  { value: "simple", label: "Simple" },
  { value: "complex", label: "Complex" },
];

const OPERATOR_TYPES = [
  { value: "is", label: "is" },
  { value: "in", label: "in" },
  { value: "between", label: "between" },
  { value: "like", label: "like" },
];

const FilterIs = ({ filter, setFilter }) => {
  const value =
    filter.filter_type === "comparison" && filter.values?.length === 1
      ? filter.values[0]
      : "";
  const setValue = (value) =>
    setFilter({
      ...filter,
      filter_type: "comparison",
      values: [value],
      domain: undefined,
    });

  return (
    <>
      <div className="flex items-center">
        <p className="font-normal text-sm">Value</p>
        <Tooltip title="null can be specified to filter empty columns">
          <div className="ml-auto text-sm">
            <QuestionCircleOutlined />
          </div>
        </Tooltip>
      </div>
      <Input
        placeholder="value..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </>
  );
};

const FilterIn = ({ filter, setFilter }) => {
  const values = filter.filter_type === "comparison" ? filter.values : [];
  const updateValues = (changes) => {
    setFilter({
      ...update(filter, { values: { ...changes } }),
      filter_type: "comparison",
    });
  };

  return (
    <>
      <p className="text-sm font-normal">Values</p>
      {values.map((value, index) => (
        <div key={index} className="pb-2 flex space-x-1">
          <div className="w-10/12">
            <Input
              placeholder="value..."
              value={value}
              onChange={(e) =>
                updateValues({ [index]: { $set: e.target.value } })
              }
            />
          </div>
          <div className="w-1/12">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => updateValues({ $splice: [[index, 1]] })}
            />
          </div>
        </div>
      ))}

      <div className="content-start w-full">
        <Button
          type="dashed"
          onClick={() => {
            updateValues({ $autoArray: { $push: [""] } });
          }}
          block
        >
          <PlusOutlined />
          <span>Add a value</span>
        </Button>
      </div>
    </>
  );
};

const FilterBetweenNumeric = ({ domain, setDomain }) => {
  return (
    <>
      <div
        style={{
          display: "inline-block",
          width: "calc(50% - 8px)",
          marginBottom: "0px",
        }}
      >
        <div className="flex items-center">
          <p className="font-normal text-sm">Min</p>
          <Tooltip title="Specify a minimum value. If unset, no minimum will be applied.">
            <div className="ml-auto text-[10px] font-subdued text-gray-700">
              Optional
            </div>
          </Tooltip>
        </div>
        <InputNumber
          className="w-full"
          controls={false}
          placeholder="min..."
          value={domain[0]}
          onChange={(value) => setDomain([value, domain[1]])}
        />
      </div>
      <div
        style={{
          display: "inline-block",
          width: "calc(50% - 8px)",
          margin: "0 8px",
        }}
      >
        <div className="flex items-center">
          <p className="font-normal text-sm">Max</p>
          <Tooltip title="Specify a maximum value. If unset, no maximum will be applied.">
            <div className="ml-auto text-[10px] font-subdued text-gray-700">
              Optional
            </div>
          </Tooltip>
        </div>
        <InputNumber
          className="w-full"
          controls={false}
          placeholder="max..."
          value={domain[1]}
          onChange={(value) => setDomain([domain[0], value])}
        />
      </div>
    </>
  );
};

const FilterBetweenString = ({ domain, setDomain }) => {
  return (
    <>
      <div
        style={{
          display: "inline-block",
          width: "calc(50% - 8px)",
          marginBottom: "0px",
        }}
      >
        <p className="text-sm font-normal">Start</p>
        <Input
          placeholder="start..."
          value={domain[0]}
          onChange={(e) => setDomain([e.target.value, domain[1]])}
        />
      </div>
      <div
        style={{
          display: "inline-block",
          width: "calc(50% - 8px)",
          margin: "0 8px",
        }}
      >
        <p className="text-sm font-normal">End</p>
        <Input
          placeholder="end..."
          value={domain[1]}
          onChange={(e) => setDomain([domain[0], e.target.value])}
        />
      </div>
    </>
  );
};

const FilterBetween = ({ filter, setFilter }) => {
  const { databaseSchema } = useSessionContext();
  const filterColumnType = getColumnType(databaseSchema, filter.name);
  const isNumeric = filterColumnType === "int" || filterColumnType === "float";

  const domain = filter.domain || [undefined, undefined];
  const setDomain = (domain) =>
    setFilter({
      ...filter,
      filter_type: "numeric",
      domain: domain,
      values: undefined,
    });

  return isNumeric ? (
    <FilterBetweenNumeric domain={domain} setDomain={setDomain} />
  ) : (
    <FilterBetweenString domain={domain} setDomain={setDomain} />
  );
};

const FilterLike = ({ filter, setFilter }) => {
  const value =
    filter.filter_type === "like" && filter.values?.length === 1
      ? filter.values[0]
      : "";
  const setValue = (value) =>
    setFilter({
      ...filter,
      filter_type: "like",
      values: [value],
      domain: undefined,
    });

  return (
    <>
      <p className="text-sm font-normal">Value</p>
      <Input
        placeholder="value..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </>
  );
};

const FilterNegate = ({ filter, setFilter }) => {
  return (
    <div className="flex items-center pt-4 space-x-1">
      <Checkbox
        className="flex-row-reverse"
        checked={filter.negate}
        onChange={(e) => {
          setFilter({ ...filter, negate: e.target.checked });
        }}
      >
        <p className="text-sm font-normal">Negate</p>
      </Checkbox>
    </div>
  );
};

const getOperator = (filter) => {
  if (filter.filter_type === "comparison" && filter.values?.length === 1) {
    return "is";
  } else if (filter.filter_type === "comparison" && filter.values?.length > 1) {
    return "in";
  } else if (filter.filter_type === "numeric") {
    return "between";
  } else if (filter.filter_type === "like") {
    return "like";
  }
  return "is"; // default operator for a new filter
};

const FilterSimple = ({ filter, setFilter, axes }) => {
  const [operator, setOperator] = useState(getOperator(filter));
  const operators = {
    is: <FilterIs filter={filter} setFilter={setFilter} />,
    in: <FilterIn filter={filter} setFilter={setFilter} />,
    between: <FilterBetween filter={filter} setFilter={setFilter} />,
    like: <FilterLike filter={filter} setFilter={setFilter} />,
  };

  return (
    <>
      <p className="text-sm font-normal">Column</p>
      <Select
        placeholder="Select column"
        size="middle"
        className="w-full pb-4"
        showSearch
        options={axes}
        value={filter.name}
        onChange={(value) => setFilter({ name: value })}
      />
      {filter.name && (
        <div className="pb-4">
          <p className="text-sm font-normal">Operator</p>
          <Segmented
            size="default"
            options={OPERATOR_TYPES}
            value={operator}
            onChange={setOperator}
          />
        </div>
      )}
      {filter.name && operator && <>{operators[operator]}</>}
      {filter.name && <FilterNegate filter={filter} setFilter={setFilter} />}
    </>
  );
};

const FilterComplex = ({ filter, setFilter }) => {
  const expression = filter?.expression;
  const setExpression = (expression) =>
    setFilter({
      ...filter,
      name: "complex_filter",
      filter_type: "complex",
      expression: expression,
      values: undefined,
      domain: undefined,
    });

  return (
    <>
      <div className="flex">
        <div className="text-sm font-normal">Expression</div>
        <div className="ml-auto">
          <Tooltip title="Any valid SQL criteria is supported. e.g, where field1 = 'foo' or field2 = 'bar'">
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
      </div>
      <InlineSqlEditor
        name="filter-complex-expression-editor"
        value={expression}
        setValue={setExpression}
      />
    </>
  );
};

const FilterDrawer = ({ filter, setFilter, axes, open, onClose }) => {
  const [filterType, setFilterType] = useState(
    filter.filter_type === "complex" ? "complex" : "simple",
  );

  return (
    <ChartEditorDrawer title="Filter" open={open} onClose={onClose}>
      <p className="text-sm font-normal">Type</p>
      <Segmented
        size="default"
        options={FILTER_TYPES}
        value={filterType}
        onChange={setFilterType}
      />
      <div className="pb-4" />
      {filterType === "simple" ? (
        <FilterSimple filter={filter} setFilter={setFilter} axes={axes} />
      ) : (
        <FilterComplex filter={filter} setFilter={setFilter} />
      )}
    </ChartEditorDrawer>
  );
};

export default FilterDrawer;
