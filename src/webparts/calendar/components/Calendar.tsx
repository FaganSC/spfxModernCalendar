import * as React from 'react';
import styles from './Calendar.module.scss';
import { ICalendarProps } from './ICalendarProps';
import { ICalendarState } from './ICalendarState';
import * as strings from 'CalendarWebPartStrings';
import * as moment from 'moment';
import LoadingOverlay from 'react-loading-overlay';
import { Calendar as SPCalendar, DateLocalizer, momentLocalizer, View } from 'react-big-calendar';
import { Views as CalendarViews } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { EventService } from '../services/EventsService';
import { DisplayEvents } from '../models/dataModels';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { IButtonProps } from 'office-ui-fabric-react/lib/Button';

const localizer: DateLocalizer = momentLocalizer(moment);

const overflowProps: IButtonProps = { ariaLabel: 'More commands' };

const _overflowItems: ICommandBarItemProps[] = [];

export default class Calendar extends React.Component<ICalendarProps, ICalendarState> {
  private _eventService: EventService;
  public constructor(props: ICalendarProps) {
    super(props);
    this._eventService = new EventService(this.props.context);

    this._getPrimaryCalendarEvents = this._getPrimaryCalendarEvents.bind(this);

    this._changeView = this._changeView.bind(this);
    this._changeDate = this._changeDate.bind(this);

    this._renderEvent = this._renderEvent.bind(this);
    this._renderToolbar = this._renderToolbar.bind(this);
    moment.locale(props.context.pageContext.cultureInfo.currentUICultureName);

    this.state = {
      events: [],
      dateView: new Date(),
      currentView: this.props.defaultView,
      isLoading: true
    };
  }

  private _getPrimaryCalendarEvents = async (newDateView?: Date): Promise<void> => {
    this.setState({ isLoading: true });
    const { primaryListId, updateListProperty } = this.props;
    const { currentView, dateView } = this.state;
    let listId: string = primaryListId;
    if (!listId) {
      listId = await this._eventService.getDefaultEventsList();
      updateListProperty(listId);
    }
    let startDate: string = moment().startOf('month').format("YYYY-MM-DD");
    let endDate: string = moment().endOf('month').format("YYYY-MM-DD");
    if (newDateView) {
      switch (currentView) {
        default:
          startDate = moment(newDateView).startOf('month').format("YYYY-MM-DD");
          endDate = moment(newDateView).endOf('month').format("YYYY-MM-DD");
      }
    }

    const events: DisplayEvents[] = await this._eventService.getPrimaryCalendarEvents(listId, startDate, endDate)
    this.setState({ events: events, isLoading: false });
  }

  private _changeView = (newView: View): void => {
    this.setState({ currentView: newView });
  }

  private _changeDate = (action: string): void => {
    let navigateDate: moment.Duration = moment.duration({ 'month': 1 });
    switch (this.state.currentView) {
      case "week":
      case "work_week":
        navigateDate = moment.duration({ 'week': 1 });
        break;
      case "day":
        navigateDate = moment.duration({ 'days': 1 });
        break;
      default:
        navigateDate = moment.duration({ 'month': 1 });
        break
    }

    let newDateView: Date = new Date();
    switch (action) {
      case "NavigateForward":
        newDateView = moment(this.state.dateView).add(navigateDate).toDate();
        break;
      case "NavigateBack":
        newDateView = moment(this.state.dateView).subtract(navigateDate).toDate();
        break;
      default:
        newDateView = moment().toDate();
    }
    this.setState({ dateView: newDateView });
    this._getPrimaryCalendarEvents(newDateView);
  }

  /**
 * Handles component mount lifecycle method.
 */
  public componentDidMount = async (): Promise<void> => {
    await this._getPrimaryCalendarEvents().catch(error => console.error("Oh no!", error));
  }

  private _getViewSelector = (): ICommandBarItemProps[] => {
    const _farItems: ICommandBarItemProps[] = [
      {
        key: 'filterSubmissionPeriod',
        text: 'Current Period',
        cacheKey: 'submissionperCacheKey',
        iconProps: { iconName: 'Event' },
        subMenuProps: {
          items: [{
            key: strings.lblMonth,
            text: strings.lblMonth,
            onClick: () => { this._changeView(CalendarViews.MONTH); },
            iconProps: { iconName: 'Calendar' },
          },
          {
            key: strings.lblWeek,
            text: strings.lblWeek,
            onClick: () => { this._changeView(CalendarViews.WEEK); },
            iconProps: { iconName: 'CalendarWeek' },
          },
          {
            key: strings.lblWorkWeek,
            text: strings.lblWorkWeek,
            onClick: () => { this._changeView(CalendarViews.WORK_WEEK); },
            iconProps: { iconName: 'CalendarWorkWeek' },
          },
          {
            key: strings.lblDay,
            text: strings.lblDay,
            onClick: () => { this._changeView(CalendarViews.DAY); },
            iconProps: { iconName: 'CalendarDay' },
          }]
        }
      }
    ];

    switch (this.state.currentView) {
      case 'week':
        _farItems[0].text = strings.lblWeek;
        _farItems[0].iconProps = { iconName: 'CalendarWeek' };
        break;
      case 'work_week':
        _farItems[0].text = strings.lblWorkWeek;
        _farItems[0].iconProps = { iconName: 'CalendarWorkWeek' };
        break;
      case 'day':
        _farItems[0].text = strings.lblDay;
        _farItems[0].iconProps = { iconName: 'CalendarDay' };
        break;
      default:
        _farItems[0].text = strings.lblMonth;
        _farItems[0].iconProps = { iconName: 'Calendar' };
        break;
    }
    return _farItems;
  }

  private _renderToolbar = (calendarProps: any): React.ReactElement<[]> => {
    const { _getViewSelector } = this;

    const _items: ICommandBarItemProps[] = [
      {
        key: 'newItem',
        text: strings.lblNew,
        cacheKey: 'myCacheKey', // changing this key will invalidate this item's cache
        iconProps: { iconName: 'Add' },
        subMenuProps: {
          items: [
            {
              key: 'calendarEvent',
              text: strings.lblNewCalendarEvent,
              iconProps: { iconName: 'Calendar' },
            },
          ],
        },
      },
      {
        key: 'navigateBack',
        text: strings.lblPrevious,
        iconProps: { iconName: 'NavigateBack' },
        onClick: () => this._changeDate('NavigateBack'),
      },
      {
        key: 'navigateToday',
        text: strings.lblToday,
        iconProps: { iconName: 'GotoToday' },
        onClick: () => this._changeDate('NavigateToday'),
      },
      {
        key: 'navigateForward',
        text: strings.lblNext,
        iconProps: { iconName: 'NavigateBackMirrored' },
        onClick: () => this._changeDate('NavigateForward'),
      },
      {
        key: 'share',
        text: strings.lblShare,
        iconProps: { iconName: 'Share' },
        onClick: () => console.log('Share'),
      }
    ];

    return (<><CommandBar
      items={_items}
      overflowItems={_overflowItems}
      overflowButtonProps={overflowProps}
      farItems={_getViewSelector()}
      ariaLabel="Inbox actions"
      primaryGroupAriaLabel="Email actions"
      farItemsGroupAriaLabel="More actions"
    /><h3 className={styles.title}>{calendarProps.label}</h3></>);
  }

  private _renderEvent = ({ event }): React.ReactElement<[]> => {
    if (event.allDay) {
      return (
        <div style={{ height: 22, textAlign: 'center' }}>
          {event.title}
        </div>
      );
    } else {
      return (
        <div style={{ height: 44 }}>
          {moment(event.startDate).format('h:mm a')} - {moment(event.endDate).format('h:mm a')}
          <br />
          {event.title}
        </div>
      );
    }

  }

  public render(): React.ReactElement<ICalendarProps> {
    const { _renderEvent, _renderToolbar } = this;
    const { events, dateView, currentView, isLoading } = this.state;
    const {
      //description,
      //isDarkTheme,
      //environmentMessage,
      hasTeamsContext,
      //userDisplayName
    } = this.props;

    return (
      <section className={`${styles.calendar} ${hasTeamsContext ? styles.teams : ''}`} >
        <LoadingOverlay className={styles.loading} active={isLoading} spinner text={`Loading Events`}>
          <SPCalendar
            localizer={localizer}
            events={events}
            date={dateView}
            startAccessor="startDate"
            endAccessor="endDate"
            selectable
            view={currentView}
            //dayPropGetter={this.dayPropGetter}
            //eventPropGetter={this.eventStyleGetter}
            //onSelectSlot={this.onSelectSlot}
            components={{
              event: _renderEvent,
              toolbar: _renderToolbar,
            }}
            //onSelectEvent={this.onSelectEvent}
            defaultDate={moment().startOf('day').toDate()}
            views={{
              day: true,
              week: true,
              work_week: true,
              month: true
            }}
            messages={
              {
                'today': strings.lblToday,
                'previous': strings.lblPrevious,
                'next': strings.lblNext,
                'month': strings.lblMonth,
                'week': strings.lblWeek,
                'day': strings.lblDay,
                'showMore': total => `+${total} ${strings.lblShowMore}`,
                'work_week': strings.lblWorkWeek
              }
            }
          />
        </LoadingOverlay>
      </section >
    );
  }
}
