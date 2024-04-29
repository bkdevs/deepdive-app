import { Divider, Typography } from "antd";
import CreateSessionCard from "components/app/create_session_card";
import FilePreviewsCard from "components/app/file_previews_card";
import Logo from "components/home/logo";
import { useState } from "react";

const DefaultView = ({ setFilePreviews }) => {
  return (
    <div className="pt-32 flex justify-center content-center w-full">
      <div className="flex-col w-1/3">
        <div>
          <div className="flex justify-center content-center">
            <Logo />
          </div>
          <Divider />
          <Typography.Title level={3}>Welcome back.</Typography.Title>
          <div className="pb-2" />
        </div>
        <div className="w-full">
          <CreateSessionCard setFilePreviews={setFilePreviews} />
        </div>
      </div>
    </div>
  );
};

const FileUploadedView = ({ filePreviews }) => {
  return (
    <div className="pt-8 flex justify-center content-center w-full">
      <div className="flex-col" style={{ width: "1200px" }}>
        <div className="w-full pb-8">
          <FilePreviewsCard filePreviews={filePreviews} />
        </div>
      </div>
    </div>
  );
};

const CreateSession = () => {
  // of format { file.name: filePreview }
  const [filePreviews, setFilePreviews] = useState([]);

  return filePreviews.length === 0 ? (
    <DefaultView setFilePreviews={setFilePreviews} />
  ) : (
    <FileUploadedView filePreviews={filePreviews} />
  );
};

export default CreateSession;
