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

    model.getAll().forEach((quiz,id) => {
        log(`   [${colorize(id,'magenta')}]: ${quiz.question}`);
    });
    rl.prompt();
};


/*
Muestra una pregunta y su respuesta

@param rl       Objeto readline para implementar en el CLI.
@param id      identificador de la pregunta que se quiere mostrar
 */
exports.showCmd = (rl,id) => {
    if(typeof id === "undefined"){
        errorlog(`Falta el parámetro`);
    }else{
        try{
            const quiz =model.getByIndex(id);
            log(`   [${colorize(id,'magenta')}]:    ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer}`);
        }catch(error){
            errorlog(error.message);

        }
    }
    rl.prompt();
};

/*
Permite al usuario añadir una pregunta al juego

Hay que recordar que el funcionamiento de rl.question es asíncrono.
El prompt hay que sacarlo cuando ya se ha terminado la interaccion con el usuario,
es decir, la llamada a rl.prompt() se debe hacer en la callback de la segunda
llamada a rl.question.

@param rl       Objeto readline para implementar en el CLI.
 */
exports.addCmd = rl => {
    rl.question(colorize('  Introduzca una pregunta: ', 'red'), question => {

        rl.question(colorize('  Introduzca la respuesta: ', 'red'), answer => {
            model.add(question, answer);
            log(`   ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
            rl.prompt();
        });
    });
};

/*
Borra una pregunta

@param rl       Objeto readline para implementar en el CLI.
@param id       identificador de la pregunta que se va a borrar
 */
exports.deleteCmd = (rl,id) => {
    if(typeof id === "undefined"){
        errorlog(`Falta el parámetro`);
    }else{
        try{
            model.deleteByIndex(id);
        }catch(error){
            errorlog(error.message);

        }
    }
    rl.prompt();
};

/*
Edita una pregunta existente

@param rl       Objeto readline para implementar en el CLI.
@param id       identificador de la pregunta que se va a editar
 */
exports.editCmd = (rl,id) => {
    if(typeof id === "undefined"){
        errorlog(`Falta el parámetro`);
        rl.prompt();
    }else{
        try{
            const quiz = model.getByIndex(id);

            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);

            rl.question(colorize('  Introduzca una pregunta: ', 'red'), question => {

                process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);

                rl.question(colorize('  Introduzca la respuesta: ', 'red'), answer => {
                    model.update(id,question, answer);
                    log(`   Se ha cambiado el quiz ${colorize(id, 'magenta')} por:   ${question} ${colorize('=>', 'magenta')} ${answer}`);
                    rl.prompt();
                });
            });
        }catch(error){
            errorlog(error.message);
            rl.prompt();

        }
    }
};

/*
Prueba una pregunta existente

@param rl       Objeto readline para implementar en el CLI.
@param id       identificador de la pregunta que se va a pobar
 */
exports.testCmd = (rl,id) => {
    if(typeof id === "undefined"){
        errorlog(`Falta el parámetro`);
        rl.prompt();
    }else{
        try{
            const quiz = model.getByIndex(id);
            log(quiz.question,'yellow');

            rl.question(colorize('  Introduzca la respuesta: ', 'red'), answer => {


                if(answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim()){
                    biglog(`Respuesta correcta`,'green');
                    rl.prompt();
                }else{
                    console.log(0);
                    biglog(`Respuesta incorrecta`,'red');
                    rl.prompt();
                }
            });
        }catch(error){
            errorlog(error.message);
            rl.prompt();

        }
    }


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