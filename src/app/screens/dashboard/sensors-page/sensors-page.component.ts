import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { measurementService } from '../../dashboard-measurement/measurement_service';
import { addSettingCustomer } from '../../settings/settings.model';
import { settingsService } from '../../settings/settings.service';

@Component({
  selector: 'app-sensors-page',
  templateUrl: './sensors-page.component.html',
  styleUrls: ['./sensors-page.component.scss']
})
export class SensorsPageComponent implements OnInit {

  private postsub : Subscription;
  
  posts: addSettingCustomer[] = [];
  posts2:any;

  dataSource: MatTableDataSource<addSettingCustomer>;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  // dataSource= [];
  
  constructor(private router: Router, private dailog: MatDialog, private settingservice: settingsService, private measureservice: measurementService) { }

  ngOnInit() {
    this.getCustomer();
  }
  
  displayedColumns: string[] = ['sl', 'customer', 'location', 'sensorid', 'lastresponse', 'totalimages', 'correctresult', 'wrongresult', 'view'];


  view(id: string){
    // console.log(id);
    this.measureservice.getAllThermalData(id);
    this.router.navigate(['/measurement']);
  }

  getCustomer(){
    this.settingservice.getcustomer();
    this.postsub = this.settingservice.getPostUpdateListener()
      .subscribe((posts: addSettingCustomer[]) => {
        this.posts = posts;
        this.dataSource = new MatTableDataSource(this.posts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })

    // this.posts2 = this.measureservice.lastdata;
    // console.log(this.posts2);
  }

}
