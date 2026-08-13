import React from "react";
import { StyledCard, StyledCardHeader, CardTitle, StyledCardBody } from "./Card.styles";

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

interface CardHeaderProps {
  title: string;
  right?: React.ReactNode;
}

interface CardBodyProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Card({ children, style }: CardProps) {
  return <StyledCard style={style}>{children}</StyledCard>;
}

export function CardHeader({ title, right }: CardHeaderProps) {
  return (
    <StyledCardHeader>
      <CardTitle>{title}</CardTitle>
      {right}
    </StyledCardHeader>
  );
}

export function CardBody({ children, style }: CardBodyProps) {
  return <StyledCardBody style={style}>{children}</StyledCardBody>;
}
