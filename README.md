# SEO Analyzer



# 🧩 Instalación

Todas las instalaciones de paquetes deben realizarse manualmente en cada repositorio o módulo.  
No se  utilizar workspaces para evitar compartir los directorios `node_modules` en producción, ya que esto puede provocar conflictos o errores con dependencias compartidas entre proyectos.


## 🔗 Uso de `npm link`

Para utilizar los *packages* locales en distintos repositorios durante el desarrollo, se recomienda usar el comando `npm link`.

```bash
# En el paquete que querés compartir
npm link

# En el repositorio donde lo vas a usar
npm link nombre-del-package
```

# Desploy
Una vez que los packages estén listos para producción, deben publicarse mediante npm publish.
Antes de hacerlo, asegurate de actualizar la versión en el archivo package.json siguiendo las reglas de versionado semántico.

```bash
# Ejemplo: aumentar la versión menor
npm version minor

# Publicar el paquete
npm publish
````