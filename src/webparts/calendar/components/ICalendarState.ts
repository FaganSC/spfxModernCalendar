import { View } from "react-big-calendar";

export interface ICalendarState {
  events: any[];
  currentView: View;
  dateView: Date;
  isLoading: boolean;
}
