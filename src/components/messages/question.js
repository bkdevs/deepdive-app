import { theme } from "antd";

/**
 * @param {Message} message definition as in
 * https://github.com/bkdevs/deepdive-server/blob/main/server/deepdive/models.py
 */
const Question = ({ question }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <div
      className="rounded-lg shadow-lg"
      style={{
        whiteSpace: "pre-wrap",
        padding: 12,
        background: colorBgContainer,
      }}
    >
      {question}
    </div>
  );
};

export default Question;
