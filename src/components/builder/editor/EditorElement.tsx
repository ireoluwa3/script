import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNode, useEditor } from "@craftjs/core";
import ReactDOM from "react-dom";
import LinkDialog from "../shared/LinkDialog";
import ImageDialog from "../shared/ImageDialog";
import ButtonDialog from "../shared/ButtonDialog";
import HashtagDialog from "../shared/HashtagDialog";
import SvgDialog from "../shared/SvgDialog";
import useBuilderStore from "@/stores/admin/builder";
import DarkToolTip from "@/components/elements/base/tooltips/DarkTooltip";
import { Icon } from "@iconify/react";

interface ContainerProps {
  render: React.ReactNode;
}

const EditorElement: React.FC<ContainerProps> = ({ render }) => {
  const { id } = useNode();
  const { actions, query, isActive, enabled } = useEditor((state, query) => ({
    isActive: query.getEvent("selected").contains(id),
    enabled: state.options.enabled,
  }));

  const {
    node,
    data,
    isHover,
    dom,
    name,
    moveable,
    deletable,
    connectors: { drag },
    parent,
    isRootChild,
    showFocus,
  } = useNode((node) => ({
    node: node,
    data: node.data,
    isHover: node.events.hovered,
    dom: node.dom,
    name: node.data.custom.displayName || node.data.displayName,
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent,
    isRootChild: node.data.parent === "ROOT",
    showFocus: node.id !== "ROOT" && node.data.displayName !== "App",
  }));

  const currentRef = useRef<HTMLDivElement>(null);
  const { setSidebar } = useBuilderStore();

  useEffect(() => {
    if (dom) {
      // const handleClick = () => setSidebar("TOOLBAR");

      dom.classList.toggle("component-selected", isActive || isHover);
      // dom.addEventListener("click", handleClick);

      // return () => {
      //   dom.removeEventListener("click", handleClick);
      // };
    }
  }, [dom, isActive, isHover, setSidebar]);

  const getPos = useCallback((dom: HTMLElement | null) => {
    const rect: DOMRect = dom?.getBoundingClientRect() as DOMRect;
    const top = rect?.top + window.scrollY;
    const left = rect?.left + window.scrollX;
    return { top: `${top}px`, left: `${left}px` };
  }, []);

  const scroll = useCallback(() => {
    if (!currentRef.current || !dom) return;
    const { top, left } = getPos(dom);
    currentRef.current.style.top = top;
    currentRef.current.style.left = left;
  }, [dom, getPos]);

  useEffect(() => {
    const el = document.querySelector(".craftjs-renderer");

    el?.addEventListener("scroll", scroll);

    return () => {
      el?.removeEventListener("scroll", scroll);
    };
  }, [scroll]);

  const [openLink, setOpenLink] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [openButton, setOpenButton] = useState(false);
  const [openHash, setOpenHash] = useState(false);
  const [openSvg, setOpenSvg] = useState(false);

  const handleMouseDown = useCallback(
    (
      event: React.MouseEvent,
      setOpen: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      event.stopPropagation();
      setOpen(true);
    },
    []
  );

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.delete(id);
  };

  return (
    <>
      {isHover || isActive
        ? ReactDOM.createPortal(
            <div
              ref={currentRef}
              className="px-1 py-1 fixed flex gap-1 items-center just text-muted-900 rounded-t border-x border-t border-info-500 border-dashed"
              style={{
                left: dom ? getPos(dom).left : "0px",
                top: dom ? getPos(dom).top : "0px",
                zIndex: 9999,
                height: "24px",
                marginTop: "-23px",
                fontSize: "12px",
                lineHeight: "12px",
              }}
            >
              <h2 className="flex-1 mr-4 bg-muted-100 p-1 rounded-sm">
                {name}
              </h2>
              {isRootChild && (
                <DarkToolTip content="Move" position="bottom">
                  <a
                    className="cursor-move flex items-center hover:bg-muted-200 rounded p-1 bg-muted-100/40 transition-colors duration-200"
                    ref={(e) => {
                      if (e) drag(e);
                    }}
                  >
                    <Icon icon="mdi:cursor-move" className="h-4 w-4" />
                  </a>
                </DarkToolTip>
              )}
              {isRootChild && (
                <DarkToolTip content="Hashtag" position="bottom">
                  <a
                    className="cursor-pointer flex items-center hover:bg-muted-200 rounded p-1 bg-muted-100/40 transition-colors duration-200"
                    onMouseDown={(e) => handleMouseDown(e, setOpenHash)}
                  >
                    <Icon icon="mdi:hashtag" className="h-4 w-4" />
                  </a>
                </DarkToolTip>
              )}
              {showFocus && (
                <DarkToolTip content="Parent" position="bottom">
                  <a
                    className="cursor-pointer flex items-center hover:bg-muted-200 rounded p-1 bg-muted-100/40 transition-colors duration-200"
                    onClick={() => {
                      actions.selectNode(data.parent ?? undefined);
                    }}
                  >
                    <Icon icon="mdi:arrow-up" className="h-4 w-4" />
                  </a>
                </DarkToolTip>
              )}
              {dom?.nodeName === "IMG" && (
                <DarkToolTip content="Image" position="bottom">
                  <a
                    className="cursor-pointer flex items-center hover:bg-muted-200 rounded p-1 bg-muted-100/40 transition-colors duration-200"
                    onMouseDown={(e) => handleMouseDown(e, setOpenImage)}
                  >
                    <Icon icon="mdi:image" className="h-4 w-4" />
                  </a>
                </DarkToolTip>
              )}
              {dom?.nodeName === "svg" && (
                <DarkToolTip content="SVG" position="bottom">
                  <a
                    className="cursor-pointer flex items-center hover:bg-muted-200 rounded p-1 bg-muted-100/40 transition-colors duration-200"
                    onMouseDown={(e) => handleMouseDown(e, setOpenSvg)}
                  >
                    <Icon icon="mdi:image" className="h-4 w-4" />
                  </a>
                </DarkToolTip>
              )}
              {dom?.nodeName === "A" && (
                <DarkToolTip content="Link" position="bottom">
                  <a
                    className="cursor-pointer flex items-center hover:bg-muted-200 rounded p-1 bg-muted-100/40 transition-colors duration-200"
                    onMouseDown={(e) => handleMouseDown(e, setOpenLink)}
                  >
                    <Icon icon="mdi:link" className="h-4 w-4" />
                  </a>
                </DarkToolTip>
              )}
              {dom?.nodeName === "BUTTON" && (
                <DarkToolTip content="Button" position="bottom">
                  <a
                    className="cursor-pointer flex items-center hover:bg-muted-200 rounded p-1 bg-muted-100/40 transition-colors duration-200"
                    onMouseDown={(e) => handleMouseDown(e, setOpenButton)}
                  >
                    <Icon icon="dashicons:button" className="h-4 w-4" />
                  </a>
                </DarkToolTip>
              )}
              {isRootChild && (
                <DarkToolTip content="Delete" position="bottom">
                  <a
                    className="cursor-pointer flex items-center hover:bg-muted-200 rounded p-1 bg-muted-100/40 transition-colors duration-200"
                    onMouseDown={handleDelete}
                  >
                    <Icon icon="mdi:trash-can-outline" className="h-4 w-4" />
                  </a>
                </DarkToolTip>
              )}
              <LinkDialog
                open={openLink}
                setOpen={setOpenLink}
                node={node}
                actions={actions}
              />
              <ImageDialog
                open={openImage}
                setOpen={setOpenImage}
                node={node}
                actions={actions}
              />
              <HashtagDialog
                open={openHash}
                setOpen={setOpenHash}
                node={node}
                actions={actions}
              />
              <SvgDialog
                open={openSvg}
                setOpen={setOpenSvg}
                node={node}
                actions={actions}
              />
              <ButtonDialog
                open={openButton}
                setOpen={setOpenButton}
                node={node}
                actions={actions}
              />
            </div>,
            document.querySelector(".page-container") as HTMLElement
          )
        : null}
      {render}
    </>
  );
};

export default EditorElement;
