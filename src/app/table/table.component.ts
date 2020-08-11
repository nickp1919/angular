import {Component, OnInit} from '@angular/core';
import {TableService} from "./table.service";



@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})

export class TableComponent implements OnInit {

  nameCheckbox: string;
  headers: Array<string> = [];
  subheaders: Array<string> = [];
  keysForData: Array<string> = [];
  data: Array<object>;
  colspan: object = {};
  colspanDefault: object = {};
  display: object = {};
  setChecked: object = {};
  btn = ['btn btn-secondary active', 'btn btn-secondary']


  constructor(private jsonService: TableService) {

  }

  ngOnInit() {
    this.jsonService.getJson().subscribe(getdata => {
      this.nameCheckbox = getdata.head;
      this.data = getdata.data;
      getdata.head.forEach( x => {
         this.headers.push(x.name);
         this.display[x.name] = false;
         this.setChecked[x.name] = true;
         if (x['sub-head']) {
              this.colspan[x.name] = x['sub-head'].length;
              this.colspanDefault[x.name] = x['sub-head'].length;
              x['sub-head'].forEach( v => {
              this.subheaders.push(v.name);
              this.keysForData.push(v.name);
              this.display[v.name] = false;
              this.setChecked[v.name] = true;
              });
          } else {
              this.keysForData.push(x.name);
            }
      });
    });
  }

  displayOffHeads(event, x) {
    if (!event.target.checked) {
      this.display[x] = true;
    } else {
        this.display[x] = false;
      }
  }

  displayOffHeadAndSub(event, nameHead: any, listSub: any) {
    if (!event.target.checked) {
      this.setChecked[nameHead] = false;
      this.display[nameHead] = true;
      listSub.forEach( s => {
        this.display[s.name] = true;
        this.colspan[nameHead] = 0;
        this.setChecked[s.name] = false;
      });
    } else {
        this.display[nameHead] = false;
        this.setChecked[nameHead] = true;
        listSub.forEach( s => {
          this.display[s.name] = false;
          this.setChecked[s.name] = true;
          this.colspan[nameHead] = listSub.length;
        });
      }
  }

  displayOffSub(event, nameSub: any, nameHead: any) {
    if (!event.target.checked) {
      this.display[nameSub] = true;
      if (this.colspan[nameHead] === 1) {
        this.display[nameHead] = true;
      }
      this.colspan[nameHead] --;
      this.setChecked[nameHead] = false;
      this.setChecked[nameSub] = false;
    } else {
        this.setChecked[nameSub] = true;
        this.display[nameSub] = false;
        if (this.colspan[nameHead] === 0) {
          this.display[nameHead] = false;
        }
        if (this.colspan[nameHead] === this.colspanDefault[nameHead] - 1) {
          this.setChecked[nameHead] = true;
        }
        this.colspan[nameHead] ++;
      }
  }

}
