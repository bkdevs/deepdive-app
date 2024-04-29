import AceEditor from "react-ace";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-tomorrow";

import { useSqlCompleters } from "components/sql/use_completers";
const InlineSqlEditor = ({ name, value, setValue }) => {
  useSqlCompleters();
  return (
    <AceEditor
      mode="sql"
      theme="tomorrow"
      width="100%"
      height="100px"
      value={value}
      onChange={setValue}
      name={name}
      setOptions={{ enableAutoIndent: true, showLineNumbers: false }}
      fontSize={12}
      enableBasicAutocompletion={true}
      wrapEnabled={true}
      enableLiveAutocompletion={true}
      showPrintMargin={false}
      showGutter={true}
    />
  );
};

export default InlineSqlEditor;
