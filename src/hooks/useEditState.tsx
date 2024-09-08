import { useRouter } from "next/router";
import { useState, useCallback } from "react";
import { debounce } from "lodash";
import { useDataTable } from "@/stores/datatable";

const useEditState = (columnConfig, setFilter) => {
  const [columnEditStates, setColumnEditStates] = useState({});
  const [editState, setEditState] = useState({
    isEditing: false,
    field: "",
    value: "",
    type: "text",
  });

  const { filter } = useDataTable((state) => state);
  const router = useRouter();

  const updateRoute = useCallback(
    debounce((field, value) => {
      const newQuery = { ...router.query, [field]: value };
      if (value === undefined) {
        delete newQuery[field];
      }
      router.push({ pathname: router.pathname, query: newQuery }, undefined, {
        shallow: true,
      });
    }, 300),
    [router]
  );

  const handleFilterChange = useCallback(
    debounce((field, value) => {
      const trimmedValue = String(value).trim();
      const update = {};
      update[field] = trimmedValue === "" ? undefined : value;
      setFilter(field, update[field]);
      updateRoute(field, update[field]);
    }, 100),
    [setFilter, updateRoute]
  );

  const enableEdit = (field, currentFilterValue, type) => {
    const column = columnConfig.find((col) => col.field === field);
    const isFilterable = column.filterable !== false;
    if (column && isFilterable) {
      setColumnEditStates((prevStates) => ({
        ...prevStates,
        [field]: { ...prevStates[field], active: "true", disabled: "false" },
      }));

      const filterKey = column?.sortName || field;
      let editValue = currentFilterValue;

      if (type === "switch" && column) {
        const columnState = columnEditStates[field] || {};
        editValue =
          currentFilterValue === columnState.active ? "true" : "false";
      }

      setEditState({
        isEditing: true,
        field: filterKey,
        value: editValue ?? "",
        type: type || "text",
      });
    }
  };

  const handleEditChange = (e) => {
    const newValue =
      e.target.type === "checkbox"
        ? e.target.checked.toString()
        : e.target.value;

    setEditState((prevState) => ({
      ...prevState,
      value: newValue,
    }));

    handleFilterChange(editState.field, newValue);
  };

  const saveEdit = (field, value, clearFilter = false) => {
    const column = columnConfig.find(
      (col) => col.sortName === field || col.field === field
    );

    let filterValue = value;
    if (column && column.type === "switch") {
      filterValue = value === "true" ? column.active : column.disabled;
    }

    if (clearFilter || filterValue === undefined || filterValue === "") {
      filterValue = undefined;
    }

    // Access the current filter state before applying the new filter value
    const currentFilterValue = filter[field];

    if (filterValue !== currentFilterValue) {
      handleFilterChange(field, filterValue);
    }

    setEditState({
      isEditing: false,
      field: "",
      value: "",
      type: "text",
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      saveEdit(editState.field, editState.value);
    }
  };

  return { editState, enableEdit, handleEditChange, saveEdit, handleKeyPress };
};

export default useEditState;
