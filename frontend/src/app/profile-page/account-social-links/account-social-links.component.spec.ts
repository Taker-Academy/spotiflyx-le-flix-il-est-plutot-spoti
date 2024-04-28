import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSocialLinksComponent } from './account-social-links.component';

describe('AccountSocialLinksComponent', () => {
  let component: AccountSocialLinksComponent;
  let fixture: ComponentFixture<AccountSocialLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountSocialLinksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountSocialLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
