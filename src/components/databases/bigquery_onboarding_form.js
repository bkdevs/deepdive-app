import { Select, Button, Form, Input, message } from "antd";
import { BIGQUERY_PUBLIC_DATASETS } from "components/databases/bigquery_public_datasets";
import { authAxios } from "http/axios";
import { useDatabasesQuery } from "queries";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BigQueryOnboardingForm = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { refetch } = useDatabasesQuery();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (errors?.non_field_errors) {
      messageApi.open({
        key: "bigquery_onboarding_form",
        type: "error",
        content: errors.non_field_errors,
        duration: 5,
      });
      return () => messageApi.destroy("bigquery_onboarding_form");
    }
  }, [errors, messageApi]);

  const onFinish = (values) => {
    setSubmitting(true);

    values.database_type = "bigquery";
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
        name="bigquery_onboarding_form"
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
          label=<a
            href="https://console.cloud.google.com/marketplace/browse?filter=solution-type:dataset"
            style={{ color: "rgb(22, 119, 255)" }}
          >
            Public Dataset
          </a>
          name="bigquery_dataset_id"
          rules={[
            {
              required: true,
              message: "Please select a public BigQuery dataset to use!",
            },
          ]}
        >
          <Select
            placeholder="Select a public BigQuery dataset"
            allowClear
            showSearch
            options={BIGQUERY_PUBLIC_DATASETS.map((dataset) => ({
              value: `bigquery-public-data.${dataset}`,
              label: dataset,
            }))}
          />
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

export default BigQueryOnboardingForm;
