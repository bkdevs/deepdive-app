import { Card } from "antd";
import TableSchema from "components/app/table_schema";
import { useState } from "react";

const getTabs = (sessionTables) => {
  return sessionTables.map((name) => ({
    key: name,
    tab: name,
  }));
};

const processTableSchema = (tableSchema, primaryKeys, foreignKeys) => {
  const primaryKeySet = new Set(primaryKeys);
  for (const column of tableSchema.columns) {
    column.primaryKey = primaryKeySet.has(column.name);
  }

  return tableSchema;
};

const getTableSchemas = (databaseSchema) => {
  const tableSchemas = {};
  for (const table of databaseSchema.tables) {
    tableSchemas[table.name] = processTableSchema(
      table,
      databaseSchema.primary_keys,
      databaseSchema.foreign_keys,
    );
  }
  return tableSchemas;
};

const DatabaseSchemaCard = ({ databaseSchema, sessionTables }) => {
  const [activeTab, setActiveTab] = useState(sessionTables[0]);
  const tableSchemas = getTableSchemas(databaseSchema);

  return (
    <Card
      title="Tables"
      tabList={getTabs(sessionTables)}
      activeTabKey={activeTab}
      onTabChange={(key) => setActiveTab(key)}
    >
      <TableSchema tableSchema={tableSchemas[activeTab]} />
    </Card>
  );
};

export default DatabaseSchemaCard;
