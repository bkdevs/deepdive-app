import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import FilterDrawer from "components/viz/editor/filter_drawer";
import FilterEditor from "components/viz/editor/filter_editor";
import { getAllAxes, objectEmpty } from "components/viz/spec_helper";
import useSessionContext from "hooks/use_session_context";
import update from "immutability-helper";
import { useEffect, useState } from "react";

const FiltersEditor = ({ filters, setFilters }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newFilter, setNewFilter] = useState({});
  const { databaseSchema } = useSessionContext();
  const axes = getAllAxes(databaseSchema);

  useEffect(() => {
    if (!drawerOpen && !objectEmpty(newFilter)) {
      setFilters([...filters, newFilter]);
      setNewFilter({});
    }
  }, [newFilter, filters, setFilters, drawerOpen]);

  return (
    <>
      <div className="flex items-center">
        <p className="font-medium text-sm">Filters</p>
        <div className="ml-auto text-[10px] font-subdued text-gray-700">
          Optional
        </div>
      </div>
      {filters.map((filter, index) => (
        <FilterEditor
          key={index}
          filter={filter}
          setFilter={(filter) =>
            setFilters(update(filters, { [index]: { $merge: filter } }))
          }
          removeFilter={() =>
            setFilters(update(filters, { $splice: [[index, index + 1]] }))
          }
          axes={axes}
        />
      ))}
      <div className="mt-2 content-start">
        <Button
          type="dashed"
          className="flex items-start"
          onClick={() => setDrawerOpen(true)}
          block
        >
          <div className="flex space-x-2">
            <PlusOutlined />
            <span>Add a field</span>
          </div>
        </Button>
      </div>
      <FilterDrawer
        filter={newFilter}
        setFilter={setNewFilter}
        axes={axes}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default FiltersEditor;
