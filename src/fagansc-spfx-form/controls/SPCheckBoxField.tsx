import * as React from 'react';

import styles from './../common/FormFields.module.scss';

import { FieldActions, FieldLabel } from "../common";

import { Checkbox, Icon, mergeStyles } from '@fluentui/react';

export interface ISPCheckBoxFieldProps {
    label: string;
    internalName?: string;
    value?: string | number ;
    className?: string | string[];
    isReadOnly?: boolean;
    isDisabled?: boolean;
    isRequired?: boolean | string[];
    useIcon?: boolean;
    useTipTool?: string;
    onErrors?: any;
    onChanged?: any;
}

export interface ISPCheckBoxFieldState {}

export class SPCheckBoxField extends React.Component<ISPCheckBoxFieldProps, ISPCheckBoxFieldState> {
    public constructor(props: ISPCheckBoxFieldProps) {
        super(props);
        this._handleDataFormat = this._handleDataFormat.bind(this);
        this._handleOnChange = this._handleOnChange.bind(this);
    }

    private _handleDataFormat = (value: string | number): boolean => {
        return value === undefined && value === null ? false : Boolean(value);
    }

    private _handleOnChange = (event: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean): void => {
        const { value } = this.props;
        if (this.props.onChanged !== undefined) {
            if (value !== checked.toString()) {
                if (!checked) {
                    this.props.onChanged(false);
                } else {
                    this.props.onChanged(checked);
                }
            }
        }
    }

    public render(): JSX.Element {
        const { label, value } = this.props;
        const readonlyIcon: string = this._handleDataFormat(value) ? "BoxCheckmarkSolid" : "Checkbox";
        const _fieldActions: FieldActions = new FieldActions(this.props);
        const iconClass: string = mergeStyles({
            fontSize: 20
        });
        const iconCheckedClass: string = this._handleDataFormat(value) && mergeStyles({
            color: "#0078d4"
        });
        return (
            <div className={styles.fieldContainer}>
                <FieldLabel
                    Label={label}
                    Required={_fieldActions.isRequired()}
                    UseIcon={_fieldActions.hasIcon()}
                    TipTool={_fieldActions.isReadOnly() && _fieldActions.hasTipTool()}
                    IconName="CheckboxComposite"
                />
                {!(_fieldActions.isReadOnly()) ?
                    <Checkbox
                        checked={this._handleDataFormat(value)}
                        className={_fieldActions.getClassNames()}
                        disabled={_fieldActions.isDisabled()}
                        onChange={(event, checked) => this._handleOnChange(event, checked)}
                    /> :
                    <div className={styles.readOnly}>
                        <Icon className={mergeStyles(iconClass, iconCheckedClass, styles.fieldIcon)} iconName={readonlyIcon} />
                    </div>
                }
            </div>
        );
    }
}