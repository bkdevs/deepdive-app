import { EditOutlined } from "@ant-design/icons";
import { Button, Input, Tooltip } from "antd";
import useSessionContext from "hooks/use_session_context";
import { useState } from "react";

const ReportVizTitleEdit = ({ title, setTitle, setEditing }) => {
  return (
    <div className="flex">
      <div className="flex items-center space-x-1 w-2/3">
        <Input
          autoSize={true}
          className="text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onPressEnter={() => setEditing(false)}
        />
        <div>
          <Button
            className="mx-0"
            type="primary"
            onClick={() => setEditing(false)}
          >
            Ok
          </Button>
        </div>
      </div>
    </div>
  );
};

const ReportVizTitleView = ({ title, setEditing }) => {
  return (
    <div className="flex items-baseline space-x-1">
      <p className="text-base font-normal">{title}</p>
      <div className="text-[14px]">
        <Tooltip title="Edit visualization title">
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

const ReportVizTitle = ({ viz, setViz }) => {
  const [editing, setEditing] = useState(false);
  const { messageApi } = useSessionContext();

  return (
    <>
      {editing ? (
        <ReportVizTitleEdit
          vizId={viz.id}
          title={viz.title}
          setTitle={(title) => setViz({ ...viz, title: title })}
          setEditing={setEditing}
          messageApi={messageApi}
        />
      ) : (
        <ReportVizTitleView title={viz.title} setEditing={setEditing} />
      )}
    </>
  );
};

export default ReportVizTitle;
