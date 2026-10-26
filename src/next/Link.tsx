import { Link as RouterLink, type LinkProps } from "react-router";

export function Link(props: LinkProps) {
  return <RouterLink {...props} />;
}
