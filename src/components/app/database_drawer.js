import { Row, Col, Drawer, Spin, Button } from "antd";
import DatabaseInfoCard from "components/app/database_info_card";
import DatabaseSchemaCard from "components/app/database_schema_card";
import useSessionContext from "hooks/use_session_context";

const DatabaseDrawer = ({ open, setOpen }) => {
  const { database, tables, databaseSchema } = useSessionContext();

  return (
    <Drawer
      title={`${database.name}`}
      placement="bottom"
      size="large"
      onClose={() => setOpen(false)}
      open={open}
      closable={false}
      extra={<Button onClick={() => setOpen(false)}>Close</Button>}
    >
      {databaseSchema ? (
        <Row gutter={16}>
          <Col span={18}>
            <DatabaseSchemaCard
              databaseSchema={databaseSchema}
              sessionTables={tables}
            />
          </Col>
          <Col span={6}>
            <DatabaseInfoCard database={database} />
          </Col>
        </Row>
      ) : (
        <Spin size="large" />
      )}
    </Drawer>
  );
};

export default DatabaseDrawer;
