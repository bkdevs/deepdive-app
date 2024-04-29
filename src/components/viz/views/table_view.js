import { Table, Tooltip } from "antd";
import { getSorter } from "components/app/helper";
import moment from "moment";

const getHighlighter = (type, text) => {
  if (!shouldTruncate(type)) {
    return text;
  } else {
    return (
      <Tooltip placement="topLeft" title={text}>
        {text}
      </Tooltip>
    );
  }
};

const shouldTruncate = (type) => {
  return type === "string";
};

const getRender = (type, text) => {
  if (type === "datetime") {
    text = moment(text).format("MM-DD-YYYY");
  }
  return getHighlighter(type, text);
};

const getColumns = (schema) => {
  return schema?.fields
    .filter(({ name, _ }) => name !== "index")
    .map(({ name, type }) => ({
      title: name,
      dataIndex: name,
      width: name.length * 10, // rough heuristic logic to get pixel length of title
      key: name,
      sorter: getSorter(name, type),
      render: (text) => getRender(type, text),
      ellipsis: shouldTruncate(type) && { showTitle: false },
    }));
};

const TableView = ({ schema, rows }) => {
  const columns = getColumns(schema);

  return (
    <Table
      scroll={{ x: "100%" }}
      dataSource={rows}
      columns={columns}
      rowKey={"index"}
      sortDirections={["ascend", "descend"]}
      size={"small"}
      pagination={{ defaultPageSize: 10 }}
    />
  );
};

export default TableView;
