const ErrorMsg: string = "Field is required";

export class FieldActions {
    protected props: any;
    public constructor(props: any) {
        this.props = props;
    }

    public isRequired(): boolean {
        const { Required } = this.props;
        if (Required !== undefined) {
            if (typeof (Required) === 'boolean') {
                return Required;
            } else {
                let returnValue: boolean = false;
                Required.map(async (field: string) => {
                    if (field === this.props.FieldName) {
                        returnValue = true;
                    }
                });
                return returnValue;
            }
        } else {
            return false;
        }
    }

    public isDisabled(): boolean {
        const { Disabled } = this.props;
        if (Disabled !== undefined) {
            return Disabled;
        } else {
            return false;
        }
    }

    public isReadOnly(): boolean {
        const { ReadOnly } = this.props;
        if (ReadOnly !== undefined) {
            return ReadOnly;
        } else {
            return false;
        }
    }

    public isMultiSelect(): boolean {
        const { MultiSelect } = this.props;
        if (MultiSelect !== undefined) {
            return MultiSelect;
        } else {
            return false;
        }
    }


    public getDecimalScale(): number {
        const { DecimalScale} = this.props;
        if (DecimalScale !== undefined) {
            return DecimalScale;
        } else {
            return 0;
        }
    }

    public getErrorMessage(): string {
        const { Errors, InternalName } = this.props;
        if (Errors !== undefined) {
            return Errors.filter((field => field === InternalName)).length > 0 ? ErrorMsg : null;
        } else {
            return null;
        }
    }

    public getClassNames(addedClass?: string): string {
        const { ClassName } = this.props;
        if (addedClass !== undefined) {
            if (Array.isArray(ClassName)) {
                const classes: string[] = ClassName;
                classes.push(addedClass);
                return classes.join(' ');
            } else {
                const classes: string[] = [];
                classes.push(ClassName);
                classes.push(addedClass);
                return classes.join(' ');
            }
        } else {
            if (Array.isArray(ClassName)) {
                return ClassName.join(' ');
            } else {
                return ClassName;
            }
        }
    }

    public hasIcon(): boolean {
        const { UseIcon } = this.props;
        if (UseIcon !== undefined) {
            return UseIcon;
        } else {
            return false;
        }
    }

    public hasTipTool(): string {
        const { TipTool } = this.props;
        if (TipTool !== undefined) {
            return TipTool;
        } else {
            return null;
        }
    }

    public getRowCount(): number {
        const { Rows } = this.props;
        if (Rows !== undefined) {
            return Rows;
        } else {
            return 1;
        }
    }
}