import { Card, message } from "antd";
import AddDatabaseFile from "components/app/add_database_file";
import CreateDatabaseButton, {
  inferDatabaseType,
} from "components/app/create_database_button";
import MergeTablesModal from "components/databases/merge_tables_modal";
import TablePreview from "components/databases/table_preview";
import { objectsEqual } from "components/viz/spec_helper";
import update from "immutability-helper";
import { createContext, useEffect, useState } from "react";

export const PreviewContext = createContext();

const getTabs = (filePreviews, setFilePreviews) => {
  const tabList = [];
  const tabContent = {};

  filePreviews.forEach((filePreview, fileIndex) => {
    const setFilePreview = (filePreview) =>
      setFilePreviews(
        update(filePreviews, { [fileIndex]: { $merge: filePreview } }),
      );

    filePreview.tablePreviews.forEach(
      ({ table_schema, sample_data }, tableIndex) => {
        tabList.push({
          key: `${fileIndex}-${tableIndex}`,
          label: `Table: ${table_schema.name}`,
        });

        tabContent[`${fileIndex}-${tableIndex}`] = (
          <TablePreview
            key={`${fileIndex}-${tableIndex}`}
            tableSchema={table_schema}
            setTableSchema={(tableSchema) => {
              setFilePreview(
                update(filePreview, {
                  tablePreviews: {
                    [tableIndex]: { table_schema: { $merge: tableSchema } },
                  },
                }),
              );
            }}
            sampleData={sample_data}
            setTablePreview={(tablePreview) => {
              setFilePreview(
                update(filePreview, {
                  tablePreviews: {
                    [tableIndex]: { $set: tablePreview },
                  },
                }),
              );
            }}
          />
        );
      },
    );
  });

  return { tabList, tabContent };
};

const getTablePreviews = (filePreviews) => {
  const tablePreviews = [];
  for (const filePreview of filePreviews) {
    tablePreviews.push(...filePreview.tablePreviews);
  }
  return tablePreviews;
};

export const getInitialTableConfigs = (filePreviews) => {
  const tableConfigs = {};
  for (const filePreview of filePreviews) {
    for (const { table_schema } of filePreview.tablePreviews) {
      const columnNameMappings = {};
      for (const column of table_schema.columns) {
        columnNameMappings[column.name] = column.name;
      }
      tableConfigs[table_schema.name] = {
        file_id: filePreview.fileId,
        excel_range: "",
        new_name: table_schema.name,
      };
    }
  }
  return tableConfigs;
};

const FilePreviewsCard = ({ filePreviews: initialFilePreviews }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [filePreviews, setFilePreviews] = useState(initialFilePreviews);
  const [tableConfigs, setTableConfigs] = useState(
    getInitialTableConfigs(filePreviews),
  );
  const { tabList, tabContent } = getTabs(filePreviews, setFilePreviews);
  const databaseType = inferDatabaseType(filePreviews);
  const [tabKey, setTabKey] = useState(tabList[0].key);
  const [mergeModalOpen, setMergeModalOpen] = useState(false);

  useEffect(() => {
    const columnSchemas = filePreviews
      .map((filePreview) => filePreview.tablePreviews)
      .flat()
      .map((tablePreview) => tablePreview.table_schema.columns);
    if (
      columnSchemas.length > 1 &&
      columnSchemas.every((t) => objectsEqual(columnSchemas[0], t))
    ) {
      setMergeModalOpen(true);
    }
  }, [filePreviews, setMergeModalOpen]);

  const onTabEdit = (tabKey, action) => {
    if (action === "remove") {
      if (getTablePreviews(filePreviews).length === 1) {
        messageApi.error("Cannot remove only file!");
      } else {
        const [fileIndex, tableIndex] = tabKey
          .split("-")
          .map((str) => parseInt(str));
        const filePreview = filePreviews[fileIndex];
        const newTablePreviews = filePreview.tablePreviews.filter(
          (_, index) => index !== tableIndex,
        );
        const newFilePreviews = update(filePreviews, {
          [fileIndex]: {
            $merge: { ...filePreview, tablePreviews: newTablePreviews },
          },
        });
        setFilePreviews(newFilePreviews);
        setTabKey(`${0}-${0}`);
      }
    }
  };

  return (
    <Card
      title={<p className="text-xl font-semibold">Preview files</p>}
      className="w-full"
      bordered={false}
      tabList={tabList}
      onTabChange={(key) => setTabKey(key)}
      activeTabKey={tabKey}
      extra={
        <AddDatabaseFile
          setFilePreviews={(newFilePreviews) => {
            setFilePreviews([...filePreviews, ...newFilePreviews]);
          }}
        />
      }
      tabProps={{
        type: "editable-card",
        size: "large",
        onEdit: onTabEdit,
        hideAdd: true,
      }}
    >
      <PreviewContext.Provider
        value={{
          filePreviews: filePreviews,
          setFilePreviews: setFilePreviews,
          tableConfigs: tableConfigs,
          setTableConfigs: setTableConfigs,
          messageApi: messageApi,
          databaseType: databaseType,
        }}
      >
        <MergeTablesModal
          modalOpen={mergeModalOpen}
          setModalOpen={setMergeModalOpen}
        />
        {contextHolder}
        {tabContent[tabKey]}
        <div className="flex align-middle justify-center pt-4">
          <div className="w-auto">
            <CreateDatabaseButton filePreviews={filePreviews} />
          </div>
        </div>
      </PreviewContext.Provider>
    </Card>
  );
};

export default FilePreviewsCard;
