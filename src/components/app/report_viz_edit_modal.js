import { Button, Modal } from "antd";
import ReportVizTitle from "components/app/report_viz_title";
import VizResponse from "components/viz/viz_response";
import useSessionContext from "hooks/use_session_context";
import { useCommitViz, usePreviewViz } from "hooks/use_session_websocket";
import { useVisualizationsQuery } from "queries";
import { useState } from "react";

const ReportVizEditor = ({ viz, setViz, updatedCount, setUpdatedCount }) => {
  const { messageApi } = useSessionContext();
  const [refreshing, setRefreshing] = useState(false);

  const previewViz = usePreviewViz(
    (response) => {
      setRefreshing(false);
      setViz(response.data);
      setUpdatedCount(updatedCount + 1);
    },
    (response) => {
      messageApi.error(`Error: ${response.error_message}`);
      setRefreshing(false);
      setUpdatedCount(updatedCount + 1);
    },
  );

  const updateSpec = (vizSpec) => {
    setRefreshing(true);
    previewViz({ viz_id: viz.id, visualization_spec: vizSpec });
  };

  return (
    <VizResponse
      mode="editReport"
      message={viz}
      updateSpec={updateSpec}
      refreshing={refreshing}
      key={updatedCount}
    />
  );
};

const ReportVizEditModal = ({ initialViz, modalOpen, setModalOpen }) => {
  const [viz, setViz] = useState(initialViz);
  const [updatedCount, setUpdatedCount] = useState(0);
  const [saving, setSaving] = useState(false);

  const { messageApi } = useSessionContext();
  const { refetch } = useVisualizationsQuery();

  const commitViz = useCommitViz(async (response) => {
    await refetch();
    setSaving(false);
    setModalOpen(false);
    messageApi.open({
      key: "commit_viz_success",
      type: "success",
      content: "Visualization updated",
    });
  });

  const onOk = () => {
    if (viz.error_message) {
      messageApi.open({
        key: "commit_viz_error",
        type: "error",
        content: "Cannot save visualization with error",
      });
    } else {
      const oldViz = JSON.stringify(initialViz);
      const newViz = JSON.stringify(viz);
      if (oldViz !== newViz) {
        commitViz({ viz_id: viz.id, viz: newViz });
        setSaving(true);
      } else {
        setModalOpen(false);
      }
    }
  };

  return (
    <Modal
      title="Edit visualization"
      open={modalOpen}
      onCancel={() => {
        setModalOpen(false);
        setViz(initialViz);
        setUpdatedCount(updatedCount + 1); // remount on cancel
      }}
      onOk={onOk}
      transitionName=""
      width={1200}
      footer={[
        <Button type="primary" loading={saving} onClick={onOk}>
          Save
        </Button>,
      ]}
    >
      <ReportVizTitle viz={viz} setViz={setViz} />
      <ReportVizEditor
        viz={viz}
        setViz={setViz}
        updatedCount={updatedCount}
        setUpdatedCount={setUpdatedCount}
      />
    </Modal>
  );
};

export default ReportVizEditModal;
