


//AÑADIR socket, EN LAS LLAMADAS A LOG, ERRORLOG Y BIGLOG DE LAS FUNCIONES, ASI COMO EN LA DEFINICION DE ESTAS





const Sequelize = require('sequelize');
const {log, biglog, errorlog, colorize} = require("./out");
const {models} = require ('./model');

/*
Muestra la pantalla de ayuda con los comandos a usar.

@param rl       Objeto readline para implementar en el CLI.
 */
exports.helpCmd = (socket,rl) => {
    log(socket,"Commandos:");
    log(socket,`  h|help - Muestra esta ayuda.`);
    log(socket,`  list - Listar los quizzes existentes.`);
    log(socket,`  show <id>- Muestra la pregunta y la respuesta del quiz seleccionado.`);
    log(socket,`  add - Añade un nuevo quiz interactivamente.`);
    log(socket,`  delete <id> - Borrar el quiz indicado.`);
    log(socket,`  edit <id> - Editar el quiz indicado.`);
    log(socket,`  test <id> - Probar el quiz indicado.`);
    log(socket,`  p|play - Jugar a preguntar aleatoriamente todos los quizzes.`);
    log(socket,`  credits - Créditos.`);
    log(socket,`  q|quit - Salir del programa.`);
    rl.prompt();
};

/*
Muestra por linea de comandos la lista de preguntas añadidas

@param rl       Objeto readline para implementar en el CLI.
 */
exports.listCmd = (socket,rl) => {
    models.quiz.findAll()
    .each(quiz => {
            log(socket,`  [${colorize(quiz.id, 'magenta')}]  ${quiz.question}`);
    })
    .catch(error => {
        errorlog(socket,error,message);
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
exports.showCmd = (socket,rl,id) => {

    validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
            if (!quiz) {
                throw new Error(`No existe un quiz asociado al id=${id}.`);
            }
            log(socket,`  [${colorize(quiz.id, 'magenta')}]:  ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        })
        .catch(error => {
            errorlog(socket,error.message);
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
exports.addCmd = (socket,rl) => {

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
            log(socket,` ${colorize('Se ha añadido', 'magenta')}: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        })
        .catch(Sequelize.ValidationError, error => {
            errorlog(socket,'El quiz es erroneo:');
            error.errors.forEach(({message}) => errorlog(socket,message));
        })
        .catch(error => {
            errorlog(socket,error.message);
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
exports.deleteCmd = (socket,rl,id) => {
    validateId(id)
        .then(id => models.quiz.destroy({where: {id}}))
        .catch(error => {
            errorlog(socket,error.message);
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
exports.editCmd = (socket,rl,id) => {
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
            log(socket,` Se ha cambiado el quiz ${colorize(quiz.id, 'magenta')} por: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        })
        .catch(Sequelize.ValidationError, error => {
            errorlog(socket,'El quiz es erroneo:');
            error.errors.forEach(({message}) => errorlog(message));
        })
        .catch(error => {
            errorlog(socket,error.message);
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
exports.testCmd = (socket,rl,id) => {

    validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
            if (!quiz) {
                throw new Error(`No existe un quiz asociado al id=${id}.`);
            }
            log(socket,` [${colorize(quiz.id, 'magenta')}]: ${quiz.question}`);
            return makeQuestion(rl, 'Introduzca la respuesta: ')
                .then(a => {
                    if(quiz.answer.toLowerCase() === a.toLowerCase().trim()){
                        log(socket,"Su respuesta es correcta");
                        biglog(socket,'Correcta', 'green');
                    } else{
                        log(socket,"Su respuesta es incorrecta");
                        biglog(socket,'Incorrecta', 'red');
                    }
                });

        })
        .catch(error => {
            errorlog(socket,error.message);
        })
        .then(() => {
            rl.prompt();
        });
};

/*
Inicia el modo de juego de preguntas aleatorias

@param rl       Objeto readline para implementar en el CLI.
 */
exports.playCmd = (socket,rl) => {

    //variables
    let score = 0;
    let toBeResolved = [];

    const turno = () => {
        return new Promise((resolve,reject) => {

            if(toBeResolved.length <=0){
                log(socket,"No hay nada mas que preguntar.\nFin del examen. Aciertos:");
                resolve();
                return;
            }
            let pos = Math.floor(Math.random()*toBeResolved.length);
            let quiz = toBeResolved[pos];
            toBeResolved.splice(pos,1);

            makeQuestion(rl, quiz.question+'? ')
                .then(answer => {
                    if(answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim()){
                        score++;
                        log(socket,`CORRECTO - Lleva ${score} aciertos`);
                        resolve(turno());
                    } else {
                        log(socket,"INCORRECTO.\nFin del examen. Aciertos:");
                        resolve();
                    }
                })
        })
    }

    models.quiz.findAll({raw: true})
        .then(quizzes => {
            toBeResolved = quizzes;
        })
        .then(() => {
            return turno();
        })
        .catch(error => {
            errorlog(socket,error);
        })
        .then(() => {
            biglog(socket,score,'magenta');
            rl.prompt();
        })
};

/*
Muestra los créditos de la aplicación

@param rl       Objeto readline para implementar en el CLI.
 */
exports.creditsCmd = (socket,rl) => {
    log(socket,"Autores de la práctica:");
    log(socket,"Mario Arroyo Benito.",'green');
    rl.prompt();
};

/*
Sale de la aplicación mostrando un mensaje de despedida

@param rl       Objeto readline para implementar en el CLI.
 */
exports.quitCmd = (socket,rl) => {
    rl.close();
    socket.end();
};