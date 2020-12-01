import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { Observable } from "rxjs";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor (private userService: UserService, private router:Router){ }


canActivate(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | Observable<boolean> | Promise<boolean> {
  if(this.userService.token ) {
    return true;
  } else {
    this.router.navigate(['/']);
    return false;
  }
}
}

