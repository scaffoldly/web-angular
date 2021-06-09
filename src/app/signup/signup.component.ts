import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Logger } from '@app/@core';

const log = new Logger('Signup');
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  activeFragment = 'terms-and-conditions';
  pages = ['terms-and-conditions', 'basic-info'];

  // TODO Hide stuff (header or links in header if we're in this component)
  constructor(private route: ActivatedRoute, private router: Router) {}

  next() {
    const nextFragment = this.pages.reduce((acc, fragment, index, keys) => {
      if (acc) {
        return acc;
      }

      if (fragment === this.activeFragment) {
        return keys[index + 1];
      }

      return null;
    }, null);

    if (!nextFragment) {
      log.warn('No fragments left, navigating home');
      this.router.navigate(['/home'], { replaceUrl: true });
      return;
    }

    this.router.navigate([], { fragment: nextFragment });
  }

  ngOnInit() {
    this.route.fragment.subscribe((fragment: string) => {
      this.activeFragment = this.pages.find((p) => p === fragment) || this.pages[0];
    });
  }
}
