import { Modal } from "antd";
import useProfileContext from "hooks/use_profile_context";
import { authAxios } from "http/axios";
import { useSessionsQuery } from "queries";
import { useState } from "react";

const DeleteSessionModal = ({
  session,
  removeSession,
  modalOpen,
  setModalOpen,
}) => {
  const [loading, setLoading] = useState(false);
  const { messageApi } = useProfileContext();
  const { refetch } = useSessionsQuery();

  const onDelete = () => {
    setLoading(true);
    authAxios
      .delete(`/sessions/${session.id}/`)
      .then(() => {
        messageApi.success(`Session ${session.name} deleted`);
        refetch();
      })
      .finally(() => {
        removeSession();
        setLoading(false);
        setModalOpen(false);
      });
  };

  return (
    <Modal
      title="Delete session"
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
      <span className="font-bold">{session.name}?</span> This action is
      permanent and irreversible.
    </Modal>
  );
};

export default DeleteSessionModal;
