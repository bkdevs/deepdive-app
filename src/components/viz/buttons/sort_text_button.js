import { CaretDownOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
import SortEditor from "components/viz/buttons/sort_editor";
import { getActiveFields } from "components/viz/spec_helper";
import { useEffect, useState } from "react";

const getActiveAxes = (spec) => {
  return getActiveFields(spec).map((field) => ({
    value: field,
    label: field,
  }));
};

const getSortLimitText = (spec) => {
  if (!spec.limit && !spec.sort_by) {
    return "all rows";
  } else if (spec.limit && !spec.sort_by) {
    return `${spec.limit} rows`;
  } else if (!spec.limit && spec.sort_by) {
    return `all rows sorted by ${spec.sort_by.name}`;
  } else if (spec.sort_by.direction === "asc") {
    return `bottom ${spec.limit} rows by ${spec.sort_by.name}`;
  } else if (spec.sort_by.direction === "desc") {
    return `top ${spec.limit} rows by ${spec.sort_by.name}`;
  } else {
    return "all rows";
  }
};

const SortTextButton = ({ spec, setSpec }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [updatedLimit, setUpdatedLimit] = useState(spec.limit);
  const sortBy = spec?.sort_by || {};
  const setSortBy = (sortBy) => {
    if (sortBy?.name) {
      setSpec({ ...spec, sort_by: sortBy });
    } else {
      setSpec({ ...spec, sort_by: undefined });
    }
  };
  const activeAxes = getActiveAxes(spec);

  useEffect(() => {
    if (
      !popoverOpen &&
      updatedLimit !== undefined &&
      updatedLimit !== spec.limit
    ) {
      setSpec({ ...spec, limit: updatedLimit });
    }
  }, [updatedLimit, spec, setSpec, popoverOpen]);

  return (
    <div className="-mt-7">
      <span>Showing</span>
      <Popover
        open={popoverOpen}
        onOpenChange={setPopoverOpen}
        content={
          <SortEditor
            activeAxes={activeAxes}
            sortBy={sortBy}
            setSortBy={setSortBy}
            limit={updatedLimit}
            setLimit={setUpdatedLimit}
          />
        }
        trigger="click"
        placement="bottom"
      >
        <Button size="small" type="text" style={{ paddingLeft: 3.5 }}>
          {getSortLimitText(spec)} <CaretDownOutlined />
        </Button>
      </Popover>
    </div>
  );
};

export default SortTextButton;
