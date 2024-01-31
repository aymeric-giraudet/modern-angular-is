import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InstantSearchService } from './instant-search.service';
import connectHits from 'instantsearch.js/es/connectors/hits/connectHits';
import { BaseHit } from 'instantsearch.js';
import { FacetsComponent } from './facets/facets.component';
import connectSearchBox from 'instantsearch.js/es/connectors/search-box/connectSearchBox';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FacetsComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
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

  public search(event: Event) {
    this.refine!((event.target as HTMLInputElement).value);
  }

  ngAfterContentInit() {
    this.InstantSearchService.start();
  }
}
