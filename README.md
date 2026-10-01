# Cartilla del trabajo realizado — GeSSTionamos SAS

Libro digital de una sola página, sin dependencias ni compilación.
Operación a cargo de **Full Nova Digital**.

## Archivos

| Archivo | Contenido |
|---|---|
| `index.html` | Las 17 páginas del libro, con sus diagramas SVG |
| `styles.css` | Sistema de diseño sobre la paleta de marca de GeSSTionamos |
| `app.js` | Motor del libro: paginación, índice, teclado y gestos |
| `img/` | Isotipo y las tres piezas de campaña |

## Cómo se navega

- **Flechas ← →** o los botones de la barra inferior
- **Barra espaciadora** avanza
- **Inicio / Fin** van a la primera y última página
- **Deslizar** a izquierda o derecha en móvil
- El **índice** se abre con el botón de la izquierda
- Cada página tiene su propia dirección: `.../#p8` abre el capítulo de calentamiento

## Publicación

Sitio estático. Funciona en GitHub Pages, Cloudflare Pages o Netlify sin configuración.

## Edición

- **Textos:** en `index.html`, cada página es un `<article class="page">` con sus
  atributos `data-title` y `data-part`, que alimentan el índice y la barra.
- **Colores:** todos los tokens están en `:root`, al comienzo de `styles.css`.
  La paleta se extrajo de las piezas originales de la marca.
- **Agregar una página:** duplicar un `<article class="page">`, cambiar el número
  del encabezado y los atributos `data-`. El índice se genera solo.

## Nota de contenido

El documento describe lo construido, el método y la capacidad operativa.
**No incluye métricas de rendimiento** porque la campaña aún no ha salido al aire:
las cifras reales se construyen con la cuenta del cliente.
