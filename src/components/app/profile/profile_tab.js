import { Button, Spin } from "antd";
import DeactivateAccountModal from "components/app/profile/deactivate_account_modal";
import { useUserProfileQuery } from "queries";
import { useState } from "react";

const ProfileTab = () => {
  const { data, isLoading } = useUserProfileQuery();
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return <Spin size="large" />;
  }

  return (
    <div className="pt-1 pl-1 w-full">
      <div className="flex flex-col">
        <div className="text-lg">Welcome back.</div>
        <div className="pb-4" />
        <div className="text-base">Email: {data.email}</div>
      </div>
      <Button
        danger
        type="text"
        onClick={() => setModalOpen(true)}
        className="text-xs absolute bottom-1 right-1"
      >
        Deactivate account
      </Button>
      <DeactivateAccountModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </div>
  );
};

export default ProfileTab;
