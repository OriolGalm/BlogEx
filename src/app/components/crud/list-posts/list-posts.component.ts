import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationExtras, Router } from '@angular/router';
import { Article } from 'src/app/shared/models/article';
import { ArticleService } from 'src/app/shared/services/article.service';
import { DeleteComponent } from '../delete/delete.component';

export interface PeriodicElement {
  title: string
}

/* const ELEMENT_DATA: PeriodicElement[] = [
  {title: "Primer article"},
  {title: "Segon article"},
  {title: "Tercer article"},
  {title: "quart article"},
  {title: "Cinquè article"},
  {title: "Desè article"},
  {title: "Onzè article"}
]; */

@Component({
  selector: 'app-list-posts',
  templateUrl: './list-posts.component.html',
  styleUrls: ['./list-posts.component.scss']
})
export class ListPostsComponent implements OnInit {

  navigationExtras: NavigationExtras = {
    state: {
      value: null
    }
  };

  displayedColumns: string[] = ['titol', 'borrar'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private readonly router: Router, 
    private readonly dialog: MatDialog,
    private readonly articleSvc: ArticleService
    ) { }

  ngOnInit(): void {
    this.articleSvc.getAll().subscribe(posts => this.dataSource.data = posts);
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  //Send all the post
  async onEditWait(post: Article){
    this.navigationExtras.state = post;
    await this.router.navigate(['/admin/edit'], this.navigationExtras);
  }

  onEdit(post: Article){
    this.onEditWait(post);
  }

  onDelete(post: any){
    this.dialog.open(DeleteComponent);
  }

}
