import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Measure } from 'src/app/screens/dashboard-measurement/measurement-model';
import { measurementService } from 'src/app/screens/dashboard-measurement/measurement_service';
import { addSettingCustomer } from 'src/app/screens/settings/settings.model';
import { settingsService } from 'src/app/screens/settings/settings.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sensor-card',
  templateUrl: './sensor-card.component.html',
  styleUrls: ['./sensor-card.component.scss']
})
export class SensorCardComponent implements OnInit {

  private api_url = environment.API_URL;

  posts: Measure[] = [];

  totalsensors=0;
  totalmeasurements=0;
  wrongcount=0;
  correctcount=0;

  constructor(private router: Router, private dailog: MatDialog, private settingservice: settingsService, private measureservice: measurementService, private http: HttpClient) { }

  ngOnInit() {
    this.getCustomer();
    this.totalMeasurements();
  }

  getCustomer(){
    // this.settingservice.getcustomer();
    this.settingservice.getPostUpdateListener()
      .subscribe((posts: addSettingCustomer[]) => {
        this.totalsensors = posts.length;
        
      })
  }

  totalMeasurements(){ //`${this.api_url}/getdata`
    this.http
    .get<{message: string, posts: any}>(`${this.api_url}/getdata`)
    .pipe(map((postData) => {
        return postData.posts.map(post => {
            return {
              // Image_Result: post.Image_Result
            }
        })
    }))
    .subscribe(post => {
        // console.log(post);
        this.totalmeasurements = post.length;
        // this.posts = post;
        // console.log(this.posts.slice(-1)[0]);
        // for (var i = 0; i < this.posts.length; i++) {
        //   if(post.Image_Result == 0){
        //     this.wrongcount = this.wrongcount+1;
        //   }
        //   if(post.Image_Result == 1){
        //     this.correctcount = this.correctcount+1;
        //   }
        //   console.log(this.correctcount);
        // }
        
    })
  }


}
