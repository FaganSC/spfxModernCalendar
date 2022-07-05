import { WebPartContext } from "@microsoft/sp-webpart-base";
import { View as CalendarViews } from 'react-big-calendar';

export interface ICalendarProps {
  wpContext: WebPartContext;
  primaryListId: string;
  defaultView: CalendarViews;
  updateListProperty: any;

  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}
