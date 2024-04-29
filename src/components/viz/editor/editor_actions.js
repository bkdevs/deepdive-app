import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Tooltip, message } from "antd";
import SqlEditorModal from "components/sql/sql_editor_modal";
import { VizResponseContext } from "components/viz/viz_response";
import { useAddViz } from "hooks/use_session_websocket";
import { useVisualizationsQuery } from "queries";
import { useContext, useState } from "react";

const EditorActions = () => {
  const { messageId } = useContext(VizResponseContext);
  const [sqlEditorOpen, setSqlEditorOpen] = useState(false);
  const [messageInstance, contextHolder] = message.useMessage();
  const { refetch } = useVisualizationsQuery();

  const addViz = useAddViz(() => {
    messageInstance.success("Successfully added to report");
    refetch();
  });

  return (
    <>
      {contextHolder}
      <div className="flex flex-row space-x-1">
        <Tooltip title="Edit SQL query">
          <Button
            icon={<EditOutlined />}
            onClick={() => setSqlEditorOpen(true)}
          />
        </Tooltip>
        <Tooltip title="Add to report">
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              addViz({ message_id: messageId });
            }}
          />
        </Tooltip>
      </div>
      <SqlEditorModal open={sqlEditorOpen} setOpen={setSqlEditorOpen} />
    </>
  );
};

export default EditorActions;
