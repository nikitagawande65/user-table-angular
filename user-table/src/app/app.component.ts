//app.component.ts
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';

import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';

export interface PeriodicElement {
  id: number;
  name: string;
  email: string;
  address: string;
  gender: string;
  dateOfBirth: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    id: 1,
    name: 'Steve',
    email: 'steve@gmail.com',
    address: '471 Duncan Avenue,new york',
    gender: 'Male',
    dateOfBirth: '05/04/1980',
  },
  {
    id: 2,
    name: 'John',
    email: 'johne@gmail.com',
    address: '567 Duncan Avenue,new york',
    gender: 'Male',
    dateOfBirth: '05/04/1980',
  },
  {
    id: 3,
    name: 'Ellie',
    email: 'trend@gmail.com',
    address: '378 Duncan Avenue,new york',
    gender: 'Female',
    dateOfBirth: '05/04/1980',
  },
];
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'address',
    'gender',
    'dateOfBirth',
    'action',
  ];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  progressBar: number = 0;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  maleUsers: number = 0;
  femaleUsers: number = 0;

  constructor(
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef
  ) {}
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
    this.userCount();
  }
  userCount() {
    this.progressBar = this.dataSource.filteredData.length * 10;
    for (let item of this.dataSource.filteredData) {
      item.gender === 'Male' ? ++this.maleUsers : ++this.femaleUsers;
    }
  }
  updateRowData(row_obj: any) {
    this.dataSource.filteredData = this.dataSource.filteredData.filter(
      (value) => {
        if (value.id == row_obj.id) {
          value.name = row_obj.name;
          value.email = row_obj.email;
          value.address = row_obj.address;
          value.gender = row_obj.gender;
          value.dateOfBirth = row_obj.dateOfBirth;
        }
        return true;
      }
    );
  }
  deleteRowData(row_obj: any) {
    this.dataSource.data = this.dataSource.filteredData.filter((value) => {
      return value.id != row_obj.id;
    });
    this.changeDetectorRefs.detectChanges();
    this.dataSource._updateChangeSubscription();
    this.maleUsers = 0;
    this.femaleUsers = 0;
    this.userCount();
  }
  openDialog(action: any, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '800px',
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event == 'Update') {
        this.updateRowData(result.data);
      } else if (result.event == 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }
}
