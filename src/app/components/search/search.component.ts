import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, pipe } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
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

  @ViewChild('hideForm') toForm!: ElementRef;

  myControl = this.fb.control('', [Validators.minLength(2), Validators.required]);
  options: string[] = [];
  allOptions: Article[] = [];
  filteredOptions!: Observable<string[]>;
  oneArticle!: any;
  articlesTitle!: string[];
  articleId!: number;
  mostrar: boolean = false;
  private debounceTimer!: any;
  private uniqueChars: string[] = [];

  constructor(private readonly articleSvc: ArticleService, 
    private readonly router: Router,
    private readonly renderer2: Renderer2,
    private readonly fb: FormBuilder
    ) { }

  ngOnInit(): void {
      
    this.filteredOptions = this.myControl.valueChanges.pipe(
      //debounceTime(400),
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

 /*  onQueryChanged(query: string = ''){
    if(this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {
      this.articleSvc.getAll()
      .subscribe(res => {
        this.allOptions = res;
        this.allOptions.map(x =>{ this.options.push(x.title);
        });
      });
    }, 500)
  } */

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    
    if(this.myControl.valid){
      this.articleSvc.getAll()
      .subscribe(res => {
        this.allOptions = res;
        this.allOptions.map(x =>{ this.options.push(x.title);
          this.uniqueChars = [...new Set(this.options)];
        });
      });
    }
    return this.uniqueChars.filter(option => option.toLowerCase().includes(filterValue));
  }

  selectArticle(){
    for(let i = 0; i < this.allOptions.length; i++){
      if(this.allOptions[i].title == this.myControl.value){
        this.articleId = this.allOptions[i].id;
        this.router.navigate(['/article', this.articleId]);
      } 
    }    
  }

  openSelect(){
    this.mostrar = !this.mostrar;
    const asForm = this.toForm.nativeElement;
    if(this.mostrar == true){
      this.renderer2.setStyle(asForm, 'display', 'block');
    }else{
      this.renderer2.setStyle(asForm, 'display', 'none');
    }
  }
}
