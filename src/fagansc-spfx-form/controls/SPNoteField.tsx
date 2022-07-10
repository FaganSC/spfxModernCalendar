import * as React from 'react';
import styles from '../common/FormFields.module.scss';

import { FieldActions, FieldLabel } from "../common";

import { TextField } from '@fluentui/react/lib/TextField';

export interface ISPNoteFieldProps {
    label: string;
    internalName?: string;
    value?: any;
    maxLength?: number;
    className?: string | string[];
    isReadOnly?: boolean;
    isDisabled?: boolean;
    isRequired?: boolean | string[];
    useIcon?: boolean;
    useTipTool?: string;
    onErrors?: any;
    onChanged?: any;
}

export interface ISPNoteFieldState { }

export class SPNoteField extends React.Component<ISPNoteFieldProps, ISPNoteFieldState> {
    public constructor(props: ISPNoteFieldProps) {
        super(props);
        this._handleDataFormat = this._handleDataFormat.bind(this);
        this._handleOnChange = this._handleOnChange.bind(this);
    }

    private _handleDataFormat = (value: string | number): string => {
        return value === undefined || value === null ? null : value.toString();
    }

    private _handleOnChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newTextValue?: string): void => {
        const { value } = this.props;
        if (this.props.onChanged !== undefined) {
            if (value !== newTextValue) {
                if (!newTextValue) {
                    this.props.onChanged(null);
                } else {
                    this.props.onChanged(newTextValue);
                }
            }
        }
    }

    public render(): JSX.Element {
        const { label, value } = this.props;
        const _fieldActions: FieldActions = new FieldActions(this.props);
        return (
            <div className={styles.fieldContainer}>
                <FieldLabel
                    Label={label}
                    Required={_fieldActions.isRequired()}
                    UseIcon={_fieldActions.hasIcon()}
                    TipTool={_fieldActions.isReadOnly() && _fieldActions.hasTipTool()}
                    IconName="TextField"
                />
                <TextField
                    readOnly={_fieldActions.isReadOnly()}
                    disabled={_fieldActions.isDisabled()}
                    className={_fieldActions.getClassNames(_fieldActions.isReadOnly() && styles.spFieldReadOnly)}
                    multiline={true}
                    resizable={_fieldActions.isReadOnly() ? false : true}
                    value={this._handleDataFormat(value)}
                    errorMessage={_fieldActions.getErrorMessage()}
                    onChange={(event, value) => this._handleOnChange(event, value)} />
            </div>
        );
    }
}