import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Article } from 'src/app/shared/models/article';
import { ArticleService } from 'src/app/shared/services/article.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  public post!: Article;

  constructor(private readonly route: ActivatedRoute, private articleSvc: ArticleService) {  }

  ngOnInit(): void {
    const idPost = this.route.snapshot.params['title'];   //snapshot.params['id'];
    this.articleSvc.getLocalArticleByTitle(idPost)
    .subscribe(data => this.post = data);
    console.log("Post: ", idPost);
  }

    //In case of assets file is a JSON format
   /* private async getArticles(){
    this.articleSvc.getArticles()
      .subscribe(res => {
        this.articles = res;
      })
  } */
 
}
