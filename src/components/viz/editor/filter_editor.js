import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import FilterDrawer from "components/viz/editor/filter_drawer";
import { getFilterText, objectsEqual } from "components/viz/spec_helper";
import { useEffect, useState } from "react";

const FilterEditor = ({ filter, setFilter, removeFilter, axes }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [updateFilter, setUpdatedFilter] = useState(filter);

  useEffect(() => {
    if (!drawerOpen && !objectsEqual(filter, updateFilter)) {
      setFilter(updateFilter);
    }
  }, [updateFilter, filter, setFilter, drawerOpen]);

  return (
    <>
      <div className="mt-2 content-start">
        <Button
          type="default"
          className="flex items-start align-middle"
          onClick={() => setDrawerOpen(true)}
          block
        >
          <span className="truncate">{getFilterText(updateFilter)}</span>
          <Button
            size="small"
            icon={<DeleteOutlined />}
            className="ml-auto"
            type="text"
            onClick={(e) => {
              e.stopPropagation();
              removeFilter();
            }}
          />
        </Button>
      </div>
      <FilterDrawer
        filter={updateFilter}
        setFilter={setUpdatedFilter}
        axes={axes}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default FilterEditor;
