const Sequelize = require('sequelize');
const {log, biglog, errorlog, colorize} = require("./out");
const {models} = require ('./model');

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
    models.quiz.findAll()
    .each(quiz => {
            log(`  [${colorize(quiz.id, 'magenta')}]  ${quiz.question}`);
    })
    .catch(error => {
        errorlog(error,message);
    })
    .then(() => {
        rl.prompt();
    });
};

/*
Esta funcion devuelve una promesa que:
 -Valida que se ha introducido un valor para el parámetro.
 -Convierte el parámetro en un número entero.
 Si todo va bien, la promesa se satisface y devuelve el valor de id a usar.

 @param id Parámetro con el índice a validar.
 */

const validateId = id => {
    return new Sequelize.Promise((resolve, reject) => {
        if (typeof id === "undefined") {
            reject(new Error(`Falta el parámetro <id>.`));
        }else{
            id = parseInt(id);
            if (Number.isNaN(id)){
                reject(new Error(`El valor del parámetro <id> no es un número.`));
            }else{
                resolve(id);
            }
        }
    });
};

/*
Muestra una pregunta y su respuesta

@param rl       Objeto readline para implementar en el CLI.
@param id      identificador de la pregunta que se quiere mostrar
 */
exports.showCmd = (rl,id) => {

    validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
            if (!quiz) {
                throw new Error(`No existe un quiz asociado al id=${id}.`);
            }
            log(`  [${colorize(quiz.id, 'magenta')}]:  ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        })
        .catch(error => {
            errorlog(error.message);
        })
        .then(() => {
            rl.prompt();
        });

};

/*
Esta funcion convierte la llamada rl.question, basada en callbacjs, en una llamada basada en promesas.
@param rl Objeto readline usado para implementar el CLI.
@param text Pregunta que hay que hacerle al usuario.
 */

const makeQuestion = (rl, text) => {
    return new Sequelize.Promise((resolve, reject) => {
        rl.question(colorize(text, 'red'), answer => {
            resolve(answer.trim());
        });
    });
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

    makeQuestion(rl, ' Introduzca la pregunta: ')
        .then(q => {
            return makeQuestion(rl, ' Introduzca la respuesta ')
                .then(a => {
                    return {question: q, answer: a};
                });
        })
        .then(quiz => {
            return models.quiz.create(quiz);
        })
        .then((quiz) => {
            log(` ${colorize('Se ha añadido', 'magenta')}: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        })
        .catch(Sequelize.ValidationError, error => {
            errorlog('El quiz es erroneo:');
            error.errors.forEach(({message}) => errorlog(message));
        })
        .catch(error => {
            errorlog(error.message);
        })
        .then(() => {
            rl.prompt();
        });
};

/*
Borra una pregunta

@param rl       Objeto readline para implementar en el CLI.
@param id       identificador de la pregunta que se va a borrar
 */
exports.deleteCmd = (rl,id) => {
    validateId(id)
        .then(id => models.quiz.destroy({where: {id}}))
        .catch(error => {
            errorlog(error.message);
        })
        .then(() => {
            rl.prompt();
        })
};

/*
Edita una pregunta existente

@param rl       Objeto readline para implementar en el CLI.
@param id       identificador de la pregunta que se va a editar
 */
exports.editCmd = (rl,id) => {
    validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
            if(!quiz){
                throw new Error(`No existe un quiz asociado al id=${id}.`);
            }

            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)}, 0);
            return makeQuestion(rl, ' Introduzca la pregunta: ')
                .then(q => {
                    process.stdout.isTTY && setTimeout(()=> {rl.write(quiz.answer)}, 0);
                    return makeQuestion(rl, ' Introduzca la respuesta ')
                        .then(a => {
                            quiz.question = q;
                            quiz.answer = a;
                            return quiz;
                        });
                });
        })
        .then(quiz => {
            return quiz.save();
        })
        .then(quiz => {
            log(` Se ha cambiado el quiz ${colorize(quiz.id, 'magenta')} por: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        })
        .catch(Sequelize.ValidationError, error => {
            errorlog('El quiz es erroneo:');
            error.errors.forEach(({message}) => errorlog(message));
        })
        .catch(error => {
            errorlog(error.message);
        })
        .then(() => {
            rl.prompt();
        })
};

/*
Prueba una pregunta existente

@param rl       Objeto readline para implementar en el CLI.
@param id       identificador de la pregunta que se va a pobar
 */
exports.testCmd = (rl,id) => {
    /*if(typeof id === "undefined"){
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
    }*/


};

/*
Inicia el modo de juego de preguntas aleatorias

@param rl       Objeto readline para implementar en el CLI.
 */
exports.playCmd = rl => {

    let score = 0;

    let toBeResolved =[];

    const turno =() => {
        return new Promise((resolve, reject) => {
            if(toBeResolved.length <=0){
                console.log(`No hay nada mas que preguntar.\nFin del juego. Aciertos: ${score}`);
                biglog(score,'magenta');
                resolve();
                rl.prompt();
                return;
            }
            let pos =  Math.floor(Math.random()*toBeResolved.length);
            let quiz = toBeResolved[pos];
            toBeResolved.splice(pos,1);

            makeQuestion(rl, quiz.question)
            .then(answer => {
                if(answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim()){
                    score++;
                    console.log(`CORRECTO - Lleva ${score} 'aciertos`);
                    resolve(playOne());
                }else{
                    console.log(`INCORRECTO.\nFin del juego. Aciertos: ${score}`);
                    biglog(score,'magenta');
                    rl.prompt();
                    resolve();
                }
            })
        })
    }
    rl.prompt();
    turno();

    /*let score = 0;
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
    turno();*/
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