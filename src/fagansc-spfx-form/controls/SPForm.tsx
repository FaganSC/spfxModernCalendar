import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';

//import styles from '../../common/FormFields.module.scss';
import * as strings from 'SPFormStrings';

import { FormType } from '../SPForm';
import { FieldDisplay } from '../common/models';

import { FormListService } from '../services/FormListService';
import { SPField } from './SPField';

import Stack from '@fluentui/react/lib/components/Stack/Stack';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/components/Button';
import { ProgressIndicator } from '@fluentui/react/lib/components/ProgressIndicator';

export interface ISPFormProps {
    wpContext: WebPartContext;
    listId: string;
    itemId: number;
    formType: FormType;
    fieldIcons?: boolean;

    onSave?: any;
    onCancel?: any;
}

export interface ISPFormState {
    isLoading: boolean;
    formSturcture: FieldDisplay[];
    formData: any;
}

export class SPForm extends React.Component<ISPFormProps, ISPFormState> {
    private _formListService: FormListService;
    public constructor(props: ISPFormProps) {
        super(props);
        this._formListService = new FormListService(props.wpContext, props.listId);
        this._onFieldChange = this._onFieldChange.bind(this);
        this._onSave = this._onSave.bind(this);
        this.state = {
            formSturcture: [],
            formData: [],
            isLoading: true
        }
    }

    public componentDidMount = (): void => {
        this.setState({ isLoading: true });
        const { _formListService } = this;
        const { listId, itemId, formType } = this.props;
        switch (formType) {
            case FormType.New:
                _formListService.getNewFormDisplay(listId)
                    .then(async (data: FieldDisplay[]) => {
                        this.setState({ formSturcture: data, isLoading: false });
                    })
                    .catch(error => console.error("Oh no!", error));
                break;
            default:
                _formListService.getItemDisplay(listId, itemId)
                    .then(async (data: FieldDisplay[]) => {
                        this.setState({ formSturcture: data, isLoading: false });
                    })
                    .catch(error => console.error("Oh no!", error));
        }
    }

    private _onFieldChange = (internalName: string, changedValue: string | number): void => {
        const { formData, formSturcture } = this.state;
        const data: any = formData;
        const form: FieldDisplay[] = formSturcture.map((p, i) => {
            /*if(internalName === "fAllDayEvent" && p.internalName==="Title"){
                p["value"] = "Hello World!";
                data["Title"] = "Hello World!";
            }*/
            return p;
        });

        data[internalName] = changedValue;
        this.setState({ formData: data, formSturcture: form });
    }

    private _onSave = async (): Promise<any> => {
        const { itemId } = this.props;
        const { formData } = this.state;
        if (itemId) {
            const temp: any = await this._formListService.updateItem(itemId, formData);
            console.log(temp);
        } else {
            const temp: any = await this._formListService.addItem(formData);
            console.log(temp);
        }
        this.props.onSave();
    }

    public render = (): JSX.Element => {
        const { formSturcture } = this.state;
        const { wpContext, listId, formType } = this.props;
        console.log(formType);
        return (
            <section>
                {formSturcture.length === 0 ?
                    <ProgressIndicator label={strings.FormLoading} description={strings.FormLoadingDescription} /> :
                    <>
                        {formSturcture.map((p, i) => {
                            return <SPField key={i}
                                {...p}
                                wpContext={wpContext}
                                listId={listId}
                                formType={formType}
                                onChanged={(internalName, value) => this._onFieldChange(internalName, value)} />;
                        })}
                        {formType !== FormType.Display &&
                            <Stack /*className={styles.buttons}*/ horizontal /*tokens={stackTokens}*/>
                                <PrimaryButton /*disabled={isSaving}*/ text={strings.FormSave} onClick={() => this._onSave()} />
                                <DefaultButton /*disabled={isSaving}*/ text={strings.FormCancel} onClick={() => this.props.onCancel()} />
                            </Stack>}
                    </>
                }
            </section>
        );
    }
}