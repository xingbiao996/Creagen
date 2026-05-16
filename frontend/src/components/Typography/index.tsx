import React from 'react';
import { Typography } from '@arco-design/web-react';

const { Text: ArcoText, Paragraph: ArcoParagraph, Title: ArcoTitle } = Typography;

// Helper to replace quotes in Chinese context
const formatChineseQuotes = (text: string | undefined | null) => {
  if (!text) return text;
  return text.replace(/"(.*?)"/g, '「$1」').replace(/'(.*?)'/g, '『$1』');
};

const processChildren = (children: React.ReactNode): React.ReactNode => {
  if (typeof children === 'string') {
    return formatChineseQuotes(children);
  }
  if (Array.isArray(children)) {
    return children.map((child, index) => (
      <React.Fragment key={index}>{processChildren(child)}</React.Fragment>
    ));
  }
  return children;
};

export const Text: React.FC<React.ComponentProps<typeof ArcoText>> = ({ children, ...props }) => {
  return <ArcoText {...props}>{processChildren(children)}</ArcoText>;
};

export const Paragraph: React.FC<React.ComponentProps<typeof ArcoParagraph>> = ({
  children,
  ...props
}) => {
  return <ArcoParagraph {...props}>{processChildren(children)}</ArcoParagraph>;
};

export const Title: React.FC<React.ComponentProps<typeof ArcoTitle>> = ({ children, ...props }) => {
  return <ArcoTitle {...props}>{processChildren(children)}</ArcoTitle>;
};

export default {
  Text,
  Paragraph,
  Title
};
