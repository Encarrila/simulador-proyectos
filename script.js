const outputDiv = document.getElementById("output");
const input = document.getElementById("userInput");
let mensajes = [];
let escenarioCargado = false;

const instruccionesBase = `Sos un simulador de escenarios para que líderes de proyectos practiquen la toma de decisiones. No respondas como asistente ni brindes explicaciones fuera del marco del juego.
[PEGAR TODAS LAS INSTRUCCIONES AQUÍ]`;

mensajes.push({
  role: "system",
  content: instruccionesBase
});

mensajes.push({
  role: "assistant",
  content: "Simulador: Estoy listo. Por favor, cargá el documento del escenario para comenzar."
});

// Leer el archivo .md cargado
function cargarEscenario() {
  const fileInput = document.getElementById("fileInput");
  const archivo = fileInput.files[0];
  if (!archivo) {
    alert("Por favor seleccioná un archivo .md");
    return;
  }

  const lector = new FileReader();
  lector.onload = function (e) {
    const contenido = e.target.result;

    // Agregar el escenario como mensaje del usuario
    mensajes.push({
      role: "user",
      content: `Este es el escenario cargado:\n\n${contenido}`
    });

    outputDiv.innerHTML += `\n\nEscenario cargado. Iniciando simulación...`;

    // Enviar el contenido al modelo
    iniciarSimulacion();
    escenarioCargado = true;
  };

  lector.readAsText(archivo);
}

async function iniciarSimulacion() {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer TU_API_KEY"
    },
    body: JSON.stringify({
      model: "gpt-4-turbo",
      messages: mensajes,
      temperature: 0.7
    })
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;
  mensajes.push({ role: "assistant", content: reply });
  outputDiv.innerHTML += `\n\n${reply}`;
}

async function enviarMensaje() {
  if (!escenarioCargado) {
    alert("Primero cargá un escenario .md para comenzar.");
    return;
  }

  const userMensaje = input.value;
  if (!userMensaje.trim()) return;

  mensajes.push({ role: "user", content: userMensaje });
  outputDiv.innerHTML += `\n\nParticipante: ${userMensaje}`;
  input.value = "";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer TU_API_KEY"
    },
    body: JSON.stringify({
      model: "gpt-4-turbo",
      messages: mensajes,
      temperature: 0.7
    })
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;
  mensajes.push({ role: "assistant", content: reply });
  outputDiv.innerHTML += `\n\n${reply}`;
}
