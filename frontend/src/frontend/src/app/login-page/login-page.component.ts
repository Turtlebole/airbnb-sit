import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  form: FormGroup = new FormGroup({});
  token: string|undefined;
  
  constructor(
    private formBuilder: FormBuilder,
    private http:HttpClient,
    private router:Router
    
    ){
      this.token = undefined;
  }

  sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      const blockedCharactersPattern = /[<>"'`*/()\[\]?]/g;
      input = input.replace(blockedCharactersPattern, '');
    }
    return input;
  }


  ngOnInit():void{
    this.form = this.formBuilder.group({
      email:'',
      password:''

  });
  }

  submit(): void {
    const requestData = this.form.getRawValue();
    requestData.email = this.sanitizeInput(requestData.email);
    requestData.password = this.sanitizeInput(requestData.password);

    

    this.http.post<any>('https://localhost/api/user/users/login', this.form.getRawValue(), { withCredentials: true })
      .subscribe(
        (res: any) => {
          const token = res.token;
          localStorage.setItem('token', token);
          this.router.navigate(['/']).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          console.error(error);
        }
      );
  }
  
}