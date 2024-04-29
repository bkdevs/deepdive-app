import { UploadOutlined } from "@ant-design/icons";
import { Button, Tooltip, Upload, message } from "antd";
import { DEEPDIVE_ACCESS_TOKEN, DEEPDIVE_SERVER_HTTP } from "constants";
import Cookies from "js-cookie";

const UploadDatabaseFile = ({ setFilePreviews }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const validateFile = (file) => {
    const fileSizeValid = file.size / 1024 / 1024 < 50;
    if (!fileSizeValid) {
      file.status = "error";
      messageApi.error("File must smaller than 50MB!");
    }
    return fileSizeValid;
  };

  return (
    <>
      {contextHolder}
      <div className="flex justify-center content-center">
        <Upload
          name="database_file"
          className="flex flex-col items-center justify-center"
          listType="picture" // for prettier rendering
          multiple={true}
          accept=".csv,.tsv,.xlsx,.xlsm,.xlsb"
          action={`${DEEPDIVE_SERVER_HTTP}/preview_tables/`}
          headers={{
            Authorization: `JWT ${Cookies.get(DEEPDIVE_ACCESS_TOKEN)}`,
          }}
          beforeUpload={validateFile}
          onChange={({ fileList }) => {
            if (fileList && fileList.every((file) => file.status === "done")) {
              setFilePreviews(fileList.map((file) => file.response));
            }
          }}
        >
          <Tooltip title="Upload files to analyze. Only CSV and Excel files are currently supported">
            <Button size="large" icon={<UploadOutlined />}>
              Upload files
            </Button>
          </Tooltip>
        </Upload>
      </div>
    </>
  );
};

export default UploadDatabaseFile;
