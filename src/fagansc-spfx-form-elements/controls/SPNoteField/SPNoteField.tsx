import * as React from 'react';
import styles from '../../common/FormFields.module.scss';

import { ISPNoteFieldProps, ISPNoteFieldState } from ".";
import { FieldActions, FieldLabel } from "../../common";

import { TextField } from '@fluentui/react/lib/TextField';
import { IIconProps } from 'office-ui-fabric-react/lib/Icon';

export class SPNoteField extends React.Component<ISPNoteFieldProps, ISPNoteFieldState> {
    public constructor(props: ISPNoteFieldProps) {
        super(props);
        this._handleDataFormat = this._handleDataFormat.bind(this);
        this._handleOnChange = this._handleOnChange.bind(this);
        this.state = {
            FieldsValue: this._handleDataFormat()
        };
    }

    private _handleDataFormat = (): string => {
        const { Value, InternalName } = this.props;
        return Value !== undefined
            && Value !== null
            && Object.keys(Value).length > 0
            && Value[InternalName] !== null
            ? Value[InternalName] : null;
    }

    private _handleOnChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newTextValue?: string): void => {
        const { Value, InternalName, onChanged } = this.props;
        const FieldsValue: string = (newTextValue ? newTextValue : null);
        this.setState({ FieldsValue: FieldsValue });
        const DataObj: any = Value;
        if (FieldsValue.length === 0) {
            DataObj[InternalName] = null;
        } else {
            DataObj[InternalName] = FieldsValue;
        }
        onChanged(InternalName, DataObj);
    }

    public componentDidMount = (): void => {
        //alert('Load');
    }

    public componentWillUnmount = (): void => {
        //alert('Unload');
    }

    public componentDidUpdate = (prevProps: ISPNoteFieldProps): void => {
        const { Value, InternalName } = this.props;
        const { FieldsValue } = this.state;
        if (Value[InternalName] !== FieldsValue) {
            this.setState({ FieldsValue: this._handleDataFormat() });
        }
    }

    public render(): JSX.Element {
        const { Label, ReadOnly } = this.props;
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
                    multiline={true}
                    value={FieldsValue}
                    iconProps={iconProps}
                    errorMessage={_fieldActions.getErrorMessage()}
                    onChange={(event, value) => this._handleOnChange(event, value)} />
            </div>
        );
    }
}