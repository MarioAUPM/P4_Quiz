const {log, biglog, errorlog, colorize} = require("./out");
const model = require ('./model');

/*
Muestra la pantalla de ayuda con los comandos a usar.

@param rl       Objeto readline para implementar en el CLI.
 */
exports.helpCmd = rl => {
    log("\nCommandos:");
    log(`${colorize("h|help",'yellow')} - Muestra el menú de ayuda.`);
    log(`${colorize("list",'yellow')} - Muestra la lista de quizzes existentes.`);
    log(`${colorize("show",'yellow')} ${colorize("<id>",'blue')} - Muestra la pregunta y la respuesta del quiz seleccionado.`);
    log(`${colorize("add",'yellow')} - Añade un nuevo quiz interactivamente.`);
    log(`${colorize("delete",'yellow')} ${colorize("<id>",'blue')} - Borra el quiz indicado.`);
    log(`${colorize("edit",'yellow')} ${colorize("<id>",'blue')} - Edita el quiz indicado.`);
    log(`${colorize("test",'yellow')} ${colorize("<id>",'blue')}  - Prueba el test indicado.`);
    log(`${colorize("p|play",'yellow')} - Inicia el juego de preguntas aleatorias.`);
    log(`${colorize("credits",'yellow')} - Muestra los créditos.`);
    log(`${colorize("q|quit",'yellow')} - Salir de la aplicación.`);
    log("");
    rl.prompt();
};

/*
Muestra por linea de comandos la lista de preguntas añadidas

@param rl       Objeto readline para implementar en el CLI.
 */
exports.listCmd = rl => {
    log("Mostrar lista de preguntas.",'red');
    rl.prompt();
};


/*
Muestra una pregunta y su respuesta

@param rl       Objeto readline para implementar en el CLI.
@param id      identificador de la pregunta que se quiere mostrar
 */
exports.showCmd = (rl,id) => {
    log("Muestra la pregunta y la respuesta deseadas.",'red');
    rl.prompt();
};

/*
Permite al usuario añadir una pregunta al juego

@param rl       Objeto readline para implementar en el CLI.
 */
exports.addCmd = rl => {
    log("Añadir pregunta.",'red');
    rl.prompt();
};

/*
Borra una pregunta

@param rl       Objeto readline para implementar en el CLI.
@param id       identificador de la pregunta que se va a borrar
 */
exports.deleteCmd = (rl,id) => {
    log("Borra la pregunta deseada.",'red');
    rl.prompt();
};

/*
Edita una pregunta existente

@param rl       Objeto readline para implementar en el CLI.
@param id       identificador de la pregunta que se va a editar
 */
exports.editCmd = (rl,id) => {
    log("Edita la pregunta deseada.",'red');
    rl.prompt();
};

/*
Prueba una pregunta existente

@param rl       Objeto readline para implementar en el CLI.
@param id       identificador de la pregunta que se va a pobar
 */
exports.testCmd = (rl,id) => {
    log("Prueba la pregunta deseada.",'red');
    rl.prompt();
};

/*
Inicia el modo de juego de preguntas aleatorias

@param rl       Objeto readline para implementar en el CLI.
 */
exports.playCmd = rl => {
    log("Jugar al juego.",'red');
    rl.prompt();
};

/*
Muestra los créditos de la aplicación

@param rl       Objeto readline para implementar en el CLI.
 */
exports.creditsCmd = rl => {
    log("\nAutor:");
    log("Mario Arroyo Benito.\n");
    rl.prompt();
};

/*
Sale de la aplicación mostrando un mensaje de despedida

@param rl       Objeto readline para implementar en el CLI.
 */
exports.quitCmd = rl => {
    rl.close();
};