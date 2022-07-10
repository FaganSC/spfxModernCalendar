import * as React from 'react';

import styles from '../common/FormFields.module.scss';

import { FieldActions, FieldLabel } from "../common";

import * as moment from 'moment';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/components/Dropdown';
import { DatePicker, defaultDatePickerStrings } from '@fluentui/react/lib/components/DatePicker';
import { DayOfWeek } from '@fluentui/react/lib/components/Calendar';
import { TextField } from '@fluentui/react/lib/components/TextField';

const options12Hours: IDropdownOption[] = [
  { key: '00', text: '12 AM' },
  { key: '01', text: '1 AM' },
  { key: '02', text: '2 AM' },
  { key: '03', text: '3 AM' },
  { key: '04', text: '4 AM' },
  { key: '05', text: '5 AM' },
  { key: '06', text: '6 AM' },
  { key: '07', text: '7 AM' },
  { key: '08', text: '8 AM' },
  { key: '09', text: '9 AM' },
  { key: '10', text: '10 AM' },
  { key: '11', text: '11 AM' },
  { key: '12', text: '12 PM' },
  { key: '13', text: '1 PM' },
  { key: '14', text: '2 PM' },
  { key: '15', text: '3 PM' },
  { key: '16', text: '4 PM' },
  { key: '17', text: '5 PM' },
  { key: '18', text: '6 PM' },
  { key: '19', text: '7 PM' },
  { key: '20', text: '8 PM' },
  { key: '21', text: '9 PM' },
  { key: '22', text: '10 PM' },
  { key: '23', text: '11 PM' },
];

const options24Hours: IDropdownOption[] = [
  { key: '00', text: '00' },
  { key: '01', text: '01' },
  { key: '02', text: '02' },
  { key: '03', text: '03' },
  { key: '04', text: '04' },
  { key: '05', text: '05' },
  { key: '06', text: '06' },
  { key: '07', text: '07' },
  { key: '08', text: '08' },
  { key: '09', text: '09' },
  { key: '10', text: '10' },
  { key: '11', text: '11' },
  { key: '12', text: '12' },
  { key: '13', text: '13' },
  { key: '14', text: '14' },
  { key: '15', text: '15' },
  { key: '16', text: '16' },
  { key: '17', text: '17' },
  { key: '18', text: '18' },
  { key: '19', text: '19' },
  { key: '20', text: '20' },
  { key: '21', text: '21' },
  { key: '22', text: '22' },
  { key: '23', text: '23' },
];

const optionsMinutes: IDropdownOption[] = [
  { key: '00', text: '00' },
  { key: '05', text: '05' },
  { key: '10', text: '10' },
  { key: '15', text: '15' },
  { key: '20', text: '20' },
  { key: '25', text: '25' },
  { key: '30', text: '30' },
  { key: '35', text: '35' },
  { key: '40', text: '40' },
  { key: '45', text: '45' },
  { key: '50', text: '50' },
  { key: '55', text: '55' },
];

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

  twentyfourHourTime?: boolean;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  monthPickerVisible?: boolean;
  firstDayOfWeek?: DayOfWeek;
  displayTime?: boolean;
}

export interface ISPDateTimeFieldState { }

export class SPDateTimeField extends React.Component<ISPDateTimeFieldProps, ISPDateTimeFieldState> {
  public constructor(props: ISPDateTimeFieldProps) {
    super(props);
    this._handleDateFormat = this._handleDateFormat.bind(this);
    this._handleTimeFormat = this._handleTimeFormat.bind(this);
    this._handleOnDateChange = this._handleOnDateChange.bind(this);
    this._handleOnTimeChange = this._handleOnTimeChange.bind(this);
    this._onFormatDate = this._onFormatDate.bind(this);
    this._onFormatReadOnlyDate = this._onFormatReadOnlyDate.bind(this);
  }

  private _handleDateFormat = (value: string | number): Date => {
    return value === undefined || value === null ? null : moment(value).toDate();
  }

  private _handleTimeFormat = (value: string | number, type: 'hours' | 'minutes'): string => {
    switch (type) {
      case 'hours':
        return value === undefined || value === null ? null : moment(value).format("HH");
      case 'minutes':
        return value === undefined || value === null ? null : moment(value).format("mm");
      default:
        return value === undefined || value === null ? null : moment(value).format("YYYY-MM-DDTHH:mm:ssZ");
    }
  }

  private _handleOnDateChange = (date?: Date): void => {
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

  private _handleOnTimeChange = (time: IDropdownOption, type?: 'hours' | 'minutes'): void => {
    const { value } = this.props;
    const currentDate: moment.Moment = moment(value);
    const newDateTime: moment.Moment = moment(currentDate.format("YYYY-MM-DD hh:mm"));
    if (this.props.onChanged !== undefined) {
      switch (type) {
        case 'hours':
          if (value !== time.key) {
            if (time.key) {
              newDateTime.hours(Number(time.key));
            }
          }
          break;
        case 'minutes':
          if (value !== time.key) {
            newDateTime.minutes(Number(time.key));
          }
          break;
      }
      this.props.onChanged(newDateTime.toDate());
    }
  }

  private _onFormatDate(date?: Date | string): string {
    //const { DateFormat } = this.props;
    const DateFormat: string = undefined;
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

  private _onFormatReadOnlyDate(date?: Date | string): string {
    const { displayTime } = this.props;
    const formatDate: string = "ddd MMM DD YYYY";
    const formatDateTime: string = "ddd MMM DD YYYY h:mm a";
    if (displayTime) {
      return moment(date).format(formatDateTime).toString();
    } else {
      return moment(date).format(formatDate).toString();
    }
  }

  public render(): JSX.Element {
    const { label, value, firstDayOfWeek, maxDate, minDate, monthPickerVisible, displayTime, twentyfourHourTime } = this.props;
    const _fieldActions: FieldActions = new FieldActions(this.props);
    const displayTimePicker: boolean = displayTime === undefined || displayTime === null ? true : displayTime;

    return (
      <div className={[styles.fieldContainer, styles.SPDateTimeField].join(' ')}>
        <FieldLabel
          Label={label}
          Required={_fieldActions.isRequired()}
          UseIcon={_fieldActions.hasIcon()}
          TipTool={_fieldActions.isReadOnly() && _fieldActions.hasTipTool()}
          IconName="Calendar"
        />
        {!(_fieldActions.isReadOnly()) && !(_fieldActions.isDisabled()) ?
          <div className={displayTimePicker ? styles.DateTimePicker : [styles.DateTimePicker, styles.DateOnly].join(' ')}>
            <DatePicker
              firstDayOfWeek={firstDayOfWeek === undefined ? DayOfWeek.Sunday : firstDayOfWeek}
              placeholder="Select a date"
              ariaLabel="Select a date"
              strings={defaultDatePickerStrings}
              value={this._handleDateFormat(value)}
              className={_fieldActions.getClassNames(styles.DatePicker)}
              maxDate={maxDate !== undefined ? maxDate : null}
              minDate={minDate !== undefined ? minDate : null}
              isMonthPickerVisible={monthPickerVisible === undefined ? true : monthPickerVisible}
              formatDate={this._onFormatDate}
              onSelectDate={(date) => this._handleOnDateChange(date)}
            />
            {displayTimePicker && <>
              <Dropdown
                selectedKey={this._handleTimeFormat(value, 'hours')}
                onChange={(event, option, number) => this._handleOnTimeChange(option, 'hours')}
                placeholder="Select an hour"
                options={twentyfourHourTime ? options24Hours : options12Hours}
                className={styles.HourPicker}
              />
              <Dropdown
                selectedKey={this._handleTimeFormat(value, 'minutes')}
                onChange={(event, option, number) => this._handleOnTimeChange(option, 'minutes')}
                placeholder="Select a minute"
                options={optionsMinutes}
                className={styles.MinutePicker}
              />
            </>
            }
          </div>
          : <TextField
            readOnly={_fieldActions.isReadOnly()}
            disabled={_fieldActions.isDisabled()}
            className={_fieldActions.getClassNames(styles.spFieldReadOnly)}
            value={this._onFormatReadOnlyDate(value)}
          />
        }
      </div>
    );
  }
}