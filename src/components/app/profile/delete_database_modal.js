import { Modal } from "antd";
import useProfileContext from "hooks/use_profile_context";
import { authAxios } from "http/axios";
import { useDatabasesQuery, useSessionsQuery } from "queries";
import { useState } from "react";

const DeleteDatabaseModal = ({
  database,
  removeDatabase,
  modalOpen,
  setModalOpen,
}) => {
  const [loading, setLoading] = useState(false);
  const { messageApi } = useProfileContext();
  const { refetch: refetchSessions } = useSessionsQuery();
  const { refetch: refetchDatabases } = useDatabasesQuery();

  const onDelete = () => {
    setLoading(true);
    authAxios
      .delete(`/databases/${database.id}/`)
      .then(() => {
        messageApi.success(`Database ${database.name} deleted`);
        refetchSessions();
        refetchDatabases();
      })
      .finally(() => {
        removeDatabase();
        setLoading(false);
        setModalOpen(false);
      });
  };

  return (
    <Modal
      title="Delete database"
      transitionName=""
      open={modalOpen}
      onOk={onDelete}
      onCancel={() => setModalOpen(false)}
      okText="Delete"
      okType="danger"
      confirmLoading={loading}
      width={400}
    >
      Are you sure you want to delete{" "}
      <span className="font-bold">{database.name}?</span> This action is
      permanent and irreversible.
    </Modal>
  );
};

export default DeleteDatabaseModal;
