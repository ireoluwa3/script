import React, { useEffect, useContext, useState } from "react";
import {
  Editor as CraftEditor,
  Frame,
  Element,
  useEditor,
  Resolver,
  SerializedNodes,
} from "@craftjs/core";
import EditorElement from "./EditorElement";
import { Container } from "../shared/Container";
import { loadTemplate } from "../utils/fetch";
import { ThemeContext, ThemeProvider } from "@/context/ThemeContext";
import Viewport from "../viewport";
import { debounce } from "lodash";

interface FrameProps {
  data: any;
}

export const DEFAULT_TEMPLATE: SerializedNodes = {
  ROOT: {
    type: { resolvedName: "Container" },
    isCanvas: true,
    props: { width: "100%", height: "800px" },
    displayName: "Container",
    custom: { displayName: "App" },
    parent: null,
    nodes: [],
    linkedNodes: {},
    hidden: false,
  },
};

const FrameEditor: React.FC<FrameProps> = ({ data }) => {
  const { actions } = useEditor();
  const [isDeserialized, setIsDeserialized] = useState(false);

  const loadData = async () => {
    const result = await loadTemplate();
    actions.deserialize(result.ROOT ? result : DEFAULT_TEMPLATE);
    setIsDeserialized(true);
  };

  const debounceLoadData = debounce(loadData, 100);

  useEffect(() => {
    if (!data && !isDeserialized) {
      debounceLoadData();
    }
  }, [data, isDeserialized]);

  if (data) {
    let parsedData;
    try {
      parsedData = typeof data === "string" ? JSON.parse(data) : data;
    } catch (error) {
      parsedData = DEFAULT_TEMPLATE;
    }
    if (parsedData.ROOT && parsedData.ROOT.type) {
      return <Frame data={parsedData} />;
    } else {
      return <Frame data={DEFAULT_TEMPLATE} />;
    }
  }

  return (
    <ThemeProvider>
      <Viewport>
        <Frame>
          <Element
            canvas
            is={Container}
            // eslint-disable-next-line react/no-children-prop
            children={[]}
            custom={{ displayName: "App" }}
          />
        </Frame>
      </Viewport>
    </ThemeProvider>
  );
};

interface EditorProps {
  data: any;
}

const Editor: React.FC<EditorProps> = ({ data }) => {
  const { resolver } = useContext(ThemeContext);

  return (
    <CraftEditor
      resolver={resolver as Resolver}
      enabled={!data}
      onRender={({ render }) => <EditorElement render={render} />}
    >
      <FrameEditor data={data} />
    </CraftEditor>
  );
};

export default Editor;
