import * as React from 'react';
import styles from './Calendar.module.scss';
import { ICalendarProps } from './ICalendarProps';
import { ICalendarState } from './ICalendarState';
import * as strings from 'CalendarWebPartStrings';
import * as moment from 'moment';
import LoadingOverlay from 'react-loading-overlay';
import { Calendar as SPCalendar, DateLocalizer, momentLocalizer, View, Views } from 'react-big-calendar';
import { Views as CalendarViews } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { EventService } from '../services/EventsService';
import { DisplayEvents } from '../models/dataModels';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { IButtonProps } from '@fluentui/react/lib/Button';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { isMobile } from "react-device-detect";
import SPFormPanel from '../../../fagansc-spfx-form/controls/SPFormPanel';

const localizer: DateLocalizer = momentLocalizer(moment);

const overflowProps: IButtonProps = { ariaLabel: 'More commands' };

const _overflowItems: ICommandBarItemProps[] = [];

export default class Calendar extends React.Component<ICalendarProps, ICalendarState> {
  private _eventService: EventService;

  public constructor(props: ICalendarProps) {
    super(props);
    this._eventService = new EventService(props.wpContext);

    this._getPrimaryCalendarEvents = this._getPrimaryCalendarEvents.bind(this);

    this._onSelectEvent = this._onSelectEvent.bind(this);
    this._changeView = this._changeView.bind(this);
    this._changeDate = this._changeDate.bind(this);
    this._onTogglePanel = this._onTogglePanel.bind(this);

    this._renderEvent = this._renderEvent.bind(this);
    this._renderToolbar = this._renderToolbar.bind(this);

    moment.locale(props.wpContext.pageContext.cultureInfo.currentUICultureName);
    initializeIcons("https://static2.sharepointonline.com/files/fabric/assets/icons/");

    this.state = {
      events: [],
      dateView: new Date(),
      currentView: isMobile ? Views.DAY : this.props.defaultView,
      isLoading: true,
      isPanelOpen: false,
      formElements: [],
      itemId: null
    };
  }

  private _getPrimaryCalendarEvents = async (newDateView?: Date): Promise<void> => {
    const { _eventService } = this;
    this.setState({ isLoading: true });
    const { primaryListId, updateListProperty } = this.props;
    const { currentView } = this.state;
    let listId: string = primaryListId;
    if (!listId) {
      listId = await _eventService.getDefaultEventsList();
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

    const events: DisplayEvents[] = await _eventService.getPrimaryCalendarEvents(listId, startDate, endDate)
    this.setState({ events: events, isLoading: false });
  }

  private _onSelectEvent = (calEvent): void => {
    this._onTogglePanel(calEvent.id);
  }

  private _changeView = (newView: View): void => {
    this.setState({ currentView: newView });
  }

  private _changeDate = (action: string): void => {
    const { dateView, currentView } = this.state;
    let navigateDate: moment.Duration = moment.duration({ 'month': 1 });
    switch (currentView) {
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
        newDateView = moment(dateView).add(navigateDate).toDate();
        break;
      case "NavigateBack":
        newDateView = moment(dateView).subtract(navigateDate).toDate();
        break;
      default:
        newDateView = moment().toDate();
    }
    this.setState({ dateView: newDateView });
    this._getPrimaryCalendarEvents(newDateView).catch(error => console.error("Oh no!", error));
  }

  private _onTogglePanel = (itemId?: number): void => {
    const { isPanelOpen } = this.state;
    if (isPanelOpen) {
      this._getPrimaryCalendarEvents().catch(error => console.error("Oh no!", error));
    }
    itemId = itemId !== undefined ? itemId : null;
    this.setState({ itemId: itemId, isPanelOpen: !isPanelOpen });
  }

  /**
 * Handles component mount lifecycle method.
 */
  public componentDidMount = async (): Promise<void> => {
    await this._getPrimaryCalendarEvents().catch(error => console.error("Oh no!", error));
  }

  private _getViewSelector = (): ICommandBarItemProps[] => {
    const { currentView } = this.state;
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

    switch (currentView) {
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
    const { wpContext } = this.props;
    const { _getViewSelector, _changeDate, _onTogglePanel } = this;
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
              onClick: () => _onTogglePanel()
            },
          ],
        },
      },
      {
        key: 'navigateBack',
        text: strings.lblPrevious,
        iconProps: { iconName: 'NavigateBack' },
        onClick: () => _changeDate('NavigateBack'),
      },
      {
        key: 'navigateToday',
        text: strings.lblToday,
        iconProps: { iconName: 'GotoToday' },
        onClick: () => _changeDate('NavigateToday'),
      },
      {
        key: 'navigateForward',
        text: strings.lblNext,
        iconProps: { iconName: 'NavigateBackMirrored' },
        onClick: () => _changeDate('NavigateForward'),
      }/*,
      {
        key: 'share',
        text: strings.lblShare,
        iconProps: { iconName: 'Share' },
        onClick: () => console.log('Share'),
      }*/
    ];
    if (wpContext.sdks.microsoftTeams) {
      return (<>
        <CommandBar
          items={_items}
          overflowItems={_overflowItems}
          overflowButtonProps={overflowProps}
          farItems={_getViewSelector()}
          ariaLabel="Inbox actions"
          primaryGroupAriaLabel="Email actions"
          farItemsGroupAriaLabel="More actions"
        />
        <h3 className={styles.title}>{calendarProps.label}</h3>
      </>);
    } else {
      return (<>
        <h3 className={styles.title}>{calendarProps.label}</h3>
        <CommandBar
          items={_items}
          overflowItems={_overflowItems}
          overflowButtonProps={overflowProps}
          farItems={_getViewSelector()}
          ariaLabel="Inbox actions"
          primaryGroupAriaLabel="Email actions"
          farItemsGroupAriaLabel="More actions"
        />
        </>);
    }
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
    const { _renderEvent, _renderToolbar, _onTogglePanel } = this;
    const { events, dateView, currentView, isLoading, isPanelOpen, itemId } = this.state;
    const { wpContext, hasTeamsContext, primaryListId } = this.props;

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
            onSelectEvent={this._onSelectEvent}
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
        <SPFormPanel
          wpContext={wpContext}
          primaryListId={primaryListId}
          listId={primaryListId}
          itemId={itemId}
          isPanelOpen={isPanelOpen}
          onTogglePanel={() => _onTogglePanel()} />
      </section >
    );
  }
}
