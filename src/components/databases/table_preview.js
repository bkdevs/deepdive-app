import TableConfigEditor from "components/databases/table_config_editor";
import TableSampleData from "components/databases/table_sample_data";
import TableSchemaEditor from "components/databases/table_schema_editor";

const TablePreview = ({
  tableSchema,
  setTableSchema,
  sampleData,
  setTablePreview,
}) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-start-1 col-span-1">
        <TableConfigEditor
          tableSchema={tableSchema}
          setTableSchema={setTableSchema}
          setTablePreview={setTablePreview}
        />
        <TableSchemaEditor
          tableSchema={tableSchema}
          setTableSchema={setTableSchema}
        />
      </div>
      <div className="col-start-2 col-span-3">
        <TableSampleData tableSchema={tableSchema} sampleData={sampleData} />
      </div>
    </div>
  );
};

export default TablePreview;
