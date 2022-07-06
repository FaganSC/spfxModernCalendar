import * as React from 'react';

import styles from '../../common/FormFields.module.scss';

import { ISPDateTimeFieldProps, ISPDateTimeFieldState } from ".";
import { FieldActions, FieldLabel } from "../../common";

import { DatePicker, DayOfWeek, defaultDatePickerStrings, TextField } from '@fluentui/react';
import * as moment from 'moment';
import { IIconProps } from 'office-ui-fabric-react/lib/Icon';

export class SPDateTimeField extends React.Component<ISPDateTimeFieldProps, ISPDateTimeFieldState> {
  public constructor(props: ISPDateTimeFieldProps) {
    super(props);
    this._handleDataFormat = this._handleDataFormat.bind(this);
    this._handleOnChange = this._handleOnChange.bind(this);
    this._onFormatDate = this._onFormatDate.bind(this);
    this.state = {
      FieldsValue: this._handleDataFormat()
    };
  }

  private _handleDataFormat = (): string => {
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

  private _handleOnChange = (date?: Date): void => {
    const { Value, InternalName, onChanged } = this.props;
    const DataObj: any = Value;
    this.setState({ FieldsValue: (date ? date.toString() : null) });
    DataObj[InternalName] = (date ? moment(date).format("YYYY-MM-DDT00:00:00Z") : null);

    onChanged(InternalName, DataObj);
  }

  private _onFormatDate(date?: Date | string): string {
    const { DateFormat } = this.props;
    let format: string = "ddd MMM DD YYYY";
    if (DateFormat !== undefined) {
      format = DateFormat;
    }
    if (date === null) {
      return null;
    } else if (typeof (date) === 'string') {
      return moment(date).format(format);
    } else {
      return moment(date.toString()).format(format);
    }
  }

  public componentDidUpdate = (prevProps: ISPDateTimeFieldProps): void => {
    const { Value, InternalName } = this.props;
    const { FieldsValue } = this.state;
    if (Value[InternalName] !== FieldsValue) {
      this.setState({ FieldsValue: this._handleDataFormat() });
    }
  }

  public render(): JSX.Element {
    const { Label, ReadOnly, FirstDayOfWeek, MaxDate, MinDate, MonthPickerVisible } = this.props;
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
          IconName="Calendar"
        />
        {!(_fieldActions.isReadOnly()) && !(_fieldActions.isDisabled()) ?
          <DatePicker
            firstDayOfWeek={FirstDayOfWeek === undefined ? DayOfWeek.Sunday : FirstDayOfWeek}
            placeholder="Select a date..."
            ariaLabel="Select a date"
            strings={defaultDatePickerStrings}
            value={FieldsValue && FieldsValue !== null ? moment(FieldsValue).toDate() : undefined}
            className={_fieldActions.getClassNames()}
            maxDate={MaxDate !== undefined ? MaxDate : null}
            minDate={MinDate !== undefined ? MinDate : null}
            isMonthPickerVisible={MonthPickerVisible === undefined ? true : MonthPickerVisible}
            formatDate={this._onFormatDate}
            onSelectDate={(date) => this._handleOnChange(date)}
          />
          : <TextField
            readOnly={_fieldActions.isReadOnly()}
            disabled={_fieldActions.isDisabled()}
            className={_fieldActions.getClassNames()}
            value={FieldsValue !== undefined ? this._onFormatDate(FieldsValue) : undefined}
            iconProps={iconProps}
          />
        }
      </div>
    );
  }
}