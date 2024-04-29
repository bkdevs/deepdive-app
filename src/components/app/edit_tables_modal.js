import { Divider, Form, Modal } from "antd";
import EditTablesForm from "components/app/edit_tables_form";
import useSessionContext from "hooks/use_session_context";
import { useEffect } from "react";
import { useFetcher, useNavigate } from "react-router-dom";

// note: unused
const EditTablesModal = ({ modalOpen, setModalOpen }) => {
  const [form] = Form.useForm();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const { session, tables, databaseSchema } = useSessionContext();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setModalOpen(false);
      form.resetFields();
    }
  }, [form, fetcher, navigate, setModalOpen]);

  const onOk = () => {
    form
      .validateFields()
      .then((values) => {
        fetcher.submit(values, {
          method: "post",
          action: `/app/sessions/${session.id}`,
        });
      })
      .catch((error) => {});
  };

  return (
    <Modal
      title="Edit Tables"
      open={modalOpen}
      onOk={onOk}
      onCancel={() => setModalOpen(false)}
      confirmLoading={fetcher.state === "submitting"}
      transitionName=""
      width={800}
    >
      <Divider />
      <EditTablesForm
        form={form}
        tables={tables}
        databaseSchema={databaseSchema}
      />
    </Modal>
  );
};

export default EditTablesModal;
