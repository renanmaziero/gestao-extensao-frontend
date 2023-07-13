import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/core/auth/token-storage.service';

@Component({
  selector: 'app-suporte',
  templateUrl: './suporte.component.html',
  styleUrls: ['./suporte.component.scss']
})
export class SuporteComponent implements OnInit {
  private roles: string[];  
  admin = false; 
  user = false;
  constructor(private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.roles = this.tokenStorage.getAuthorities();

      this.admin = this.roles.includes('ROLE_ADMIN');
      this.user = this.roles.includes('ROLE_USER');

    }
  }

}
