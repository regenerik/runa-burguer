# Runa Burger Admin Setup

Arquitectura final:

```text
Render = solo frontend estatico
Google Apps Script = backend de admin, productos y cupon
Google Sheets = base de datos
Cloudinary = imagenes
```

## Valores Que Necesitas

Vas a usar estos datos:

```text
Carpeta Cloudinary: runa
API_TOKEN: una clave larga inventada por vos
ADMIN_EMAIL: email para entrar al admin
ADMIN_PASSWORD: contrasena para entrar al admin
Cloudinary cloud name
Cloudinary API key
Cloudinary API secret
Cloudinary upload preset name
Apps Script Web App URL terminada en /exec
```

`API_TOKEN` no sale de Cloudinary. Es una clave privada que inventas vos, por ejemplo:

```text
runa_admin_2026_una_clave_bien_larga
```

## 1. Apps Script

Este paso se hace desde la planilla de Google Sheets que ya usa Runa.

1. Abrir la planilla.
2. Ir a `Extensiones > Apps Script`.
3. Abrir `Codigo.gs`.
4. Borrar todo.
5. Pegar completo el contenido de `docs/runa-products-google-apps-script.js`.
6. Guardar con el icono de disquete o `Ctrl + S`.

En tu captura el codigo pegado se ve bien.

## 2. Propiedades De Apps Script

En Apps Script:

1. Click en el icono de engranaje de la barra izquierda.
2. Entrar en `Configuracion del proyecto`.
3. Buscar `Propiedades de la secuencia de comandos`.
4. Agregar estas propiedades:

```text
API_TOKEN=la_clave_larga_que_inventaste
ADMIN_EMAIL=tu_email_para_entrar_al_admin
ADMIN_PASSWORD=tu_password_para_entrar_al_admin
CLOUDINARY_CLOUD_NAME=tu_cloud_name_de_cloudinary
CLOUDINARY_API_KEY=tu_api_key_de_cloudinary
CLOUDINARY_API_SECRET=tu_api_secret_de_cloudinary
CLOUDINARY_ALLOWED_FOLDERS=runa
```

Importante:

- No uses comillas.
- Como tu carpeta de Cloudinary se llama `runa`, el valor exacto de `CLOUDINARY_ALLOWED_FOLDERS` es `runa`.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `API_TOKEN`, `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET` van solo en Apps Script. No van en Render.

## 3. Crear La Hoja products

En Apps Script, arriba hay un selector de funciones. En tu captura ese selector dice `jsonResponse`.

1. Click en ese selector.
2. Elegir `setupProductSheets`.
3. Click en `Ejecutar`.
4. Si Google pide permisos, aceptar.
5. Volver a Google Sheets.
6. Mirar abajo, donde estan las pestanas de hojas.
7. Debe aparecer una hoja nueva llamada `products`.
8. Si no aparece, refrescar la pestana de Google Sheets.

Si sigue sin aparecer, el Apps Script probablemente no esta asociado a esa planilla. En ese caso cerralo y volve a abrirlo desde la planilla con `Extensiones > Apps Script`.

## 4. Autorizar Cloudinary

Esto permite que Apps Script borre imagenes reemplazadas o eliminadas.

1. En Apps Script, abrir el mismo selector de funciones.
2. Elegir `authorizeExternalRequests`.
3. Click en `Ejecutar`.
4. Aceptar los permisos de Google.
5. Si aparece advertencia de app no verificada, entrar en `Avanzado` y permitir el proyecto.

## 5. Implementar Apps Script

1. Arriba a la derecha, click en `Implementar`.
2. Si ya habia una implementacion, elegir `Administrar implementaciones`.
3. Click en el lapiz de la implementacion actual.
4. En `Version`, elegir `Nueva version`.
5. Confirmar:

```text
Ejecutar como: Yo
Quien tiene acceso: Cualquier persona
```

6. Click en `Implementar`.
7. Copiar la URL que termina en `/exec`.

Esa URL va en Render como `VITE_GOOGLE_SCRIPT_URL`.

## 6. Cloudinary

Necesitas estos datos de Cloudinary:

```text
Cloud name
API key
API secret
Upload preset name
```

Donde va cada uno:

```text
Cloud name          -> Apps Script CLOUDINARY_CLOUD_NAME
Cloud name          -> Render VITE_CLOUDINARY_CLOUD_NAME
API key             -> Apps Script CLOUDINARY_API_KEY
API secret          -> Apps Script CLOUDINARY_API_SECRET
Upload preset name  -> Render VITE_CLOUDINARY_UPLOAD_PRESET
```

El upload preset debe ser unsigned y guardar en la carpeta:

```text
runa
```

## 7. Render

Como Render va a servir solo el frontend, en Render solo van variables publicas `VITE_`.

En Render > Environment agregar:

```text
VITE_GOOGLE_SCRIPT_URL=la_url_de_apps_script_terminada_en_exec
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name_de_cloudinary
VITE_CLOUDINARY_UPLOAD_PRESET=el_nombre_del_upload_preset_unsigned
```

No poner en Render:

```text
API_TOKEN
ADMIN_EMAIL
ADMIN_PASSWORD
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

Esos valores privados viven solo en Apps Script.

## 8. Probar

1. Deployar el frontend en Render.
2. Abrir `/new-menu`.
3. Abrir `/admin`.
4. Entrar con el `ADMIN_EMAIL` y `ADMIN_PASSWORD` que cargaste en Apps Script.
5. Crear un producto de prueba escondido.
6. Confirmar que aparece en la hoja `products`.
7. Subir una imagen de prueba.
8. Confirmar que aparece en Cloudinary dentro de la carpeta `runa`.

## Migracion

`/menu` queda intacto. `/new-menu` usa el catalogo dinamico.

Cuando `/new-menu` este probado, el reemplazo final es cambiar la ruta `/menu` para que renderice `NewMenu`.
