import { Card, Col } from "antd";
import ReportVizActions from "components/app/report_viz_actions";
import VizResponse from "components/viz/viz_response";

const ReportViz = ({ viz, removeViz }) => {
  return (
    <Col flex="auto">
      <Card
        title={viz.title}
        headStyle={{ paddingLeft: 10, paddingRight: 6 }}
        className="shadow-lg"
        extra={<ReportVizActions viz={viz} removeViz={removeViz} />}
      >
        <VizResponse mode="view" message={viz} />
      </Card>
    </Col>
  );
};

export default ReportViz;
