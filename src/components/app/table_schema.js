import { Table } from "antd";
import { getSorter } from "components/app/helper";

const columns = [
  {
    title: "Column",
    dataIndex: "name",
    key: "name",
    sorter: getSorter("name", "string"),
  },
  {
    title: "Type",
    dataIndex: "column_type",
    key: "column_type",
    sorter: getSorter("column_type", "string"),
  },
  {
    title: "Primary key",
    dataIndex: "primaryKey",
    key: "primaryKey",
    render: (val) => <div>{val ? "true" : "false"}</div>,
    sorter: getSorter("primaryKey", "integer"),
  },
  {
    title: "Comment",
    dataIndex: "comment",
    key: "comment",
    sorter: getSorter("comment", "string"),
  },
];

const TableSchema = ({ tableSchema }) => {
  return (
    <div>
      <Table
        rowKey="name"
        dataSource={tableSchema.columns}
        columns={columns}
        size={"small"}
        pagination={false}
      />
    </div>
  );
};

export default TableSchema;
