import ace from "ace-builds";
import useSessionContext from "hooks/use_session_context";
import { useEffect } from "react";

const getTablesCompleter = (tables) => {
  return {
    getCompletions: (editor, session, pos, prefix, callback) => {
      callback(
        null,
        tables.map((table) => ({
          caption: `${table.name}`,
          value: table.name,
          meta: "table",
          score: 2000, // prioritize tables over all
        })),
      );
    },
  };
};

const getColumnsCompleter = (tables) => {
  const allColumns = [];
  for (const { columns } of tables) {
    allColumns.push(...columns);
  }

  return {
    getCompletions: (editor, session, pos, prefix, callback) => {
      callback(
        null,
        allColumns.map((column) => ({
          caption: `${column.name}`,
          value: column.name,
          meta: `column ${column.column_type}`,
          score: 1000,
        })),
      );
    },
  };
};
export function useSqlCompleters() {
  const { databaseSchema, tables } = useSessionContext();

  const activeTables =
    databaseSchema &&
    databaseSchema.tables.filter((table) => tables.includes(table.name));

  useEffect(() => {
    if (!databaseSchema) {
      return;
    }
    const langTools = ace.require("ace/ext/language_tools");
    // get rid of local variable completer
    langTools.setCompleters([
      langTools.snippetCompleter,
      langTools.keyWordCompleter,
    ]);
    langTools.addCompleter(getTablesCompleter(activeTables));
    langTools.addCompleter(getColumnsCompleter(activeTables));
  }, [activeTables, databaseSchema]);
}
