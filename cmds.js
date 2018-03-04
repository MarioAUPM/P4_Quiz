const {log, biglog, errorlog, colorize} = require("./out");
const model = require ('./model');

/*
Muestra la pantalla de ayuda con los comandos a usar.

@param rl       Objeto readline para implementar en el CLI.
 */
exports.helpCmd = rl => {
    log("Commandos:");
    log(`  h|help - Muestra esta ayuda.`);
    log(`  list - Listar los quizzes existentes.`);
    log(`  show <id>- Muestra la pregunta y la respuesta del quiz seleccionado.`);
    log(`  add - Añade un nuevo quiz interactivamente.`);
    log(`  delete <id> - Borrar el quiz indicado.`);
    log(`  edit <id> - Editar el quiz indicado.`);
    log(`  test <id> - Probar el quiz indicado.`);
    log(`  p|play - Jugar a preguntar aleatoriamente todos los quizzes.`);
    log(`  credits - Créditos.`);
    log(`  q|quit - Salir del programa.`);
    rl.prompt();
};

/*
Muestra por linea de comandos la lista de preguntas añadidas

@param rl       Objeto readline para implementar en el CLI.
 */
exports.listCmd = rl => {

    model.getAll().forEach((quiz,id) => {
        log(` [${colorize(id,'magenta')}]: ${quiz.question}`);
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
        errorlog(`El valor del parámetro id no es válido`);
    }else{
        try{
            const quiz =model.getByIndex(id);
            log(` [${colorize(id,'magenta')}]: ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer}`);
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
    rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

        rl.question(colorize(' Introduzca la respuesta: ', 'red'), answer => {
            model.add(question, answer);
            log(` ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
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
        errorlog(`El valor del parámetro id no es válido`);
        rl.prompt();
    }else{
        try{
            const quiz = model.getByIndex(id);

            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);

            rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

                process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);

                rl.question(colorize(' Introduzca la respuesta: ', 'red'), answer => {
                    model.update(id,question, answer);
                    log(` Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
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
        errorlog(`El valor del parámetro id no es válido`);
        rl.prompt();
    }else{
        try{
            const quiz = model.getByIndex(id);

            rl.question(colorize(quiz.question + "? ", 'red'), answer => {


                if(answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim()){
                    log("Su respuesta es correcta");
                    biglog(`Correcta`,'green');
                    rl.prompt();
                }else{
                    log("Su respuesta es incorrecta");
                    biglog(`Incorrecta`,'red');
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

    let score = 0;
    toBeResolved = model.getAll();
    const MAX_NUM = toBeResolved.length;

    if(MAX_NUM<1){
        errorlog("No hay preguntas.");
    }
    //Una vez se ha comprobado que haya más de 0 preguntas, se inicia el juego
    const turno = () => {
        if (toBeResolved.length === 0){
            log("No hay nada más que preguntar.");
            log(`Fin del juego. Aciertos: ${score}`);
            biglog(score,'magenta');
            rl.prompt();
            return;
        } else {

            let id = Math.floor(Math.random()*toBeResolved.length);
            const quiz = toBeResolved[id];
            toBeResolved.splice(id,1);
            rl.question(colorize(quiz.question + "? ", 'red'), answer => {


                if(answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim()){
                    score++;
                    log(`CORRECTO - Lleva ${score} aciertos.`);
                    turno();
                    rl.prompt();
                    return;
                }else{
                    log(`INCORRECTO.`);
                    log(`Fin del juego. Aciertos: ${score}`);
                    biglog(score,'magenta');
                    rl.prompt();
                    return;
                }
            });

        }
    }
    rl.prompt();
    turno();
};

/*
Muestra los créditos de la aplicación

@param rl       Objeto readline para implementar en el CLI.
 */
exports.creditsCmd = rl => {
    log("Autores de la práctica:");
    log("Mario Arroyo Benito.",'green');
    rl.prompt();
};

/*
Sale de la aplicación mostrando un mensaje de despedida

@param rl       Objeto readline para implementar en el CLI.
 */
exports.quitCmd = rl => {
    rl.close();
};