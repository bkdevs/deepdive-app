import { Divider, Modal } from "antd";
import {
  PreviewContext,
  getInitialTableConfigs,
} from "components/app/file_previews_card";
import { authAxios } from "http/axios";
import { useContext, useState } from "react";

const MergeTablesModal = ({ modalOpen, setModalOpen }) => {
  const [merging, setMerging] = useState(false);
  const { messageApi, filePreviews, setFilePreviews, setTableConfigs } =
    useContext(PreviewContext);

  const onClick = async () => {
    setMerging(true);
    const fileIds = filePreviews.map((filePreview) => filePreview.fileId);
    const { data } = await authAxios.post("/merge_tables/", fileIds);
    setMerging(false);
    setModalOpen(false);
    setFilePreviews([data]);
    setTableConfigs(getInitialTableConfigs([data]));
    messageApi.success("Successfully merged files");
  };

  return (
    <Modal
      title="Merge files"
      open={modalOpen}
      onOk={onClick}
      onCancel={() => setModalOpen(false)}
      width={400}
      transitionName=""
      confirmLoading={merging}
    >
      <Divider />
      <div>
        Looks like your files have the same columns specified. <br /> Would you
        like to merge them into one file?
      </div>
    </Modal>
  );
};

export default MergeTablesModal;
