import { Col, Divider, Row, Space, Typography } from "antd";
import SocialAuthButton from "components/auth/social_auth_button";
import SignupForm from "components/auth/signup_form";
import Logo from "components/home/logo";

const Signup = () => {
  return (
    <Row
      type="flex"
      justify="center"
      align="middle"
      style={{ minHeight: "100vh" }}
    >
      <Col span={6}>
        <Row align="middle" justify="center">
          <Logo />
        </Row>
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
          <Row align="middle" justify="center">
            <Typography.Title level={3}>Create a new account</Typography.Title>
          </Row>
          <SignupForm />
        </Space>
        <Typography.Text>
          Already have an account?{" "}
          <a href="/login" style={{ color: "rgb(22, 119, 255)" }}>
            Log in
          </a>
        </Typography.Text>
        <Divider>OR</Divider>
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
          <SocialAuthButton provider="google" label="Google" />
          <SocialAuthButton provider="linkedin_oauth2" label="LinkedIn" />
          <SocialAuthButton provider="github" label="Github" />
        </Space>
      </Col>
    </Row>
  );
};
export default Signup;
