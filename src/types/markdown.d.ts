declare module 'react-markdown' {
  import * as React from 'react';
  type ComponentsMap = Record<string, React.ComponentType<any> | ((props: any) => React.ReactNode)>;
  interface ReactMarkdownProps {
    children?: React.ReactNode;
    remarkPlugins?: any[];
    rehypePlugins?: any[];
    components?: ComponentsMap;
    className?: string;
  }
  const ReactMarkdown: React.ComponentType<ReactMarkdownProps>;
  export default ReactMarkdown;
}

declare module 'remark-gfm' {
  const remarkGfm: any;
  export default remarkGfm;
}

declare module 'remark-breaks' {
  const remarkBreaks: any;
  export default remarkBreaks;
}


