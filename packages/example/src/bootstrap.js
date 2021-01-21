import React from "react";
import ReactDOM from "react-dom";

import { PrimaryButton } from "@fluentui/react/lib/compat/Button";
import { Label } from "@fluentui/react/lib/Label";
import { Breadcrumb } from "@fluentui/react/lib/Breadcrumb";

const root = document.getElementById("root");

const breadcrumbItems = [
  { text: "Files", key: "Files" },
  { text: "Folder 1", key: "f1" },
  { text: "Folder 2", key: "f2" },
];

ReactDOM.render(
  <div>
    <Breadcrumb items={breadcrumbItems}></Breadcrumb>
    <Label>THIS IS A LABEL</Label>
    <PrimaryButton>sdfsdf</PrimaryButton>
  </div>,
  root
);
