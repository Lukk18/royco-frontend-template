"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useActiveMarket } from "../hooks";
import { SecondaryLabel } from "../composables";
import { AlertIndicator } from "@/components/common";
import { OfferListRow } from "../offer-list";

export const OfferListBook = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { previousHighestOffers, currentHighestOffers } = useActiveMarket();

  return (
    <div
      ref={ref}
      className={cn("flex flex-col border-y border-divider", className)}
      {...props}
    >
      <div className="grid grid-cols-1 divide-y divide-divider md:grid-cols-2 md:divide-x md:divide-y-0">
        <div className="divide-y divide-divider">
          <SecondaryLabel className="py-1 pl-5 pr-2 font-semibold text-black">
            Incentives Offered
          </SecondaryLabel>

          <div className="grid w-full grid-cols-2 items-center divide-x divide-divider pl-5 pr-2 text-sm">
            <SecondaryLabel className="py-1 pr-1 text-tertiary">
              Offer
            </SecondaryLabel>
            <SecondaryLabel className="py-1 pl-1 text-tertiary">
              Ask
            </SecondaryLabel>
          </div>

          {!!currentHighestOffers &&
          !!currentHighestOffers.ip_offers &&
          currentHighestOffers.ip_offers.length !== 0 ? (
            currentHighestOffers?.ip_offers.map((offer, offerIndex) => {
              const keyInfo = {
                previousValue:
                  !!previousHighestOffers &&
                  offerIndex < previousHighestOffers.ip_offers.length
                    ? (previousHighestOffers?.ip_offers[offerIndex]
                        .input_token_data.token_amount ?? 0)
                    : 0,
                currentValue: offer.input_token_data.token_amount as number,
              };

              const valueInfo = {
                previousValue:
                  !!previousHighestOffers &&
                  offerIndex < previousHighestOffers.ip_offers.length
                    ? previousHighestOffers?.ip_offers[offerIndex]
                        .tokens_data &&
                      previousHighestOffers?.ip_offers[offerIndex].tokens_data
                        .length > 0
                      ? previousHighestOffers?.ip_offers[offerIndex]
                          .tokens_data[0].token_amount
                      : 0
                    : 0,
                currentValue:
                  offer.tokens_data && offer.tokens_data.length > 0
                    ? offer.tokens_data[0].token_amount
                    : 0,
              };

              return (
                <OfferListRow
                  key={`offer-list-row:${offer.offer_id}`}
                  type="ap"
                  keyInfo={keyInfo}
                  valueInfo={valueInfo}
                  offer={offer}
                  className="pl-5 pr-2"
                />
              );
            })
          ) : (
            <AlertIndicator>No offers yet</AlertIndicator>
          )}
        </div>

        <div>
          <div className="divide-y divide-divider">
            <SecondaryLabel className="py-1 pl-5 pr-2 font-semibold text-black md:pl-2 md:pr-5">
              Assets Offered
            </SecondaryLabel>

            <div className="grid w-full grid-cols-2 items-center divide-x divide-divider pl-5 pr-2 text-sm md:pl-2 md:pr-5">
              <SecondaryLabel className="py-1 pr-1 text-tertiary">
                Ask
              </SecondaryLabel>
              <SecondaryLabel className="py-1 pl-1 text-tertiary">
                Offer
              </SecondaryLabel>
            </div>

            {!!currentHighestOffers &&
            !!currentHighestOffers.ap_offers &&
            currentHighestOffers.ap_offers.length !== 0 ? (
              currentHighestOffers?.ap_offers.map((offer, offerIndex) => {
                const BASE_KEY = `market:offer:${offer.offer_id}-${offer.offer_side}`;
                const INDEX_KEY = `market:offer:${offer.offer_side}:${offerIndex}`;

                const keyInfo = {
                  previousValue:
                    !!previousHighestOffers &&
                    offerIndex < previousHighestOffers.ap_offers.length
                      ? (previousHighestOffers?.ap_offers[offerIndex]
                          .input_token_data.token_amount ?? 0)
                      : 0,

                  currentValue: offer.input_token_data.token_amount as number,
                };

                const valueInfo = {
                  previousValue:
                    !!previousHighestOffers &&
                    offerIndex < previousHighestOffers.ap_offers.length
                      ? previousHighestOffers?.ap_offers[offerIndex]
                          .tokens_data &&
                        previousHighestOffers?.ap_offers[offerIndex].tokens_data
                          .length > 0
                        ? previousHighestOffers?.ap_offers[offerIndex]
                            .tokens_data[0].token_amount
                        : 0
                      : 0,
                  currentValue:
                    offer.tokens_data && offer.tokens_data.length > 0
                      ? offer.tokens_data[0].token_amount
                      : 0,
                };

                return (
                  <OfferListRow
                    key={`offer-list-row:${offer.offer_id}`}
                    type="ip"
                    keyInfo={keyInfo}
                    valueInfo={valueInfo}
                    offer={offer}
                    className="pl-5 pr-2 md:pl-2 md:pr-5"
                  />
                );
              })
            ) : (
              <AlertIndicator>No offers yet</AlertIndicator>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
