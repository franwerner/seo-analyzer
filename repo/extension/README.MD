# ENV:
- VITE_BACKEND_URL


## Uso del dominio en producción

Se debe utilizar la ruta **`{VERCEL_URL}/backend`** para acceder al backend y aprovechar las credenciales ya almacenadas en el dominio generado por Vercel.
Si se utiliza directamente el dominio del backend, al realizar la solicitudes las credenciales almacenadas en el dominio de vercel no seran enviadas por el navegador.
Ya que justamente pertencen a dominios diferentes.
