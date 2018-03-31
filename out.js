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
};

/*
Escribe un mensaje de log

@param msg      String a escribir
@param color    color del que se escribirá
 */

const log = (socket,msg,color) => {
    socket.write(colorize(msg,color) + "\n");
};

/*
Escribe un mensaje de log grande

@param msg      Es el string a colorear y agrandar
@param color    Es el color del que se quiere poner el string
 */

const biglog = (socket,msg,color) => {
    log(socket,figlet.textSync(msg, { horizontalLayout: 'full'}), color);
};

/*
Escribe el mensaje de error emsg.

@param emsg     mensaje de error.
 */

const errorlog = (socket,emsg) => {
    socket.write(`${colorize("Error", "red")}: ${colorize(colorize(emsg, "red"), "bgYellowBright")}\n`);
};

exports = module.exports = {
    colorize,
    log,
    biglog,
    errorlog
};