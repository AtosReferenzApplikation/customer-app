import { Component, OnInit } from '@angular/core';
import { AuthenticationService} from '../shared/services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
      public authService: AuthenticationService,
      private router: Router
  ) { }

  ngOnInit() {
  }

  logon() {
    this.authService.logon()
        .then(() => {
          if (this.authService.isLoggedIn) {
            this.redirectUser();
          }
        });
  }

  private redirectUser() {
    // Get the redirect URL from the auth service
    // If no redirect has been set, use the default
    const redirect = this.authService.redirectUrl
        ? this.router.parseUrl(this.authService.redirectUrl)
        : '/support';

    // Redirect the user
    this.router.navigateByUrl(redirect);
  }
}
