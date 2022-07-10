import * as React from 'react';

import styles from '../common/FormFields.module.scss';

import { FieldActions, FieldLabel } from "../common";

import { Dropdown, IDropdownOption, TextField } from '@fluentui/react';

export interface ISPChoiceFieldProps {
    label: string;
    internalName?: string;
    value?: string | number;
    className?: string | string[];
    isReadOnly?: boolean;
    isDisabled?: boolean;
    isRequired?: boolean | string[];
    useIcon?: boolean;
    useTipTool?: string;
    onErrors?: any;
    onChanged?: any;

    options: IDropdownOption[];
}

export interface ISPChoiceFieldState { }

export class SPChoiceField extends React.Component<ISPChoiceFieldProps, ISPChoiceFieldState> {
    public constructor(props: ISPChoiceFieldProps) {
        super(props);
        this._handleDataFormat = this._handleDataFormat.bind(this);
        this._handleOnChanged = this._handleOnChanged.bind(this);
    }

    private _handleDataFormat = (value: string | number): string | number => {
        return value === undefined && value === null ? null : value;
    }

    private _handleOnChanged = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        const { value } = this.props;
        if (this.props.onChanged !== undefined) {
            if (value !== item.key) {
                if (!item.key) {
                    this.props.onChanged(null);
                } else {
                    this.props.onChanged(item.key);
                }
            }
        }
    }

    public render(): JSX.Element {
        const { label, value, options } = this.props;
        const _fieldActions: FieldActions = new FieldActions(this.props);
        return (
            <div className={styles.fieldContainer}>
                <FieldLabel
                    Label={label}
                    Required={_fieldActions.isRequired()}
                    UseIcon={_fieldActions.hasIcon()}
                    TipTool={!_fieldActions.isReadOnly() && _fieldActions.hasTipTool()}
                    IconName="TextField"
                />
                {(!_fieldActions.isReadOnly()) ?
                    <Dropdown
                        placeholder="Select an option"
                        options={options}
                        disabled={_fieldActions.isDisabled()}
                        className={_fieldActions.getClassNames()}
                        errorMessage={_fieldActions.getErrorMessage()}
                        onChange={(event, item) => this._handleOnChanged(event, item)}
                        selectedKey={this._handleDataFormat(value)}
                    /> :
                    <TextField
                        readOnly={_fieldActions.isReadOnly()}
                        disabled={_fieldActions.isDisabled()}
                        className={_fieldActions.getClassNames(styles.spFieldReadOnly)}
                        value={this._handleDataFormat(value).toString()}
                    />
                }
            </div>
        );
    }
}