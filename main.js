const readline = require('readline');

const figlet = require('figlet');
const chalk = require('chalk');

/*
Da color a un string

@param msg      String al que se le da color.
@param color    Color del que se pinta el string.
@returns {string} String coloreado del color indicado
 */

const colorize = (msg,color) => {
    if (typeof color !== "undefined"){
        msg = chalk[color].bold(msg);
    }
    return msg;
}

/*
Escribe un mensaje de log

@param msg      String a escribir
@param color    color del que se escribirá
 */

const log = (msg,color) => {
    console.log(colorize(msg,color));
}

/*
Escribe un mensaje de log grande

@param msg      Es el string a colorear y agrandar
@param color    Es el color del que se quiere poner el string
 */

const biglog = (msg,color) => {
    log(figlet.textSync(msg, { horizontalLayout: 'full'}), color);
}

/*
Escribe el mensaje de error emsg.

@param emsg     mensaje de error.
 */

const errorlog = (emsg) => {
    console.log(`${colorize("Error", "red")}: ${colorize(colorize(emsg, "red"), "bgYellowBright")}`);
}

//Mensaje inicial
biglog('CORE quiz', 'green');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'quiz> ',
  completer: (line) => {
    const completions = 'h help add delete show edit list test p play credits q quit'.split(' ');
      const hits = completions.filter((c) => c.startsWith(line)
      )
      ;
      // show all completions if none found
      return [hits.length ? hits : completions, line];
  }
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

