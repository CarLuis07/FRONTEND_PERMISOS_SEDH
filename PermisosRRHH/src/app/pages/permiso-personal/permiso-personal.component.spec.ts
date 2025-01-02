import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermisoPersonalComponent } from './permiso-personal.component';

describe('PermisoPersonalComponent', () => {
  let component: PermisoPersonalComponent;
  let fixture: ComponentFixture<PermisoPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermisoPersonalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermisoPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
