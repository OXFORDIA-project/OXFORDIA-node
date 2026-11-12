import React from "react";
import {
  ContainerView,
  ContainerResourceView,
  DefaultContainerLayout,
  DefaultContainerSideMenu,
  type ResourceViewConfig,
} from "linked-data-browser";
import { CustomContainerContent } from "./CustomContainerContent";
import { CustomContainerResourceItem } from "./CustomContainerResourceItem";

function CustomContainerView() {
  return (
    <ContainerView
      Layout={DefaultContainerLayout}
      SideMenu={DefaultContainerSideMenu}
      Content={CustomContainerContent}
      ResourceItem={CustomContainerResourceItem}
    />
  );
}

export const CustomContainerConfig: ResourceViewConfig = {
  ...ContainerResourceView,
  view: CustomContainerView,
};
