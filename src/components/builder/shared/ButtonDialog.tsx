import React, { useState } from "react";
import Modal from "@/components/elements/base/modal/Modal";
import Card from "@/components/elements/base/card/Card";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Icon } from "@iconify/react";
import Button from "@/components/elements/base/button/Button";
import Input from "@/components/elements/form/input/Input";
import Checkbox from "@/components/elements/form/checkbox/Checkbox";
import { capitalize } from "../utils/text";
import ListBox from "@/components/elements/form/listbox/Listbox";

const options = ["url", "email", "submit"];
const methods = ["GET", "POST"];

interface DialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  node: any;
  actions: any;
}

const Dialog: React.FC<DialogProps> = ({ open, setOpen, node, actions }) => {
  const props = node.data.props;
  const key = props.propId;

  const [url, setUrl] = useState(props.url);
  const [email, setEmail] = useState(props.email);
  const [submitUrl, setSubmitUrl] = useState(props.submitUrl);
  const [submitMethod, setSubmitMethod] = useState(props.submitMethod ?? "GET");
  const [submitAsync, setSubmitAsync] = useState(props.submitAsync || false);
  const [newTab, setNewTab] = useState(props.newTab || false);
  const [type, setType] = useState(props.type ?? "url");

  return (
    <Modal open={open} size="md">
      <Card shape="smooth">
        <div className="flex items-center justify-between p-4 md:p-6">
          <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
            Update Button
          </p>
          <IconButton size="sm" shape="full" onClick={() => setOpen(false)}>
            <Icon icon="lucide:x" className="h-4 w-4" />
          </IconButton>
        </div>
        <div className="p-4 md:px-6">
          <div className="mt-4 mb-4">
            <div>
              <div className="flex justify-start items-start gap-5">
                <div className="w-1/3">
                  <ListBox
                    label="Type"
                    options={options.map((o) => {
                      return { value: o, label: capitalize(o) };
                    })}
                    selected={{
                      value: type,
                      label: capitalize(type),
                    }}
                    setSelected={(e) => setType(e.value)}
                  />
                </div>
                {type === "url" && (
                  <Input
                    type="text"
                    shape="rounded"
                    label="URL"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 mb-4"
                    placeholder="Eg. https://codecanyon.net/user/mashdiv"
                    defaultValue={url as string}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                )}
                {type === "email" && (
                  <Input
                    type="text"
                    shape="rounded"
                    label="Email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    placeholder="Eg. johndoe@example.com"
                    defaultValue={email as string}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                )}
                {type === "submit" && (
                  <div className="flex justify-end items-end gap-5">
                    <ListBox
                      label="Method"
                      options={methods.map((o) => {
                        return { value: o, label: o };
                      })}
                      selected={{
                        value: submitMethod,
                        label: submitMethod,
                      }}
                      setSelected={(e) => setSubmitMethod(e.value)}
                    />
                    <Input
                      type="text"
                      shape="rounded"
                      label="Submit URL"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                      placeholder="Eg. /api/submit"
                      defaultValue={submitUrl as string}
                      onChange={(e) => setSubmitUrl(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            {type === "url" && (
              <div className="w-full">
                <Checkbox
                  label="Open in new tab"
                  checked={newTab}
                  onChange={(e) => setNewTab(e.target.checked)}
                  className="ml-4"
                />
              </div>
            )}
            {type === "submit" && (
              <div className="w-full">
                <Checkbox
                  label="Submit Async"
                  checked={submitAsync}
                  onChange={(e) => setSubmitAsync(e.target.checked)}
                  className="ml-4"
                />
              </div>
            )}
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
                    prop[key].type = type.toLowerCase();
                    prop[key].url = url;
                    prop[key].email = email;
                    prop[key].newTab = newTab;
                    prop[key].submitUrl = submitUrl;
                    prop[key].submitMethod = submitMethod;
                    prop[key].submitAsync = submitAsync;
                  });
                  setOpen(false);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Modal>
  );
};

export default Dialog;
