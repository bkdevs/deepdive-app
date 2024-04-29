import React from "react";
import { Button, Result } from "antd";

const NotFound = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, this page doesn't exist"
    extra={
      <Button type="primary" href="/">
        Back Home
      </Button>
    }
  />
);

export default NotFound;
