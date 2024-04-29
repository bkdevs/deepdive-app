import { Row, Spin } from "antd";
import { unauthAxios } from "http/axios";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Activation = () => {
  const { key } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    unauthAxios
      .post("/auth/register/verify-email/", {
        key: key,
      })
      .then(() => {
        navigate("/login", {
          state: {
            message: {
              key: "activation_success",
              type: "success",
              content:
                "Successfully activated your account. Log in with your credentials here",
            },
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [key, navigate]);

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
export default Activation;
