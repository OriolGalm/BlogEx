import { Component, OnInit } from '@angular/core';
import { LoginComponent } from 'src/app/components/Auth/login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { Imagen } from './../../../shared/models/imagen';
import { ArticleService } from './../../../shared/services/article.service';
import { Article } from 'src/app/shared/models/article';

@Component({
  selector: 'app-front-articles',
  templateUrl: './front-articles.component.html',
  styleUrls: ['./front-articles.component.scss']
})
export class FrontArticlesComponent implements OnInit {

  articles: Article[] = [];
  imagenes: Imagen[] = [];
  imagenesAll: Imagen[] = [];


  constructor(private articleService: ArticleService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getArticles();
    this.getImagenes();
  }

  private getArticles() {
    this.articleService.getAll().subscribe({
      next: data => {
        this.articles = data;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  private getImagenes() {
    this.articleService.getImages().subscribe({
      next: (data: Imagen[]) => {
        this.imagenesAll = data;
      }
    })
  }

  onImgs(articleId: number) {
    this.getImgsByArticleId(articleId);
    this.imagenes = [];
  }

  private getImgsByArticleId(id: number) {
    this.articleService.getImagesByArticleId(id).subscribe({
      next: (data: Imagen[]) => {
        this.imagenes = data;
      },
      error: err => {
        console.log(err);
      }
    })
  }

  openGalery() {
    this.dialog.open(LoginComponent);
  }

}
