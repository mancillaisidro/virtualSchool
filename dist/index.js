"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
// Configurar body-parser para analizar las solicitudes JSON
app.use(body_parser_1.default.json());
const port = 3000;
// definiendo ruta para los courses
app.use("/virtualschool/courses", require("./routes/courses"));
app.get((''), (request, response) => {
    response.json('Server Running');
});
app.listen(port, () => {
    console.log(`Express Server listening on port:  ${port}`);
});
