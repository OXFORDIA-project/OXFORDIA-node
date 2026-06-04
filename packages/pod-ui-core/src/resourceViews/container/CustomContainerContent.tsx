import React from "react";
import { DefaultContainerContent, type ContainerContentProps } from "linked-data-browser";
import type { SolidLeaf, SolidContainer } from "@ldo/connected-solid";

function shouldShow(resource: SolidLeaf | SolidContainer): boolean {
  if (resource.uri.endsWith("statistic-access-rule.ttl")) return false;
  return resource.uri.endsWith(".ttl");
}

export function CustomContainerContent({
  resources,
  ...rest
}: ContainerContentProps & { creatorsAvailable?: boolean }) {
  return (
    <DefaultContainerContent resources={resources.filter(shouldShow)} {...rest} />
  );
}
