import { Alert, Empty, Spin, Typography } from "antd";
import { validateSpec } from "components/viz/spec_helper";
import { CHART_HEIGHT } from "components/viz/views/chart_helper";
import AreaChartViz from "components/viz/viz_types/area_chart_viz";
import BarChartViz from "components/viz/viz_types/bar_chart_viz";
import LineChartViz from "components/viz/viz_types/line_chart_viz";
import PieChartViz from "components/viz/viz_types/pie_chart_viz";
import ScatterChartViz from "components/viz/viz_types/scatter_chart_viz";
import TableViz from "components/viz/viz_types/table_viz";
import { createContext, useEffect, useState } from "react";

const VIZ_TYPES = {
  bar: BarChartViz,
  line: LineChartViz,
  area: AreaChartViz,
  pie: PieChartViz,
  table: TableViz,
  scatter: ScatterChartViz,
};

/**
 * The state management around this is rather involved
 *
 *  - serverSpec is the spec we get back as response from the server (either the /messages/ API or websocket)
 *  - [spec, setSpec] is our local copy of the spec
 *
 * Upon edits to our local copy, we send an update to the server using updateSpec
 * and _mark_ our component as having **sent an update**
 *
 * Once VizResponse sends an update, it _cannot_ send another
 * Instead, it waits to be remounted by <Response> upon successful receipt of a websocket message
 *
 * It's important that we remount VizResponse
 * Otherwise, we run into an issue of synchronizing state changes from two sources:
 *  - Our local editor / buttons
 *  - Async response from websocket
 *
 * And we don't know when to trigger an update (e.g, could get into an infinite loop if we call update triggered by the backend)
 *
 * To summarize:
 *   - An instance of VizResponse can only send _one_ update message
 *   - VizResponse is _remounted_ upon receiving a server-side update
 */
const useUpdateSpec = (serverSpec, spec, updateSpec) => {
  const [sentUpdate, setSentUpdate] = useState(false);

  useEffect(() => {
    if (sentUpdate) {
      // we already sent our one update, this must be a server-side event
      // do nothing and wait to be remounted
      return;
    }

    const clonedSpec = { ...spec };
    clonedSpec.breakdownValues = undefined;
    const vizSpecString = JSON.stringify(clonedSpec);

    if (serverSpec !== vizSpecString && vizSpecString !== "{}") {
      updateSpec(vizSpecString);
      setSentUpdate(true);
    }
  }, [serverSpec, spec, updateSpec, sentUpdate, setSentUpdate]);
};

const renderView = (message, spec, setSpec, refreshing) => {
  const { schema, data: rows } = JSON.parse(message.data || "{}");

  if (refreshing) {
    return (
      <Spin size="large" tip="Loading...">
        <div style={{ height: CHART_HEIGHT + 22, width: CHART_HEIGHT }} />
      </Spin>
    );
  }

  if (message.error_message) {
    return (
      <div style={{ height: CHART_HEIGHT + 22, width: "100%" }}>
        <Alert
          className="w-full"
          message={
            <Typography.Title level={5}>
              Failed to execute query
            </Typography.Title>
          }
          description={message.error_message}
          showIcon
          type="error"
        />
      </div>
    );
  }

  const vizType = VIZ_TYPES[spec.visualization_type];
  const specError = vizType.validateSpec(spec);
  if (specError) {
    return <Empty description={specError} />;
  } else {
    return vizType.renderView({ schema, rows, spec, setSpec });
  }
};

export const VizResponseContext = createContext();

const VizResponseView = ({ message }) => {
  const [spec, setSpec] = useState(
    JSON.parse(message.visualization_spec || "{}"),
  );

  return renderView(message, spec, setSpec, false);
};

const VizResponseEdit = ({ message, updateSpec, refreshing }) => {
  const [spec, setSpec] = useState(
    JSON.parse(message.visualization_spec || "{}"),
  );
  useUpdateSpec(message.visualization_spec, spec, updateSpec);
  validateSpec(spec);

  const vizType = VIZ_TYPES[spec.visualization_type];
  return (
    <div className="flex flex-row flex-nowrap">
      <div className="flex-auto min-w-0 w-3/4">
        {renderView(message, spec, setSpec, refreshing)}
      </div>
      <div className="justify-self-end w-1/4 px-6">
        {vizType?.renderEditor({ spec, setSpec })}
      </div>
    </div>
  );
};

const VizResponse = ({
  mode,
  message,
  updateSpec,
  processQuery,
  refreshing,
}) => {
  return (
    <VizResponseContext.Provider
      value={{
        mode: mode,
        messageId: message.id,
        query: message.sql_query,
        processQuery: processQuery,
      }}
    >
      {["view", "viewReport"].includes(mode) ? (
        <VizResponseView message={message} />
      ) : (
        <VizResponseEdit
          message={message}
          updateSpec={updateSpec}
          refreshing={refreshing}
        />
      )}
    </VizResponseContext.Provider>
  );
};

export default VizResponse;
