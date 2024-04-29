import { Col, Divider, Row, Space, Typography, message } from "antd";
import LoginForm from "components/auth/login_form";
import SocialAuthButton from "components/auth/social_auth_button";
import Logo from "components/home/logo";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Login = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { state } = useLocation();

  useEffect(() => {
    if (state?.message) {
      messageApi.open({
        key: state.message.key,
        type: state.message.type,
        content: state.message.content,
        duration: 5,
      });
      return () => messageApi.destroy(state.message.key);
    }
  }, [state, messageApi]);

  return (
    <>
      {contextHolder}
      <Row
        type="flex"
        align="middle"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <Col span={6}>
          <Row align="middle" justify="center">
            <Logo />
          </Row>
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <Row align="middle" justify="center">
              <Typography.Title level={3}>
                Log in to your account
              </Typography.Title>
            </Row>
            <LoginForm />
          </Space>
          <Typography.Text>
            Don't have an account?{" "}
            <a href="/signup" style={{ color: "rgb(22, 119, 255)" }}>
              Register now!
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
    </>
  );
};
export default Login;
