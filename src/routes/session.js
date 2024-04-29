import {
  Col,
  Layout,
  Menu,
  Row,
  Spin,
  Tabs,
  Tooltip,
  theme,
  message as antdMessage,
  Button,
} from "antd";
import { DATABASE_LOGOS_SMALL } from "assets/database_logos";
import ReportEditor from "components/app/report_editor";
import SessionEditor from "components/app/session_editor";
import SessionName from "components/app/session_name";
import ShareSessionModal from "components/app/share_session_modal";
import { useSessionWebsocket } from "hooks/use_session_websocket";
import { authAxios } from "http/axios";
import { ShareAltOutlined } from "@ant-design/icons";
import { createContext, useState } from "react";
import { useLoaderData, useNavigation, useParams } from "react-router-dom";
import {
  HEADER_HEIGHT,
  SIDER_EXPANDED_WIDTH,
} from "routes/app_layout_constants";

export const SessionContext = createContext();

export async function loader({ params }) {
  const data = await Promise.all([
    authAxios.get(`/sessions/${params.sessionId}`),
    authAxios.get(`/sessions/${params.sessionId}/messages`),
  ]);

  const session = data[0].data;
  const messages = data[1].data;

  return { session, messages };
}

export async function action({ params, request }) {
  const formData = Object.fromEntries(await request.formData());
  formData.tables = formData.tables.split(","); // we munge lists when submitting formData, so unmunge
  const data = await authAxios.patch(
    `/sessions/${params.sessionId}/`,
    formData,
  );
  return data;
}

const buildMenuItems = (session, dbSchema, setShareModalOpen) => {
  const tableColumns = {};
  for (const table of dbSchema.tables) {
    tableColumns[table.name] = table.columns.map((column) => ({
      key: `column-${column.name}`,
      label: (
        <Tooltip
          placement="topRight"
          title={
            `${column.name} (${column.column_type})` +
            (column.comment && column.comment !== "None"
              ? ` - ${column.comment}`
              : "")
          }
        >
          {`${column.name} (${column.column_type})`}
        </Tooltip>
      ),
    }));
  }

  const tableMenuItems = session.tables.map((tableName) => ({
    key: `table-${tableName}`,
    label: tableName,
    children: tableColumns[tableName] || [
      { key: `loading-table-${tableName}`, label: <Spin /> },
    ],
  }));

  return [
    {
      key: "session-name",
      type: "group",
      label: <SessionName session={session} />,
    },
    {
      type: "divider",
    },
    {
      key: "database",
      label: <p className="text-sm">Database</p>,
      type: "group",
      children: [
        {
          key: "database-name",
          label: "Name: " + session.database.name,
        },
        {
          key: "database-type",
          label: (
            <>
              {"Type: "}
              {DATABASE_LOGOS_SMALL[session.database.database_type]}{" "}
              {session.database.database_type}
            </>
          ),
        },
        {
          key: "database-created-at",
          label:
            "Created at: " +
            new Date(session.database.timestamp).toLocaleString(),
        },
      ],
    },
    {
      type: "divider",
    },
    {
      key: "tables",
      label: (
        <Row>
          <Col flex="auto">
            <p className="text-sm">Tables</p>
          </Col>
        </Row>
      ),
      type: "group",
      children: tableMenuItems,
    },
  ];
};

const Session = () => {
  const [messageApi, contextHolder] = antdMessage.useMessage();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [tabKey, setTabKey] = useState("1");
  const { session, messages } = useLoaderData();
  const databaseSchema = JSON.parse(session.database.schema);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigation = useNavigation();
  const currentSession = useParams().sessionId;
  const menuItems = buildMenuItems(session, databaseSchema, setShareModalOpen);

  // Establish websocket connection at the route level so unmounting editor
  // component does not disconnect the connection. It works only because "share"
  // parameter is set to true. Only a single WebSocket will be created and useWebSocket
  // will manage subscriptions/unsubscriptions internally
  useSessionWebsocket(session, () => {});

  return (
    <Layout hasSider>
      <Layout.Sider
        width={SIDER_EXPANDED_WIDTH}
        theme="light"
        style={{
          overflow: "auto",
          height: "calc(100vh - 60px)",
          position: "fixed",
          top: HEADER_HEIGHT,
          left: 0,
        }}
      >
        <Menu
          theme="light"
          selectedKeys={[currentSession]}
          mode="inline"
          items={menuItems}
          inlineIndent={12}
        ></Menu>
      </Layout.Sider>
      <Layout
        id="app-main"
        className={navigation.state === "loading" ? "loading" : ""}
        style={{ marginLeft: SIDER_EXPANDED_WIDTH }}
      >
        <Layout.Header
          style={{
            padding: 10,
            display: "flex",
            alignItems: "center",
            background: colorBgContainer,
          }}
        >
          <Menu
            mode="horizontal"
            className="text-base font-medium"
            style={{ minWidth: 0, flex: "auto" }}
            defaultSelectedKeys={["1"]}
            selectedKeys={[tabKey]}
            onClick={({ key }) => {
              if (key === "share_report") {
                setShareModalOpen(true);
              } else {
                setTabKey(key);
              }
            }}
          >
            <Menu.Item key="1">Explore</Menu.Item>
            <Menu.Item key="2">Report</Menu.Item>
            {tabKey === "2" && (
              <Menu.Item key="share_report" style={{ marginLeft: "auto" }}>
                <Tooltip title="Share report">
                  <Button icon={<ShareAltOutlined />}>Share</Button>
                </Tooltip>
              </Menu.Item>
            )}
          </Menu>
        </Layout.Header>
        <Layout.Content style={{ margin: "0 16px" }}>
          <div style={{ margin: "16px 0" }} />
          <SessionContext.Provider
            value={{
              messageApi: messageApi,
              session: session,
              database: session.database,
              tables: session.tables,
              databaseSchema: databaseSchema,
            }}
          >
            {contextHolder}
            {/* We use tabs here to prevent component unmounting upon tab change */}
            <Tabs
              tabBarStyle={{ display: "none" }}
              activeKey={tabKey}
              items={[
                {
                  key: "1",
                  label: <div className="hidden" />,
                  children: (
                    // setting key here forces React to unmount the component and re-initialize state
                    // without it, React will re-use state since it caches by position in the virtual DOM
                    <SessionEditor
                      key={session.id}
                      initialMessages={messages}
                    />
                  ),
                },
                {
                  key: "2",
                  label: <div className="hidden" />,
                  children: <ReportEditor />,
                },
              ]}
            />
            <ShareSessionModal
              modalOpen={shareModalOpen}
              setModalOpen={setShareModalOpen}
            />
          </SessionContext.Provider>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
export default Session;
