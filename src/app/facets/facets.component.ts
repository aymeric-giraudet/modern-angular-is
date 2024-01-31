import { Component } from '@angular/core';
import { InstantSearchService } from '../instant-search.service';
import connectRefinementList, {
  RefinementListItem,
} from 'instantsearch.js/es/connectors/refinement-list/connectRefinementList';

@Component({
  selector: 'app-facets',
  standalone: true,
  imports: [],
  templateUrl: './facets.component.html',
})
export class FacetsComponent {
  public brands?: RefinementListItem[];
  public refineBrands?: (value: string) => void;

  constructor(private InstantSearchService: InstantSearchService) {
    this.InstantSearchService.connect(
      connectRefinementList,
      { attribute: 'brand' },
      ({ items, refine }) => {
        this.brands = items;
        this.refineBrands = refine;
      }
    );
  }

  toggleRefinement(value: string) {
    this.refineBrands!(value);
  }
}
