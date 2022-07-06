import { IDropdownOption } from '@fluentui/react/lib/Dropdown';
import * as React from 'react';

import LoadingOverlay from 'react-loading-overlay';

import styles from '../../common/FormFields.module.scss';

import { ISPFormProps, ISPFormState } from ".";
import { FormType } from '../../SPForm';
import { FieldDisplay } from '../../common/models';

import { FormListService } from '../../services/FormListService';

import { SPChoiceField } from '../SPChoiceField';
import { SPDateTimeField } from '../SPDateTimeField';
import { SPNoteField } from '../SPNoteField';
import { SPTextBoxField } from '../SPTextBoxField';
import { SPCheckBoxField } from '../SPCheckBoxField';

export class SPForm extends React.Component<ISPFormProps, ISPFormState> {
    private _formListService: FormListService;
    public constructor(props: ISPFormProps) {
        super(props);
        this._formListService = new FormListService(props.wpContext);
        this._getFormElements = this._getFormElements.bind(this);
        this.state = {
            formElements: [],
            isLoading: true
        }
    }

    public componentDidMount = (): void => {
        this.setState({ isLoading: true });
        const { _formListService } = this;
        const { listId, itemId, formType } = this.props;
        switch (formType) {
            case FormType.New:
                _formListService.getListContext(listId)
                    .then((data: any) => {
                        console.log(data);
                        this.setState({ formElements: data, isLoading: false });
                    })
                    .catch(error => console.error("Oh no!", error));
                break;
            case FormType.Edit:
                break;
            default:
                _formListService.getItemDisplay(listId, itemId)
                    .then(async (data: FieldDisplay[]) => {
                        const sturcture: JSX.Element[] = await this._getFormElements(data)
                        this.setState({ formElements: sturcture, isLoading: false });
                    })
                    .catch(error => console.error("Oh no!", error));
        }
    }

    public componentWillUnmount = (): void => {

    }

    public componentDidUpdate = (prevProps: ISPFormProps): void => {

    }

    private _getFormElements = async (formStucture: FieldDisplay[]): Promise<JSX.Element[]> => {
        const { listId, fieldIcons } = this.props;
        const useFieldIcons: boolean = fieldIcons === undefined ? false : fieldIcons;
        return new Promise<JSX.Element[]>(async (resolve, reject) => {
            const promise: any = formStucture.map(async (ele: FieldDisplay, key) => {
                switch (ele.FieldTypeKind) {
                    case 2: //FieldType: Text
                        return await (<SPTextBoxField Label={ele.Title} InternalName={ele.InternalName} Required={ele.Required} Value={ele.Value} TipTool={ele.Description} UseIcon={useFieldIcons} />);
                    case 3: //FieldType: Note
                        return await (<SPNoteField Label={ele.Title} InternalName={ele.InternalName} Required={ele.Required} Value={ele.Value} TipTool={ele.Description} UseIcon={useFieldIcons} />)
                    case 4: //FieldType: DateTime
                        return await (<SPDateTimeField Label={ele.Title} InternalName={ele.InternalName} Required={ele.Required} Value={ele.Value} TipTool={ele.Description} UseIcon={useFieldIcons} />)
                    case 6: //FieldType: Choice
                        const choiceOptions: IDropdownOption[] = await this._formListService.getChoiceValues(listId, ele.InternalName);
                        return await (<SPChoiceField Label={ele.Title} InternalName={ele.InternalName} Required={ele.Required} Value={ele.Value} TipTool={ele.Description} Options={choiceOptions} UseIcon={useFieldIcons} />)
                    case 21: //FieldType: Recurrence 
                        return await (<></>)
                    case 29: //FieldType: AllDayEvent 
                        return await (<SPCheckBoxField Label={ele.Title} InternalName={ele.InternalName} Required={ele.Required} Value={ele.Value} TipTool={ele.Description} UseIcon={useFieldIcons} />)
                    default:
                        return await (<div key={key}>{ele.Title} ({ele.FieldTypeKind}): {ele.Value}</div>);
                }
            });

            await Promise.all(promise)
                .then((test) => {
                    resolve(test);
                })
                .catch((error) => {
                    reject([]);
                });
        });
    }

    public render = (): JSX.Element => {
        const { formElements, isLoading } = this.state;
        return (
            <LoadingOverlay className={styles.loading} active={isLoading} spinner text={`Loading Form`}>
                <section>{formElements}</section>
            </LoadingOverlay>
        );
    }
}