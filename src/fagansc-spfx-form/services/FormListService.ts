import { WebPartContext } from "@microsoft/sp-webpart-base";
import { PageContext } from "@microsoft/sp-page-context";

import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/regional-settings/web";
import "@pnp/sp/fields/list";

import { IList } from "@pnp/sp/lists";
import "@pnp/sp/content-types/list";
import { IContentType, IContentTypeInfo } from "@pnp/sp/content-types";
import { FieldDisplay } from "../common/models";
import { IDropdownOption } from "@fluentui/react/lib/Dropdown";

export class FormListService {
    private _sp: SPFI;

    public constructor(webPartContext: WebPartContext) {
        const pageContext: PageContext = webPartContext.pageContext;
        this._sp = spfi().using(SPFx({ pageContext }));
    }

    private _getListContentTypes = async (listId: string): Promise<IContentTypeInfo[]> => {
        const { _sp } = this;
        const list: IList = _sp.web.lists.getById(listId);
        const contentTypes: IContentTypeInfo[] = await list.contentTypes();
        return contentTypes;
    }

    private _getListContentTypesFields = async (listId: string, contentTypeId: string): Promise<IContentType[]> => {
        const { _sp } = this;
        const list: IList = _sp.web.lists.getById(listId)
        const contentTypeFields: IContentType[] = await list.contentTypes.getById(contentTypeId).fields.filter(`FieldTypeKind ne 0 and (ReadOnlyField ne true and Hidden ne true)`)();
        return contentTypeFields;
    }

    public getListContext = async (listId: string): Promise<any> => {
        const { _getListContentTypes, _getListContentTypesFields } = this;
        const contentTypes: IContentTypeInfo[] = await _getListContentTypes(listId);
        const fields: IContentType[] = await _getListContentTypesFields(listId, contentTypes[0].StringId);
        return fields;
    }

    private _getItemData = async (listId: string, itemId: number): Promise<any[]> => {
        const results: any = await this._sp.web.lists.getById(listId).items.getById(itemId)();
        return results;
    }

    public getItemDisplay = async (listId: string, itemId: number): Promise<FieldDisplay[]> => {
        const { _getListContentTypes, _getListContentTypesFields, _getItemData } = this;
        const contentTypes: IContentTypeInfo[] = await _getListContentTypes(listId);
        const fields: IContentType[] = await _getListContentTypesFields(listId, contentTypes[0].StringId);
        const data: any[] = await _getItemData(listId, itemId);

        const formFields: FieldDisplay[] = [];
        fields.map((listField: any) => {
            if (listField.InternalName !== "ContentType") {
                formFields.push({
                    title: listField.Title,
                    internalName: listField.InternalName,
                    description: listField.Description,
                    fieldTypeKind: listField.FieldTypeKind,
                    required: listField.Required,
                    value: data[listField.InternalName] !== undefined ? data[listField.InternalName] : null
                });
            }
        });
        return formFields;
    }

    public getChoiceValues = async (listId: string, internalName: string): Promise<IDropdownOption[]> => {
        const ddOptions: IDropdownOption[] = [];
        const choices: any = await this._sp.web.lists.getById(listId).fields.getByInternalNameOrTitle(internalName).select("DefaultValue","Choices","FillInChoice","SchemaXml")();
        choices.Choices.map((item: any) => {
            ddOptions.push({
                key: item,
                text: item
            });
        });
        return ddOptions;
    }
}