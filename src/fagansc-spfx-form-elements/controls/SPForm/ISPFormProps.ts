import { WebPartContext } from '@microsoft/sp-webpart-base';
import {FormType} from '../../common/enums';

export interface ISPFormProps {
    context: WebPartContext;
    listId: string;
    formType: FormType;
}