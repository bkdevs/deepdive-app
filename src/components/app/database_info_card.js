import { Card, List, Typography } from "antd";
import { DATABASE_LOGOS_SMALL } from "assets/database_logos";

const getListItems = (database) => {
  const items = [
    { title: "Database name", value: database.name },
    {
      title: "Database type",
      value: (
        <>
          {DATABASE_LOGOS_SMALL[database.database_type]}{" "}
          {database.database_type}
        </>
      ),
    },
    { title: "Created by", value: database.user_username },
    {
      title: "Created at",
      value: new Date(database.timestamp).toLocaleString(),
    },
  ];

  if (
    (database.database_type === "csv") |
    (database.database_type === "excel")
  ) {
    items.push({
      title: "Files",
      value: database.files.join(", "),
    });
  } else if (database.database_type === "snowflake") {
    items.push(
      {
        title: "Snowflake account",
        value: database.account,
      },
      {
        title: "Snowflake database",
        value: database.database,
      },
      {
        title: "Snowflake schema",
        value: database.schema,
      },
    );
  }

  return items;
};

const DatabaseInfoCard = ({ database }) => {
  return (
    <Card title="Info">
      <List
        size="small"
        dataSource={getListItems(database)}
        renderItem={(item) => (
          <List.Item>
            <Typography.Text type="secondary">{item.title}:</Typography.Text>{" "}
            {item.value}
          </List.Item>
        )}
      />
    </Card>
  );
};

export default DatabaseInfoCard;
