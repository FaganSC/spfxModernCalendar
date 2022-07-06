import * as React from 'react';
import styles from './FormFields.module.scss';
import { Icon } from '@fluentui/react/lib/Icon';
import { TipToolCallout } from './TipToolCallout';

export interface IFieldLabelProps {
    UseIcon: boolean;
    Label: string;
    Required: boolean;
    TipTool: string;
    IconName?: string;
}

export interface IFieldLabelState {
    isCalloutVisible: boolean;
}

export class FieldLabel extends React.Component<IFieldLabelProps, IFieldLabelState> {
    public constructor(props: IFieldLabelProps) {
        super(props);
        this._toggleIsCalloutVisible = this._toggleIsCalloutVisible.bind(this);
        this.state = {
            isCalloutVisible: false
        };
    }

    private _toggleIsCalloutVisible = (): void => {
        this.setState({ isCalloutVisible: !this.state.isCalloutVisible });
    }

    public render(): JSX.Element {
        const { IconName, UseIcon, Required, Label, TipTool } = this.props;
        const iconName: string = IconName ? IconName : "FieldEmpty";
        const containerStyles: string[] = [styles.titleContainer];
        if (UseIcon) {
            containerStyles.push(styles.fieldIcon);
        }
        if (Required) {
            containerStyles.push(styles.isRequired);
        }
        const className: string = containerStyles.join(" ");
        return (
            <div className={className}>
                <Icon className={styles.fieldIcon} iconName={iconName} />
                <div className={styles.label}>{Label}</div>
                {TipTool && <TipToolCallout message={TipTool} />}
            </div>
        );
    }
}