import { Button, Form, Input, message } from "antd";
import { authAxios } from "http/axios";
import { useDatabasesQuery } from "queries";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SnowflakeOnboardingForm = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { refetch } = useDatabasesQuery();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (errors?.non_field_errors) {
      messageApi.open({
        key: "snowflake_onboarding_error",
        type: "error",
        content: errors.non_field_errors,
        duration: 5,
      });
      return () => messageApi.destroy("snowflake_onboarding_error");
    }
  }, [errors, messageApi]);

  const onFinish = (values) => {
    setSubmitting(true);

    values.database_type = "snowflake";
    authAxios
      .post("/databases/", values)
      .then(() => refetch())
      .then(() =>
        navigate("/app/databases", { state: { databaseCreated: true } }),
      )
      .catch((e) => setErrors(JSON.parse(e.request.response)))
      .finally(() => setSubmitting(false));
  };

  return (
    <>
      {contextHolder}
      <Form
        name="snowflake_onobarding_form"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 4 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the name of the database",
            },
          ]}
        >
          <Input placeholder="Database name" />
        </Form.Item>
        <Form.Item
          label="Account"
          name="snowflake_account"
          rules={[
            { required: true, message: "Please input your Snowflake account" },
          ]}
        >
          <Input placeholder="Snowflake account ID, such as fflaogk-lrb26269" />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: "Please input your Snowflake username" },
          ]}
        >
          <Input placeholder="Username used to login to Snowflake" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input your Snowflake password" },
          ]}
        >
          <Input.Password placeholder="Password used to login to Snowflake" />
        </Form.Item>

        <Form.Item
          label="Database"
          name="snowflake_database"
          rules={[
            { required: true, message: "Please input your Snowflake Database" },
          ]}
        >
          <Input placeholder="Snowflake database to connect to" />
        </Form.Item>

        <Form.Item
          label="Schema"
          name="snowflake_schema"
          rules={[
            { required: true, message: "Please input your Snowflake schema" },
          ]}
        >
          <Input placeholder="Snowflake schema to connect to" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 2 }}>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SnowflakeOnboardingForm;
