import { WebPartContext } from '@microsoft/sp-webpart-base';
import {FormType} from '../../common/enums';

export interface ISPFormProps {
    wpContext: WebPartContext;
    listId: string;
    itemId: number;
    formType: FormType;
    fieldIcons?: boolean;
}