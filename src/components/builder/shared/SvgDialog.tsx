import React, { useState } from "react";
import Modal from "@/components/elements/base/modal/Modal";
import Card from "@/components/elements/base/card/Card";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Icon } from "@iconify/react";
import Button from "@/components/elements/base/button/Button";
import Textarea from "@/components/elements/form/textarea/Textarea";

type DialogProps = { open: boolean; setOpen: any; node: any; actions: any };

const Dialog: React.FC<DialogProps> = ({ open, setOpen, node, actions }) => {
  const props = node.data.props;
  const key = props.propId;
  const [path, setPath] = useState(node.data.props[key]?.path);

  return (
    <Modal open={open} size="md">
      <Card shape="smooth">
        <div className="flex items-center justify-between p-4 md:p-6">
          <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
            Update SVG Path
          </p>
          <IconButton size="sm" shape="full" onClick={() => setOpen(false)}>
            <Icon icon="lucide:x" className="h-4 w-4" />
          </IconButton>
        </div>
        <div className="p-4 md:px-6">
          <Textarea
            rows={4}
            shape="rounded"
            label="SVG Path"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 mb-4"
            placeholder="Eg. d = 'M150 0 L75 200 L225 200 Z'"
            defaultValue={path as string}
            onChange={(e) => setPath(e.target.value)}
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
                  if (!prop[key]) prop[key] = {};
                  prop[key].path = path;
                });
                setOpen(false);
              }}
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
