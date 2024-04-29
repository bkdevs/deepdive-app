import { Space } from "antd";
import Message from "components/messages/message";

const MessageHistory = ({ messages }) => {
  return (
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      {messages.map((props, idx) => (
        <Message key={idx} {...props} />
      ))}
      <div className="pt-10"></div>
    </Space>
  );
};

export default MessageHistory;
