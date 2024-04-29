import { CopyOutlined } from "@ant-design/icons";
import { Button, Divider, Modal } from "antd";
import useSessionContext from "hooks/use_session_context";
import { authAxios } from "http/axios";
import { useState } from "react";

const DEFAULT_BUTTON_TEXT = "Copy Link";

const ShareSessionModal = ({ modalOpen, setModalOpen }) => {
  const [buttonText, setButtonText] = useState(DEFAULT_BUTTON_TEXT);
  const { session, messageApi } = useSessionContext();

  const onClick = async () => {
    setButtonText("Copying");
    const { data } = await authAxios.post(`share/${session.id}/`);
    navigator.clipboard.writeText(`${window.location.origin}/share/${data.id}`);
    setButtonText(DEFAULT_BUTTON_TEXT);
    setModalOpen(false);
    messageApi.open({
      key: "share_session_link_copied",
      type: "success",
      content: "Shareable link copied!",
      duration: 5,
    });
  };

  return (
    <Modal
      title="Share report"
      open={modalOpen}
      onCancel={() => setModalOpen(false)}
      width={500}
      transitionName=""
      footer={[
        <Button
          type="primary"
          icon={<CopyOutlined />}
          loading={buttonText !== DEFAULT_BUTTON_TEXT}
          onClick={onClick}
        >
          {buttonText}
        </Button>,
      ]}
    >
      <Divider />
      <div>
        Create a shareable link. Changes you make after creating your link won't
        be shared. Anyone with the URL will be able to view the shared session.
      </div>
    </Modal>
  );
};

export default ShareSessionModal;
