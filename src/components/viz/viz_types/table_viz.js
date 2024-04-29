import SortTextButton from "components/viz/buttons/sort_text_button";
import TableEditor from "components/viz/editor/table_editor";
import TableView from "components/viz/views/table_view";

class TableViz {
  static renderView({ schema, rows, spec, setSpec }) {
    return (
      <div style={{ height: "100%", minHeight: 360 }}>
        <TableView schema={schema} rows={rows} />
        <SortTextButton spec={spec} setSpec={setSpec} />
      </div>
    );
  }

  static renderEditor({ spec, setSpec }) {
    return <TableEditor spec={spec} setSpec={setSpec} />;
  }

  static validateSpec(spec) {
    if (
      spec.y_axises.length === 0 &&
      spec.breakdowns.length === 0 &&
      !spec.x_axis
    ) {
      return "No columns specified. Add one to visualize";
    }
  }
}

export default TableViz;
