import { Col, Row } from "antd";
import AskInput from "components/app/ask_input";
import DatabaseDrawer from "components/app/database_drawer";
import MessageHistory from "components/app/message_history";
import StarterQuestions from "components/app/starter_questions";
import { objectEmpty } from "components/viz/spec_helper";
import { useSessionWebsocket } from "hooks/use_session_websocket";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ReadyState } from "react-use-websocket";
import { SIDER_EXPANDED_WIDTH } from "routes/app_layout_constants";
import { SessionContext } from "routes/session";

const COMMAND_ALIASES = {
  "show tables": "/tables",
  "desc tables": "/tables",
  "describe tables": "/tables",
  "show columns": "/tables",
  ".tables": "/tables",
};

const SessionEditor = ({ initialMessages }) => {
  const { session, messageApi } = useContext(SessionContext);
  const [messages, setMessages] = useState(initialMessages);
  const [waiting, setWaiting] = useState(false);
  const [input, setInput] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const askInputRef = useRef(null);
  const bottom = useRef(null);
  useEffect(() => {
    bottom?.current.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  const handleKeyUp = (event) => {
    if (document.activeElement.tagName === "BODY" && event?.keyCode === 13) {
      askInputRef.current.focus();
    }
  };

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const onMessage = (event) => {
    const response = JSON.parse(event.data);
    setWaiting(false);
    if (
      response["status"] === 200 &&
      response["action"] === "process_question"
    ) {
      if (objectEmpty(response.data.visualization_spec)) {
        messageApi.error(
          "Failed to process question: " + response.data.error_message,
        );
        return;
      }
      if (messages.every((message) => message.id !== response.data.id)) {
        setMessages((prev) => prev.concat(response.data));
      }
    }
  };

  const { sendJsonMessage, readyState } = useSessionWebsocket(
    session,
    onMessage,
  );

  useEffect(() => {
    if (ReadyState.CONNECTING === readyState) {
      setTimeout(() => {
        messageApi.open({
          key: "loading_session",
          type: "loading",
          content: <span className="text-xs py-0 px-0">Loading session</span>,
          duration: 0,
        });
      });
    } else {
      messageApi.destroy("loading_session");
      setTimeout(() => {
        messageApi.success("Session loaded", 2.5);
      }, 200);
    }
  }, [readyState, messageApi]);

  const processCommand = (command) => {
    if (command === "/tables") {
      setInput("");
      setDrawerOpen(true);
    }
  };

  const askQuestion = (value) => {
    if (value.startsWith("/")) {
      return processCommand(value);
    }
    if (value.toLowerCase() in COMMAND_ALIASES) {
      return processCommand(COMMAND_ALIASES[value.toLowerCase()]);
    }

    setMessages((prev) => prev.concat({ message_type: "Q", question: value }));
    setWaiting(true);
    setInput("");
    sendJsonMessage({
      action: "process_question",
      question: value,
    });
  };

  const starterQuestions = useMemo(
    () => <StarterQuestions askQuestion={askQuestion} />, // eslint-disable-next-line
    [],
  );
  const messageHistory = useMemo(
    () => <MessageHistory messages={messages} />,
    [messages],
  );
  const databaseDrawer = useMemo(
    () => <DatabaseDrawer open={drawerOpen} setOpen={setDrawerOpen} />,
    [drawerOpen],
  );

  return (
    <div>
      <div>{messages.length > 0 ? messageHistory : starterQuestions}</div>
      <div
        style={{
          marginTop: 12,
          paddingBottom: 12,
          position: "fixed",
          bottom: 0,
          left: SIDER_EXPANDED_WIDTH,
          width: "100%",
          zIndex: 50,
        }}
      >
        {databaseDrawer}
        <Row>
          <Col span={12} offset={4}>
            <AskInput
              ref={askInputRef}
              input={input}
              setInput={setInput}
              askQuestion={askQuestion}
              readyState={readyState}
              waiting={waiting}
              processCommand={processCommand}
            />
          </Col>
        </Row>
      </div>
      <div ref={bottom} />
    </div>
  );
};
export default SessionEditor;
