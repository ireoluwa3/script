import { create } from "zustand";
import $fetch, { fileToBase64 } from "@/utils/api";
import { immer } from "zustand/middleware/immer";
import { toast } from "sonner";
import { generateCrudActions } from "@/utils/datatable";
import { toCamelCase } from "@/utils/strings";
import { debounce } from "lodash";

interface PaginationState {
  totalItems: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
}

interface DataTableProps {
  title: string;
  endpoint: string;
  hasStructure?: boolean;
  columnConfig: any[];
  formSize?: string;
  isCrud?: boolean;
  canView?: boolean;
  canCreate?: boolean;
  canImport?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  isParanoid?: boolean;
  navActionsConfig: NavActionsConfig[];
  dropdownActionsConfig: DropdownActionsConfig[];
  showDeletedAction?: NavActionsConfig;
  onlySingleActiveStatus?: boolean;
}

interface StructureSchemaItem {
  type: "input" | "select" | "switch" | "file";
  label: string;
  name: string;
  placeholder?: string;
  options?: Array<{ value: string | number; label: string }>;
  fileType?: string;
  width?: number;
  height?: number;
  maxSize?: number;
  notNull?: boolean;
  ts: "string" | "number" | "boolean" | "date" | "json"; // Extended for additional data types
  readOnly?: boolean; // Added to support read-only states for 'get'
}

// Represents an entire form configuration
interface FormStructure {
  get: Array<StructureSchemaItem | StructureSchemaItem[]>; // Array or nested arrays for grouping
  set: Array<StructureSchemaItem | StructureSchemaItem[]>; // Array or nested arrays for grouping
}

type StructureSchema = FormStructure;

interface StoreState {
  props: DataTableProps;
  items: any[];
  params: Record<string, any>;
  activeModal: string | null;
  modalItem: any | null;
  modalAction: any | null;
  isPanelOpen: boolean;
  viewItem: any | null;
  panelAction: any | null;
  pagination: PaginationState;
  structureData: StructureSchema;
  selectedItems: number[];
  isLoading: boolean;
  filter: Record<string, any>;
  filterOperator: Record<string, any>;
  sort: { field: string; rule: "asc" | "desc" };
  dynamicFormItems: StructureSchema;
  actionConfigs: {
    navActionsConfig: NavActionsConfig[];
    dropdownActionsConfig: DropdownActionsConfig[];
  };
  showDeletedAction?: NavActionsConfig;
  navActionsState: Record<string, any>;
  formErrors: Record<string, string>;

  fileUploadProgress: Record<string, number>;
  fileUploadStatus: Record<string, string>;
  uploadError: string | null;
  uploadSuccess: boolean;
  // Actions
  updateItemStatus: (itemId: number, newStatus: any) => void;
  updateItemDetail: (updatedData: any) => void;
  setSort: (update: { field: string; rule: "asc" | "desc" }) => void;
  setFilter: (field: string, value: any, operator?: string) => void;
  setFilters: (filters: Record<string, any>) => void;
  clearFilters: () => void;
  fetchData: () => void;
  fetchStructureData: () => void;
  clearDataTableProps: () => void;
  setDataTableProps: (props: DataTableProps | null) => void;
  setPagination: (update: Partial<PaginationState>) => void;
  toggleItemSelection: (itemId: number) => void;
  selectAllItems: () => void;
  clearSelection: () => void;
  setNavActionsState: (update: any) => void;
  closeModal: () => void;
  openModal: (modalName: string, action?: any, item?: any) => void;
  openPanel: (action: any, item?: any) => void;
  closePanel: () => void;
  handleAction: (action: any, item?: any) => void;
  handleSubmit: (formValues: any) => void;
  setParams: (params: Record<string, any>) => void;
  handleDelete: (
    isRestoring?: boolean,
    isDestroying?: boolean,
    isLog?: boolean,
    query?: Record<string, any>
  ) => void;
  handleBulkDelete: (
    isRestoring?: boolean,
    isDestroying?: boolean,
    isLog?: boolean,
    query?: Record<string, any>
  ) => void;
  setFormErrors: (errors: Record<string, string>) => void;
  clearFormErrors: () => void;

  startUpload: (fileName: string) => void;
  setUploadProgress: (fileName: string, progress: number) => void;
  setUploadStatus: (fileName: string, status: string) => void;
  setUploadSuccess: (success: boolean) => void;
  setUploadError: (error: string | null) => void;
  resetUpload: () => void;
  uploadFile: (
    file: File,
    url: string,
    dir: string,
    additionalData: { height?: number; width?: number; oldPath?: string }
  ) => Promise<void>;
}

export const useDataTable = create<StoreState>()(
  immer((set, get) => ({
    props: {
      title: "",
      endpoint: "",
      columnConfig: [],
      navActionsConfig: [],
      dropdownActionsConfig: [],
      formSize: "md",
      isCrud: true,
      canView: true,
      canCreate: true,
      canImport: true,
      canEdit: true,
      canDelete: true,
      isParanoid: true,
      onlySingleActiveStatus: false,
    },
    items: [],
    params: {},
    pagination: {
      totalItems: 0,
      currentPage: 1,
      perPage: 10,
      totalPages: 0,
    },
    activeModal: null,
    modalItem: null,
    modalAction: null,

    isPanelOpen: false,
    viewItem: null,
    panelAction: null,

    structureData: {
      get: [],
      set: [],
      edit: [],
      import: [],
    },
    selectedItems: [],
    isLoading: true,
    filter: {},
    filterOperator: {},
    sort: { field: "", rule: "desc" },
    dynamicFormItems: {
      get: [],
      set: [],
    },
    actionConfigs: { navActionsConfig: [], dropdownActionsConfig: [] },
    navActionsState: { showDeleted: false },

    formErrors: {},

    fileUploadProgress: {},
    fileUploadStatus: {},
    uploadError: null,
    uploadSuccess: false,

    startUpload: (fileName) => {
      set((state) => {
        state.fileUploadProgress[fileName] = 0;
        state.fileUploadStatus[fileName] = "Uploading";
      });
    },

    setUploadProgress: (fileName, progress) => {
      set((state) => {
        state.fileUploadProgress[fileName] = progress;
      });
    },

    setUploadStatus: (fileName, status) => {
      set((state) => {
        state.fileUploadStatus[fileName] = status;
      });
    },

    setUploadSuccess: (success) => {
      set((state) => {
        state.uploadSuccess = success;
      });
    },

    setUploadError: (error) => {
      set((state) => {
        state.uploadError = error;
      });
    },

    resetUpload: () => {
      set((state) => {
        state.fileUploadProgress = {};
        state.fileUploadStatus = {};
        state.uploadError = null;
        state.uploadSuccess = false;
      });
    },

    uploadFile: (file, url, dir, { height, width, oldPath }) =>
      new Promise(async (resolve, reject) => {
        const {
          startUpload,
          setUploadProgress,
          setUploadStatus,
          setUploadError,
          setUploadSuccess,
        } = get();

        startUpload(file.name);

        const filePayload = {
          file: await fileToBase64(file),
          dir,
          height,
          width,
          oldPath,
        };

        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(file.name, progress);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              setUploadStatus(file.name, "Uploaded");
              setUploadSuccess(true);
              setTimeout(() => {
                resolve(response.url);
              }, 700);
            } catch (error) {
              setUploadStatus(file.name, "Error parsing server response");
              reject("Error parsing server response");
            }
          } else {
            setUploadError(`Failed to upload. Status: ${xhr.status}`);
            setUploadStatus(
              file.name,
              `Failed to upload. Status: ${xhr.status}`
            );
            reject(`Failed to upload. Status: ${xhr.status}`);
          }
        };

        xhr.onerror = () => {
          setUploadError("Network error during file upload");
          setUploadStatus(file.name, "Network error during file upload");
          reject("Network error during file upload");
        };

        xhr.send(JSON.stringify(filePayload));
      }),

    setFormErrors: (errors: Record<string, string>) =>
      set((state) => {
        state.formErrors = errors;
      }),
    clearFormErrors: () =>
      set((state) => {
        state.formErrors = {};
      }),

    handleAction: (action, item = null) => {
      const { navActionsState, openModal, setNavActionsState, openPanel } =
        get();

      const actionHandlers = {
        modal: {
          confirmation: {
            delete: (action, item) => openModal("Delete", action, item),
            restore: (action, item) => openModal("Restore", action, item),
            "permanent-delete": (action, item) =>
              openModal("PermanentDelete", action, item),
            "bulk-delete": (action, item) =>
              openModal("BulkDelete", action, item),
            "bulk-restore": (action, item) =>
              openModal("BulkRestore", action, item),
            "bulk-permanent-delete": (action, item) =>
              openModal("BulkPermanentDelete", action, item),
            default: (action, item) => openModal("Confirm", action, item),
          },
          form: {
            default: (action, item) => openModal("FormModal", action, item),
            create: (action) => openModal("FormModal", action),
          },
        },
        panel: {
          default: (action, item) => {
            openPanel(action, item);
          },
        },
        button: {
          showDeleted: () =>
            setNavActionsState({ showDeleted: !navActionsState.showDeleted }),
        },
        checkbox: {
          showDeleted: () =>
            setNavActionsState({ showDeleted: !navActionsState.showDeleted }),
        },
      };

      const actionTypeHandler = actionHandlers[action.type];
      if (!actionTypeHandler) return;

      if (typeof actionTypeHandler === "function") {
        // Direct actions like links
        actionTypeHandler(action, item);
      } else {
        const actionDetailHandler =
          actionTypeHandler[action.modalType || action.type] ||
          actionTypeHandler;
        if (typeof actionDetailHandler === "function") {
          // If the handler is directly callable
          actionDetailHandler(action, item);
        } else {
          (actionDetailHandler[action.topic] || actionDetailHandler.default)(
            action,
            item
          );
        }
      }
    },

    openPanel: debounce(async (action, item) => {
      set((state) => {
        state.isPanelOpen = true;
        state.viewItem = null;
        state.panelAction = action;
      });

      if (action.api) {
        try {
          const { data, error } = await $fetch({
            url: action.api.replace(":id", item.id),
            silent: true,
          });
          if (!error) {
            set((state) => {
              state.viewItem = data; // Set the fetched data as panel item
            });
          }
        } catch (error) {
          console.error("Error fetching data for panel:", error);
          toast.error("Failed to load data for the panel.");
          set((state) => {
            state.isPanelOpen = false; // Optionally close the panel on failure
          });
        }
      }
    }, 5),

    closePanel: () =>
      set((state) => {
        state.isPanelOpen = false;
        state.panelAction = null;
      }),

    closeModal: () =>
      set((state) => {
        state.activeModal = null;
        state.modalItem = null;
        state.modalAction = null;
      }),
    openModal: (modalName, action = null, item = null) => {
      set((state) => {
        state.activeModal = modalName;
        state.modalAction = action;
        state.modalItem = item;
      });
    },

    updateItemDetail: (updatedData: any) => {
      set((state) => {
        const itemIndex = state.items.findIndex(
          (item) => item.id === updatedData.id
        );
        if (itemIndex !== -1) {
          state.items[itemIndex] = {
            ...state.items[itemIndex],
            ...updatedData,
          };
        }
      });
    },
    updateItemStatus: (itemId, newStatus) => {
      const { onlySingleActiveStatus } = get().props;
      set((state) => {
        if (onlySingleActiveStatus && newStatus) {
          // Deactivate all items
          state.items.forEach((item) => {
            item.status = false;
          });
        }

        // Find the item and update its status
        const itemIndex = state.items.findIndex((item) => item.id === itemId);
        if (itemIndex !== -1) {
          state.items[itemIndex].status = newStatus;
        }
      });
    },

    setNavActionsState: (update) => {
      set((state) => {
        const newNavActionsState = { ...state.navActionsState, ...update };

        // Logic to handle deletion of filters if value is empty
        Object.keys(newNavActionsState).forEach((key) => {
          if (
            newNavActionsState[key] === "" ||
            newNavActionsState[key] === undefined
          ) {
            delete newNavActionsState[key];
          }
        });

        state.navActionsState = newNavActionsState;
      }),
        get().fetchData();
    },

    setSort: (update) => {
      set((state) => {
        state.sort = update;
      });
      get().fetchData(); // Assuming fetchData correctly handles sorting
    },
    setPagination: (update) => {
      const { fetchData } = get();
      set((state) => {
        Object.assign(state.pagination, update);
      });
      fetchData();
    },
    toggleItemSelection: (itemId) =>
      set((state) => {
        const itemIndex = state.selectedItems.indexOf(itemId);
        if (itemIndex !== -1) {
          state.selectedItems.splice(itemIndex, 1);
        } else {
          state.selectedItems.push(itemId);
        }
      }),
    selectAllItems: () =>
      set((state) => {
        state.selectedItems = state.items.map((item) => item.id);
      }),
    clearSelection: () =>
      set((state) => {
        state.selectedItems = [];
      }),

    handleSubmit: debounce(async (formValues) => {
      const {
        modalItem,
        modalAction,
        fetchData,
        closeModal,
        props,
        setFormErrors,
        clearSelection,
        uploadFile,
        resetUpload,
      } = get();
      const isNew = !modalItem || !modalItem.id;

      if (!modalAction) {
        toast.error("Action is missing");
        return;
      }

      if (!modalAction.api) {
        toast.error("API endpoint is missing");
        return;
      }

      if (!modalAction.formItems) {
        toast.error("Form items are missing");
        return;
      }

      if (!modalAction.method) {
        toast.error("API method is missing");
        return;
      }

      if (!formValues) {
        toast.error("Form values are missing");
        return;
      }

      const updatedFormValues = { ...formValues };

      const uploadPromises = Object.keys(formValues).map(async (key) => {
        const item = formValues[key];
        if (item && typeof item === "object" && item.data instanceof File) {
          const { data: file, height, width } = item;
          const dir = `${toCamelCase(props?.title.toLowerCase())}/${key}`;
          const oldPath = !isNew && modalItem[key] ? modalItem[key] : undefined;

          try {
            const url = await uploadFile(file, "/api/upload", dir, {
              height,
              width,
              oldPath,
            });
            updatedFormValues[key] = url; // Assuming uploadFile resolves with the URL
          } catch (error) {
            throw new Error(`Error uploading ${key}: ${error}`);
          }
        }
      });

      try {
        await Promise.all(uploadPromises);

        const { error, validationErrors } = await $fetch({
          url: isNew
            ? modalAction.api
            : modalAction.api.replace(":id", modalItem.id),
          method: modalAction.method,
          body: updatedFormValues,
        });

        if (!error) {
          fetchData();
          closeModal();
          setFormErrors({});
          clearSelection();
          resetUpload();
        } else if (validationErrors) {
          setFormErrors(validationErrors);
          if (Object.keys(validationErrors).length > 0) {
            toast.error("Please correct the validation errors.");
          } else {
            toast.error(Object.values(validationErrors)[0]);
          }
        }
      } catch (error) {
        console.error("Error updating the item:", error);
        toast.error("An error occurred while updating the item.");
      }
    }, 5),

    handleDelete: debounce(
      async (
        isRestoring = false,
        isDestroying = false,
        isLog = false,
        query = {}
      ) => {
        const {
          modalItem,
          modalAction,
          fetchData,
          closeModal,
          clearSelection,
        } = get();
        if (!modalItem || !modalAction) return;
        if (!modalAction.api) {
          toast.error("API endpoint is missing");
          return;
        }

        try {
          const params = {
            ...(isRestoring && { restore: true }),
            ...(isDestroying && { force: true }),
            ...(isLog && { ...query }),
          };

          const { error } = await $fetch({
            url: modalAction.api.replace(":id", modalItem.id),
            method: "DELETE",
            params,
          });
          if (!error) {
            fetchData();
            clearSelection();
          }
        } catch (error) {
          console.error(error);
          toast.error("An error occurred during deletion.");
        } finally {
          closeModal();
        }
      },
      5
    ),

    handleBulkDelete: debounce(
      async (
        isRestoring = false,
        isDestroying = false,
        isLog = false,
        query = {}
      ) => {
        const { selectedItems, fetchData, clearSelection, closeModal, props } =
          get();
        if (!selectedItems.length) return;
        if (!props || !props.endpoint) {
          toast.error("Endpoint is missing");
          return;
        }

        const params = {
          ...(isRestoring && { restore: true }),
          ...(isDestroying && { force: true }),
          ...(isLog && { ...query }),
        };

        try {
          const { error } = await $fetch({
            url: `${props.endpoint}`,
            method: "DELETE",
            body: { ids: Array.from(selectedItems) },
            params,
          });

          if (!error) {
            fetchData();
            clearSelection();
          }
        } catch (error) {
          console.error(error);
          toast.error("An error occurred during bulk deletion.");
        } finally {
          closeModal();
        }
      },
      5
    ),

    setDataTableProps: (props) => {
      const { fetchStructureData } = get();
      set((state) => {
        if (!props) return;
        const {
          endpoint,
          isCrud,
          canView,
          canCreate,
          canImport,
          canEdit,
          canDelete,
          isParanoid,
          hasStructure,
          navActionsConfig,
          dropdownActionsConfig,
        } = props;

        // Generate CRUD actions or use custom configs if provided
        const generatedActionConfigs = isCrud
          ? generateCrudActions(
              endpoint,
              canView,
              canCreate,
              canImport,
              canEdit,
              canDelete,
              isParanoid
            )
          : {
              navActionsConfig,
              dropdownActionsConfig,
              showDeletedAction: undefined,
            };

        // Set the new state
        state.props = {
          ...props,
          navActionsConfig: generatedActionConfigs.navActionsConfig,
          dropdownActionsConfig: generatedActionConfigs.dropdownActionsConfig,
        };

        state.showDeletedAction = generatedActionConfigs.showDeletedAction;

        state.actionConfigs = {
          navActionsConfig: generatedActionConfigs.navActionsConfig,
          dropdownActionsConfig: generatedActionConfigs.dropdownActionsConfig,
        };

        if (hasStructure && isCrud) {
          fetchStructureData();
        }
      });
    },

    fetchStructureData: debounce(() => {
      set((state) => {
        state.isLoading = true;
      });

      const { props } = get();
      const performFetchStructure = async () => {
        if (!props.endpoint) return;
        const endpoint = `${props.endpoint}/structure`;
        try {
          const { data, error } = await $fetch({
            url: endpoint,
            silent: true,
          });

          if (!error) {
            const updatedActionsConfig = props.dropdownActionsConfig.map(
              (action) => {
                if (action.modalType === "form") {
                  switch (action.topic) {
                    case "edit":
                      return { ...action, formItems: data.edit || data.set };
                    default:
                      return action;
                  }
                }
                return action;
              }
            );

            const updatedNavActionsConfig = props.navActionsConfig.map(
              (action) => {
                if (action.modalType === "form") {
                  switch (action.topic) {
                    case "create":
                      return { ...action, formItems: data.set };
                    case "import":
                      return { ...action, formItems: data.import };
                    default:
                      return action;
                  }
                }
                return action;
              }
            );

            set((state) => {
              state.structureData = data;

              // set the action with name view to the panel action
              state.panelAction =
                updatedNavActionsConfig.find(
                  (action) => action.name === "View"
                ) || null;

              state.actionConfigs.dropdownActionsConfig = updatedActionsConfig;
              state.actionConfigs.navActionsConfig = updatedNavActionsConfig;

              state.isLoading = false;
            });
          }
        } catch (error) {
          console.error("Error fetching structure data:", error);
          set((state) => {
            state.isLoading = false;
          });
        }
      };

      performFetchStructure();
    }, 5),

    clearDataTableProps: () =>
      set((state) => {
        state.props = {
          title: "",
          endpoint: "",
          columnConfig: [],
          navActionsConfig: [],
          dropdownActionsConfig: [],
          formSize: "md",
          isCrud: true,
          canView: true,
          canCreate: true,
          canEdit: true,
          canDelete: true,
          isParanoid: true,
        };
      }),

    setFilter: (field, value, operator) => {
      let shouldFetch = false;
      set((state) => {
        // If value is different from current filter, including an empty value
        if (state.filter[field] !== value) {
          state.filter[field] = value;
          shouldFetch = true;
        }
        // If operator is different from current filter operator
        if (operator && state.filterOperator[field] !== operator) {
          state.filterOperator[field] = operator;
          shouldFetch = true;
        }
      });

      // Fetch data if shouldFetch is true, regardless of value being empty or not

      if (shouldFetch) {
        get().fetchData();
      }
    },

    setFilters: (filters) => {
      set((state) => {
        state.filter = filters;
      });
      get().fetchData();
    },

    clearFilters: () =>
      set((state) => {
        state.filter = {};
        state.filterOperator = {};
      }),

    setParams: (params) => {
      set((state) => {
        state.params = params;
      });
    },

    fetchData: debounce(async () => {
      set((state) => {
        state.isLoading = true;
      });

      const {
        filter,
        sort,
        props,
        pagination,
        navActionsState,
        clearSelection,
        filterOperator,
        params,
      } = get();

      const endpoint = props.endpoint;
      if (!endpoint) return;

      const fetchParams = {
        ...(pagination.currentPage !== undefined && {
          page: pagination.currentPage,
        }),
        ...(pagination.perPage !== undefined && {
          perPage: pagination.perPage,
        }),
        ...(sort.field && { sortField: sort.field }),
        ...(sort.rule && { sortOrder: sort.rule }),
        ...(navActionsState.showDeleted && { showDeleted: true }),
        ...params,
      };

      const activeFilters = Object.keys(filter).reduce((acc, key) => {
        if (filter[key] !== undefined && filter[key] !== "") {
          if (typeof filter[key] === "boolean") {
            acc[key] = filter[key];
          } else {
            acc[key] = {
              value: filter[key],
              operator: filterOperator[key]?.value || "startsWith",
            };
          }
        }
        return acc;
      }, {});

      if (Object.keys(activeFilters).length > 0) {
        fetchParams.filter = JSON.stringify(activeFilters);
      }

      const queryString = new URLSearchParams(fetchParams).toString();
      const url = `${endpoint}?${queryString}`;

      try {
        const { data, error } = await $fetch({
          url,
          silent: true,
        });
        if (!error) {
          set((state) => {
            state.items = data.items;
            state.pagination = data.pagination;
            state.isLoading = false;
          });

          clearSelection();
        }
      } catch (error) {
        console.error("Fetch error:", error);
        set((state) => {
          state.isLoading = false;
        });
      }
    }, 10),
  }))
);
