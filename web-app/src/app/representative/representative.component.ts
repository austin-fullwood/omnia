import {Component, Input, OnInit} from '@angular/core';
import {Representative} from '../_models/representative';

@Component({
  selector: 'app-representative',
  templateUrl: './representative.component.html',
  styleUrls: ['./representative.component.css']
})
export class RepresentativeComponent implements OnInit {

  @Input() rep = new Representative();

  ngOnInit(): void {
  }

}
