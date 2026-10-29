// SERVIDOR SIMULADO DEL BUFFET
// Recibe pedidos, valida el horario de retiro y devuelve un código de retiro.
// Para correrlo: node server.js

const http = require("http");

// ---------------------------------------------------------------
// DATOS
// ---------------------------------------------------------------

const PUERTO = 3000;

// Horarios en los que se puede retirar el pedido.
// (El turno noche todavía no está confirmado, se agrega cuando se sepa.)
const HORARIOS = [
  { id: "MANANA_RECREO_1", turno: "Mañana", nombre: "Primer recreo", desde: "09:05", hasta: "09:15" },
  { id: "MANANA_RECREO_2", turno: "Mañana", nombre: "Segundo recreo", desde: "10:35", hasta: "10:45" },
  { id: "MANANA_SALIDA", turno: "Mañana", nombre: "Primera hora de salida", desde: "12:05", hasta: "12:05" },
  { id: "TARDE_ESPERA", turno: "Tarde", nombre: "Segunda hora (espera de contraturno)", desde: "12:45", hasta: "13:30" },
  { id: "TARDE_RECREO_1", turno: "Tarde", nombre: "Primer recreo", desde: "14:50", hasta: "15:00" },
  { id: "TARDE_RECREO_2", turno: "Tarde", nombre: "Segundo recreo", desde: "16:20", hasta: "16:30" },
];

// Número con el que arranca el código de retiro
let proximoNumeroCodigo = 8842;

// ---------------------------------------------------------------
// FUNCIONES AUXILIARES
// ---------------------------------------------------------------

// Crea un código de retiro nuevo cada vez que se llama (BE-8842, BE-8843, ...)
function generarCodigo() {
  const codigo = "BE-" + proximoNumeroCodigo;
  proximoNumeroCodigo = proximoNumeroCodigo + 1;
  return codigo;
}

// Busca un horario por su id. Devuelve undefined si no existe.
function buscarHorario(idHorario) {
  return HORARIOS.find(function (horario) {
    return horario.id === idHorario;
  });
}

// Pasa un horario a texto para mostrarlo. Ej: "09:05 - 09:15"
function horarioATexto(horario) {
  if (horario.desde === horario.hasta) {
    return horario.desde;
  }
  return horario.desde + " - " + horario.hasta;
}

// Manda una respuesta en formato JSON
function responderJson(res, codigoHttp, objeto) {
  res.writeHead(codigoHttp, { "Content-Type": "application/json" });
  res.end(JSON.stringify(objeto));
}

// ---------------------------------------------------------------
// ATENCIÓN DE CADA RUTA
// ---------------------------------------------------------------

// GET /horarios -> devuelve la lista de horarios disponibles
function atenderHorarios(res) {
  responderJson(res, 200, { status: 200, horarios: HORARIOS });
}

// POST /pedidos -> recibe un pedido y devuelve el código de retiro
function atenderPedido(req, res) {
  let texto = "";

  // Vamos juntando los pedazos de datos que llegan
  req.on("data", function (pedazo) {
    texto = texto + pedazo;
  });

  // Cuando terminó de llegar todo, procesamos el pedido
  req.on("end", function () {
    const pedido = JSON.parse(texto); // pasamos de texto a objeto

    // Chequeamos que el horario elegido exista
    const horario = buscarHorario(pedido.horario_retiro);
    if (horario === undefined) {
      responderJson(res, 400, {
        status: 400,
        mensaje: "El horario de retiro no es válido",
      });
      return;
    }

    console.log("Llegó el pedido: " + pedido.pedido_id);
    console.log("Alumno: " + pedido.alumno.nombre + " (" + pedido.alumno.curso + ")");
    console.log("Total: $" + pedido.monto_total);
    console.log("Retira en: " + horario.nombre + " (" + horarioATexto(horario) + ")");

    responderJson(res, 200, {
      status: 200,
      mensaje: "Pedido recibido con éxito",
      codigo_retiro: generarCodigo(),
      tiempo_estimado_entrega: horarioATexto(horario),
    });
  });
}

// ---------------------------------------------------------------
// SERVIDOR
// ---------------------------------------------------------------

const servidor = http.createServer(function (req, res) {
  if (req.method === "POST" && req.url === "/pedidos") {
    atenderPedido(req, res);
  } else if (req.method === "GET" && req.url === "/horarios") {
    atenderHorarios(res);
  } else {
    responderJson(res, 404, { status: 404, mensaje: "Ruta no encontrada" });
  }
});

servidor.listen(PUERTO, function () {
  console.log("Servidor listo en http://localhost:" + PUERTO + "/pedidos");
});
