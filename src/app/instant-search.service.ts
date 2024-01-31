import { Injectable } from '@angular/core';
import algoliasearch from 'algoliasearch/lite';
import { Connector, WidgetDescription } from 'instantsearch.js';
import InstantSearch from 'instantsearch.js/es/lib/InstantSearch';

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

  constructor() {
    this.instantSearchInstance = new InstantSearch({
      searchClient,
      indexName: 'instant_search',
      future: { preserveSharedStateOnUnmount: true },
    });
  }

  start() {
    this.instantSearchInstance.start();
  }

  connect<T extends Connector<WidgetDescription, Record<string, unknown>>>(
    connector: T,
    widgetParams: Parameters<ReturnType<T>>[0] = {},
    updater: (renderOptions: ExtractStateType<T>) => void
  ) {
    this.instantSearchInstance.addWidgets([
      connector((renderOptions) => {
        updater(renderOptions);
      })(widgetParams),
    ]);
  }
}
