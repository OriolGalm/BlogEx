import { AuthService } from 'src/app/shared/services/auth.service';
import { TokenService } from './../../../shared/services/token.service';
import { Article } from 'src/app/shared/models/article';
import { GalleryImagesComponent } from './../list-images/gallery-images/gallery-images.component';
import { GalleryVideosComponent } from './../list-videos/gallery-videos/gallery-videos.component';
import { VideoService } from './../../../shared/services/video.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ArticleService } from 'src/app/shared/services/article.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  durationInSeconds = 5;

  constructor(
    private tokenSvc: TokenService,
    private authSvc: AuthService,
    private readonly dialog: MatDialog,
    private toastrService: ToastrService,
    private snack: MatSnackBar,
    private readonly articleSvc: ArticleService,
    private videoSvc: VideoService,
    @Inject(MAT_DIALOG_DATA) public data: { article: Article, imgId: string, videoId: number, option: string },
    private readonly router: Router
  ) { }

  ngOnInit(): void {}

  onDeleteArticle() {
    this.articleSvc.deleteArticle(this.data.article.id).subscribe({
      next: data => {
        this.snack.open("Article deleted", "", { duration: 3000 });
        this.redirectTo(this.router.url);
        // this.router.navigate(['admin/new']);
      }
    });
    this.dialog.closeAll();
  }

  onDeleteImage() {
    this.articleSvc.deleteImage(this.data.imgId).subscribe({
      next: (data: any) => {
        this.toastrService.success(data.mensaje, '', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        //this.redirectTo(this.router.url);
        //window.location.reload();
        this.dialog.closeAll();
        this.dialog.open(GalleryImagesComponent, { data: { article: this.data.article } });
      },
      error: err => {
        console.log(err);
      }
    })
  }

  onDeleteVideo(){
    this.videoSvc.delete(this.data.videoId).subscribe({
      next: data => {
        console.log(data);
        this.dialog.closeAll();
        this.dialog.open(GalleryVideosComponent, { data: { article: this.data.article } });     
      },
      error: err => {
        console.log(err);     
      }
    })
  }

  onDeleteAccount(){
    const username: string = this.tokenSvc.getUsername() as string;
    this.authSvc.deleteAccount(username).subscribe( data => console.log(data));
    this.tokenSvc.logOut();
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }

  cancel() {
    this.dialog.closeAll();
  }

}
