import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-agregar-empleado',
  templateUrl: './agregar-empleado.component.html',
  styleUrls: ['./agregar-empleado.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule]
})
export class AgregarEmpleadoComponent implements OnInit {
  @ViewChild('empleadoForm') empleadoForm!: NgForm;
  @ViewChild('modalContent') modalContent: any;
  
  apiUrl = `${environment.apiUrl}/empleados`;
  datosUrl = `${environment.apiUrl}/datos-sedh`;
  empleado = {
    email_institucional_empleado: '',
    contrasena: '',
    pri_nombre: '',
    seg_nombre: '',
    pri_apellido: '',
    seg_apellido: '',
    fech_ingreso_laboral: '',
    act_laboral: 1,
    num_identidad: '',
    num_telefono: '',
    id_tipo_contratacion: '',
    id_dependencia: '',
    id_cargo: '',
    id_sup_inmediato: '',
    id_sexo: '',
    id_estado_civil: '',
    id_departamento_nacimiento: '',
    id_municipio_nacimiento: '',
    id_rol: '',
    id_jefe_inmediato: ''
  };

  // Variables para el modal
  modalTitle: string = '';
  modalMessage: string = '';
  isSuccess: boolean = true;

  tiposContrataciones: any[] = [];
  dependencias: any[] = [];
  cargos: any[] = [];
  sexos: any[] = [];
  estadosCiviles: any[] = [];
  departamentos: any[] = [];
  municipios: any[] = [];
  roles: any[] = [];

  filteredMunicipios: any[] = [];
  filteredCargos: any[] = [];
  isLoading: boolean = true;

  constructor(private http: HttpClient, private modalService: NgbModal) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.isLoading = true;
    this.http.get(this.datosUrl).subscribe({
      next: (response: any) => {
        this.tiposContrataciones = response.tipos_contrataciones;
        this.dependencias = response.dependencias;
        this.cargos = response.cargos;
        this.sexos = response.sexos;
        this.estadosCiviles = response.estados_civiles;
        this.departamentos = response.departamentos;
        this.municipios = response.municipios;
        this.roles = response.roles;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener datos', error);
        this.openModal('Error', 'No se pudieron cargar los datos necesarios', false);
        this.isLoading = false;
      }
    });
  }

  onDepartamentoChange() {
    this.filteredMunicipios = this.municipios.filter(municipio => municipio.id_departamento === +this.empleado.id_departamento_nacimiento);
  }

  onDependenciaChange() {
    this.filteredCargos = this.cargos.filter(cargo => cargo.id_dependencia === +this.empleado.id_dependencia);
  }

  agregarEmpleado() {
    const empleadoData = {
      email_institucional_empleado: this.empleado.email_institucional_empleado,
      contrasena: this.empleado.contrasena,
      pri_nombre: this.empleado.pri_nombre,
      seg_nombre: this.empleado.seg_nombre || '',
      pri_apellido: this.empleado.pri_apellido,
      seg_apellido: this.empleado.seg_apellido || '',
      fech_ingreso_laboral: this.empleado.fech_ingreso_laboral,
      act_laboral: this.empleado.act_laboral,
      num_identidad: this.empleado.num_identidad,
      num_telefono: this.empleado.num_telefono,
      id_tipo_contratacion: +this.empleado.id_tipo_contratacion,
      id_cargo: +this.empleado.id_cargo,
      id_sup_inmediato: this.empleado.id_jefe_inmediato,
      id_sexo: +this.empleado.id_sexo,
      id_estado_civil: +this.empleado.id_estado_civil,
      id_municipio: +this.empleado.id_municipio_nacimiento,
      id_rol: +this.empleado.id_rol
    };

    this.http.post(this.apiUrl, empleadoData).subscribe({
      next: (response) => {
        console.log('Empleado agregado exitosamente', response);
        this.openModal('¡Éxito!', 'Empleado agregado exitosamente', true);
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al agregar empleado', error);
        this.openModal('Error', 'No se pudo agregar el empleado. Valide el correo institucional y su DNI.', false);
      }
    });
  }

  openModal(title: string, message: string, success: boolean = true) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.isSuccess = success;
    this.modalService.open(this.modalContent, {
      centered: true,
      backdrop: 'static'
    });
  }

  resetForm() {
    if (this.empleadoForm) {
      this.empleadoForm.resetForm();
      // Reiniciar valores por defecto
      this.empleado = {
        email_institucional_empleado: '',
        contrasena: '',
        pri_nombre: '',
        seg_nombre: '',
        pri_apellido: '',
        seg_apellido: '',
        fech_ingreso_laboral: '',
        act_laboral: 1,
        num_identidad: '',
        num_telefono: '',
        id_tipo_contratacion: '',
        id_dependencia: '',
        id_cargo: '',
        id_sup_inmediato: '',
        id_sexo: '',
        id_estado_civil: '',
        id_departamento_nacimiento: '',
        id_municipio_nacimiento: '',
        id_rol: '',
        id_jefe_inmediato: ''
      };
      
      // Limpiar las listas filtradas
      this.filteredMunicipios = [];
      this.filteredCargos = [];
    }
  }

  isFormValid() {
    return this.empleado.email_institucional_empleado &&
           this.empleado.contrasena &&
           this.empleado.pri_nombre &&
           this.empleado.pri_apellido &&
           this.empleado.fech_ingreso_laboral &&
           this.empleado.num_identidad &&
           this.empleado.num_telefono &&
           this.empleado.id_tipo_contratacion &&
           this.empleado.id_dependencia &&
           this.empleado.id_cargo &&
           this.empleado.id_jefe_inmediato &&
           this.empleado.id_sexo &&
           this.empleado.id_estado_civil &&
           this.empleado.id_departamento_nacimiento &&
           this.empleado.id_municipio_nacimiento &&
           this.empleado.id_rol;
  }
}
