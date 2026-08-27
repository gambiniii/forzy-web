import React from "react";
import { BackButton } from "../BackButton";
import { HeaderRoot, HeaderLeft, HeaderTitle, HeaderSub } from "./PageHeader.styles";

interface PageHeaderProps {
  title: string;
  sub?: string;
  right?: React.ReactNode;
  back?: boolean;
}

export function PageHeader({ title, sub, right, back }: PageHeaderProps) {
  return (
    <HeaderRoot $hasRight={!!right}>
      <HeaderLeft>
        {back && <BackButton style={{ marginBottom: 6 }} />}
        <HeaderTitle>{title}</HeaderTitle>
        {sub && <HeaderSub>{sub}</HeaderSub>}
      </HeaderLeft>
      {right}
    </HeaderRoot>
  );
}
