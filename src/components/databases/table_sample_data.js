import { Empty, Table } from "antd";

const getColumns = (tableSchema) => {
  if (!tableSchema) {
    return [];
  }

  return tableSchema.columns.map(({ name }, index) => ({
    title: name,
    dataIndex: index,
    key: index,
  }));
};

const TableSampleData = ({ tableSchema, sampleData }) => {
  const columns = getColumns(tableSchema);
  if (!columns || columns.length === 0) {
    return (
      <Empty description="No columns set. Add columns to preview your data" />
    );
  }

  return (
    <div>
      <p className="text-lg font-medium pb-2">Sample data</p>
      <Table
        className="block w-full"
        size="small"
        scroll={{ x: "100%" }}
        rowKey="index"
        columns={columns}
        dataSource={JSON.parse(sampleData).data}
        pagination={false}
      />
    </div>
  );
};

export default TableSampleData;
