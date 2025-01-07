import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermisoOficialComponent } from './permiso-oficial.component';

describe('PermisoOficialComponent', () => {
  let component: PermisoOficialComponent;
  let fixture: ComponentFixture<PermisoOficialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermisoOficialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermisoOficialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
