import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountConnectionsComponent } from './account-connections.component';

describe('AccountConnectionsComponent', () => {
  let component: AccountConnectionsComponent;
  let fixture: ComponentFixture<AccountConnectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountConnectionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
