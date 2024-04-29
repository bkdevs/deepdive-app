import TablePreview from "components/databases/table_preview";
import update from "immutability-helper";

const FilePreview = ({ filePreview, setFilePreview }) => {
  const { tablePreviews } = filePreview;

  return (
    <>
      {tablePreviews.map(({ table_schema, sample_data }, index) => (
        <TablePreview
          key={table_schema.name}
          tableSchema={table_schema}
          setTableSchema={(tableSchema) => {
            setFilePreview(
              update(filePreview, {
                tablePreviews: {
                  [index]: { table_schema: { $merge: tableSchema } },
                },
              }),
            );
          }}
          sampleData={sample_data}
        />
      ))}
    </>
  );
};

export default FilePreview;
