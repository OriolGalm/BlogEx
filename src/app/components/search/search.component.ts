import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, pipe } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ArticleService } from 'src/app/shared/services/article.service';
import { Article } from 'src/app/shared/models/article';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  navigationExtras: NavigationExtras = {
    state: {
      value: null
    }
  };

  myControl = new FormControl('');
  options: string[] = [];
  allOptions: Article[] = [];
  filteredOptions!: Observable<string[]>;
  oneArticle!: any;
  articlesTitle!: string[];

  constructor(private readonly articleSvc: ArticleService, private readonly router: Router) { }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.articleSvc.getAll()
    .subscribe(res => {
      this.allOptions = res;
      this.allOptions.map(x =>{ this.options.push(x.title);
      });
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  selectArticle(){
    /* this.articleSvc.getAll().subscribe(res => {
      res.find()
    }) */
    /* const title: any = this.myControl.value;
    this.articleSvc.getLocalArticleByTitle(title).subscribe({next: res => {
      this.oneArticle = res;
      console.log("One Article: ", this.oneArticle);
    }
    }); */
    /* this.articleSvc.getArticles().subscribe((res:Article[]) => {res.map(x => {
      this.oneArticle = x
    })}); */

    for(let i = 0; i < this.allOptions.length; i++){
      if(this.allOptions[i].title == this.myControl.value){
        this.router.navigate(['/article', this.myControl.value]);
        console.log("Article: ", this.allOptions);
      console.log("Input: ", this.myControl);
      } 
      
    }
  }

}
