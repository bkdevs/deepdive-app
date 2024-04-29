import { Card, Col, Divider, Row, Typography } from "antd";
import useSessionContext from "hooks/use_session_context";

const StarterQuestions = ({ askQuestion }) => {
  const { database } = useSessionContext();
  const starterQuestions = database?.starter_questions;

  if (!starterQuestions) {
    return <></>;
  }
  return (
    <>
      <Row justify="start" style={{ width: "100%", marginBottom: "0px" }}>
        <Col span={6}>
          <Typography.Title level={4}>
            Get started, try asking:
          </Typography.Title>
        </Col>
      </Row>
      <Divider style={{ marginBottom: "16px", marginTop: "0px" }} />
      <Row justify="center" gutter={16} style={{ width: "100%" }}>
        {starterQuestions.map((question) => (
          <Col span={6}>
            <div onClick={() => askQuestion(question)}>
              <Card hoverable={true} bordered={false}>
                {question}
              </Card>
            </div>
          </Col>
        ))}
      </Row>
    </>
  );
};
export default StarterQuestions;
