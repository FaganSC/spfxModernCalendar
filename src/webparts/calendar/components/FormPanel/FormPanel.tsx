import * as React from 'react';
import { IFormPanelProps } from './IFormPanelProps';
import { IFormPanelState } from './IFormPanelState';
import * as strings from 'CalendarWebPartStrings';
//import * as moment from 'moment';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
//import { IButtonProps } from '@fluentui/react/lib/Button';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { SPForm } from '../../../../fagansc-spfx-form-elements/controls/SPForm/SPForm';
import { viewType } from '../../../../fagansc-spfx-form-elements';

export default class FormPanel extends React.Component<IFormPanelProps, IFormPanelState> {
  public constructor(props: IFormPanelProps) {
    super(props);
    this._onTogglePanel = this._onTogglePanel.bind(this);
    this._onSaveItem = this._onSaveItem.bind(this);
    this._onEditItem = this._onEditItem.bind(this);
    this.state = {
      isPanelOpen: false,
      viewDisplay: props.viewDisplay
    };
  }

  private _onTogglePanel = (): void => {
    const { isPanelOpen } = this.state;
    this.setState({ isPanelOpen: !isPanelOpen });
  }

  private _onSaveItem = (): void => {
    alert('Save Item');
  }

  private _onEditItem = (): void => {
    this.setState({ viewDisplay: viewType.Edit });
  }

  public componentDidUpdate = (prevProps: IFormPanelProps): void => {
    const { viewDisplay } = this.props;
    if (prevProps.viewDisplay !== viewDisplay) {
      this.setState({ viewDisplay: viewDisplay });
    }
  }

  /**
 * Handles component mount lifecycle method.
 */
  public componentDidMount = async (): Promise<void> => {

  }

  public render(): React.ReactElement<IFormPanelProps> {
    const { _onSaveItem, _onEditItem } = this;
    const { viewDisplay } = this.state;
    const { primaryListId, wpContext, isPanelOpen, onTogglePanel } = this.props;
    const _items: ICommandBarItemProps[] = [];
    if (viewDisplay === viewType.Display) {
      _items.push({
        key: 'editItem',
        text: strings.lblEditItem,
        iconProps: { iconName: 'Edit' },
        onClick: () => _onEditItem()
      }, {
        key: 'closeItem',
        text: strings.lblCloseItem,
        iconProps: { iconName: 'ChromeClose' },
        onClick: () => onTogglePanel(this.state.viewDisplay),
      });
    }

    if (viewDisplay === viewType.Edit || viewDisplay === viewType.New) {
      _items.push({
        key: 'saveItem',
        text: strings.lblSaveItem,
        iconProps: { iconName: 'Save' },
        onClick: () => _onSaveItem()
      }, {
        key: 'cancelItem',
        text: strings.lblCancelItem,
        iconProps: { iconName: 'Cancel' },
        onClick: () => onTogglePanel(this.state.viewDisplay),
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

    switch (viewDisplay) {
      case viewType.New:
        PanelTitle = "New Event";
        break;
      case viewType.Edit:
        PanelTitle = "Edit Event";
        break;
      default:
        PanelTitle = "View Event";
        break;
    }

    return (
      <Panel
        isOpen={isPanelOpen}
        onDismiss={() => onTogglePanel(this.state.viewDisplay)}
        type={PanelType.medium}
        closeButtonAriaLabel="Close"
        headerText={PanelTitle} >
        <CommandBar items={_items} />
        <SPForm context={wpContext} listId={primaryListId} viewType={viewType.New} />
      </Panel>
    );
  }
}
