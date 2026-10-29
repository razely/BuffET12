# PoC - Pedidos del buffet

Prueba de concepto de la comunicación entre cliente y servidor. El cliente
(`cliente.js`) envía un pedido en formato JSON al servidor simulado
(`server.js`), y el servidor responde con un código de retiro y el horario
en el que se puede retirar el pedido.

## Requisitos

- Node.js versión 18 o superior.
- Los archivos `server.js` y `cliente.js` en la misma carpeta.
- No hace falta instalar ninguna librería.

Para ver si Node está instalado, abrir una terminal y escribir:

    node --version

Tiene que mostrar `v18` o un número mayor. Si no está instalado, se puede
descargar desde https://nodejs.org (versión LTS).

## Cómo correrlo

1. Abrir la carpeta del proyecto en VS Code (Archivo > Abrir carpeta).
2. Abrir una terminal (menú Terminal > Nueva terminal).
3. Iniciar el servidor:

       node server.js

   Tiene que aparecer: `Servidor listo en http://localhost:3000/pedidos`.
   Dejar esta terminal abierta.

4. Abrir una segunda terminal con el botón `+` del panel de terminal.
5. Ejecutar el cliente:

       node cliente.js

## Resultado esperado

En la terminal del cliente:

    Prueba 1: pedido con horario válido
    {
      status: 200,
      mensaje: 'Pedido recibido con éxito',
      codigo_retiro: 'BE-8842',
      tiempo_estimado_entrega: '10:35 - 10:45'
    }
    PRUEBA EXITOSA: se recibió el código BE-8842

    Prueba 2: pedido con horario inexistente
    { status: 400, mensaje: 'El horario de retiro no es válido' }
    PRUEBA EXITOSA: el servidor rechazó el horario inválido

En la terminal del servidor se ven los datos del pedido recibido (alumno,
curso, total y horario de retiro).

El código de retiro aumenta con cada pedido que llega.

## Si algo falla

- **"node: command not found"**: Node.js no está instalado.
- **"fetch is not defined"**: la versión de Node es anterior a la 18.
- **"ECONNREFUSED"**: el servidor no está corriendo. Revisar que la primera
  terminal siga abierta con el mensaje "Servidor listo".
- **"EADDRINUSE"**: el puerto 3000 está ocupado por una ejecución anterior.
  Cerrar esa terminal (o presionar `Ctrl+C`) y volver a iniciar el servidor.
- Para detener el servidor: `Ctrl+C` en su terminal.

## Horarios de retiro

Los horarios disponibles están en la lista `HORARIOS` al principio de
`server.js`. El servidor también los devuelve en `GET /horarios`.