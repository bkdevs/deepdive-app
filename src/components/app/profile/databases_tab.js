import { DeleteOutlined } from "@ant-design/icons";
import { Button, List, Spin } from "antd";
import DeleteDatabaseModal from "components/app/profile/delete_database_modal";
import { PAGE_SIZE } from "components/app/profile/profile_util";
import update from "immutability-helper";
import moment from "moment";
import { useDatabasesQuery } from "queries";
import { useEffect, useState } from "react";

const DatabaseListItem = ({ database, removeDatabase }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <List.Item
      style={{ paddingTop: 6, paddingBottom: 6 }}
      actions={[
        <Button
          danger
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => setDeleteModalOpen(true)}
        />,
      ]}
    >
      <div className="flex flex-col">
        <div>
          <Button
            type="link"
            className="text-sm px-0 py-0 text-inherit"
            style={{
              borderWidth: "0px 0px 0px 0px",
            }}
          >
            {database.name}
          </Button>
        </div>
        <div className="font-subdued text-gray-400">
          {moment(database.timestamp).format("MMMM Do, h:mm a")}
        </div>
      </div>
      <DeleteDatabaseModal
        database={database}
        removeDatabase={removeDatabase}
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
      />
    </List.Item>
  );
};

const DatabasesTab = () => {
  const [databases, setDatabases] = useState([]);
  const { data, isLoading } = useDatabasesQuery();

  useEffect(() => {
    data && setDatabases(data);
  }, [data, setDatabases]);

  if (isLoading) {
    return <Spin size="large" />;
  }

  return (
    <List
      size="large"
      dataSource={databases}
      pagination={{
        pageSize: PAGE_SIZE,
        showSizeChanger: false,
      }}
      renderItem={(item, index) => (
        <DatabaseListItem
          database={item}
          removeDatabase={() =>
            setDatabases(update(databases, { $splice: [[index, 1]] }))
          }
        />
      )}
    />
  );
};

export default DatabasesTab;
