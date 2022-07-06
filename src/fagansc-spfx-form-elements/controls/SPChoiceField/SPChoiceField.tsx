import * as React from 'react';

import styles from '../../common/FormFields.module.scss';

import { ISPChoiceFieldProps, ISPChoiceFieldState } from ".";
import { FieldActions, FieldLabel } from "../../common";

import { Dropdown, IDropdownOption, TextField } from '@fluentui/react';
import { IIconProps } from 'office-ui-fabric-react/lib/Icon';

export class SPChoiceField extends React.Component<ISPChoiceFieldProps, ISPChoiceFieldState> {
    public constructor(props: ISPChoiceFieldProps) {
        super(props);
        this._handleDataFormat = this._handleDataFormat.bind(this);
        this._handleOnChange = this._handleOnChange.bind(this);
        this.state = {
            selectedKey: this._handleDataFormat()
        };
    }

    private _handleDataFormat = (): string | number => {
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

    private _handleOnChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        const { Value, InternalName, onChanged } = this.props;
        const DataObj: any = Value;
        const selectedKey: string | number = (item ? item.key : null);
        this.setState({ selectedKey: selectedKey });
        if (!selectedKey) {
            DataObj[InternalName] = null;
        } else {
            DataObj[InternalName] = selectedKey;
        }
        onChanged(InternalName, DataObj);
    }

    public componentDidMount = (): void => {
        //alert('Load');
    }

    public componentWillUnmount = (): void => {
        //alert('Unload');
    }

    public componentDidUpdate = (prevProps: ISPChoiceFieldProps): void => {
        const { Value, InternalName } = this.props;
        const { selectedKey } = this.state;
        const _fieldActions: FieldActions = new FieldActions(this.props);
        if (!_fieldActions.isMultiSelect() && Value[InternalName] !== selectedKey) {
            this.setState({ selectedKey: this._handleDataFormat() });
        }
    }

    public render(): JSX.Element {
        const { props } = this;
        const { selectedKey } = this.state;
        const iconProps: IIconProps = props.ReadOnly ? { iconName: 'Lock' } : null;
        const _fieldActions: FieldActions = new FieldActions(props);
        const readyOnlyValue: string = _fieldActions.isReadOnly() && selectedKey && props.Options.filter((item => item.key === selectedKey))[0].text;
        return (
            <div className={styles.fieldContainer}>
                <FieldLabel
                    Label={props.Label}
                    Required={_fieldActions.isRequired()}
                    UseIcon={_fieldActions.hasIcon()}
                    TipTool={_fieldActions.hasTipTool()}
                    IconName="TextField"
                />

                {!(_fieldActions.isReadOnly()) &&
                    <Dropdown
                        placeholder="Select an option"
                        options={props.Options}
                        disabled={_fieldActions.isDisabled()}
                        className={_fieldActions.getClassNames()}
                        errorMessage={_fieldActions.getErrorMessage()}
                        onChange={(event, item) => this._handleOnChange(event, item)}
                        selectedKey={selectedKey}
                    />}

                {(_fieldActions.isReadOnly()) &&
                    <TextField
                        readOnly={_fieldActions.isReadOnly()}
                        disabled={_fieldActions.isDisabled()}
                        className={_fieldActions.getClassNames()}
                        value={readyOnlyValue}
                        iconProps={iconProps}
                    />
                }
            </div>
        );
    }
}