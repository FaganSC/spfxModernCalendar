import * as React from 'react';
import * as strings from 'CalendarWebPartStrings';
//import * as moment from 'moment';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
//import { IButtonProps } from '@fluentui/react/lib/Button';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { SPForm } from '../../../fagansc-spfx-form/controls/SPForm';
import { FormType } from '../../../fagansc-spfx-form';
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IFormPanelProps {
  wpContext: WebPartContext;
  primaryListId: string;
  listId: string;
  itemId: number;
  isPanelOpen: boolean;
  onTogglePanel: any;
  formType: FormType
}

export interface IFormPanelState {}

export default class FormPanel extends React.Component<IFormPanelProps, IFormPanelState> {
  public constructor(props: IFormPanelProps) {
    super(props);
    this._onSaveItem = this._onSaveItem.bind(this);
    this._onEditItem = this._onEditItem.bind(this);
    this.state = {
      formType: props.formType
    };
  }

  private _onSaveItem = (): void => {
    alert('Save Item');
    this.props.onTogglePanel();
  }

  private _onEditItem = (): void => {
    this.setState({ formType: FormType.Edit });
  }

  public componentDidUpdate = (prevProps: IFormPanelProps): void => {
    const { formType } = this.props;
    if (prevProps.formType !== formType) {
      this.setState({ formType: formType });
    }
  }

  /**
 * Handles component mount lifecycle method.
 */
  public componentDidMount = async (): Promise<void> => {}

  public render(): React.ReactElement<IFormPanelProps> {
    const { _onSaveItem, _onEditItem } = this;
    const { isPanelOpen, formType, primaryListId, itemId, wpContext, onTogglePanel } = this.props;
    const _items: ICommandBarItemProps[] = [];
    if (formType === FormType.Display) {
      _items.push({
        key: 'editItem',
        text: strings.lblEditItem,
        iconProps: { iconName: 'Edit' },
        onClick: () => _onEditItem()
      }, {
        key: 'closeItem',
        text: strings.lblCloseItem,
        iconProps: { iconName: 'ChromeClose' },
        onClick: () => onTogglePanel(formType),
      });
    }

    if (formType === FormType.Edit || formType === FormType.New) {
      _items.push({
        key: 'saveItem',
        text: strings.lblSaveItem,
        iconProps: { iconName: 'Save' },
        onClick: () => _onSaveItem()
      }, {
        key: 'cancelItem',
        text: strings.lblCancelItem,
        iconProps: { iconName: 'Cancel' },
        onClick: () => onTogglePanel(formType),
      });
    }

    _items.push(/*{
      key: 'versionHistory',
      text: strings.lblVersionHistory,
      iconProps: { iconName: 'History' },
      onClick: () => alert('Version History'),
    },
      {
        key: 'share',
        text: strings.lblShareWith,
        iconProps: { iconName: 'Share' },
        onClick: () => alert('Share With'),
      },*/
      {
        key: 'deleteItem',
        text: strings.lblDelete,
        iconProps: { iconName: 'Delete' },
        onClick: () => alert('Delete Item'),
      }
    );
    let PanelTitle: string;

    switch (formType) {
      case FormType.New:
        PanelTitle = "New Event";
        break;
      case FormType.Edit:
        PanelTitle = "Edit Event";
        break;
      default:
        PanelTitle = "View Event";
        break;
    }

    return (
      <Panel
        isOpen={isPanelOpen}
        onDismiss={() => onTogglePanel(formType)}
        type={PanelType.medium}
        closeButtonAriaLabel="Close"
        headerText={PanelTitle} >
        <CommandBar items={_items} />
        <SPForm
          wpContext={wpContext}
          listId={primaryListId}
          itemId={itemId}
          formType={FormType.Display}
          onSave={() => this._onSaveItem()}
          onCancel={() => onTogglePanel(formType)} />
      </Panel>
    );
  }
}
