import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-tomorrow";
import { Modal } from "antd";
import { useSqlCompleters } from "components/sql/use_completers";
import { VizResponseContext } from "components/viz/viz_response";
import { useContext, useState } from "react";
import AceEditor from "react-ace";

const SqlEditorModal = ({ open, setOpen }) => {
  const { query, processQuery } = useContext(VizResponseContext);
  const [updatedQuery, setUpdatedQuery] = useState(query);
  useSqlCompleters();

  return (
    <Modal
      title="SQL Editor"
      width={1000}
      centered
      transitionName=""
      open={open}
      onOk={() => {
        setOpen(false);
        processQuery(updatedQuery);
      }}
      onCancel={() => setOpen(false)}
    >
      <AceEditor
        mode="sql"
        theme="tomorrow"
        width="100%"
        height="400px"
        value={updatedQuery}
        onChange={(value) => setUpdatedQuery(value)}
        name={"sql-editor"}
        setOptions={{ enableAutoIndent: true }}
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        enableBasicAutocompletion={true}
        enableLiveAutocompletion={true}
        commands={[
          {
            name: "submitCode",
            bindKey: { win: "Ctrl-Enter", mac: "Command-Enter" },
            exec: (editor) => {
              setOpen(false);
              processQuery(editor.getValue());
            },
          },
        ]}
      />
    </Modal>
  );
};

export default SqlEditorModal;
