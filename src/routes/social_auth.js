import { Row, Spin } from "antd";
import { unauthAxios } from "http/axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "store/auth_store";
import { useParams } from "react-router-dom";

const SocialAuth = () => {
  const navigate = useNavigate();
  const provider = useParams().provider;

  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search);
    unauthAxios
      .post(`/auth/${provider}/login/`, {
        code: searchParams.get("code"),
      })
      .then((response) => {
        useAuthStore.getState().setAccessToken(response.data.access);
        useAuthStore.getState().setRefreshToken(response.data.refresh);
        navigate("/app");
      })
      .catch((error) => {
        if (error?.response?.status === 409) {
          navigate("/login", {
            state: {
              message: {
                key: "social_login_account_already_exists",
                type: "error",
                content:
                  "Account already exists. Login with your email and password instead",
              },
            },
          });
        }
      });
  }, [provider, navigate]);

  return (
    <Row
      type="flex"
      align="middle"
      justify="center"
      style={{ minHeight: "100vh" }}
    >
      <Spin size="large" />
    </Row>
  );
};

export default SocialAuth;
