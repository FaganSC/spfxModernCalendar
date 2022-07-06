export interface ISPCheckBoxFieldProps {
    Label: string;
    Value?: any;
    InternalName?: string;
    ClassName?: string | string[];
    ReadOnly?: boolean;
    Disabled?: boolean;
    Required?: boolean | string[];
    Errors?: string[];
    UseIcon?: boolean;
    TipTool?: string;
    onChanged?: any;
}
