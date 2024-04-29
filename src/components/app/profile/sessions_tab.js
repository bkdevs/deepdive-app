import { DeleteOutlined } from "@ant-design/icons";
import { Button, List, Spin } from "antd";
import DeleteSessionModal from "components/app/profile/delete_session_modal";
import { PAGE_SIZE } from "components/app/profile/profile_util";
import update from "immutability-helper";
import moment from "moment";
import { useSessionsQuery } from "queries";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SessionListItem = ({ session, removeSession }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

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
            onClick={() => navigate(`/app/sessions/${session.id}`)}
          >
            {session.name}
          </Button>
        </div>
        <div className="font-subdued text-gray-400">
          {moment(session.timestamp).format("MMMM Do, h:mm a")}
        </div>
      </div>
      <DeleteSessionModal
        session={session}
        removeSession={removeSession}
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
      />
    </List.Item>
  );
};

const SessionsTab = () => {
  const [sessions, setSessions] = useState([]);
  const { data, isLoading } = useSessionsQuery();

  useEffect(() => {
    data && setSessions(data);
  }, [data, setSessions]);

  if (isLoading) {
    return <Spin size="large" />;
  }

  return (
    <List
      size="large"
      dataSource={sessions}
      pagination={{
        pageSize: PAGE_SIZE,
        showSizeChanger: false,
      }}
      renderItem={(item, index) => (
        <SessionListItem
          session={item}
          removeSession={() =>
            setSessions(update(sessions, { $splice: [[index, 1]] }))
          }
        />
      )}
    />
  );
};

export default SessionsTab;
