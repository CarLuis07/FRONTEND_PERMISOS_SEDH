# FRONTEND PERMISOS SEDH RRHH

Permisos Personales es un sistema monolitico para el area de Recursos Humanos de la Secretaria de Derechos Humanos en Honduras. dicho sistema se encarga de gestionar los permisos personales, oficiales, vacaciones de todos los empleados.

el proyecto utiliza la conexion a un backend mediante mediante Api para su conexión estara mas abajo en la sección de instrucciones.

## Tabla de contenido:
* [Descargas](#descargas)
* [instrucciones](#instrucciones)
* [importante](#importante)
* [Desarrolladores](#desarrolladores)
* [Colaboradores](#colaboradores)


## Descargas  
- [GitHub Desktop](https://desktop.github.com/)
- [Visual Studio Code](https://code.visualstudio.com/download)
- [Node v20.9.0](https://nodejs.org/en/blog/release/v20.9.0)
- [Angular CLI versión 19.0.6.](https://angular.dev/installation)

## Instrucciones
para ejecutar este proyecto 
1. descargue el proyecto en Git hub desktop o descarguelo como zip.
2. abralo con un editor de texto como visual Studio Code.
3. abra una terminal en VSC y coloque el siguiente comando para descargar todas las dependencias.

```bash
npm i
```

4. este proyecto tiene metodos de seguridad como varibles de entorno, cree un archivo en la sisguiente ruta del proyecto como: `src/environments/enviroment.ts` en ella necesitará colocar las credenciales de conexion de la API para consumirlas.
necesitará las variables para la conexion debera colocar en el archivo: 

```
export const environment = {
    production: false,
    apiUrl: 'cambiar por Url de la api o backend'
  };
```

5. iniciar el proyecto, ejecutar en la terminal de VSC.
```bash
ng serve
```

## Importante
* *este proyecto usa javascript con el framework Angular versión 19.0.6*
* *este proyecto usa variables de entorno obligatorias para ejecutar el proyecto.*

## Desarrolladores
- **[@CarLuis07](https://github.com/CarLuis07/)  - Luis Cardona - `kikecar97@gmail.com`**

### Colaboradores


- Emerson Duron  - `emerson.duron@sedh.gob.hn`
