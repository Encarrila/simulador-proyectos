// Asegúrate de que dotenv esté cargado si es en desarrollo local (no necesario en Vercel)
require('dotenv').config();

// Recuperar la clave de la API desde la variable de entorno
const openaiApiKey = process.env.TU_API_KEY;

if (!openaiApiKey) {
  console.error('No se encontró la clave API de OpenAI.');
  process.exit(1);  // Salir si la clave no está presente
}

// Configura el endpoint de la API de OpenAI
const openaiEndpoint = 'https://api.openai.com/v1/completions';

// Función para interactuar con OpenAI
async function callOpenAI(prompt) {
  try {
    const response = await fetch(openaiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,  // Agrega la API Key al header
      },
      body: JSON.stringify({
        model: 'text-davinci-003',  // Puedes cambiar al modelo que prefieras
        prompt: prompt,             // El mensaje o prompt para enviar a la API
        max_tokens: 150,            // Ajusta el número de tokens según el tamaño de la respuesta que quieras
        temperature: 0.7,           // Ajusta la creatividad de las respuestas
      }),
    });

    // Si la respuesta es exitosa, obtenemos los datos
    if (response.ok) {
      const data = await response.json();
      return data.choices[0].text.trim();  // Devuelve el texto generado por OpenAI
    } else {
      const errorData = await response.json();
      console.error('Error de la API de OpenAI:', errorData);
      return 'Hubo un error con la solicitud a la API.';
    }
  } catch (error) {
    console.error('Error al hacer la solicitud:', error);
    return 'Hubo un error al conectar con la API.';
  }
}

// Inicia el simulador con un mensaje introductorio
async function iniciarSimulador() {
  let turno = 1;
  let contexto = "Estás iniciando un proyecto de marketing digital. ¿Qué decisión tomarás?";
  
  // Imprime el primer turno
  console.log(`TURNO ${turno}: ${contexto}`);
  
  // Llamada a OpenAI para obtener una respuesta basada en el contexto
  const respuesta = await callOpenAI(contexto);
  
  console.log('Respuesta del simulador:', respuesta);

  // Aquí puedes agregar el código para que el simulador interactúe con el jugador
  // por ejemplo, mostrándole las opciones numeradas y pidiéndole que elija una
  // Y luego usar la respuesta de OpenAI para definir qué sucederá en el siguiente turno

  // En este caso, solo estamos mostrando cómo OpenAI puede generar respuestas dinámicas
  // usando el contexto dado.
}

iniciarSimulador();
