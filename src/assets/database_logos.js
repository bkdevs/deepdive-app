import bigQueryLogo from "./db_logos/bigquery-logo.svg";
import redshiftLogo from "./db_logos/redshift-logo.svg";
import snowflakeLogo from "./db_logos/snowflake-logo.svg";
import postgresLogo from "./db_logos/postgres-logo.svg";

import { FileTextOutlined, FileExcelOutlined } from "@ant-design/icons";
import { Avatar } from "antd";

const DATABASE_LOGOS = {
  snowflake: <Avatar src={snowflakeLogo} />,
  bigquery: <Avatar src={bigQueryLogo} />,
  redshift: <Avatar src={redshiftLogo} />,
  postgres: <Avatar src={postgresLogo} />,
  csv: <Avatar icon={<FileTextOutlined />} />,
  excel: <Avatar icon={<FileExcelOutlined />} />,
};

const DATABASE_LOGOS_SMALL = {
  snowflake: <Avatar size="small" src={snowflakeLogo} />,
  big_query: <Avatar size="small" src={bigQueryLogo} />,
  redshift: <Avatar size="small" src={redshiftLogo} />,
  postgres: <Avatar size="small" src={postgresLogo} />,
  csv: <Avatar size="small" icon={<FileTextOutlined />} />,
  excel: <Avatar size="small" icon={<FileExcelOutlined />} />,
};

const DATABASE_LOGOS_LARGE = {
  snowflake: <Avatar shape="square" size="large" src={snowflakeLogo} />,
  big_query: <Avatar shape="square" size="large" src={bigQueryLogo} />,
  redshift: <Avatar shape="square" size="large" src={redshiftLogo} />,
  postgres: <Avatar shape="square" size="large" src={postgresLogo} />,
  csv: <Avatar shape="circle" size="large" icon={<FileTextOutlined />} />,
  excel: <Avatar shape="circle" size="large" icon={<FileExcelOutlined />} />,
};

export {
  DATABASE_LOGOS,
  DATABASE_LOGOS_SMALL,
  DATABASE_LOGOS_LARGE,
  bigQueryLogo,
  redshiftLogo,
  snowflakeLogo,
  postgresLogo,
  FileExcelOutlined,
  FileTextOutlined,
};
