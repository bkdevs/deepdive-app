import {
  GithubOutlined,
  GoogleOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { unauthAxios } from "http/axios";

const ICONS = {
  github: <GithubOutlined />,
  google: <GoogleOutlined />,
  linkedin_oauth2: <LinkedinOutlined />,
};

const SocialAuthButton = ({ provider, label }) => {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    await unauthAxios
      .get(`/auth/${provider}/login/`)
      .then((response) => {
        const authorization_url = response.data.authorization_url;
        window.location.replace(authorization_url);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Button
      icon={ICONS[provider]}
      style={{ textAlign: "left" }}
      onClick={onClick}
      loading={loading}
      size="large"
      block
    >
      Continue with {label}
    </Button>
  );
};
export default SocialAuthButton;
