import React, { useContext, useEffect, useState } from "react";

import ListBox from "@/components/elements/form/listbox/Listbox";
import Category from "./Category";
import { ThemeContext } from "@/context/ThemeContext";
import { useEditor } from "@craftjs/core";
import Item from "./Item";
import { Icon } from "@iconify/react";

const Blocks = () => {
  const { components, categories, updateIndex, themeNames, themeIndex } =
    useContext(ThemeContext);

  const { enabled, connectors } = useEditor(({ options }) => ({
    enabled: options.enabled,
  }));

  const [toolbarVisible, setToolbarVisible] = useState<boolean[]>([]);

  useEffect(() => {
    const v = Array.from({ length: categories.length }, (_, i) => i === 0);
    setToolbarVisible(v);
  }, [categories]);

  const toggleToolbar = (index: number) => {
    setToolbarVisible((t) => t.map((c, i) => (i === index ? !c : c)));
  };

  const onChange = (item) => {
    updateIndex(themeNames.indexOf(item.value));
  };

  return (
    <div className="w-full flex flex-col shadow-inner h-full">
      <div className="p-3">
        <ListBox
          setSelected={(e) => onChange(e)}
          selected={{
            label: themeNames[themeIndex],
            value: themeNames[themeIndex],
          }}
          options={themeNames.map((t) => ({ label: t, value: t }))}
        />
      </div>
      <div className="scrollbar-hidden overflow-y-auto slimscroll">
        {categories.map((b, j) => (
          <Category
            key={j}
            title={b}
            visible={toolbarVisible[j]}
            setVisible={() => toggleToolbar(j)}
          >
            <div className="flex flex-col gap-5 p-5 bg-muted-100 dark:bg-muted-900">
              {components
                ?.filter((c) => c.category === b)
                .map((c, i) => (
                  <div key={i} className="relative w-full group">
                    <Item move connectors={connectors} c={c}>
                      <img
                        src={`/themes/${c.themeFolder}/${c.blockFolder}/preview.png`}
                        width="600px"
                        height="300px"
                        alt={c.displayName}
                        className="rounded-md"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md">
                        <Icon
                          icon="fluent:drag-20-regular"
                          className="text-white text-3xl"
                        />
                        <span className="absolute bottom-1 left-2 text-white">
                          {c.displayName}
                        </span>
                      </div>
                    </Item>
                  </div>
                ))}
            </div>
          </Category>
        ))}
      </div>
    </div>
  );
};

export default Blocks;
