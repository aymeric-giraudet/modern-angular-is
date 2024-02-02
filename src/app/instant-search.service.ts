import { Injectable } from '@angular/core';
import algoliasearch from 'algoliasearch/lite';
import { Connector, WidgetDescription } from 'instantsearch.js';
import history from 'instantsearch.js/es/lib/routers/history';
import InstantSearch from 'instantsearch.js/es/lib/InstantSearch';
import { Router } from '@angular/router';
import index from 'instantsearch.js/es/widgets/index/index';

type ExtractStateType<T extends (...args: any) => any> = Parameters<
  Parameters<T>[0]
>[0];

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

@Injectable({
  providedIn: 'root',
})
export class InstantSearchService {
  public instantSearchInstance: InstantSearch;

  constructor(router: Router) {
    this.instantSearchInstance = new InstantSearch({
      searchClient,
      indexName: 'instant_search',
      future: { preserveSharedStateOnUnmount: true },
      routing: {
        router: history({
          getLocation: () => {
            if (typeof window === 'undefined') {
              // no other way to get this in constructor
              return new URL(
                router['location']._locationStrategy._platformLocation.href
              ) as unknown as Location;
            }
            return window.location;
          },
        }),
      },
    });
  }

  createIndex({ indexName, indexId }: { indexName: string; indexId?: string }) {
    const createdIndex = index({
      indexName,
      indexId,
    });

    this.instantSearchInstance.addWidgets([createdIndex]);

    return createdIndex;
  }

  start() {
    this.instantSearchInstance.start();
  }

  connect<T extends Connector<WidgetDescription, Record<string, unknown>>>(
    connector: T,
    widgetParams: Parameters<ReturnType<T>>[0] = {},
    updater: (renderOptions: ExtractStateType<T>) => void
  ) {
    this.instantSearchInstance.addWidgets([connector(updater)(widgetParams)]);
  }
}
