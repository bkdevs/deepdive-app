import { EditOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Input, Space, Tooltip } from "antd";
import { PreviewContext } from "components/app/file_previews_card";
import {
  getOriginalTableName,
  updateTableConfig,
  validateExcelRange,
} from "components/databases/table_config_util";
import { authAxios } from "http/axios";
import { useContext, useState } from "react";

const TableNameView = ({ tableName, setEditingTableName }) => (
  <div className="flex items-center pb-2">
    <p className="text-lg font-medium truncate">{tableName}</p>
    <div className="ml-auto text-sm">
      <Tooltip title="Edit table name. DeepDive works best when given human-readable names">
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => setEditingTableName(true)}
        />
      </Tooltip>
    </div>
  </div>
);

const TableNameEdit = ({ tableName, updateTableName, setEditingTableName }) => {
  const { messageApi } = useContext(PreviewContext);
  const saveTableName = () => {
    if (tableName === "") {
      messageApi.error("Table name cannot be empty!");
    } else {
      setEditingTableName(false);
    }
  };

  return (
    <div className="flex flex-row space-x-1 items-center pb-2">
      <Input
        className="text-lg font-medium"
        size="middle"
        value={tableName}
        onChange={(e) => {
          updateTableName(e.target.value);
        }}
        status={tableName === "" ? "error" : ""}
        onPressEnter={saveTableName}
      />
      <div className="ml-auto">
        <Button className="mx-0" type="primary" onClick={saveTableName}>
          Ok
        </Button>
      </div>
    </div>
  );
};

const TableCellEditor = ({ originalTableName, setTablePreview }) => {
  const { messageApi, tableConfigs, setTableConfigs } =
    useContext(PreviewContext);
  const [previewing, setPreviewing] = useState(false);
  const isValidRange = validateExcelRange(
    tableConfigs[originalTableName].excel_range,
  );

  const previewDatabase = () => {
    setPreviewing(true);
    authAxios
      .patch(`database_file/${tableConfigs[originalTableName]["file_id"]}/`, {
        [originalTableName]: tableConfigs[originalTableName],
      })
      .then((response) => {
        setTablePreview(response.data.preview);
        updateTableConfig(
          tableConfigs,
          setTableConfigs,
          originalTableName,
          "new_name",
          response.data.preview.table_schema.name,
        );
        setPreviewing(false);
      })
      .catch(() => {
        messageApi.error("Failed to preview with the given Excel range");
        setPreviewing(false);
      });
  };

  return (
    <div className="grid gap-2 pb-2">
      <div className="flex flex-row space-x-2">
        <Space.Compact className="w-full">
          <Tooltip title="Specify a cell range, e.g, A1:C3, or leave empty for all cells">
            <Input
              size="middle"
              autoSize
              style={{
                width: "100%",
              }}
              value={tableConfigs[originalTableName].excel_range}
              placeholder="All cells..."
              status={isValidRange ? "" : "error"}
              onPressEnter={() => {
                previewDatabase();
              }}
              onChange={(e) => {
                updateTableConfig(
                  tableConfigs,
                  setTableConfigs,
                  originalTableName,
                  "excel_range",
                  e.target.value,
                );
              }}
            />
          </Tooltip>
          <Button
            loading={previewing}
            icon={<ReloadOutlined />}
            type="default"
            onClick={previewDatabase}
            disabled={!isValidRange}
          />
        </Space.Compact>
      </div>
    </div>
  );
};

const TableConfigEditor = ({
  tableSchema,
  setTableSchema,
  setTablePreview,
}) => {
  const { tableConfigs, setTableConfigs, databaseType } =
    useContext(PreviewContext);
  const [editingTableName, setEditingTableName] = useState(false);
  const originalTableName = getOriginalTableName(
    tableConfigs,
    tableSchema.name,
  );

  return (
    <div>
      {editingTableName ? (
        <TableNameEdit
          tableName={tableSchema.name}
          updateTableName={(tableName) => {
            setTableSchema({ ...tableSchema, name: tableName });
            updateTableConfig(
              tableConfigs,
              setTableConfigs,
              originalTableName,
              "new_name",
              tableName,
            );
          }}
          setEditingTableName={setEditingTableName}
        />
      ) : (
        <TableNameView
          tableName={tableSchema.name}
          setEditingTableName={setEditingTableName}
        />
      )}
      {databaseType === "excel" && (
        <TableCellEditor
          originalTableName={originalTableName}
          setTablePreview={setTablePreview}
        />
      )}
      <div className="pb-2" />
    </div>
  );
};

export default TableConfigEditor;
