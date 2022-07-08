import * as React from 'react';
import { Callout, IconButton, DirectionalHint } from '@fluentui/react';
import { useBoolean, useId } from '@fluentui/react-hooks';
import styles from './FormFields.module.scss';

export interface ITipToolCalloutProps {
  message: string;
}

export function TipToolCallout(props: ITipToolCalloutProps): JSX.Element {
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false);
  const buttonId: string = useId('callout-button');
  const labelId: string = useId('callout-label');
  const descriptionId: string = useId('callout-description');

  return (
    <>
      <IconButton id={buttonId} className={styles.tipTool} iconProps={{ iconName: 'Info' }} onClick={() => toggleIsCalloutVisible()} />
      {isCalloutVisible && (
        <Callout
          className={styles.callout}
          ariaLabelledBy={labelId}
          ariaDescribedBy={descriptionId}
          role="dialog"
          gapSpace={0}
          target={`#${buttonId}`}
          isBeakVisible={true}
          beakWidth={10}
          onDismiss={toggleIsCalloutVisible}
          directionalHint={DirectionalHint.bottomRightEdge}
          setInitialFocus>
          {props.message}
        </Callout>
      )}
    </>
  );
}