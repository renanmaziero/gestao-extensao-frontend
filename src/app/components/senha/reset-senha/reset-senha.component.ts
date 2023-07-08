import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Senha } from 'src/app/models/senha.model';
import { SenhaService } from 'src/app/services/senha/senha.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-senha',
  templateUrl: './reset-senha.component.html',
  styleUrls: ['./reset-senha.component.scss']
})
export class ResetSenhaComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  senha: Senha;
  formEmail: FormGroup;

  constructor(public router: Router, private fbuilder: FormBuilder, private senhaService: SenhaService, private snackBar: MatSnackBar, private toast: ToastrService) { }

  ngOnInit(): void {
    this.senha = new Senha();

    this.formEmail = this.fbuilder.group({
      email: new FormControl('')
    });
  }

  loadLogin() {
    this.router.navigate(['/login']);
  }

  resetarSenha(request: Senha): void {
    this.senha.email = this.formEmail.get('email').value;
    this.senhaService.resetarSenha(request).subscribe(
      data => {
        //console.log(data);
        this.openSnackBar('Verifique sua caixa de entrada e spam', 'OK');
        this.loadLogin();
      },
      error => {      
        this.toast.error('E-mail não existe.');
        
        /* if (error.error == "{\"error\":\"Not Found\",\"mensagem\":\"User not found\"}") {
          //this.openSnackBar('E-mail "' + this.formEmail.get('email').value + '" não existe.', 'OK');
          this.toast.error('E-mail não existe.');
        }        */
      }
    );
  }

  openSnackBar(message: string, action: string): void{
    this.snackBar.open(message, action, {
      duration: 15000,
      horizontalPosition: this.horizontalPosition
    });
  }
}
