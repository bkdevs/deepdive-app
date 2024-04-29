import { Card } from "antd";
import { objectEmpty } from "components/viz/spec_helper";
import VizResponse from "components/viz/viz_response";
import useSessionContext from "hooks/use_session_context";
import { useSessionWebsocket } from "hooks/use_session_websocket";
import { createContext, useState } from "react";
export const ResponseContext = createContext();

/**
 * @param {Message} message definition as in
 * https://github.com/bkdevs/deepdive-server/blob/main/server/deepdive/models.py
 */
const Response = (props) => {
  const { session, messageApi } = useSessionContext();
  const [message, setMessage] = useState(props);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedCount, setUpdatedCount] = useState(0);

  const onMessage = (event) => {
    setRefreshing(false);
    const response = JSON.parse(event.data);
    if (
      response["action"] === "process_sql_query" ||
      response["action"] === "update_visualization_spec"
    ) {
      if (response.data.id !== message.id) {
        return;
      }

      if (response["status"] === 200) {
        setMessage({
          ...message,
          sql_query: response.data.sql_query,
          data: response.data.data,
          visualization_spec: response.data.visualization_spec,
          error_message: response.data.error_message,
        });
      } else if (response["status"] === 400) {
        messageApi.error(`Error: ${response.error_message}`);
      }
      setUpdatedCount(updatedCount + 1);
    }
  };

  const { sendJsonMessage } = useSessionWebsocket(session, onMessage);

  const processQuery = (sqlQuery) => {
    setRefreshing(true);
    sendJsonMessage({
      action: "process_sql_query",
      message_id: message.id,
      sql_query: sqlQuery,
    });
  };

  const updateSpec = (vizSpec) => {
    setRefreshing(true);
    sendJsonMessage({
      action: "update_visualization_spec",
      message_id: message.id,
      visualization_spec: vizSpec,
    });
  };

  if (objectEmpty(message.visualization_spec)) {
    // as of now, if a viz spec is empty but a message is saved, this indicates we have a SQL query
    // but are choosing not to render it
    return <></>;
  }

  return (
    <Card className="shadow-lg">
      <VizResponse
        mode="edit"
        message={message}
        updateSpec={updateSpec}
        processQuery={processQuery}
        refreshing={refreshing}
        key={updatedCount} // remount VizResponse on server-side updates
      />
    </Card>
  );
};

export default Response;
