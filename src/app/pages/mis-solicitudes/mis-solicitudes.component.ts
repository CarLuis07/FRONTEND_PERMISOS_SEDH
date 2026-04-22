import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subject, forkJoin } from 'rxjs';
import { timeout, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

const REQUEST_TIMEOUT_MS = 15_000;

@Component({
  selector: 'app-mis-solicitudes',
  imports: [CommonModule],
  templateUrl: './mis-solicitudes.component.html',
  styleUrl: './mis-solicitudes.component.css'
})
export class MisSolicitudesComponent implements OnInit, OnDestroy {
  solicitudes: any[] = [];
  solicitudesEmergencia: any[] = [];
  isActualizando = false;
  errorMessage = '';

  private readonly apiUrl  = `${environment.apiUrl}/misSolicitudes`;
  private readonly apiUrl2 = `${environment.apiUrl}/misSolicitudesEmergencia`;
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarSolicitudes();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarSolicitudes() {
    console.log('Cargando solicitudes...');
    if (this.isActualizando) return;
    this.isActualizando = true;
    this.errorMessage = '';

    forkJoin({
      solicitudes: this.http.get<any[]>(this.apiUrl),
      emergencias: this.http.get<any[]>(this.apiUrl2)
    })
    .pipe(timeout(REQUEST_TIMEOUT_MS), takeUntil(this.destroy$))
    .subscribe({
      next: ({ solicitudes, emergencias }) => {
        this.solicitudes = solicitudes;
        this.solicitudesEmergencia = emergencias;
        this.isActualizando = false;
      },
      error: (err: any) => {
        this.isActualizando = false;
        this.errorMessage =
          err?.name === 'TimeoutError'
            ? 'El servidor no respondió a tiempo. Intenta de nuevo.'
            : err?.status === 401
            ? 'Sesión expirada. Vuelve a iniciar sesión.'
            : 'Error al cargar las solicitudes. Intenta de nuevo.';
      }
    });
  }
}
