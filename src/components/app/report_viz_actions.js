import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import ReportVizEditModal from "components/app/report_viz_edit_modal";
import useSessionContext from "hooks/use_session_context";
import { useRemoveViz } from "hooks/use_session_websocket";
import { authAxios } from "http/axios";
import fileDownload from "js-file-download";
import { useState } from "react";

const REPORT_VIZ_ACTIONS = [
  {
    label: (
      <span>
        <EditOutlined /> Edit
      </span>
    ),
    key: "edit_visualization",
  },
  {
    label: (
      <span>
        <ExportOutlined /> Export
      </span>
    ),
    key: "export_as_excel",
  },
  {
    label: (
      <span className="text-red-500">
        <DeleteOutlined /> Remove
      </span>
    ),
    key: "remove_report",
  },
];

const ReportVizActions = ({ viz, removeViz }) => {
  const { messageApi } = useSessionContext();
  const [modalOpen, setModalOpen] = useState(false);

  const removeVizServer = useRemoveViz();
  const processAction = (key) => {
    if (key === "edit_visualization") {
      setModalOpen(true);
    } else if (key === "export_as_excel") {
      messageApi.info("Download started");
      authAxios
        .get(`export_visualization/${viz.id}/`, {
          responseType: "blob",
        })
        .then((response) => {
          fileDownload(response.data, "report.xlsx");
          messageApi.success("Download succeeded");
        })
        .catch(() => {
          messageApi.error("Download failed");
        });
    } else if (key === "remove_report") {
      removeViz(); // removes locally
      removeVizServer({ viz_id: viz.id }); // removes from servr
    }
  };

  return (
    <>
      <Dropdown
        menu={{
          items: REPORT_VIZ_ACTIONS,
          onClick: ({ key }) => processAction(key),
        }}
        trigger={["click"]}
        placement="bottomRight"
        arrow={{ pointAtCenter: true }}
      >
        <Button icon={<MoreOutlined />} />
      </Dropdown>
      <ReportVizEditModal
        initialViz={viz}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </>
  );
};

export default ReportVizActions;
