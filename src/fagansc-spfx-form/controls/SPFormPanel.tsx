import * as React from 'react';
import * as strings from 'CalendarWebPartStrings';
//import * as moment from 'moment';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
//import { IButtonProps } from '@fluentui/react/lib/Button';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MessageBar, MessageBarType } from '@fluentui/react/lib/components/MessageBar';
import { FormType } from '../common';
import { SPForm } from './SPForm';
import { FormListService } from '../services/FormListService';

export interface IFormPanelProps {
  wpContext: WebPartContext;
  primaryListId: string;
  listId: string;
  itemId: number;
  isPanelOpen: boolean;
  onTogglePanel: any;
}

export interface IFormPanelState {
  formType: FormType;
  isMessageBarOpen: boolean;
}

export default class SPFormPanel extends React.Component<IFormPanelProps, IFormPanelState> {
  private _formListService: FormListService;
  public constructor(props: IFormPanelProps) {
    super(props);
    this._formListService = new FormListService(props.wpContext, props.listId);
    this._onSaveItem = this._onSaveItem.bind(this);
    this._onEditItem = this._onEditItem.bind(this);
    this._onDeleteItem = this._onDeleteItem.bind(this);
    this.state = {
      formType: FormType.New,
      isMessageBarOpen: false
    };
  }

  private _onSaveItem = (): void => {
    this.setState({ isMessageBarOpen: true, formType: FormType.Display });
    setTimeout(function () {
      this.setState({ isMessageBarOpen: false });
      this.props.onTogglePanel();
    }.bind(this), 3000);
  }

  private _onEditItem = (): void => {
    this.setState({ formType: FormType.Edit });
  }

  private _onDeleteItem = (): void => {
    const { itemId } = this.props;
    this._formListService.deleteItem(itemId)
    .then(()=>{
      this.setState({ isMessageBarOpen: true, formType: FormType.Display });
      setTimeout(function () {
        this.setState({ isMessageBarOpen: false });
        this.props.onTogglePanel();
      }.bind(this), 3000);
    })
    .catch(()=>{
      this.setState({ isMessageBarOpen: true, formType: FormType.Display });
      setTimeout(function () {
        this.setState({ isMessageBarOpen: false });
      }.bind(this), 3000);
    });
  }

  public componentDidUpdate = (prevProps: IFormPanelProps): void => {
    const { itemId } = this.props;
    if (itemId !== prevProps.itemId) {
      if (itemId) {
        this.setState({ formType: FormType.Display });
      } else {
        this.setState({ formType: FormType.New });
      }
    }
  }

  public render(): React.ReactElement<IFormPanelProps> {
    const { _onSaveItem, _onEditItem, _onDeleteItem } = this;
    const { isPanelOpen, primaryListId, itemId, wpContext, onTogglePanel } = this.props;
    const { isMessageBarOpen, formType } = this.state;
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
        onClick: () => _onDeleteItem(),
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
        {isMessageBarOpen && <MessageBar
          messageBarType={MessageBarType.success}
          isMultiline={false}
          dismissButtonAriaLabel="Close">Item Saved</MessageBar>}
        <SPForm
          wpContext={wpContext}
          listId={primaryListId}
          itemId={itemId}
          formType={formType}
          onSave={() => this._onSaveItem()}
          onCancel={() => onTogglePanel(formType)} />
      </Panel>
    );
  }
}
