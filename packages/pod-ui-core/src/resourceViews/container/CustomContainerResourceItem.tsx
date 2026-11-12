import React from "react";
import {
  DefaultContainerResourceItem,
  type ContainerResourceItemProps,
} from "linked-data-browser";

type FullItemProps = ContainerResourceItemProps & {
  displayName?: string;
  onNavigate?: () => void;
  onDelete?: () => void;
};

export function CustomContainerResourceItem({
  displayName,
  ...rest
}: FullItemProps) {
  const name = displayName?.replace(/\.ttl$/, "") ?? displayName;
  return <DefaultContainerResourceItem displayName={name} {...rest} />;
}
