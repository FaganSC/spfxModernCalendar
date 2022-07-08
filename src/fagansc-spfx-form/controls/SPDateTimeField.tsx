import * as React from 'react';

import styles from '../common/FormFields.module.scss';

import { FieldActions, FieldLabel } from "../common";

import { DatePicker, DayOfWeek, defaultDatePickerStrings, TextField } from '@fluentui/react';
import * as moment from 'moment';
import { IIconProps } from 'office-ui-fabric-react/lib/Icon';

export interface ISPDateTimeFieldProps {
  label: string;
  internalName?: string;
  value?: any;
  className?: string | string[];
  isReadOnly?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean | string[];
  useIcon?: boolean;
  useTipTool?: string;
  onErrors?: any;
  onChanged?: any;

  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  monthPickerVisible?: boolean;
  firstDayOfWeek?: DayOfWeek;
}

export interface ISPDateTimeFieldState {}

export class SPDateTimeField extends React.Component<ISPDateTimeFieldProps, ISPDateTimeFieldState> {
  public constructor(props: ISPDateTimeFieldProps) {
    super(props);
    this._handleDataFormat = this._handleDataFormat.bind(this);
    this._handleOnChange = this._handleOnChange.bind(this);
    //this._onFormatDate = this._onFormatDate.bind(this);
    this.state = {
      FieldsValue: this._handleDataFormat(props.value)
    };
  }

  private _handleDataFormat = (value: string | number): Date => {
    return value === undefined || value === null ? null : moment(value).toDate();
}

  private _handleOnChange = (date?: Date): void => {
    const { value } = this.props;
    if (this.props.onChanged !== undefined) {
        if (value !== date) {
            if (!date) {
                this.props.onChanged(null);
            } else {
                this.props.onChanged(date);
            }
        }
    }
}

  /*private _onFormatDate(date?: Date | string): string {
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
  }*/

  public render(): JSX.Element {
    const { label, value, isReadOnly, firstDayOfWeek, maxDate, minDate, monthPickerVisible } = this.props;
    const iconProps: IIconProps = isReadOnly ? { iconName: 'Lock' } : null;
    const _fieldActions: FieldActions = new FieldActions(this.props);
    return (
      <div className={styles.fieldContainer}>
        <FieldLabel
          Label={label}
          Required={_fieldActions.isRequired()}
          UseIcon={_fieldActions.hasIcon()}
          TipTool={_fieldActions.hasTipTool()}
          IconName="Calendar"
        />
        {!(_fieldActions.isReadOnly()) && !(_fieldActions.isDisabled()) ?
          <DatePicker
            firstDayOfWeek={firstDayOfWeek === undefined ? DayOfWeek.Sunday : firstDayOfWeek}
            placeholder="Select a date..."
            ariaLabel="Select a date"
            strings={defaultDatePickerStrings}
            value={this._handleDataFormat(value)}
            className={_fieldActions.getClassNames()}
            maxDate={maxDate !== undefined ? maxDate : null}
            minDate={minDate !== undefined ? minDate : null}
            isMonthPickerVisible={monthPickerVisible === undefined ? true : monthPickerVisible}
            //formatDate={this._onFormatDate}
            onSelectDate={(date) => this._handleOnChange(date)}
          />
          : <TextField
            readOnly={_fieldActions.isReadOnly()}
            disabled={_fieldActions.isDisabled()}
            className={_fieldActions.getClassNames()}
            value={value}
            iconProps={iconProps}
          />
        }
      </div>
    );
  }
}