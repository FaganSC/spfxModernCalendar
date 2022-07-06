import * as React from 'react';
import styles from '../../common/FormFields.module.scss';

import { ISPTextBoxFieldProps, ISPTextBoxFieldState } from ".";

import { TextField } from '@fluentui/react/lib/TextField';
import { FieldActions, FieldLabel } from '../../common/index';
import { IIconProps } from '@fluentui/react/lib/components/Icon';

export class SPTextBoxField extends React.Component<ISPTextBoxFieldProps, ISPTextBoxFieldState> {
    public constructor(props: ISPTextBoxFieldProps) {
        super(props);
        this._handleValueFormat = this._handleValueFormat.bind(this);
        this._handleOnChange = this._handleOnChange.bind(this);
        this.state = {
            FieldsValue: this._handleValueFormat()
        };
    }

    private _handleValueFormat = (): string => {
        const { Value, InternalName } = this.props;
        if (typeof (Value) === 'string') {
            return Value !== undefined
                && Value !== null
                ? Value : null;
        } else {
            return Value !== undefined
                && Value !== null
                && Object.keys(Value).length > 0
                && Value[InternalName] !== null
                ? Value[InternalName] : null;
        }
    }

    private _handleOnChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newTextValue?: string): void => {
        const { Value, InternalName, onChanged } = this.props;
        const FieldsValue: string = (newTextValue ? newTextValue : null);
        this.setState({ FieldsValue: FieldsValue });
        const ValueObj: any = Value;
        if (FieldsValue.length === 0) {
            ValueObj[InternalName] = null;
        } else {
            ValueObj[InternalName] = FieldsValue;
        }
        onChanged(InternalName, ValueObj);
    }

    public componentDidMount = (): void => {
        //alert('Load');
    }

    public componentWillUnmount = (): void => {
        //alert('Unload');
    }

    public componentDidUpdate = (prevProps: ISPTextBoxFieldProps): void => {
        const { Value, InternalName } = this.props;
        if (this.props !== undefined && Value !== null) {
            if (typeof (Value) === 'string' && Value !== prevProps.Value) {
                this.setState({ FieldsValue: this._handleValueFormat() });
            } else if (Value[InternalName] !== prevProps.Value[InternalName]) {
                this.setState({ FieldsValue: this._handleValueFormat() });
            }
        }
    }

    public render(): JSX.Element {
        const { ReadOnly, Label } = this.props;
        const { FieldsValue } = this.state;
        const iconProps: IIconProps = ReadOnly ? { iconName: 'Lock' } : null;
        const _fieldActions: FieldActions = new FieldActions(this.props);
        return (
            <div className={styles.fieldContainer}>
                <FieldLabel
                    Label={Label}
                    Required={_fieldActions.isRequired()}
                    UseIcon={_fieldActions.hasIcon()}
                    TipTool={_fieldActions.hasTipTool()}
                    IconName="TextField"
                />
                <TextField
                    readOnly={_fieldActions.isReadOnly()}
                    disabled={_fieldActions.isDisabled()}
                    className={_fieldActions.getClassNames()}
                    value={FieldsValue}
                    iconProps={iconProps}
                    errorMessage={_fieldActions.getErrorMessage()}
                    onChange={(event, value) => this._handleOnChange(event, value)} />
            </div>
        );
    }
}