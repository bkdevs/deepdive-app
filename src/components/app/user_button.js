import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import useAuthStore from "store/auth_store";

const UserButton = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const items = [
    {
      key: "profile",
      label: "Your profile",
      icon: <UserOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Log out",
      icon: <LogoutOutlined />,
    },
  ];

  const onClick = ({ key }) => {
    if (key === "profile") {
      navigate("/app/profile");
    } else if (key === "logout") {
      logout();
    }
  };

  return (
    <Dropdown
      menu={{
        items,
        onClick,
      }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <Button shape="circle" icon={<UserOutlined />} />
    </Dropdown>
  );
};

export default UserButton;
