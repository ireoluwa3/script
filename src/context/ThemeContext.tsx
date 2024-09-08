import React, { createContext, useState, useEffect } from "react";

import { Element } from "@craftjs/core";

import Child from "../components/builder/shared/Child";

import { Container } from "../components/builder/shared/Container";
import { Text } from "../components/builder/shared/Text";
import { Link } from "../components/builder/shared/Link";
import { Svg } from "../components/builder/shared/Svg";
import { Button } from "../components/builder/shared/Button";
import { Image } from "../components/builder/shared/Image";
import { Component } from "../components/builder/shared/Child";

import { getThemeUrl } from "../components/builder/utils/fetch";
import { debounce } from "lodash";
import Checkbox from "@/components/elements/form/checkbox/Checkbox";
import Radio from "@/components/elements/form/radio/Radio";
import Input from "@/components/elements/form/input/Input";
import Div from "@/components/builder/shared/Div";

const themes = [
  { name: "Hyper UI", folder: "hyperui" },
  { name: "Tailblocks", folder: "tailblocks" },
  { name: "Flowrift", folder: "flowrift" },
  { name: "Meraki UI", folder: "meraki-light" },
  { name: "Preline", folder: "preline" },
  { name: "Flowbite", folder: "flowbite" },
];

interface ComponentInterface {
  folder: string;
  source: any;
}

interface ComponentInterfaceFull extends ComponentInterface {
  displayName: string;
  category: string;
  source: string;
  themeFolder: string;
  blockFolder: string;
}

interface ContextInterface {
  components: ComponentInterfaceFull[];
  categories: string[];
  themeNames: string[];
  themeIndex: number;
  resolver: object;
  updateIndex: (arg0: number) => void;
}

const _resolver = {
  Container,
  Component,
  Element,
  Text,
  Child,
  Link,
  Button,
  Image,
  Svg,
  Checkbox,
  Radio,
  Input,
  Div,
};

const defaultValue = {
  components: [],
  categories: [],
  themeNames: [],
  themeIndex: 0,
  updateIndex: () => {},
  resolver: _resolver,
};

const ThemeContext = createContext<ContextInterface>(defaultValue);

type ProviderProps = { children: React.ReactNode };

const ThemeProvider: React.FC<ProviderProps> = ({ children }) => {
  const [themeIndex, setThemeIndex] = useState<number>(defaultValue.themeIndex);
  const [components, setComponents] = useState<ComponentInterfaceFull[]>(
    defaultValue.components
  );
  const [categories, setCategories] = useState<string[]>(
    defaultValue.categories
  );
  const [resolver, _setResolver] = useState<object>(defaultValue.resolver);

  const themeNames = themes.map((t) => t.name);

  const updateIndex = async (index: number) => {
    setThemeIndex(index);

    // set components
    const folder = themes[index]?.folder;
    const url = getThemeUrl(folder);
    const data = await fetch(url).then((r) => r.json());
    const _components = data.map((c: ComponentInterfaceFull) => ({
      displayName: c.folder.replace(/(\d)/, " $1"),
      category: c.folder.replace(/\d/g, ""),
      source: c.source,
      themeFolder: folder,
      blockFolder: c.folder,
    })) as ComponentInterfaceFull[];

    // sort components
    const _coponentsSorted = _components.sort((a, b) => {
      return a.displayName.localeCompare(b.displayName, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });
    setComponents(_coponentsSorted);

    // set categories
    const _categories = _components.map(
      (c: ComponentInterfaceFull) => c.category
    );
    setCategories([...new Set(_categories)] as string[]);
  };

  const debounceUpdateIndex = debounce(updateIndex, 100);
  useEffect(() => {
    debounceUpdateIndex(0);
  }, []);

  const value = {
    components,
    categories,
    resolver,
    themeNames,
    themeIndex,
    updateIndex,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
export { ThemeContext, ThemeProvider };
