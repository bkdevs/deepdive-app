import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { InputNumber, Segmented, Select } from "antd";

const SortEditor = ({ activeAxes, sortBy, setSortBy, limit, setLimit }) => {
  return (
    <div>
      <p className="text-xs font-medium">Sort by</p>
      <Select
        placeholder="Select column"
        size="middle"
        className="w-full pb-2"
        showSearch
        options={activeAxes}
        value={sortBy.name}
        onChange={(value) => setSortBy({ ...sortBy, name: value })}
        allowClear
      />
      {sortBy.name && (
        <div className="pb-2">
          <p className="text-xs font-medium">Order </p>
          <Segmented
            size="small"
            options={[
              {
                value: "asc",
                icon: <ArrowUpOutlined />,
              },
              {
                value: "desc",
                icon: <ArrowDownOutlined />,
              },
            ]}
            value={sortBy.direction || "asc"}
            onChange={(value) => setSortBy({ ...sortBy, direction: value })}
          />
        </div>
      )}
      <p className="text-xs font-medium">Limit</p>
      <InputNumber
        placeholder="limit rows..."
        value={limit}
        max={1000}
        onChange={setLimit}
      />
    </div>
  );
};

export default SortEditor;
