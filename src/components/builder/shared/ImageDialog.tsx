import React, { useState, useRef, ChangeEvent } from "react";
import InputFile from "@/components/elements/form/input-file/InputFile";
import { imageUploader } from "@/utils/upload";
import { useTranslation } from "next-i18next";
import Modal from "@/components/elements/base/modal/Modal";
import Card from "@/components/elements/base/card/Card";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Icon } from "@iconify/react";
import Button from "@/components/elements/base/button/Button";
import Input from "@/components/elements/form/input/Input";

interface ContentProps {
  url: string;
  text: string;
  setText: (text: string) => void;
  setUrl(url: string): void;
  onChange: () => void;
}

const Content: React.FC<ContentProps> = ({
  url,
  text,
  setText,
  onChange,
  setUrl,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const handleRemoveFile = () => {
    setText("");
    onChange();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="mt-4 mb-4">
      <div ref={inputRef}>
        <InputFile
          id="image"
          acceptedFileTypes={[
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/gif",
            "image/svg+xml",
            "image/webp",
          ]}
          preview={url && url !== "" ? url : null}
          previewPlaceholder="/img/placeholder.svg"
          maxFileSize={16}
          label={`${t("Max File Size")}: ${16} MB`}
          bordered
          color="default"
          onChange={(files) => {
            if (files.length) {
              imageUploader({
                file: files[0],
                dir: "theme",
                size: {
                  maxWidth: 1980,
                  maxHeight: 1080,
                },
              }).then((response) => {
                if (response.success) {
                  setUrl(response.url);
                }
              });
            }
          }}
          onRemoveFile={handleRemoveFile}
        />
        <div className="flex justify-center my-4">OR</div>
        <div className="flex justify-center mb-4 items-end gap-2">
          <Input
            type="text"
            shape="rounded"
            label="URL"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="Eg. https://www.w3schools.com/html/pic_trulli.jpg"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button
            onClick={onChange}
            variant="solid"
            color="primary"
            shape="rounded"
            disabled={text === ""}
          >
            Set
          </Button>
        </div>
      </div>
    </div>
  );
};

interface DialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  node: any;
  actions: any;
}

const Dialog: React.FC<DialogProps> = ({ open, setOpen, node, actions }) => {
  const props = node.data.props;
  const propId = props.propId;

  const [url, setUrl] = useState(props[propId]?.url ?? node.dom?.src);
  const [text, setText] = useState(url);

  const onChange = () => {
    setUrl(text);
  };

  return (
    <Modal open={open} size="xl">
      <Card shape="smooth">
        <div className="flex items-center justify-between p-4 md:p-6">
          <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
            Upload Image
          </p>
          <IconButton size="sm" shape="full" onClick={() => setOpen(false)}>
            <Icon icon="lucide:x" className="h-4 w-4" />
          </IconButton>
        </div>
        <div className="p-4 md:px-6 md:py-8">
          <Content
            url={url}
            text={text}
            setText={setText}
            onChange={onChange}
            setUrl={(e) => {
              setText(e);
              setUrl(e);
            }}
          />
        </div>
        <div className="p-4 md:p-6">
          <div className="flex w-full justify-end gap-2">
            <Button shape="smooth" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="solid"
              color="primary"
              shape="smooth"
              onClick={() => {
                actions.setProp(node.id, (prop: any) => {
                  if (!prop[propId]) prop[propId] = {};
                  prop[propId].url = url;
                });
                setOpen(false);
              }}
              disabled={!url}
            >
              Save
            </Button>
          </div>
        </div>
      </Card>
    </Modal>
  );
};

export default Dialog;
