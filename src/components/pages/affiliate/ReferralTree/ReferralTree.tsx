import { useEffect, useRef, useState, memo } from "react";
import * as d3 from "d3";
import { useRouter } from "next/router";
import Card from "@/components/elements/base/card/Card";
import Button from "@/components/elements/base/button/Button";
import { Icon } from "@iconify/react";
import useAffiliateStore from "@/stores/user/affiliate";
import IconBox from "@/components/elements/base/iconbox/IconBox";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "next-i18next";
import { MashImage } from "@/components/elements/MashImage";
type Props = {
  id?: string;
  isAdmin?: boolean;
};
const ReferralTreeBase = ({ id, isAdmin = false }: Props) => {
  const { t } = useTranslation();
  const { fetchNodes, tree } = useAffiliateStore();
  const [loading, setLoading] = useState(false);
  const networkContainer = useRef<HTMLDivElement | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isTransformed, setIsTransformed] = useState(false);
  const initialTransform = useRef(d3.zoomIdentity);
  const svgRef = useRef<d3.Selection<
    SVGSVGElement,
    unknown,
    null,
    undefined
  > | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<Element, unknown> | null>(null);
  const router = useRouter();
  const nodeWidth = 72;
  const nodeHeight = 72;
  const margin = { top: 40, right: 120, bottom: 20, left: 160 };
  useEffect(() => {
    if (router.isReady) {
      fetchNodes();
    }
  }, [router.isReady]);
  useEffect(() => {
    if (tree) {
      setLoading(true);
      if (networkContainer.current) {
        createTree(networkContainer.current, tree);
      }
      setLoading(false);
    }
  }, [tree]);
  const createTree = (container: HTMLDivElement, rootUser: any) => {
    const width = container.clientWidth - margin.left - margin.right;
    const height = container.clientHeight - margin.top - margin.bottom;
    d3.select(container).selectAll("svg").remove();
    const svg = d3
      .select(container)
      .append("svg")
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      )
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", "100%")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    svgRef.current = svg;
    const gridSpacing = 50;
    const gridLimit = 5000;
    const gridOrigin = gridLimit / 2;
    for (let y = -gridOrigin; y <= gridOrigin; y += gridSpacing) {
      svg
        .append("line")
        .attr("x1", -gridOrigin)
        .attr("y1", y)
        .attr("x2", gridOrigin)
        .attr("y2", y)
        .attr("stroke-width", 0.1)
        .attr("class", "stroke-gray-600 dark:stroke-gray-400");
    }
    for (let x = -gridOrigin; x <= gridOrigin; x += gridSpacing) {
      svg
        .append("line")
        .attr("x1", x)
        .attr("y1", -gridOrigin)
        .attr("x2", x)
        .attr("y2", gridOrigin)
        .attr("stroke-width", 0.1)
        .attr("class", "stroke-gray-600 dark:stroke-gray-400");
    }
    const treemap = d3.tree().size([height, width]);
    const nodes = d3.hierarchy(rootUser, (d) => d.downlines);
    treemap(nodes);
    nodes.descendants().forEach((d) => {
      d.y = d.depth * (nodeHeight + 40);
    });
    svg
      .selectAll(".link")
      .data(nodes.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .style("fill", "none")
      .style("stroke", "#ccc")
      .style("stroke-width", "1px")
      .attr(
        "d",
        d3
          .linkVertical()
          .x((d) => d.x)
          .y((d) => d.y)
      );
    const node = svg
      .selectAll(".node")
      .data(nodes.descendants())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .attr("class", "node grayscale");
    node
      .append("foreignObject")
      .attr("width", nodeWidth)
      .attr("height", nodeHeight)
      .attr("x", -nodeWidth / 2)
      .attr("y", -nodeHeight / 2)
      .append("xhtml:body")
      .style("margin", "0")
      .style("padding", "0")
      .style("background-color", "none")
      .style("width", `${nodeWidth}px`)
      .style("height", `${nodeHeight}px`)
      .attr(
        "class",
        "transform hover:scale-110 transition-all duration-300 cursor-pointer"
      )
      .html(
        (d) => `<img src='${
          d.data.avatar || `/img/avatars/${d.data.level + 1}.svg`
        }'
                alt='User Avatar'
                style='border-radius: 50%; width: 100%; height: 100%; object-fit: cover;'
                class='p-1'
                />`
      );
    node.on("click", (event, d) => selectUser(d.data));
    // Calculate the bounding box of the tree
    const treeBBox = svg.node().getBBox();
    // Calculate initial translate values to center the tree
    const initialX = width / 2 - treeBBox.width / 2 - treeBBox.x;
    const initialY = height / 2 - treeBBox.height / 2 - treeBBox.y;
    initialTransform.current = d3.zoomIdentity.translate(initialX, initialY);
    const zoom = d3
      .zoom()
      .scaleExtent([0.7, 3])
      .on("zoom", (event) => {
        const transform = event.transform;
        svg.attr("transform", transform);
        setIsTransformed(
          !(
            transform.x === initialTransform.current.x &&
            transform.y === initialTransform.current.y &&
            transform.k === 1
          )
        );
      });
    zoomRef.current = zoom;
    d3.select(container)
      .select("svg")
      .call(zoom)
      .call(zoom.transform, initialTransform.current)
      .on("dblclick.zoom", null);
    selectUser(rootUser);
  };
  const selectUser = (profile: User): void => {
    setSelectedUser(profile);
    d3.selectAll(".node").classed("grayscale-0", false);
    d3.selectAll(".link").style("stroke", "#ccc");
    const selectedD3Node = d3
      .selectAll(".node")
      .filter((d) => d.data.id === profile.id);
    if (!selectedD3Node.empty()) {
      selectedD3Node.classed("grayscale-0", true);
      const ancestors = selectedD3Node.datum().ancestors();
      d3.selectAll(".link")
        .style("stroke", (d) => {
          return ancestors.includes(d.target) ? "#EE4E34" : "#ccc";
        })
        .style("stroke-width", (d) =>
          ancestors.includes(d.target) ? "2px" : "1px"
        );
      d3.selectAll(".node")
        .filter((d) => ancestors.includes(d))
        .classed("grayscale-0", true);
    }
  };
  const resetView = () => {
    if (zoomRef.current && svgRef.current) {
      d3.select(networkContainer.current)
        .select("svg")
        .call(zoomRef.current.transform, initialTransform.current);
      svgRef.current
        .transition()
        .duration(750)
        .attr("transform", initialTransform.current.toString());
      setIsTransformed(false);
    }
  };
  const deselectUser = () => {
    setSelectedUser(null);
    d3.selectAll(".node").classed("grayscale-0", false);
    d3.selectAll(".link").style("stroke", "#ccc").style("stroke-width", "1px");
  };
  const view = (id: string) => {
    router.push(`/admin/ext/affiliate/node/${id}`);
  };
  return (
    <Card
      className="flex justify-center items-center relative"
      shape="curved"
      color={"contrast"}
    >
      <AnimatePresence>
        {isTransformed && (
          <motion.div
            key="reset-icon"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-3 right-3 z-50"
          >
            <IconBox
              onClick={resetView}
              className="cursor-pointer"
              shadow={"contrast"}
              shape={"rounded"}
              size={"sm"}
              icon="fluent:resize-small-20-regular"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            key="selected-user-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-3 left-3 mr-5 z-50 text-sm"
          >
            <Card color="muted" className="px-4 pb-4 pt-6 w-auto">
              <Icon
                icon="fluent:dismiss-24-regular"
                onClick={deselectUser}
                className="absolute top-2 right-2 w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-danger-500 dark:hover:text-danger-500"
              />
              <div className="flex gap-5 items-center mb-5">
                <MashImage
                  src={
                    selectedUser.avatar ??
                    `/img/avatars/${selectedUser.level + 1}.svg`
                  }
                  alt="User Avatar"
                  className="rounded-full w-12 h-12"
                />
                <div>
                  <h3 className="text-gray-700 dark:text-gray-300">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t("Level")}
                    {selectedUser.level}
                  </p>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between gap-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    {t("Referred")}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {selectedUser.referredCount}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    {t("Rewards")}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {selectedUser.rewardsCount}
                  </span>
                </div>
                {isAdmin && selectedUser.id !== id && (
                  <Button
                    onClick={() => view(selectedUser.id)}
                    color="primary"
                    className="mt-5"
                  >
                    {t("View Node")}
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className="relative w-full overflow-hidden z-0 rounded-2xl h-[60vh]"
        ref={networkContainer}
      />
    </Card>
  );
};
export const ReferralTree = memo(ReferralTreeBase);
