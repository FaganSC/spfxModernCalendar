import * as React from 'react';
import styles from '../common/FormFields.module.scss';

import { TextField } from '@fluentui/react/lib/TextField';
import { FieldActions, FieldLabel } from '../common/index';

export interface ISPTextBoxFieldProps {
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

export interface ISPTextBoxFieldState {
    value: string;
}

export class SPTextBoxField extends React.Component<ISPTextBoxFieldProps, ISPTextBoxFieldState> {
    public constructor(props: ISPTextBoxFieldProps) {
        super(props);
        this._handleOnBlur = this._handleOnBlur.bind(this);
        this._handleOnChange = this._handleOnChange.bind(this);
        this.state = {
            value: props.value
        }
    }

    private _handleOnChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newTextValue?: string): void => {
        if (newTextValue === '') {
            this.setState({ value: null });
        } else {
            this.setState({ value: newTextValue });
        }
    }

    private _handleOnBlur = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { value } = this.state;
        this.props.onChanged(value);
    }

    public render(): JSX.Element {
        const { value } = this.state;
        const { label } = this.props;
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
                    value={value}
                    errorMessage={_fieldActions.getErrorMessage()}
                    onBlur={(event) => this._handleOnBlur(event)}
                    onChange={(event, value) => this._handleOnChange(event, value)} />
            </div>
        );
    }
}