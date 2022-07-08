import { IDropdownOption } from '@fluentui/react/lib/Dropdown';
import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';

//import styles from '../../common/FormFields.module.scss';

import { FormListService } from '../services/FormListService';

import { FormType } from '../common/enums';
import { FieldDisplay } from '../common/models';

import { SPTextBoxField } from './SPTextBoxField';
import { SPChoiceField } from './SPChoiceField';
import { SPDateTimeField } from './SPDateTimeField';
import { SPNoteField } from './SPNoteField';
import { SPCheckBoxField } from './SPCheckBoxField';


export interface ISPFieldProps {
    wpContext: WebPartContext;
    listId: string;
    formType?: FormType;
    fieldTypeKind: number;
    internalName: string;
    title: string;
    required?: boolean;
    value: string | number;
    description: string;
    fieldIcons?: boolean;
    onChanged?: any;
}

export interface ISPFieldState {
    isLoading: boolean;
    formSturcture: FieldDisplay[];
    currentValue: string | number;
    choiceOptions: IDropdownOption[];
}

export class SPField extends React.Component<ISPFieldProps, ISPFieldState> {
    private _formListService: FormListService;
    public constructor(props: ISPFieldProps) {
        super(props);
        this._formListService = new FormListService(props.wpContext);
        this._getChoiceOptions = this._getChoiceOptions.bind(this);
        this._onFieldChange = this._onFieldChange.bind(this);
        this.state = {
            formSturcture: [],
            currentValue: null,
            isLoading: true,
            choiceOptions: []
        }
    }

    public componentDidMount = (): void => {
        //this.setState({ isLoading: true });\
        const { fieldTypeKind, internalName } = this.props;
        if (fieldTypeKind === 6) {
            this._getChoiceOptions(internalName)
                .then((options: IDropdownOption[]) => {
                    this.setState({ choiceOptions: options })
                })
                .catch((error: any) => {
                    console.log(error);
                })
        }
        //this.setState({ isLoading: false });
    }

    public componentDidUpdate = (prevProps: ISPFieldProps): void => {
        const { value } = this.props;
        if (value !== prevProps.value) {
            this.setState({ currentValue: value });
        }
    }

    private _getChoiceOptions = async (internalName: string): Promise<IDropdownOption[]> => {
        const { listId } = this.props;
        const choiceOptions: IDropdownOption[] = await this._formListService.getChoiceValues(listId, internalName);
        return choiceOptions;
    }

    private _getCurrentValue = (defaultValue: string | number ): string | number => {
        const { currentValue } = this.state;
        if (defaultValue === undefined && currentValue === null) {
            return null;
        } else if (currentValue !== null && defaultValue !== currentValue) {
            return currentValue;
        } else {
            return defaultValue;
        }
    }

    private _onFieldChange = (changedValue: string | number): void => {
        this.setState({ currentValue: changedValue });
        this.props.onChanged(this.props.internalName, changedValue);
    }

    public render = (): JSX.Element => {
        const { fieldIcons, title, fieldTypeKind, internalName, required, value, description } = this.props;
        const useFieldIcons: boolean = fieldIcons === undefined ? false : fieldIcons;
        switch (fieldTypeKind) {
            case 2: //FieldType: Text
                return (<SPTextBoxField
                     label={title}
                     internalName={internalName}
                     isRequired={required}
                     value={this._getCurrentValue(value)}
                     useTipTool={description}
                     useIcon={useFieldIcons}
                     onChanged={(value) => this._onFieldChange(value)} />)
            case 3: //FieldType: Note
                return (<SPNoteField 
                    label={title}
                    internalName={internalName}
                    isRequired={required}
                    value={this._getCurrentValue(value)}
                    useTipTool={description}
                    useIcon={useFieldIcons}
                    onChanged={(value) => this._onFieldChange(value)} />)
            case 4: //FieldType: DateTime
                return (<SPDateTimeField 
                    label={title}
                    internalName={internalName}
                    isRequired={required}
                    value={this._getCurrentValue(value)}
                    useTipTool={description}
                    useIcon={useFieldIcons}
                    onChanged={(value) => this._onFieldChange(value)} />)
            case 6: //FieldType: Choice
                return (<SPChoiceField
                    label={title}
                    internalName={internalName}
                    isRequired={required}
                    value={this._getCurrentValue(value)}
                    options={this.state.choiceOptions}
                    useTipTool={description}
                    useIcon={useFieldIcons}
                    onChanged={(value) => this._onFieldChange(value)} />)
            case 21: //FieldType: Recurrence 
                return (<></>)
            case 29: //FieldType: AllDayEvent 
                return (<SPCheckBoxField
                    label={title}
                    internalName={internalName}
                    isRequired={required}
                    value={this._getCurrentValue(value)}
                    useTipTool={description}
                    useIcon={useFieldIcons}
                    onChanged={(value) => this._onFieldChange(value)} />)
            default:
                return (<div>{title} ({fieldTypeKind}): {value}</div>);
        }
    }
}