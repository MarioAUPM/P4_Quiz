const readline = require('readline');
console.log("CORE quiz");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'quiz> '
});

rl.prompt();

rl.on('line', (line) => {

  let args = line.split(" ");
  let cmd = args[0].toLowerCase().trim();

  switch (cmd) {


    case '':
      rl.prompt();
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
      showCmd(args[1]);
      break;

    case 'delete':
      deleteCmd(args[1]);
      break;

    case 'edit':
      editCmd(args[1]);
      break;

    case 'test':
      testCmd(args[1]);
      break;

    case 'play':
    case 'p':
      playCmd();
      break;

    case 'credits':
      creditsCmd();
      break;


    default:
      console.log(`Comando desconocido: '${cmd}'`);
      console.log(`Use help o h para ver los comandos disponibles.`);
        rl.prompt();
      break;
  }
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
    rl.prompt();
}

const quitCmd = () => {
    rl.close();
}

const addCmd = () => {
    console.log("Añadir pregunta.");
    rl.prompt();
}

const listCmd = () => {
    console.log("Mostrar lista de preguntas.");
    rl.prompt();
}

const showCmd = id => {
    console.log("Muestra la pregunta y la respuesta deseadas.");
    rl.prompt();
}

const deleteCmd = id => {
    console.log("Borra la pregunta deseada.");
    rl.prompt();
}

const editCmd = id => {
    console.log("Edita la pregunta deseada.");
    rl.prompt();
}

const testCmd = id => {
    console.log("Prueba la pregunta deseada.");
    rl.prompt();
}

const playCmd = () => {
    console.log("Jugar al juego.");
    rl.prompt();
}

const creditsCmd = () => {
    console.log("\nAutor:");
    console.log("Mario Arroyo Benito.\n");
    rl.prompt();
}

