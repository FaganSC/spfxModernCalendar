import { View } from "react-big-calendar";
import { viewType } from "../../../fagansc-spfx-form-elements/common/enums";

export interface ICalendarState {
  events: any[];
  currentView: View;
  dateView: Date;
  isLoading: boolean;
  isPanelOpen: boolean;
  formElements: any;
  itemId: number;
  formView: viewType;
}
