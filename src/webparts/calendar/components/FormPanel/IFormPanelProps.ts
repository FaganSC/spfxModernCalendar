import { WebPartContext } from "@microsoft/sp-webpart-base";
import { FormType } from "../../../../fagansc-spfx-form-elements";
export interface IFormPanelProps {
  wpContext: WebPartContext;
  primaryListId: string;
  listId: string;
  itemId: number;
  isPanelOpen: boolean;
  onTogglePanel: any;
  formType: FormType
}
