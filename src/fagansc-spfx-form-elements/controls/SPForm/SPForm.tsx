import * as React from 'react';

//import styles from '../../common/FormFields.module.scss';

import { ISPFormProps, ISPFormState } from ".";
import { FormListService } from '../../services/FormListService';

export class SPForm extends React.Component<ISPFormProps, ISPFormState> {
    private _formListService: FormListService;
    public constructor(props: ISPFormProps) {
        super(props);
        this._formListService = new FormListService(props.context);
        this.state = {
            formElements: []
        }
    }

    public componentDidMount = (): void => {
        //alert('Load');
        const { _formListService } = this;
        const { listId } = this.props;
        _formListService.getListContext(listId)
            .then((data: any) => {
                console.log(data);
                this.setState({ formElements: data });
            })
            .catch(error => console.error("Oh no!", error));
    }

    public componentWillUnmount = (): void => {
        //alert('Unload');
    }

    public componentDidUpdate = (prevProps): void => {

    }

    public render(): JSX.Element {
        const { formElements } = this.state;
        const form: JSX.Element[] = formElements.map((ele, key) => {
            return (<div key={key}>{ele.Title} - {ele.FieldTypeKind}</div>);
        });
        return (<section>{form}</section>);
    }
}