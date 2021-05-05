import {Component, Input, OnInit} from '@angular/core';
import {Representative} from '../_models/representative';

/**
 * Displays a representative's information.
 */
@Component({
  selector: 'app-representative',
  templateUrl: './representative.component.html',
  styleUrls: ['./representative.component.css']
})
export class RepresentativeComponent implements OnInit {

  /**
   * Rep given by parent.
   */
  @Input() rep = new Representative();

  ngOnInit(): void {
  }

}
