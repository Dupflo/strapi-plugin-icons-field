import React, { HTMLAttributes } from 'react';
interface RenderSvgProps extends HTMLAttributes<SVGElement> {
    icon?: string;
}
export default function Icon({ icon, ...props }: RenderSvgProps): React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | null;
export {};
