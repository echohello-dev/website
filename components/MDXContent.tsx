"use client";

import { useMDXComponent } from "next-contentlayer2/hooks";

export function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  // eslint-disable-next-line react-hooks/static-components
  return <Component />;
}
