import { SettingTwoTone, SettingOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
import SortEditor from "components/viz/buttons/sort_editor";
import { getActiveFields, objectEmpty } from "components/viz/spec_helper";
import { useEffect, useState } from "react";

const DEFAULT_LIMIT = 500;

const getActiveAxes = (spec) => {
  return getActiveFields(spec).map((field) => ({
    value: field,
    label: field,
  }));
};

const SortButton = ({ spec, setSpec }) => {
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
    if (!popoverOpen && updatedLimit && updatedLimit !== spec.limit) {
      setSpec({ ...spec, limit: updatedLimit });
    }
  }, [updatedLimit, spec, setSpec, popoverOpen]);

  const sortOrLimitApplied =
    !objectEmpty(sortBy) || spec?.limit !== DEFAULT_LIMIT;

  return (
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
      <Button
        icon={sortOrLimitApplied ? <SettingTwoTone /> : <SettingOutlined />}
        size="small"
        type="text"
      />
    </Popover>
  );
};

export default SortButton;
