import { DownOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, Space, Spin, Typography } from "antd";
import UploadDatabaseFile from "components/app/upload_database_file";
import { authAxios } from "http/axios";
import { useDatabasesQuery, useSessionsQuery } from "queries";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NUM_RECENT_DATABASES = 5;

const RecentDatabases = ({ databases, createSession }) => {
  return (
    <ul>
      {databases.map((database) => (
        <li key={database.id}>
          <Button
            type="link"
            size="small"
            onClick={() => createSession(database.id)}
          >
            <p className="text-sm">{database.name}</p>
          </Button>
        </li>
      ))}
    </ul>
  );
};

const OlderDatabases = ({ databases, createSession }) => {
  const items = databases.map((database) => ({
    key: database.id,
    label: <p className="text-sm"> {database.name} </p>,
  }));
  const onClick = ({ key }) => createSession(key);

  return (
    <Dropdown menu={{ items, onClick }} placement="bottomLeft">
      <a className="text-sm" href="/" onClick={(e) => e.preventDefault()}>
        <Space>
          More...
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
};

const CreateSessionCard = ({ setFilePreviews }) => {
  const [creating, setCreating] = useState(false);
  const { data, isLoading } = useDatabasesQuery();
  const { refetch } = useSessionsQuery();
  const navigate = useNavigate();

  const createSession = async (databaseId) => {
    setCreating(true);
    const { data } = await authAxios.post("/sessions/", {
      database_id: databaseId,
    });
    navigate(`sessions/${data.id}`);
    refetch();
  };

  return (
    <Card className="w-full" loading={isLoading} bordered={false}>
      {creating ? (
        <Spin size="large" tip="Creating session...">
          <div className="h-40 w-40" />
        </Spin>
      ) : (
        <div>
          <p className="text-sm font-normal">
            Select a database or upload files to get started
          </p>
          <Typography.Paragraph>
            {!isLoading && (
              <RecentDatabases
                databases={data.slice(0, NUM_RECENT_DATABASES)}
                createSession={createSession}
              />
            )}
            {!isLoading && data.length > NUM_RECENT_DATABASES && (
              <OlderDatabases
                databases={data.slice(NUM_RECENT_DATABASES)}
                createSession={createSession}
              />
            )}
          </Typography.Paragraph>
          <UploadDatabaseFile setFilePreviews={setFilePreviews} />
        </div>
      )}
    </Card>
  );
};

export default CreateSessionCard;
