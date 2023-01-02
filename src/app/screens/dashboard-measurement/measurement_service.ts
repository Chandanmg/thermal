
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddThermal, Measure } from './measurement-model';
import * as moment from 'moment';

@Injectable({ providedIn : 'root'})
export class measurementService{
    
    private api_url = environment.API_URL;

    private posts: Measure[] = [];
    //  public lastdata: any;
    private postUpdated = new Subject<Measure[]>();

    // private posts: AddBuildingPage[] = [];
    // private postUpdated = new Subject<AddBuildingPage[]>();

    constructor(private http: HttpClient){}

    getAllThermalData(id : string){
        this.http
        .get<{message: string, posts: any}>(`${this.api_url}/customerlist/name/`+id)
        .pipe(map((postData) => {
            return postData.posts.map(post => {
                let thisdate = moment(post.Thermal_Date).format('DD-MM-YY, HH:mm:ss');
                // console.log(date);
                return {
                    id: post._id,
                    Thermal_Date: thisdate,
                    Thermal_Value: post.Thermal_Value,
                    Number_Of_People: post.Number_Of_People,
                    // Image_Result: post.Image_Result,
                    Temp: post.Temp
                }
            })
        }))
        .subscribe(post => {
            console.log(post[0]);
            this.posts = post,
            this.postUpdated.next([...this.posts]);
            // this.lastdata = (this.posts[this.posts.length - 1]);
            // console.log = (this.lastdata);
        })
    }

    getPostUpdateListener(){
        return this.postUpdated.asObservable();
    }

    

    


    // thermaldate;
    // numberpeople;

    // viewButton(id: string){
    //     this.http.get<{message: string, posts: any}>("http://13.234.186.116:3000/getdata/measurement/view/"+ id)
    //     .subscribe(post => {
    //         this.thermaldate = post.posts.Thermal_Date;
    //         this.numberpeople = post.posts.Number_Of_People;
    //         // console.log(this.thermal);
    //     })

    // }

    // tDate(){
    //     return this.thermaldate;
    //     // console.log(this.thermal);
    // }

    // nOfPeople(){
    //     return this.numberpeople;
    //     // console.log(this.thermal);
    // }



    
}