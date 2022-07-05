import { WebPartContext } from '@microsoft/sp-webpart-base';
import {viewType} from '../../common/enums';

export interface ISPFormProps {
    context: WebPartContext;
    listId: string;
    viewType: viewType;
}