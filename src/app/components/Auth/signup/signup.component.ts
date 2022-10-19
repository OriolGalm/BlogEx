import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoginComponent } from '../login/login.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public hide:boolean = true;
  public signupForm!: FormGroup;

  constructor(
    private readonly dialog: MatDialog,
    private readonly fb: FormBuilder,
    public authSvc: AuthService,
    private readonly router: Router,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.initform();
  }

  private initform():void{
    this.signupForm = this.fb.group({
      nombre: ['', Validators.required],
      nombreUsuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  //email = new FormControl('', [Validators.required, Validators.email]);

  // getErrorMessage() {
  //   if (this.email.hasError('required')) {
  //     return 'You must enter a value';
  //   }
  //   return this.email.hasError('email') ? 'Not a valid email' : '';
  // }

  signupOpen(){
    this.dialog.closeAll();
    this.dialog.open(LoginComponent);
  }

  newUser(user:User){
    if(this.signupForm.valid){
    this.authSvc.signupUser(user).subscribe({
      next: (data) => {
        console.log(data.mensaje);
        this.toastr.success(data.mensaje, '', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
        this.dialog.closeAll();
        //this.router.navigate(['admin/new']);
      },

      error: err => {
        console.log(err.error.mensaje);
        this.toastr.error(err.error.mensaje, '', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
      }
    });
  }else{
    this.toastr.error("Error", '', {
      timeOut: 3000,  positionClass: 'toast-top-center',
    });
  }
}

}
