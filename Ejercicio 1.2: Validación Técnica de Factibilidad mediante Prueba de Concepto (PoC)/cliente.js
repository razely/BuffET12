// CLIENTE DE PRUEBA
// Manda un pedido al servidor y comprueba que llegue el código de retiro.
// Para correrlo (con el servidor ya prendido): node cliente.js

const URL_PEDIDOS = "http://localhost:3000/pedidos";

// El pedido de ejemplo. El alumno elige en qué horario lo retira.
const pedido = {
  pedido_id: "BE-2024-001",
  alumno: {
    nombre: "Raul Restelli",
    curso: "6to 7ma Computacion",
  },
  items: [
    { id: 101, producto: "Sánguche de Miga", cantidad: 2, precio_unitario: 1200 },
    { id: 204, producto: "Gaseosa 500ml", cantidad: 1, precio_unitario: 800 },
  ],
  monto_total: 3200,
  metodo_pago: "Efectivo",
  horario_retiro: "MANANA_RECREO_2", // segundo recreo del turno mañana
  estado: "PENDIENTE_CONFIRMACION",
};

// Manda un pedido al servidor y devuelve la respuesta ya convertida a objeto
async function enviarPedido(pedidoAEnviar) {
  const respuesta = await fetch(URL_PEDIDOS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pedidoAEnviar),
  });
  return await respuesta.json();
}

// Prueba 1: un pedido correcto tiene que devolver un código de retiro
async function probarPedidoCorrecto() {
  console.log("Prueba 1: pedido con horario válido");
  const datos = await enviarPedido(pedido);
  console.log(datos);

  if (datos.status === 200 && datos.codigo_retiro) {
    console.log("PRUEBA EXITOSA: se recibió el código " + datos.codigo_retiro);
  } else {
    console.log("PRUEBA FALLIDA");
  }
}

// Prueba 2: un pedido con un horario que no existe tiene que ser rechazado
async function probarHorarioInvalido() {
  console.log("\nPrueba 2: pedido con horario inexistente");
  const pedidoMalo = { ...pedido, horario_retiro: "HORARIO_QUE_NO_EXISTE" };
  const datos = await enviarPedido(pedidoMalo);
  console.log(datos);

  if (datos.status === 400) {
    console.log("PRUEBA EXITOSA: el servidor rechazó el horario inválido");
  } else {
    console.log("PRUEBA FALLIDA");
  }
}

async function main() {
  await probarPedidoCorrecto();
  await probarHorarioInvalido();
}

main();
