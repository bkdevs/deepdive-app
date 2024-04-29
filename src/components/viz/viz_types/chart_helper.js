import update from "immutability-helper";

export const getSetDomain = (spec, setSpec) => {
  return (left, right) => {
    if (spec?.x_axis) {
      setSpec({
        ...spec,
        x_axis: {
          ...spec.x_axis,
          domain: [left, right],
        },
      });
    }
  };
};

export const getSet2DDomain = (spec, setSpec) => {
  return (left, right, bottom, top) => {
    if (spec.y_axises.length !== 1) {
      // only applicable for scatters, where there's a single y axis
      return;
    }

    const yAxisName = spec.y_axises[0].name;
    const filterIndex = spec.filters.findIndex(
      (filter) => filter.name === yAxisName && filter.filter_type === "numeric",
    );

    let newFilters;
    if (filterIndex !== -1) {
      newFilters = update(spec.filters, {
        [filterIndex]: {
          $merge: {
            domain: [bottom, top],
          },
        },
      });
    } else {
      newFilters = [
        ...spec.filters,
        {
          name: yAxisName,
          filter_type: "numeric",
          domain: [bottom, top],
        },
      ];
    }
    setSpec({
      ...spec,
      x_axis: {
        ...spec.x_axis,
        domain: [left, right],
      },
      filters: newFilters,
    });
  };
};
