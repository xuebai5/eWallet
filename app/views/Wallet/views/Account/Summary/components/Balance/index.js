/* @flow */
import React, { PureComponent } from 'react';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';
import Icon from 'components/Icon';
import colors from 'config/colors';
import ICONS from 'config/icons';
import { FONT_SIZE, FONT_WEIGHT } from 'config/variables';

import type { Network } from 'flowtype';
import { withNamespaces } from "react-i18next";

type Props = {
  network: Network,
  balance: string,
  fiat: any,
  currency: string,
}

type State = {
  isHidden: boolean,
  canAnimateHideBalanceIcon: boolean,
};

const Wrapper = styled.div`
    padding-bottom: ${props => (props.isHidden ? '0px' : '28px')};
    position: relative;
    display: flex;

    border-bottom: 1px solid ${colors.DIVIDER};
`;

const HideBalanceIconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    width: 40px;
    height: 40px;
    position: absolute;
    margin-left: -20px;
    left: 50%;
    bottom: -20px;

    cursor: pointer;
    background: ${colors.WHITE};
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.04);
    border-radius: 50%;
    transition: all 0.3s;
    &:hover {
        background: ${colors.DIVIDER};
    }
`;

const FiatValue = styled.div`
    font-weight: ${FONT_WEIGHT.SEMIBOLD};
    font-size: ${FONT_SIZE.BIGGER};
    margin: 7px 0;
    min-height: 25px;
    color: ${colors.TEXT_PRIMARY};
`;

const FiatValueRate = styled.div`
    font-weight: ${FONT_WEIGHT.SEMIBOLD};
    font-size: ${FONT_SIZE.BIG};
    min-height: 25px;
    margin: 7px 0;
    display: flex;
    align-items: center;
    color: ${colors.TEXT_PRIMARY};
`;

const BalanceWrapper = styled.div`
    margin-right: 48px;
`;

const BalanceRateWrapper = styled(BalanceWrapper)`
    padding-left: 50px;
`;

const CoinBalance = styled.div`
    font-size: ${FONT_SIZE.SMALL};
    color: ${colors.TEXT_SECONDARY};
`;

const Label = styled.div`
    font-size: ${FONT_SIZE.SMALL};
    color: ${colors.TEXT_SECONDARY};
`;


class AccountBalance extends PureComponent<Props, State> {
  intlNumberFormat;

  constructor(props: Props) {
    super(props);
    this.state = {
      isHidden: false,
      canAnimateHideBalanceIcon: false
    };

    const locale = !!this.props.locale ? this.props.locale : 'en';
    const currency = !!this.props.currency ? this.props.currency : 'USD';

    const intlOptions = { style: 'currency', currency: currency };
    this.intlNumberFormat = new Intl.NumberFormat(locale, intlOptions);
  }

  handleHideBalanceIconClick() {
    this.setState(previousState => ({
      isHidden: !previousState.isHidden,
      canAnimateHideBalanceIcon: true
    }));
  }

  render() {
    const { network, currency, t } = this.props;
    const fiatRate = this.props.fiat.find(f => f.network.toLowerCase() === network.shortcut.toLowerCase());
    let accountBalance = '';
    let fiatRateValue = '';
    let fiatRateValueFormatted = '';
    let fiat = '';
    if (fiatRate) {
      accountBalance = new BigNumber(this.props.balance);
      fiatRateValue = new BigNumber(fiatRate.value).toFixed(2);
      fiatRateValueFormatted = this.intlNumberFormat.format(fiatRateValue);
      fiat = this.intlNumberFormat.format(accountBalance.times(fiatRateValue));
    }

    return (
      <Wrapper isHidden={this.state.isHidden}>
        <HideBalanceIconWrapper
          onClick={() => this.handleHideBalanceIconClick()}
        >
          <Icon
            canAnimate={this.state.canAnimateHideBalanceIcon}
            isActive={this.state.isHidden}
            icon={ICONS.ARROW_UP}
            color={colors.TEXT_SECONDARY}
            size={26}
          />
        </HideBalanceIconWrapper>
        {!this.state.isHidden && (
          <React.Fragment>
            <BalanceWrapper>
              <Label>{t('Balance')}</Label>
              {fiatRate && (
                <FiatValue>{fiat}</FiatValue>
              )}
              <CoinBalance>{this.props.balance} {network.shortcut}</CoinBalance>
            </BalanceWrapper>
            {fiatRate && (
              <BalanceRateWrapper>
                <Label>{t('Rate')}</Label>
                <FiatValueRate>{fiatRateValueFormatted}</FiatValueRate>
                <CoinBalance>1.00 {network.shortcut}</CoinBalance>
              </BalanceRateWrapper>
            )}
          </React.Fragment>
        )}
      </Wrapper>
    );
  }
}

export default withNamespaces()(AccountBalance);
