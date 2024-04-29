import { Button, Form, Input, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import useAuthStore from "store/auth_store";

const LoginForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setSubmitting(true);
    login(values)
      .then(() => navigate("/app"))
      .catch((e) => setErrors(JSON.parse(e.request.response)))
      .finally(() => setSubmitting(false));
  };

  return (
    <Form
      name="login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      requiredMark={false}
      autoComplete="off"
      layout="vertical"
    >
      <Form.Item
        style={{ marginBottom: "8px" }}
        label={
          <Typography.Text type="secondary" strong={true}>
            Email address
          </Typography.Text>
        }
        name="email"
        rules={[
          { required: true, message: "Please input your email address" },
          { type: "email", message: "Please input a valid email address" },
        ]}
        validateStatus={errors?.non_field_errors && "error"}
        validateTrigger="onSubmit"
      >
        <Input
          prefix={<UserOutlined style={{ color: "rgb(0,0,0,.25)" }} />}
          placeholder="Email address"
        />
      </Form.Item>
      <Form.Item
        style={{ marginBottom: "16px" }}
        label={
          <Typography.Text type="secondary" strong={true}>
            Password
          </Typography.Text>
        }
        name="password"
        rules={[{ required: true, message: "Please input your password" }]}
        validateStatus={(errors?.detail || errors?.non_field_errors) && "error"}
        help={errors?.detail || errors?.non_field_errors}
      >
        <Input.Password
          prefix={<LockOutlined style={{ color: "rgb(0,0,0,.25)" }} />}
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: "100%" }}
          loading={submitting}
        >
          Log In
        </Button>
      </Form.Item>
    </Form>
  );
};
export default LoginForm;
