import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Article } from 'src/app/shared/models/article';
import { ArticleService } from 'src/app/shared/services/article.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  public editPostForm!: FormGroup;
  public viewForm: any = [1];
  public flag: number = 1;
  public buttonTag: string = "One More";
  public article: any = null;
  private image!: any;
  public imageOriginal: any;

  constructor(private readonly fBuilder: FormBuilder,
    private readonly router: Router,
    private readonly articleSvc: ArticleService) { 
      const navigation = router.getCurrentNavigation();
      this.article = navigation?.extras?.state;
      this.reload();
      this.initForm();
  }

  ngOnInit(): void {
    //Check if there is some image and if not place it
    this.image = this.imageOriginal;
    if(this.imageOriginal !== ''){
      this.imageOriginal = this.article.img1;
    }
    //If the post is not empty, fill the fields of the form
    if(typeof this.article !== 'undefined'){
      this.editPostForm.patchValue(this.article);
    }else{
      this.router.navigate(['admin/new']);
    }
  }

  //Reload the page to bring more forms
  reload(){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
  }

  toNew(){
    this.router.navigate(['admin/new']);
  }

  private initForm():void{
    this.editPostForm = this.fBuilder.group({
      title:['', Validators.required],
      img1:['', Validators.required],
      alt1:['', Validators.required],
      text1:['', Validators.required],
      img2:[''],
      alt2:[''],
      text2:[''],
      img3:[''],
      alt3:[''],
      text3:[''],
      longitude:['', Validators.required],
      latitude:['', Validators.required]
    })
  }

  moreImgs(){
    if(this.flag < 3){
      this.flag++;
      this.viewForm.push(this.flag);
      if(this.flag == 3)
        this.buttonTag = "One Less";
    }else{
      this.viewForm.pop(this.flag)
      this.flag--;
      this.buttonTag = "One More";
    }
  }

  editPost(post: Article){
    if(this.image === this.imageOriginal){
      this.article.imatge1 = this.imageOriginal;
      this.articleSvc.updateArticle(post.id, post);
    }
  }

  handleImage1(event:any): void{
    this.image = event.target.files[0];
  }

}