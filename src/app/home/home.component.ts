import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { InstantSearchService } from '../instant-search.service';
import connectHits from 'instantsearch.js/es/connectors/hits/connectHits';
import { BaseHit } from 'instantsearch.js';
import { FacetsComponent } from '../facets/facets.component';
import connectSearchBox from 'instantsearch.js/es/connectors/search-box/connectSearchBox';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FacetsComponent, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  public hits?: BaseHit[];
  public query?: string;
  private refine?: (value: string) => void;

  constructor(private InstantSearchService: InstantSearchService) {
    this.InstantSearchService.connect(
      connectSearchBox,
      {},
      ({ refine, query }) => {
        this.refine = refine;
        this.query = query;
      }
    );

    this.InstantSearchService.connect(connectHits, {}, ({ hits }) => {
      this.hits = hits;
    });
  }

  ngAfterContentInit() {
    this.InstantSearchService.start();
  }

  public search(event: Event) {
    this.refine!((event.target as HTMLInputElement).value);
  }
}
