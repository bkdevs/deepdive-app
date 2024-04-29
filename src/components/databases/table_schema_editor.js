import { Popover, Input, Select } from "antd";
import update from "immutability-helper";
import { QuestionCircleOutlined } from "@ant-design/icons";

const COLUMN_TYPES = [
  {
    value: "id",
    label: "id",
  },
  {
    value: "text",
    label: "text",
  },
  {
    value: "int",
    label: "int",
  },
  {
    value: "float",
    label: "float",
  },
  {
    value: "boolean",
    label: "bool",
  },
  {
    value: "date",
    label: "date",
  },
  {
    value: "time",
    label: "time",
  },
];

const TableColumnEditor = ({ columnSchema, setColumnSchema }) => {
  return (
    <div className="grid grid-cols-8 gap-2 pb-2">
      <div className="col-span-3">
        <div className="flex flex-row space-x-1 ">
          <p className="text-sm">Type:</p>
          <Select
            size="middle"
            value={columnSchema.column_type}
            onChange={(value) =>
              setColumnSchema({ ...columnSchema, column_type: value })
            }
            className="w-full"
            options={COLUMN_TYPES}
          ></Select>
        </div>
      </div>

      <div className="col-span-5">
        <div className="flex flex-row space-x-1">
          <p className="text-sm">Name:</p>
          <Input
            size="middle"
            className="w-full"
            value={columnSchema.name}
            onChange={(e) => {
              setColumnSchema({ ...columnSchema, name: e.target.value });
            }}
          />
        </div>
      </div>
    </div>
  );
};

const TableSchemaEditor = ({ tableSchema, setTableSchema }) => {
  const columnHelp = (
    <div className="w-60">
      <p className="text-sm font-medium">Columns</p>
      <p className="text-xs">
        Configure columns for your file. <br />
        DeepDive works best when given human-readable names and appropriate data
        types
      </p>
    </div>
  );

  return (
    <div>
      <div className="flex items-center pb-2">
        <p className="text-lg font-medium">Columns</p>
        <div className="ml-auto text-sm">
          <Popover content={columnHelp} trigger="hover">
            <QuestionCircleOutlined />
          </Popover>
        </div>
      </div>
      {tableSchema.columns.map((columnSchema, index) => (
        <TableColumnEditor
          key={index}
          columnSchema={columnSchema}
          setColumnSchema={(columnSchema) =>
            setTableSchema(
              update(tableSchema, {
                columns: {
                  [index]: { $merge: columnSchema },
                },
              }),
            )
          }
        />
      ))}
    </div>
  );
};

export default TableSchemaEditor;
