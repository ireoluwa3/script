// components/Loading.tsx
import { useDashboardStore } from "@/stores/dashboard";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const defaultTheme = process.env.NEXT_PUBLIC_DEFAULT_THEME || "light";
const Loading = () => {
  const { isDark } = useDashboardStore();
  const [skeletonProps, setSkeletonProps] = useState({
    baseColor: defaultTheme === "dark" ? "#27272a" : "#f7fafc",
    highlightColor: defaultTheme === "dark" ? "#3a3a3e" : "#edf2f7",
  });

  useEffect(() => {
    setSkeletonProps({
      baseColor: isDark ? "#27272a" : "#f7fafc",
      highlightColor: isDark ? "#3a3a3e" : "#edf2f7",
    });
  }, [isDark]);

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <Skeleton height={40} width={300} {...skeletonProps} />
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: "20px" }}>
        <Skeleton height={40} width="100%" {...skeletonProps} />
      </div>

      {/* Navigation Menu */}
      <div style={{ display: "flex", marginBottom: "20px" }}>
        {Array(5)
          .fill("")
          .map((_, index) => (
            <Skeleton
              key={index}
              height={40}
              width={100}
              style={{ marginRight: "10px" }}
              {...skeletonProps}
            />
          ))}
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {Array(8)
          .fill("")
          .map((_, index) => (
            <div key={index} style={{ width: "calc(25% - 20px)" }}>
              <Skeleton height={180} {...skeletonProps} />
              <div style={{ marginTop: "10px" }}>
                <Skeleton height={20} width="80%" {...skeletonProps} />
              </div>
              <div style={{ marginTop: "5px" }}>
                <Skeleton height={20} width="60%" {...skeletonProps} />
              </div>
              <div style={{ marginTop: "5px" }}>
                <Skeleton height={20} width="40%" {...skeletonProps} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Loading;
