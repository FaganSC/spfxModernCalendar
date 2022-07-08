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
        this._formListService = new FormListService(props.wpContext);
        this._onFieldChange = this._onFieldChange.bind(this);
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
                _formListService.getListContext(listId)
                    .then((data: any) => {
                        console.log(data);
                        //this.setState({ formElements: data, isLoading: false });
                    })
                    .catch(error => console.error("Oh no!", error));
                break;
            case FormType.Edit:
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
        console.log(data);
    }

    public render = (): JSX.Element => {
        const { formSturcture } = this.state;
        const { wpContext, listId } = this.props;
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
                                onChanged={(internalName, value) => this._onFieldChange(internalName, value)} />;
                        })}
                        <Stack /*className={styles.buttons}*/ horizontal /*tokens={stackTokens}*/>
                            <PrimaryButton /*disabled={isSaving}*/ text={strings.FormSave} onClick={() => this.props.onSave()} />
                            <DefaultButton /*disabled={isSaving}*/ text={strings.FormCancel} onClick={() => this.props.onCancel()} />
                        </Stack></>}
            </section>
        );
    }
}