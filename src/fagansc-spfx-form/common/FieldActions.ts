const ErrorMsg: string = "Field is required";

export class FieldActions {
    protected props: any;
    public constructor(props: any) {
        this.props = props;
    }

    public isRequired(): boolean {
        const { isRequired } = this.props;
        if (isRequired !== undefined) {
            if (typeof (isRequired) === 'boolean') {
                return isRequired;
            } else {
                let returnValue: boolean = false;
                isRequired.map(async (field: string) => {
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
        const { isDisabled } = this.props;
        if (isDisabled !== undefined) {
            return isDisabled;
        } else {
            return false;
        }
    }

    public isReadOnly(): boolean {
        const { isReadOnly } = this.props;
        if (isReadOnly !== undefined) {
            return isReadOnly;
        } else {
            return false;
        }
    }

    public isMultiSelect(): boolean {
        const { isMultiSelect } = this.props;
        if (isMultiSelect !== undefined) {
            return isMultiSelect;
        } else {
            return false;
        }
    }


    public getDecimalScale(): number {
        const { decimalScale} = this.props;
        if (decimalScale !== undefined) {
            return decimalScale;
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
        const { className } = this.props;
        if (addedClass !== undefined) {
            if (Array.isArray(className)) {
                const classes: string[] = className;
                classes.push(addedClass);
                return classes.join(' ');
            } else {
                const classes: string[] = [];
                classes.push(className);
                classes.push(addedClass);
                return classes.join(' ');
            }
        } else {
            if (Array.isArray(className)) {
                return className.join(' ');
            } else {
                return className;
            }
        }
    }

    public hasIcon(): boolean {
        const { useIcon } = this.props;
        if (useIcon !== undefined) {
            return useIcon;
        } else {
            return false;
        }
    }

    public hasTipTool(): string {
        const { useTipTool } = this.props;
        if (useTipTool !== undefined) {
            return useTipTool;
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