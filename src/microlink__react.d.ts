declare module '@microlink/react' {
    import * as React from 'react';
    interface MicrolinkProps extends React.HTMLAttributes<HTMLDivElement> {
      url: string;
      size?: 'small' | 'large';
      style?: React.CSSProperties;
      [key: string]: any; // 기타 prop 허용
    }
    const Microlink: React.FC<MicrolinkProps>;
    export default Microlink;
  }