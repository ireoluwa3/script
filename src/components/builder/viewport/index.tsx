import { useEditor } from "@craftjs/core";
import { cn } from "@/utils/cn";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Logo from "@/components/vector/Logo";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Icon } from "@iconify/react";
import Card from "@/components/elements/base/card/Card";
import DarkToolTip from "@/components/elements/base/tooltips/DarkTooltip";
import { useRouter } from "next/router";
import Modal from "@/components/elements/base/modal/Modal";
import Button from "@/components/elements/base/button/Button";
import lz from "lzutf8";
import copy from "copy-to-clipboard";
import { toast } from "sonner";
import Textarea from "@/components/elements/form/textarea/Textarea";
import useBuilderStore from "@/stores/admin/builder";
import ThemeSwitcher from "@/components/widgets/ThemeSwitcher";
import BuilderSidebarIcon from "./Sidebar/BuilderSidebarIcon";
import BuilderMenu from "./Sidebar/BuilderMenu";

export const Viewport: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { saveEditorState } = useBuilderStore();
  const { enabled, connectors, canUndo, canRedo, actions, query } = useEditor(
    (state, query) => ({
      enabled: state.options.enabled,
      canUndo: query.history.canUndo(),
      canRedo: query.history.canRedo(),
    })
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [stateToLoad, setStateToLoad] = useState("");

  useEffect(() => {
    if (!window) return;
    window.requestAnimationFrame(() => {
      window.parent.postMessage({ LANDING_PAGE_LOADED: true }, "*");
      setTimeout(() => {
        actions.setOptions((options) => {
          options.enabled = true;
        });
      }, 200);
    });
  }, [actions.setOptions]);

  useEffect(() => {
    if (containerRef.current) {
      connectors.select(connectors.hover(containerRef.current, ""), "");
    }
  }, [connectors]);

  const handleSave = async () => {
    const json = query.serialize();
    const content = lz.encodeBase64(lz.compress(json));
    saveEditorState(content);
  };

  const handleCopyState = () => {
    const json = query.serialize();
    copy(lz.encodeBase64(lz.compress(json)));
    toast.success("State copied to clipboard");
  };

  const handleLoadState = () => {
    if (stateToLoad.trim()) {
      try {
        const json = lz.decompress(lz.decodeBase64(stateToLoad));
        actions.deserialize(json);
        toast.success("State loaded successfully");
      } catch (error) {
        toast.error("Failed to load state");
      }
    } else {
      toast.error("Please paste a valid state to load");
    }
  };

  return (
    <div
      className={`viewport flex h-full overflow-hidden flex-col w-full fixed`}
    >
      <nav
        className={`fixed h-full start-0 top-0 z-[50] w-20 overflow-visible border border-muted-200 bg-white transition-all duration-300 dark:border-muted-800 dark:bg-muted-950 lg:translate-x-0`}
      >
        <div className="h-full flex justify-between flex-col z-50">
          <ul>
            <li className="relative mb-2 flex h-20 w-full items-center justify-center">
              <Link
                href="/"
                className="relative flex h-10 w-10 mt-2 items-center justify-center text-sm no-underline transition-all duration-100 ease-linear"
              >
                <Logo className="-mt-[5px] h-7 w-7 text-primary-500 transition-opacity duration-300 hover:opacity-80" />
              </Link>
            </li>
            {/* <BuilderSidebarIcon
              icon="solar:add-square-bold-duotone"
              name="ELEMENTS"
            /> */}
            <BuilderSidebarIcon
              icon="solar:layers-bold-duotone"
              name="BLOCKS"
            />
          </ul>
          <div className="mt-auto my-3 w-full flex items-center flex-col gap-4">
            <div
              className="side-icon-inner mask mask-blob flex h-[35px] w-[35px] items-center justify-center transition-colors duration-300 bg-muted-200 dark:bg-muted-800 cursor-pointer group hover:bg-muted-500/10 dark:hover:bg-muted-500/20"
              onClick={() => {
                router.push("/admin/dashboard");
              }}
            >
              <Icon
                icon={"mdi:chevron-left"}
                className="relative h-7 w-7 text-muted-400 transition-colors duration-300 group-hover/side-icon:text-muted-500 group-hover:text-primary-500 group-dark:hover:text-primary-500"
              />
            </div>
            <div className="side-icon-inner mask mask-blob flex h-[35px] w-[35px] items-center justify-center transition-colors duration-300 bg-muted-200 dark:bg-muted-800 cursor-pointer group hover:bg-muted-500/10 dark:hover:bg-muted-500/20">
              <ThemeSwitcher />
            </div>
            <DarkToolTip content="View" position="end">
              <div
                className="side-icon-inner mask mask-blob flex h-[35px] w-[35px] items-center justify-center transition-colors duration-300 bg-muted-200 dark:bg-muted-800 cursor-pointer group hover:bg-muted-500/10 dark:hover:bg-muted-500/20"
                onClick={() => {
                  actions.setOptions((options) => (options.enabled = !enabled));
                }}
              >
                <Icon
                  icon={
                    enabled
                      ? "solar:eye-bold-duotone"
                      : "solar:pen-2-bold-duotone"
                  }
                  className="relative h-7 w-7 text-muted-400 transition-colors duration-300 group-hover/side-icon:text-muted-500 group-hover:text-primary-500 group-dark:hover:text-primary-500"
                />
              </div>
            </DarkToolTip>
            <DarkToolTip content="Save" position="end">
              <div
                className="side-icon-inner mask mask-blob flex h-[35px] w-[35px] items-center justify-center transition-colors duration-300 bg-muted-200 dark:bg-muted-800 cursor-pointer group hover:bg-muted-500/10 dark:hover:bg-muted-500/20"
                onClick={() => {
                  handleSave();
                }}
              >
                <Icon
                  icon={"solar:check-read-line-duotone"}
                  className="relative h-7 w-7 text-muted-400 transition-colors duration-300 group-hover/side-icon:text-muted-500 group-hover:text-primary-500 group-dark:hover:text-primary-500"
                />
              </div>
            </DarkToolTip>
            <DarkToolTip content="Import/Export" position="end">
              <div
                className="side-icon-inner mask mask-blob flex h-[35px] w-[35px] items-center justify-center transition-colors duration-300 bg-muted-200 dark:bg-muted-800 cursor-pointer group hover:bg-muted-500/10 dark:hover:bg-muted-500/20"
                onClick={() => {
                  setOpen(true);
                }}
              >
                <Icon
                  icon="solar:cloud-upload-line-duotone"
                  className="relative h-7 w-7 text-muted-400 transition-colors duration-300 group-hover/side-icon:text-muted-500 group-hover:text-primary-500 group-dark:hover:text-primary-500"
                />
              </div>
            </DarkToolTip>
          </div>
        </div>
      </nav>
      <div className="flex flex-1 h-full bg-muted-100 dark:bg-muted-900 w-full">
        <div className="h-full ms-20 z-[12]">
          <BuilderMenu />
        </div>
        <div className="page-container relative flex-1 h-full transition-all duration-300">
          <div
            className={cn([
              "craftjs-renderer flex-1 h-full w-full transition pb-8 overflow-auto slimscroll px-8",
              { "bg-muted-100 dark:bg-muted-800": enabled },
            ])}
            ref={(ref) =>
              connectors.select(connectors.hover(ref as HTMLElement, ""), "")
            }
          >
            <div className="relative flex-col flex items-center pt-8">
              {children}
            </div>
          </div>

          <div className="absolute bottom-0 right-0 z-[20]">
            <div className="flex gap-2 px-2 pt-[5px] pb-[2px] bg-white dark:bg-muted-800 border-t border-s border-muted-300 dark:border-muted-700 rounded-tl-md">
              <DarkToolTip content="Undo" position="bottom">
                <IconButton
                  shape={"rounded"}
                  size={"sm"}
                  variant={"solid"}
                  color={"muted"}
                  className={cn({
                    "opacity-50 cursor-not-allowed": !canUndo,
                  })}
                  onClick={() => actions.history.undo()}
                >
                  <Icon
                    icon="solar:undo-left-line-duotone"
                    className="h-6 w-6 text-muted-800 dark:text-muted-200"
                  />
                </IconButton>
              </DarkToolTip>
              <DarkToolTip content="Redo" position="bottom">
                <IconButton
                  shape={"rounded"}
                  size={"sm"}
                  variant={"solid"}
                  color={"muted"}
                  className={cn({
                    "opacity-50 cursor-not-allowed": !canRedo,
                  })}
                  onClick={() => actions.history.redo()}
                >
                  <Icon
                    icon="solar:undo-right-line-duotone"
                    className="h-6 w-6 text-muted-800 dark:text-muted-200"
                  />
                </IconButton>
              </DarkToolTip>
            </div>
          </div>
        </div>
      </div>

      {/* Import/Export Modal */}
      <Modal open={open} size="sm">
        <Card shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              Import/Export State
            </p>
            <IconButton
              size="sm"
              shape="full"
              onClick={() => {
                setOpen(false);
              }}
            >
              <Icon icon="lucide:x" className="h-4 w-4 dark:text-white" />
            </IconButton>
          </div>
          <div className="p-4 md:px-6 md:py-8">
            <div className="mx-auto w-full max-w-xs">
              <Textarea
                rows={5}
                label="Paste the compressed state here"
                placeholder="Paste here"
                value={stateToLoad}
                onChange={(e) => setStateToLoad(e.target.value)}
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button shape="smooth" onClick={handleLoadState}>
                Import
              </Button>
              <Button
                variant="outlined"
                shape="smooth"
                onClick={handleCopyState}
              >
                Export
              </Button>
            </div>
          </div>
        </Card>
      </Modal>
    </div>
  );
};

export default Viewport;
