import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SnackbarService } from '../snackbar';
import { AddThermal, Measure } from './measurement-model';
import { measurementService } from './measurement_service';
import * as moment from 'moment';


@Component({
  selector: 'app-dashboard-measurement',
  templateUrl: './dashboard-measurement.component.html',
  styleUrls: ['./dashboard-measurement.component.scss']
})
export class DashboardMeasurementComponent implements OnInit {

  private api_url = environment.API_URL;
  
  imageurl;
  normalimage;

  private postSub: Subscription;

  dataSource: MatTableDataSource<Measure>;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  displayedColumns: string[] = ['sl','time', 'people','temp','view'];

  mainposts: Measure[] = [];
  posts: Measure[] = [];

  

  constructor(private snackbar: SnackbarService,private router: Router, private measureservice: measurementService, private http: HttpClient) { }

  ngOnInit() {
    // this.measureservice.getAllThermalData();
    this.postSub = this.measureservice.getPostUpdateListener()
      .subscribe((post: Measure[]) => {
        this.mainposts = post;
        this.posts = this.mainposts.filter((item, index) => {
          let d = new Date(item.Thermal_Date).getTime(),
              passedTimeInHours = (((Date.now() - d) / 1000) / 60) / 60
          return passedTimeInHours < 24
        });
        // console.log(this.posts[this.posts.length - 1])
        // this.totalsensors = posts.length;
        this.dataSource = new MatTableDataSource(this.posts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  thermaldate="12:00:00";
  numberofpeople=0;
  Thermal_Date= "";
  Thermal_Value= "";
  Number_Of_People= 0;
  Sensor_Name= "";
  Image_Result= 0;
  Processed= "";
  Temp="";
  serialnumber="0"
  
  view(id: string, i){ 
    this.viewButton(id);
    this.getImage(id);
    this.serialnumber=(i+1);
    // this.thermaldate = await this.measureservice.tDate();
    // this.numberofpeople = await this.measureservice.nOfPeople();
  
  }

  newid="";
  viewButton(id: string){
      this.newid = id;
      this.http.get<{message: string, posts: any}>(`${this.api_url}/getdata/measurement/view/`+ id)
      .subscribe(post => {
        // const str = post.posts.Thermal_Date;

        // const [dateComponents, timeComponents] = str.split(',');

        // // console.log(dateComponents); // 👉️ "07/21/2024"
        // // console.log(timeComponents); // 👉️ "04:24:37"

        // const [month, day, year] = dateComponents.split('/');
        // const [hours, minutes, seconds] = timeComponents.split(':');

        // const date = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);

        let date = moment(post.posts.Thermal_Date).format('HH:mm:ss');
        // console.log(date);

          this.thermaldate = date;
          this.numberofpeople = post.posts.Number_Of_People;
            // console.log(this.thermal);
      })
  }

  correct(){
    const add: AddThermal = {
      // id: this.newid,
      Sensor_Name: this.Sensor_Name,
      Thermal_Date: this.Thermal_Date,
      Thermal_Value: this.Thermal_Value,
      Number_Of_People: this.Number_Of_People,
      Image_Result: 1,
      Thermal_Image: this.imageurl,
      Normal_Image: this.normalimage,
      Processed: this.Processed,
      Temp: this.Temp,
    }
    this.http.post(`${this.api_url}/AddThermal/measurement/view/`+this.newid, add)
    .subscribe((response:any) => {
      if(response){
        // console.log("response")
        this.snackbar.showMessage("added successfully..");
                // this.dailog.closeAll();
        // window.location.reload();
      }
    })
  }

  wrong(){
    const add: AddThermal = {
      // id: this.newid,
      Sensor_Name: this.Sensor_Name,
      Thermal_Date: this.Thermal_Date,
      Thermal_Value: this.Thermal_Value,
      Number_Of_People: this.Number_Of_People,
      Image_Result: 0,
      Thermal_Image: this.imageurl,
      Normal_Image: this.normalimage,
      Processed: this.Processed,
      Temp: this.Temp,
    }
    this.http.post(`${this.api_url}/AddThermal/measurement/view/`+this.newid, add)
    .subscribe((response:any) => {
      if(response){
        // console.log("response")
        this.snackbar.showMessage("added successfully..");
                // this.dailog.closeAll();
        // window.location.reload();
      }
    })
  }

  getImage(id: string){

    this.http.get<{message: string, posts: any}>(`${this.api_url}/getdata/measurement/view/`+ id)
      .subscribe(post => {
        // const str = post.posts.Thermal_Date;

        // const [dateComponents, timeComponents] = str.split(',');

        // // console.log(dateComponents); // 👉️ "07/21/2024"
        // // console.log(timeComponents); // 👉️ "04:24:37"

        // const [month, day, year] = dateComponents.split('/');
        // const [hours, minutes, seconds] = timeComponents.split(':');

        // const date = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);

        let date = moment(post.posts.Thermal_Date).format('DD-MM-YY, HH:mm:ss');
        // console.log(date);

        this.Thermal_Date = date;
        this.Thermal_Value = post.posts.Thermal_Value;
        this.Number_Of_People = post.posts.Number_Of_People;
        this.Sensor_Name = post.posts.Sensor_Name;
        this.Image_Result = post.posts.Image_Result;
        this.Processed = post.posts.Processed;
        this.Temp = post.posts.Temp;
        this.imageurl = `https://sensiablebucket.s3.ap-south-1.amazonaws.com/`+post.posts.Thermal_Image;
        this.normalimage = `https://sensiablebucket.s3.ap-south-1.amazonaws.com/`+post.posts.Normal_Image;
      })
  }
  

  back(){
    this.router.navigate([''])
  }


  
}
