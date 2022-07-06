export interface ISPTextBoxFieldProps {
    Label: string;
    Value?: any;
    MaxLength?: number;
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