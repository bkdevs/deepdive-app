import { AutoComplete, Input, Typography } from "antd";
import { forwardRef } from "react";
import { ReadyState } from "react-use-websocket";

const COMMAND_OPTIONS = [
  {
    label: (
      <div
        style={{
          display: "flex",
          justifyContent: "start",
        }}
      >
        <span>
          <Typography.Text type="secondary">/tables</Typography.Text>
          {": "}
          {"Show all tables active in the session"}
        </span>
      </div>
    ),
    value: "/tables",
  },
];

const AskInput = forwardRef(
  (
    { input, setInput, askQuestion, readyState, waiting, processCommand },
    ref,
  ) => {
    return (
      <>
        <AutoComplete
          ref={ref}
          autoFocus={true}
          style={{ width: "100%" }}
          options={COMMAND_OPTIONS}
          open={input.startsWith("/")}
          value={input}
          onSelect={processCommand}
        >
          <Input.Search
            size="large"
            autoFocus={true}
            enterButton
            placeholder="Ask..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSearch={(value, _) => askQuestion(value)}
            loading={waiting || readyState !== ReadyState.OPEN}
          />
        </AutoComplete>
      </>
    );
  },
);

export default AskInput;
