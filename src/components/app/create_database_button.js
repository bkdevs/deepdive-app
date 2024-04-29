import { Button } from "antd";
import { PreviewContext } from "components/app/file_previews_card";
import { authAxios } from "http/axios";
import { useDatabasesQuery, useSessionsQuery } from "queries";
import { useContext, useState } from "react";
import { useNavigate, useNavigation } from "react-router-dom";

const EXTENSION_TO_DB_TYPE = {
  csv: "csv",
  tsv: "csv",
  xlsx: "excel",
  xlsm: "excel",
  xlsb: "excel",
};

const validateFilePreviews = (messageApi, filePreviews) => {
  const dbTypes = filePreviews
    .map((filePreview) => filePreview.fileName.split(".").pop())
    .map((fileExtension) => EXTENSION_TO_DB_TYPE[fileExtension]);

  if (!dbTypes.every((dbType) => dbType === dbTypes[0])) {
    messageApi.error(
      `Cannot create a database with different file types (csv, excel). Please remove one`,
    );
    return false;
  }
  return true;
};

const validateTableSchema = (messageApi, tableSchema) => {
  if (tableSchema.columns.length === 0) {
    messageApi.error(
      `Cannot create table ${tableSchema.name} with no columns! Add one or more columns`,
    );
    return false;
  }

  const tableColumnNames = tableSchema.columns.map((column) => column.name);
  if (new Set(tableColumnNames).size !== tableColumnNames.length) {
    messageApi.error(
      `Duplicate column names in table ${tableSchema.name}! Please rename one of the columns`,
    );
    return false;
  }
  return true;
};

export const inferDatabaseType = (filePreviews) => {
  const fileExtension = filePreviews[0].fileName.split(".").pop();
  return EXTENSION_TO_DB_TYPE[fileExtension];
};

const defaultDatabaseName = (filePreviews) => {
  return filePreviews.map((filePreview) => filePreview.fileName).join(", ");
};

const buildFormData = (messageApi, filePreviews, tableConfigs) => {
  if (!validateFilePreviews(messageApi, filePreviews)) {
    return null;
  }

  const allTableSchemas = [];
  for (const filePreview of filePreviews) {
    allTableSchemas.push(
      ...filePreview.tablePreviews.map(
        (tablePreview) => tablePreview.table_schema,
      ),
    );
  }

  for (const tableSchema of allTableSchemas) {
    if (!validateTableSchema(messageApi, tableSchema)) {
      return null;
    }
  }

  const databaseSchema = JSON.stringify({
    tables: allTableSchemas,
    sql_dialect: "Sqlite",
  });

  const formData = new FormData();
  const databaseFiles = filePreviews.map((filePreview) => filePreview.fileId);
  databaseFiles.forEach((databaseFile) =>
    formData.append("database_files", databaseFile),
  );
  formData.append("name", defaultDatabaseName(filePreviews));
  formData.append("database_type", inferDatabaseType(filePreviews));
  formData.append("schema", databaseSchema);
  formData.append("table_configs", JSON.stringify(tableConfigs));

  return formData;
};

const CreateDatabaseButton = ({ filePreviews }) => {
  const [submitting, setSubmitting] = useState(false);
  const { refetch: refetchSessions } = useSessionsQuery();
  const { refetch: refetchDatabases } = useDatabasesQuery();
  const { messageApi, tableConfigs } = useContext(PreviewContext);
  const navigation = useNavigation();
  const navigate = useNavigate();

  const createDatabase = async () => {
    const formData = buildFormData(messageApi, filePreviews, tableConfigs);
    if (!formData) {
      return;
    }

    setSubmitting(true);
    const databaseResponse = await authAxios
      .post("/databases/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .catch((error) => {
        const errorResponse = JSON.parse(error.request?.response);
        if (errorResponse && "non_field_errors" in errorResponse) {
          messageApi.error(errorResponse.non_field_errors);
        }
      });

    const database = databaseResponse && databaseResponse.data;
    if (!database) {
      setSubmitting(false);
      return;
    }

    const { data: session } = await authAxios.post("/sessions/", {
      database_id: database.id,
    });
    navigate(`sessions/${session.id}`);
    setSubmitting(false);
    refetchSessions();
    refetchDatabases();
  };

  return (
    <>
      <Button
        className="w-32"
        size="large"
        type="primary"
        loading={submitting || navigation.state === "loading"}
        onClick={createDatabase}
      >
        Create
      </Button>
    </>
  );
};

export default CreateDatabaseButton;
