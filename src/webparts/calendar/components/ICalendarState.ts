import { View } from "react-big-calendar";
import { FormType } from "../../../fagansc-spfx-form";

export interface ICalendarState {
  events: any[];
  currentView: View;
  dateView: Date;
  isLoading: boolean;
  isPanelOpen: boolean;
  formElements: any;
  itemId: number;
  formType: FormType;
}
