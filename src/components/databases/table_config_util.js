export function getOriginalTableName(tableConfigs, currentTableName) {
  for (const originalTableName in tableConfigs) {
    if (tableConfigs[originalTableName]["new_name"] === currentTableName) {
      return originalTableName;
    }
  }
  return null;
}

export function updateTableConfig(
  tableConfigs,
  setTableConfigs,
  originalTableName,
  key,
  value,
) {
  const newTableConfig = { ...tableConfigs[originalTableName], [key]: value };
  const newTableConfigs = {
    ...tableConfigs,
    [originalTableName]: newTableConfig,
  };
  setTableConfigs(newTableConfigs);
}

export function validateExcelRange(excelRange) {
  if (excelRange.length === 0) {
    return true;
  }
  const pattern = /^[A-Z]+[1-9][0-9]*:[A-Z]+[1-9][0-9]*$/;
  if (!pattern.test(excelRange)) {
    return false;
  }

  const { startColumn, startRow, endColumn, endRow } =
    parseExcelRange(excelRange);
  if (getColumnNumber(startColumn) > getColumnNumber(endColumn)) {
    return false;
  }
  if (startRow > endRow) {
    return false;
  }
  return true;
}

function parseExcelRange(excelRange) {
  const parts = excelRange.split(":");
  const startCell = parts[0];
  const endCell = parts[1];

  const startColumn = startCell.match(/[A-Z]+/)[0];
  const startRow = parseInt(startCell.match(/[1-9][0-9]*/)[0], 10);
  const endColumn = endCell.match(/[A-Z]+/)[0];
  const endRow = parseInt(endCell.match(/[1-9][0-9]*/)[0], 10);
  return {
    startColumn: startColumn,
    startRow: startRow,
    endColumn: endColumn,
    endRow: endRow,
  };
}

// Helper function to convert column letters to numbers (A=1, B=2, ..., Z=26, AA=27, AB=28, etc.)
function getColumnNumber(column) {
  let number = 0;
  for (let i = 0; i < column.length; i++) {
    number = number * 26 + (column.charCodeAt(i) - 64);
  }
  return number;
}
