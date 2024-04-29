import { Modal } from "antd";
import { authAxios } from "http/axios";
import { useState } from "react";
import useAuthStore from "store/auth_store";

const DeactivateAccountModal = ({ modalOpen, setModalOpen }) => {
  const [loading, setLoading] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  const onDelete = () => {
    setLoading(true);
    authAxios
      .delete("auth/delete/")
      .then(() => logout())
      .finally(() => {
        setLoading(false);
        setModalOpen(false);
      });
  };

  return (
    <Modal
      title="Deactivate account"
      transitionName=""
      open={modalOpen}
      onOk={onDelete}
      onCancel={() => setModalOpen(false)}
      okText="Delete"
      okType="danger"
      confirmLoading={loading}
      width={400}
    >
      Are you sure you want to deactivate your account? This action is permanent
      and irreversible. All sessions and databases will be deleted permanently.
    </Modal>
  );
};

export default DeactivateAccountModal;
