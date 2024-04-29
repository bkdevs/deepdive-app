import { Layout, Menu, theme } from "antd";
import { LogoDiv } from "components/home/logo";
import { useSessionsQuery } from "queries";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { HEADER_HEIGHT } from "routes/app_layout_constants";
import useAuthStore from "store/auth_store";

const buildMenuItems = () => {
  return (
    <>
      {/* https://stackoverflow.com/questions/32551291/in-css-flexbox-why-are-there-no-justify-items-and-justify-self-properties */}
      <Menu.Item key="home" style={{ marginRight: "auto", paddingTop: "8px" }}>
        <LogoDiv />
      </Menu.Item>
    </>
  );
};

const ShareLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const accessToken = useAuthStore((state) => state.accessToken);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: sessions, isLoading } = useSessionsQuery();

  console.log(accessToken);
  const menuOnClick = async (item) => {
    if (item.key === "home" && accessToken) {
      navigate("/app");
    } else if (item.key === "home" && !accessToken) {
      navigate("/");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Header
        style={{
          display: "flex",
          width: "100%",
          paddingInlineStart: 0,
          paddingInlineEnd: 16,
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
      </Layout.Header>
      <Outlet />
    </Layout>
  );
};
export default ShareLayout;
