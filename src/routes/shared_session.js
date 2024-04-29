import { DownloadOutlined } from "@ant-design/icons";
import { Button, Card, Divider, message } from "antd";
import ZoomOutButton from "components/viz/buttons/zoom_out_button";
import VizResponse from "components/viz/viz_response";
import { unauthAxios } from "http/axios";
import fileDownload from "js-file-download";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";

export async function loader({ params }) {
  const data = await Promise.all([
    unauthAxios.get(`/share/${params.sessionId}/`),
    unauthAxios.get(`/share/${params.sessionId}/report/`),
  ]);
  const session = data[0].data;
  const visualizations = data[1].data;
  return { session, visualizations };
}

const DownloadReportButton = ({ messageApi, session }) => {
  const downloadReport = () => {
    messageApi.info("Download started");
    unauthAxios
      .get(`export_shared_report/${session.id}/`, {
        responseType: "blob",
      })
      .then((response) => {
        fileDownload(response.data, "report.xlsx");
        messageApi.success("Download succeeded");
      })
      .catch(() => {
        messageApi.error("Download failed");
      });
  };

  return (
    <div className="flex justify-center content-center">
      <Button
        type="text"
        size="small"
        icon={<DownloadOutlined />}
        onClick={downloadReport}
      >
        Download report
      </Button>
    </div>
  );
};

const SharedSessionViz = ({ viz }) => {
  const [updatedCount, setUpdatedCount] = useState(0);

  return (
    <div className="pb-4">
      <Card
        title={viz.title}
        headStyle={{ paddingLeft: 10, paddingRight: 6 }}
        className="shadow-lg pb-4"
        extra={
          <div className="w-18">
            <ZoomOutButton
              resetDomain={() => setUpdatedCount(updatedCount + 1)}
            />
          </div>
        }
      >
        <div className="pr-8">
          <VizResponse mode="viewReport" message={viz} key={updatedCount} />
        </div>
      </Card>
    </div>
  );
};

const SharedSession = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { session, visualizations } = useLoaderData();

  return (
    <div className="pt-8 flex justify-center content-center w-full">
      {contextHolder}
      <div className="flex-col w-3/5">
        <div className="flex justify-center content-center">
          <p className="text-2xl font-medium">{session.name}</p>
        </div>
        <DownloadReportButton messageApi={messageApi} session={session} />
        <Divider />
        <div className="pb-2" />
        {visualizations.map((viz, index) => (
          <SharedSessionViz viz={viz} key={index} />
        ))}
      </div>
    </div>
  );
};

export default SharedSession;
