"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = void 0;
const openai_1 = require("@ai-sdk/openai");
const ai_1 = require("ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function chat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const { messages } = req.body;
        try {
            const result = yield (0, ai_1.streamText)({
                model: (0, openai_1.openai)("gpt-4-turbo"),
                system: `You are a helpful, respectful, and honest assistant.`,
                messages,
            });
            res.writeHead(200, {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked",
                "Cache-Control": "no-cache",
            });
            res.write(" ");
            let fullResponse = "";
            try {
                for (var _d = true, _e = __asyncValues(result.textStream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const delta = _c;
                    fullResponse += delta;
                    res.write(delta);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            res.end();
            messages.push({ role: "assistant", content: fullResponse });
        }
        catch (error) {
            console.error("Error while processing the chat request:", error);
            res.status(500).json({ error: "An error occurred" });
        }
    });
}
exports.chat = chat;
// async (req: Request, res: Response)=> {
//   try {
//     const { messages } = req.body
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       stream: true,
//       messages,
//     })
//     const stream = OpenAIStream(response)
//     const streamingResponse = new StreamingTextResponse(stream)
//     streamingResponse.pipe(res)
//   } catch (error: any) {
//     res.status(500).json({ error: error.message })
//   }
// })
