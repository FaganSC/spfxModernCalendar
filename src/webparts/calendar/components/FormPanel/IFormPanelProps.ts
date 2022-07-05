import { WebPartContext } from "@microsoft/sp-webpart-base";
import { viewType } from "../../../../fagansc-spfx-form-elements";
export interface IFormPanelProps {
  wpContext: WebPartContext;
  primaryListId: string;
  listId: number;
  isPanelOpen: boolean;
  onTogglePanel: any;
  viewDisplay: viewType
}
