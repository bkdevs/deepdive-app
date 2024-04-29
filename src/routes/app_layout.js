import { BarChartOutlined, PlusOutlined } from "@ant-design/icons";
import { Layout, Menu, Spin, theme } from "antd";
import UserButton from "components/app/user_button";
import Logo from "components/home/logo";
import { useSessionsQuery } from "queries";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { HEADER_HEIGHT } from "routes/app_layout_constants";
import useAuthStore from "store/auth_store";

// We have to use the old Menu.Item syntax in order to get access to the menu item div to set the marginRight style here
// The new object based API doesn't let us do that, unless we override the CSS stylesheets
const buildMenuItems = (sessions, isLoading, pathname) => {
  const sessionItems =
    !isLoading &&
    sessions.map((session) => (
      <Menu.Item key={session.id}>{session.name}</Menu.Item>
    ));

  return (
    <>
      {/* https://stackoverflow.com/questions/32551291/in-css-flexbox-why-are-there-no-justify-items-and-justify-self-properties */}
      <Menu.Item key="home" style={{ marginRight: "auto", paddingTop: "8px" }}>
        <Logo />
      </Menu.Item>
      {/* only show new session if not on home page */}
      {pathname !== "/app" && (
        <Menu.Item key="create-session" icon={<PlusOutlined />}>
          New session
        </Menu.Item>
      )}
      <Menu.SubMenu key="sessions" title="Sessions" icon={<BarChartOutlined />}>
        {isLoading ? (
          <Spin>
            <div className="w-10 h-10" />
          </Spin>
        ) : (
          sessionItems
        )}
      </Menu.SubMenu>
    </>
  );
};

const AppLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: sessions, isLoading } = useSessionsQuery();

  const menuOnClick = async (item) => {
    if (item.key === "home") {
      navigate("/");
    } else if (item.key === "create-session") {
      navigate("/");
    } else if (item.key === "logout") {
      logout();
    } else if (item.keyPath.includes("sessions")) {
      navigate(`sessions/${item.keyPath[0]}`);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Header
        style={{
          display: "flex",
          width: "100%",
          paddingInlineStart: 0,
          paddingInlineEnd: 0,
          height: HEADER_HEIGHT,
          background: colorBgContainer,
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Menu
          theme="light"
          mode="horizontal"
          onClick={menuOnClick}
          style={{
            width: "100%",
            height: HEADER_HEIGHT,
            justifyContent: "flex-end",
            display: "flex",
          }}
        >
          {buildMenuItems(sessions, isLoading, pathname)}
        </Menu>
        <div
          className="flex pb-0 mb-0 pl-2 pr-4 pt-3.5"
          style={{
            borderBottomColor: "rgba(5, 5, 5, 0.06)",
            borderBottomStyle: "solid",
            borderBottomWidth: "1px",
          }}
        >
          <UserButton />
        </div>
      </Layout.Header>
      <Outlet />
    </Layout>
  );
};
export default AppLayout;
