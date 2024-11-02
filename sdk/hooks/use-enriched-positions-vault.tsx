import { useQuery } from "@tanstack/react-query";
import { RoycoClient, useRoycoClient } from "../client";
import { getEnrichedPositionsRecipeQueryOptions } from "../queries/get-enriched-positions-recipe";
import { BaseQueryFilter, BaseSortingFilter, CustomTokenData } from "../types";
import { useEnrichedMarkets } from "./use-enriched-markets";
import { useEnrichedAccountBalancesVaultInMarket } from "./use-enriched-account-balances-vault-in-market";
import { RoycoMarketUserType } from "../market";

export const useEnrichedPositionsVault = ({
  account_address,
  chain_id,
  market_id,
  custom_token_data,
  page_index = 0,
  filters = [],
  sorting,
  enabled = true,
}: {
  account_address: string;
  chain_id: number;
  market_id: string;
  custom_token_data?: CustomTokenData;
  page_index?: number;
  filters?: Array<BaseQueryFilter>;
  sorting?: Array<BaseSortingFilter>;
  enabled?: boolean;
}) => {
  let data = null;

  const propsEnrichedMarket = useEnrichedMarkets({
    chain_id,
    market_id,
    custom_token_data,
  });

  const market = propsEnrichedMarket.data?.[0];

  const propsEnrichedAccountBalancesVaultInMarket =
    useEnrichedAccountBalancesVaultInMarket({
      chain_id,
      market_id,
      account_address,
      custom_token_data,
    });

  const balances = propsEnrichedAccountBalancesVaultInMarket.data;

  if (!!market && !!balances) {
    const position_ap = {
      offer_side: RoycoMarketUserType.ap.value,
      annual_change_ratio: market.annual_change_ratio,
      reward_style: 0,
      tokens_data: balances.incentives_ap_data,
      input_token_data: balances.input_token_data_ap,
    };

    const position_ip = {
      offer_side: RoycoMarketUserType.ip.value,
      annual_change_ratio: market.annual_change_ratio,
      reward_style: 0,
      tokens_data: balances.incentives_ip_data,
      input_token_data: balances.input_token_data_ip,
    };

    let new_data = [];

    if (
      balances.incentives_ap_data.length > 0 ||
      balances.input_token_data_ap.token_amount > 0
    ) {
      new_data.push(position_ap);
    } else if (
      balances.incentives_ip_data.length > 0 ||
      balances.input_token_data_ip.token_amount > 0
    ) {
      new_data.push(position_ip);
    }

    data = new_data;
  }

  const isLoading =
    propsEnrichedMarket.isLoading ||
    propsEnrichedAccountBalancesVaultInMarket.isLoading;
  const isRefetching =
    propsEnrichedMarket.isRefetching ||
    propsEnrichedAccountBalancesVaultInMarket.isRefetching;
  const isError =
    propsEnrichedMarket.isError ||
    propsEnrichedAccountBalancesVaultInMarket.isError;
  const isSuccess =
    propsEnrichedMarket.isSuccess &&
    propsEnrichedAccountBalancesVaultInMarket.isSuccess;

  return {
    isLoading,
    isRefetching,
    isError,
    isSuccess,
  };
};
