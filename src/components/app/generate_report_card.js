import { Button, Card, Divider, Empty, Spin } from "antd";
import { useGenerateReport } from "hooks/use_session_websocket";
import { useState } from "react";

const GenerateReportCard = ({ refetchVisualizations }) => {
  const [generating, setGenerating] = useState(false);
  const generateReport = useGenerateReport(refetchVisualizations);

  return (
    <Card className="w-full" bordered={false}>
      {generating ? (
        <Spin size="large" tip="Generating report...">
          <div className="h-40 w-40" />
        </Spin>
      ) : (
        <div>
          <Empty
            description={
              <div>
                <p className="text-base font-medium">Empty report!</p>
                <Divider />
                <p>
                  Add visualizations from the explore tab or click on generate
                  to automatically create a few.
                </p>
              </div>
            }
          >
            <div className="pt-2">
              <Button
                type="primary"
                onClick={() => {
                  setGenerating(true);
                  generateReport();
                }}
              >
                Generate
              </Button>
            </div>
          </Empty>
        </div>
      )}
    </Card>
  );
};

export default GenerateReportCard;
