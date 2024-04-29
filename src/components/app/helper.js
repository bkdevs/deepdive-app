const SORTERS = {
  string: (a, b) => a?.localeCompare(b),
  integer: (a, b) => a - b,
  number: (a, b) => a - b,
  datetime: (a, b) => new Date(a) - new Date(b),
  boolean: (a, b) => a - b,
};

const getSorter = (name, type) => {
  if (type in SORTERS) {
    return (a, b) => SORTERS[type](a[name], b[name]);
  }
  throw Error(`Unsupported column ${name} with type ${type}`);
};

export { getSorter };
