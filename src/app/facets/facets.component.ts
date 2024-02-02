import { Component } from '@angular/core';
import { InstantSearchService } from '../instant-search.service';
import connectRefinementList, {
  RefinementListItem,
} from 'instantsearch.js/es/connectors/refinement-list/connectRefinementList';
import { BaseHit, Hit, IndexWidget } from 'instantsearch.js';
import connectHits from 'instantsearch.js/es/connectors/hits/connectHits';

@Component({
  selector: 'app-facets',
  standalone: true,
  imports: [],
  templateUrl: './facets.component.html',
})
export class FacetsComponent {
  public brands?: RefinementListItem[];
  public refineBrands?: (value: string) => void;

  public querySuggestionsIndex: IndexWidget;
  public querySuggestions?: string[];

  constructor(private InstantSearchService: InstantSearchService) {
    this.InstantSearchService.connect(
      connectRefinementList,
      { attribute: 'brand' },
      ({ items, refine }) => {
        this.brands = items;
        this.refineBrands = refine;
      }
    );

    this.querySuggestionsIndex = this.InstantSearchService.createIndex({
      indexName: 'instant_search_demo_query_suggestions',
    });
    this.querySuggestionsIndex.addWidgets([
      connectHits(({ hits }) => {
        this.querySuggestions = (
          hits as Array<Hit<BaseHit> & { query: string }>
        ).map((hit) => hit.query);
      })({}),
    ]);
  }

  toggleRefinement(value: string) {
    this.refineBrands!(value);
  }

  selectQuerySuggestion(query: string) {
    this.InstantSearchService.instantSearchInstance
      .helper!.setQuery(query)
      .search();
  }
}
