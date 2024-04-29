import { DEEPDIVE_SERVER_WS } from "constants";
import useSessionContext from "hooks/use_session_context";
import { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export const useSessionWebsocket = (session, onMessage) => {
  const { sendJsonMessage, getWebSocket, readyState } = useWebSocket(
    `${DEEPDIVE_SERVER_WS}/sessions/${session.id}/`,
    {
      onMessage: onMessage,
      shouldReconnect: (closeEvent) => true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
      share: true,
    },
  );

  useEffect(() => {
    // TODO: this logic no longer works, since because share: true
    // we're using a proxy shared websocket instance that the react lib provides
    // so if session tables changed (we should send something to the consumer)
    // to re-initialize the prompt (and whatever else needs changing)
    if (readyState === ReadyState.OPEN) {
      getWebSocket().close();
    }
  }, [session.tables]); // eslint-disable-line

  return { sendJsonMessage, readyState };
};

const useSessionAction = (actionType, callback, errorHandler) => {
  const { session } = useSessionContext();
  const onMessage = (event) => {
    const response = JSON.parse(event.data);
    if (response["action"] !== actionType) {
      return;
    }

    if (response["status"] === 200) {
      callback(response);
    } else if (response["status"] === 400) {
      errorHandler(response);
    }
  };

  const { sendJsonMessage } = useSessionWebsocket(session, onMessage);
  return (params) => {
    sendJsonMessage({
      action: actionType,
      ...params,
    });
  };
};

export const useGenerateReport = (callback) => {
  return useSessionAction("generate_report", callback, () => {});
};

export const useAddViz = (callback) => {
  return useSessionAction("add_viz", callback, () => {});
};

export const useRemoveViz = () => {
  return useSessionAction(
    "remove_viz",
    () => {},
    () => {},
  );
};

export const usePreviewViz = (callback, errorHandler) => {
  return useSessionAction("preview_viz", callback, errorHandler);
};

export const useCommitViz = (callback) => {
  return useSessionAction("commit_viz", callback, () => {});
};
