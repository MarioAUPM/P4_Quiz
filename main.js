const readline = require('readline');
console.log("CORE quiz");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'quiz> '
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {


    case '':
      break;

    case 'help':
    case 'h':
      console.log("\nCommandos:");
      console.log(" h|help - Muestra el menú de ayuda.");
      console.log(" list - Muestra la lista de quizzes existentes.");
      console.log(" show <id> - Muestra la pregunta y la respuesta del quiz seleccionado.");
      console.log(" add - Añade un nuevo quiz interactivamente.");
      console.log(" delete <id> - Borra el quiz indicado.");
      console.log(" edit <id> - Edita el quiz indicado.");
      console.log(" test <id> - Prueba el test indicado.");
      console.log(" p|play - Inicia el juego de preguntas aleatorias.");
      console.log(" credits - Muestra los créditos.");
      console.log(" q|quit - Salir de la aplicación.");
      break;

    case 'quit':
    case 'q':
      rl.close();
      break;

    case 'add':
      console.log("Añadir pregunta.");
      break;

    case 'list':
      console.log("Mostrar lsita de preguntas.");
      break;

    case 'show':
      console.log("Muestra la pregunta y la respuesta deseadas.");
      break;

    case 'delete':
      console.log("Borra la pregunta deseada.");
      break;

    case 'edit':
      console.log("Edita la pregunta deseada.");
      break;

    case 'test':
      console.log("Prueba la pregunta deseada.");
      break;

    case 'play':
    case 'p':
      console.log("Jugar al juego.");
      break;

    case 'credits':
      console.log("\nAutor");
      console.log("Mario Arroyo Benito.");
      break;


    default:
      console.log(`Comando desconocido: '${line.trim()}'`);
      console.log(`Use help o h para ver los comandos disponibles.`);
      break;
  }
  rl.prompt();
})
.on('close', () => {
  console.log('Adios!');
  process.exit(0);
});