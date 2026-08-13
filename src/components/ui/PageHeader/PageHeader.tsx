import React from "react";
import { HeaderRoot, HeaderLeft, HeaderTitle, HeaderSub } from "./PageHeader.styles";

interface PageHeaderProps {
  title: string;
  sub?: string;
  right?: React.ReactNode;
}

export function PageHeader({ title, sub, right }: PageHeaderProps) {
  return (
    <HeaderRoot $hasRight={!!right}>
      <HeaderLeft>
        <HeaderTitle>{title}</HeaderTitle>
        {sub && <HeaderSub>{sub}</HeaderSub>}
      </HeaderLeft>
      {right}
    </HeaderRoot>
  );
}
