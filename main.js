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
      helpCmd();
      break;

    case 'quit':
    case 'q':
      quitCmd();
      break;

    case 'add':
      addCmd();
      break;

    case 'list':
      listCmd();
      break;

    case 'show':
      showCmd();
      break;

    case 'delete':
      deleteCmd();
      break;

    case 'edit':
      editCmd();
      break;

    case 'test':
      testCmd();
      break;

    case 'play':
    case 'p':
      playCmd();
      break;

    case 'credits':
      creditsCmd();
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

const helpCmd = () => {
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
}

const quitCmd = () => {
    rl.close();
}

const addCmd = () => {
    console.log("Añadir pregunta.");
}

const listCmd = () => {
    console.log("Mostrar lista de preguntas.");
}

const showCmd = () => {
    console.log("Muestra la pregunta y la respuesta deseadas.");
}

const deleteCmd = () => {
    console.log("Borra la pregunta deseada.");
}

const editCmd = () => {
    console.log("Edita la pregunta deseada.");
}

const testCmd = () => {
    console.log("Prueba la pregunta deseada.");
}

const playCmd = () => {
    console.log("Jugar al juego.");
}

const creditsCmd = () => {
    console.log("\nAutor:");
    console.log("Mario Arroyo Benito.\n");
}

