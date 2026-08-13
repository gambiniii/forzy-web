import styled, { keyframes } from "styled-components";

const spin = keyframes`to { transform: rotate(360deg); }`;

const Ring = styled.div`
  width: 28px;
  height: 28px;
  border: 2px solid var(--border);
  border-top-color: var(--green);
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  margin: 24px auto;
`;

export function Spinner() {
  return <Ring />;
}
