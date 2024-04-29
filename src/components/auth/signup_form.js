import { Button, Form, Input, Typography } from "antd";
import { unauthAxios } from "http/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const SignupForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const onFinish = (values) => {
    setSubmitting(true);
    unauthAxios
      .post("/auth/register/", values)
      .then(() =>
        navigate("/login", {
          state: {
            message: {
              key: "account_created",
              type: "success",
              content: "Account successfully created. Please login",
            },
          },
        }),
      )
      .catch((e) => setErrors(JSON.parse(e.request.response)))
      .finally(() => setSubmitting(false));
  };

  return (
    <Form
      name="signup"
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
        validateStatus={errors?.email && "error"}
        validateTrigger="onSubmit"
        help={errors?.email}
      >
        <Input
          prefix={<UserOutlined style={{ color: "rgb(0,0,0,.25)" }} />}
          placeholder="Email address"
        />
      </Form.Item>

      <Form.Item
        style={{ marginBottom: "8px" }}
        label={
          <Typography.Text type="secondary" strong={true}>
            Password
          </Typography.Text>
        }
        name="password1"
        rules={[{ required: true, message: "Please input your password" }]}
        validateStatus={errors?.password && "error"}
        help={errors?.password}
      >
        <Input.Password
          prefix={<LockOutlined style={{ color: "rgb(0,0,0,.25)" }} />}
          placeholder="Password"
        />
      </Form.Item>

      <Form.Item
        style={{ marginBottom: "16px" }}
        label={
          <Typography.Text type="secondary" strong={true}>
            Confirm password
          </Typography.Text>
        }
        name="password2"
        rules={[{ required: true, message: "Please confirm your password" }]}
        validateStatus={errors?.non_field_errors && "error"}
        help={errors?.non_field_errors}
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
          Sign Up
        </Button>
      </Form.Item>
    </Form>
  );
};
export default SignupForm;
