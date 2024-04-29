import { Col, Divider, Layout, Row, Select, Typography } from "antd";
import LocalFileOnboardingForm from "components/databases/local_file_onboarding_form";
import SnowflakeOnboardingForm from "components/databases/snowflake_onboarding_form";
import BigQueryOnboardingForm from "components/databases/bigquery_onboarding_form";
import { useState } from "react";

const DATABASE_TYPES = [
  { value: "sqlite", label: "SQLite" },
  { value: "snowflake", label: "Snowflake" },
  { value: "bigquery", label: "BigQuery" },
  { value: "mysql", label: "MySQL" },
  { value: "csv", label: "CSV file" },
  { value: "excel", label: "Excel file" },
  { value: "parquet", label: "Parquet file" },
];

const getOnboardingForm = (databaseType) => {
  if (!databaseType) {
    return <></>;
  }

  switch (databaseType) {
    case "snowflake":
      return <SnowflakeOnboardingForm />;
    case "bigquery":
      return <BigQueryOnboardingForm />;
    case "sqlite":
    case "mysql":
    case "csv":
      return <LocalFileOnboardingForm key="csv" databaseType={"csv"} />;
    case "excel":
      return <LocalFileOnboardingForm key="excel" databaseType={"excel"} />;
    case "parquet":
      return <LocalFileOnboardingForm key="parquet" databaseType={"parquet"} />;
    default:
      return <></>;
  }
};

const DatabasesOnboarding = () => {
  const [databaseType, setDatabaseType] = useState(null);

  return (
    <Layout.Content style={{ margin: "0 16px" }}>
      <Row>
        <Col flex="auto">
          <Typography.Title level={3}>Database Onboarding</Typography.Title>
        </Col>
      </Row>
      <Row justify="start" align="middle" gutter={[8, 0]}>
        <Col>
          <Typography.Paragraph>
            Select a database type to integrate with
          </Typography.Paragraph>
        </Col>
        <Col flex="200px">
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Database type"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={DATABASE_TYPES}
            onChange={(value) => setDatabaseType(value)}
          />
        </Col>
      </Row>
      <Divider />
      {getOnboardingForm(databaseType)}
    </Layout.Content>
  );
};
export default DatabasesOnboarding;
