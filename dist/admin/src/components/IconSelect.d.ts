type IconSelectProps = {
    label: string;
    hint: string;
    attribute: any;
    description: any;
    disabled: boolean;
    error: any;
    intlLabel: any;
    name: string;
    onChange: (event: {
        target: {
            name: string;
            value: string;
            type: string;
        };
    }) => void;
    placeholder: any;
    required: boolean;
    value: string;
};
declare const IconSelect: (props: IconSelectProps) => import("react/jsx-runtime").JSX.Element;
export default IconSelect;
