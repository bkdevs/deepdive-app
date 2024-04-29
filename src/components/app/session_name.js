import { EditOutlined } from "@ant-design/icons";
import { Button, Input, Spin, Tooltip, message } from "antd";
import { useState } from "react";
import { authAxios } from "http/axios";

const SessionNameEdit = ({
  sessionId,
  sessionName,
  setSessionName,
  setEditing,
  messageApi,
}) => {
  const [updating, setUpdating] = useState(false);
  const updateSessionName = (sessionName) =>
    authAxios
      .patch(`/sessions/${sessionId}/`, { name: sessionName })
      .then(() => {
        setUpdating(false);
        setEditing(false);
        messageApi.success("Updated session name");
      })
      .catch(() => {
        setUpdating(false);
        setEditing(false);
        messageApi.error("Failed to update session name, try again");
      });

  return (
    <div className="flex">
      <div className="grow">
        <p className="text-sm">Sessions /</p>
        {updating ? (
          <Spin />
        ) : (
          <div className="flex items-center space-x-1">
            <div className="grow">
              <Input
                className="text-sm"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                onPressEnter={() => {
                  setUpdating(true);
                  updateSessionName(sessionName);
                }}
              />
            </div>
            <div className="ml-auto">
              <Button
                className="mx-0"
                type="primary"
                onClick={() => {
                  setUpdating(true);
                  updateSessionName(sessionName);
                }}
              >
                Ok
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SessionNameView = ({ sessionName, setEditing }) => {
  return (
    <div className="flex items-center">
      <div className="grow">
        <p className="text-sm">Sessions /</p>
        <p className="text-sm text-black">{sessionName}</p>
      </div>
      <div className="ml-auto text-[10px]">
        <Tooltip title="Edit session name">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => setEditing(true)}
          />
        </Tooltip>
      </div>
    </div>
  );
};

const SessionName = ({ session }) => {
  const [sessionName, setSessionName] = useState(session.name);
  const [editing, setEditing] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <>
      {contextHolder}
      {editing ? (
        <SessionNameEdit
          sessionId={session.id}
          sessionName={sessionName}
          setSessionName={setSessionName}
          setEditing={setEditing}
          messageApi={messageApi}
        />
      ) : (
        <SessionNameView sessionName={sessionName} setEditing={setEditing} />
      )}
    </>
  );
};

export default SessionName;
