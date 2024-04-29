import { Button, Result } from "antd";
import { useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <Result
      status="500"
      title="500"
      subTitle="Sorry, something went wrong."
      extra={
        <Button type="primary" href="/">
          Back Home
        </Button>
      }
    />
  );
};

export default Error;
