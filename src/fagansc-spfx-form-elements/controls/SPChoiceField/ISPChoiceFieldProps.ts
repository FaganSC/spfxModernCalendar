import { IDropdownOption } from "@fluentui/react/lib/Dropdown";

export interface ISPChoiceFieldProps {
    Label: string;
    Options: IDropdownOption[];
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