import { Form, Select } from "antd";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const EditTablesForm = ({ form, tables, databaseSchema }) => {
  return (
    <Form
      {...layout}
      form={form}
      initialValues={{ tables: tables }}
      style={{ maxWidth: 600 }}
      requiredMark={false}
    >
      <Form.Item
        name="tables"
        label="Tables"
        rules={[
          { required: true, message: "Please select at least one table" },
        ]}
      >
        <Select
          placeholder="Select tables"
          mode="tags"
          allowClear
          showSearch
          options={
            databaseSchema &&
            databaseSchema.tables.map((table) => ({
              value: table.name,
              label: table.name,
            }))
          }
        ></Select>
      </Form.Item>
    </Form>
  );
};

export default EditTablesForm;
