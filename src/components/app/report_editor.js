import { Spin } from "antd";
import GenerateReportCard from "components/app/generate_report_card";
import ReportViz from "components/app/report_viz";
import update from "immutability-helper";
import { useVisualizationsQuery } from "queries";
import { useEffect, useState } from "react";

const ReportGrid = ({ visualizations, setVisualizations }) => (
  <div className="grid grid-cols-2 gap-4 pb-4">
    {visualizations.map((viz, index) => (
      <ReportViz
        key={viz.id}
        viz={viz}
        removeViz={() =>
          setVisualizations(update(visualizations, { $splice: [[index, 1]] }))
        }
      />
    ))}
  </div>
);

const EmptyReport = ({ refetchVisualizations }) => (
  <div className="pt-32 flex justify-center content-center w-full">
    <div className="flex-col w-1/3">
      <GenerateReportCard refetchVisualizations={refetchVisualizations} />
    </div>
  </div>
);

const ReportEditor = () => {
  const [visualizations, setVisualizations] = useState([]);
  const [updatedCount, setUpdatedCount] = useState(0);
  const { data, refetch, isLoading } = useVisualizationsQuery();

  useEffect(() => {
    data && setVisualizations(data);
    setUpdatedCount(updatedCount + 1); // eslint-disable-next-line
  }, [data, setUpdatedCount]);

  if (isLoading) {
    return <Spin size="large" />;
  }

  return (
    <>
      {visualizations.length ? (
        <ReportGrid
          key={updatedCount}
          visualizations={visualizations}
          setVisualizations={setVisualizations}
        />
      ) : (
        <EmptyReport refetchVisualizations={refetch} />
      )}
    </>
  );
};

export default ReportEditor;
