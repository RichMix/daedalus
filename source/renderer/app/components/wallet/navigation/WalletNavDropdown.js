// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { Select } from 'react-polymorph/lib/components/Select';
import { SelectSkin } from './WalletNavSelectSkin';
import selectStyles from './WalletNavSelectStyles.scss';

import WalletNavButton from './WalletNavButton';
import styles from './WalletNavDropdown.scss';

type Props = {
  label: string,
  icon: string,
  isActive: boolean,
  options: Array<{ value: number | string, label: string }>,
  onChange: Function,
};

@observer
export default class WalletNavDropdown extends Component<Props> {
  render() {
    const { label, icon, isActive, onChange, options } = this.props;
    return (
      <div className={styles.component}>
        <Select
          label={
            <WalletNavButton
              label={label}
              icon={icon}
              isActive={isActive}
              onClick={() => {}}
            />
          }
          onChange={({ value }) => onChange(value)}
          options={options}
          skin={SelectSkin}
          themeOverrides={selectStyles}
        />
      </div>
    );
  }
}