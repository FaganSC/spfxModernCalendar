import * as React from 'react';

import styles from '../../common/FormFields.module.scss';

import { ISPCheckBoxFieldProps, ISPCheckBoxFieldState } from ".";
import { FieldActions, FieldLabel } from "../../common";

import { Checkbox, Icon, mergeStyles } from '@fluentui/react';

export class SPCheckBoxField extends React.Component<ISPCheckBoxFieldProps, ISPCheckBoxFieldState> {
    public constructor(props: ISPCheckBoxFieldProps) {
        super(props);
        this._handleDataFormat = this._handleDataFormat.bind(this);
        this._handleOnChange = this._handleOnChange.bind(this);
        this.state = {
            FieldsValue: this._handleDataFormat()
        };
    }

    private _handleDataFormat = (): boolean => {
        const { Value, InternalName } = this.props;
        if (typeof (Value) === 'boolean') {
            return Value !== undefined
                && Value !== null
                ? Value : false;
        } else {
            return Value !== undefined
                && Value !== null
                && Object.keys(Value).length > 0
                && Value[InternalName] !== null
                ? Value[InternalName] : false;
        }
    }

    private _handleOnChange = (event: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean): void => {
        const { Value, InternalName, onChanged } = this.props;
        const FieldsValue: boolean = (checked ? checked : false);
        this.setState({ FieldsValue: FieldsValue });
        const DataObj: any = Value;
        DataObj[InternalName] = FieldsValue;
        onChanged(InternalName, DataObj);
    }

    public componentDidMount = (): void => {
        //alert('Load');
    }

    public componentWillUnmount = (): void => {
        //alert('Unload');
    }

    public componentDidUpdate = (prevProps: ISPCheckBoxFieldProps): void => {
        const { Value, InternalName } = this.props;
        if (Value[InternalName] !== prevProps.Value[InternalName]) {
            this.setState({ FieldsValue: this._handleDataFormat() });
        }
    }

    public render(): JSX.Element {
        const { Label } = this.props;
        const { FieldsValue } = this.state;
        const readonlyIcon: string = FieldsValue ? "BoxCheckmarkSolid" : "Checkbox";
        const _fieldActions: FieldActions = new FieldActions(this.props);
        const iconClass: string = mergeStyles({
            fontSize: 20
        });
        const iconCheckedClass: string = FieldsValue && mergeStyles({
            color: "#0078d4"
        });
        return (
            <div className={styles.fieldContainer}>
                <FieldLabel
                    Label={Label}
                    Required={_fieldActions.isRequired()}
                    UseIcon={_fieldActions.hasIcon()}
                    TipTool={_fieldActions.hasTipTool()}
                    IconName="CheckboxComposite"
                />
                {!(_fieldActions.isReadOnly()) ?
                    <Checkbox
                        checked={FieldsValue}
                        className={_fieldActions.getClassNames()}
                        disabled={_fieldActions.isDisabled()}
                        onChange={(event, checked) => this._handleOnChange(event, checked)}
                    /> :
                    <div className={styles.readOnly}>
                        <Icon className={mergeStyles(iconClass, iconCheckedClass, styles.fieldIcon)} iconName={readonlyIcon} />
                        <Icon className={mergeStyles(styles.lockIcon, styles.fieldIcon)} iconName={"Lock"} />
                    </div>
                }
            </div>
        );
    }
}