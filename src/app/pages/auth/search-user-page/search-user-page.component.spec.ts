import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUserPageComponent } from './search-user-page.component';

describe('SearchUserPageComponent', () => {
  let component: SearchUserPageComponent;
  let fixture: ComponentFixture<SearchUserPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchUserPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
