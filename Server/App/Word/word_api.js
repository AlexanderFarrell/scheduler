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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.word_api = void 0;
var express_1 = require("express");
var ServerHelper_1 = require("../../Modules/ServerHelper");
var word_data_1 = require("./word_data");
var auth_middleware_1 = require("../Auth/auth_middleware");
exports.word_api = (0, express_1.Router)();
exports.word_api.use(auth_middleware_1.IsLoggedIn);
exports.word_api.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var words, message, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, word_data_1.Word.get_most_recent(req.session['username'], word_data_1.Word.display_count_recent)];
            case 1:
                words = _a.sent();
                message = "Words (Recent ".concat(word_data_1.Word.display_count_recent, ")");
                data = { words: words, message: message };
                (0, ServerHelper_1.RenderTemplate)(req, res, "Words", "words/index", data);
                return [2 /*return*/];
        }
    });
}); });
exports.word_api.get('/id/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var word;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, word_data_1.Word.get(parseInt(req.params['id']), req.session['username'])];
            case 1:
                word = _a.sent();
                (0, ServerHelper_1.RenderTemplate)(req, res, "Words", "words/word", { word: word });
                return [2 /*return*/];
        }
    });
}); });
exports.word_api.get("/add", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var words, message, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, word_data_1.Word.get_recently_added(req.session['username'], word_data_1.Word.display_count_recently_entered)];
            case 1:
                words = _a.sent();
                message = "Words (Recently entered ".concat(word_data_1.Word.display_count_recently_entered, ")");
                data = { words: words, message: message };
                (0, ServerHelper_1.RenderTemplate)(req, res, "Words", "words/add", data);
                return [2 /*return*/];
        }
    });
}); });
exports.word_api.get("/topic", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var topics, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, word_data_1.Word.get_word_counts(req.query['sorting'] || "none", req.session['username'])];
            case 1:
                topics = _a.sent();
                message = "Words by Topic";
                (0, ServerHelper_1.RenderTemplate)(req, res, "Words", "words/topics", { topics: topics, message: message });
                return [2 /*return*/];
        }
    });
}); });
exports.word_api.get("/topic/:topic", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var words, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, word_data_1.Word.get_by_topic(req.params['topic'], req.session['username'])];
            case 1:
                words = _a.sent();
                message = "Words about ".concat(req.params['topic']);
                (0, ServerHelper_1.RenderTemplate)(req, res, "Words", "words/list", { words: words, message: message });
                return [2 /*return*/];
        }
    });
}); });
exports.word_api.post('/edit', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(0, ServerHelper_1.ContainsBodyArgs)(req, res, 'id', 'word', 'content', 'date')) return [3 /*break*/, 2];
                return [4 /*yield*/, word_data_1.Word.update(parseInt(req.body['id']), req.body['title'], req.body['content'], new Date(req.body['date']))];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                res.redirect('/words/id/' + req.body['id']);
                return [2 /*return*/];
        }
    });
}); });
exports.word_api.get('/range', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var years, start, end, words, message, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, word_data_1.Word.get_years(req.session['username'])];
            case 1:
                years = _a.sent();
                if (!(req.query['start'] != null && req.query['end'] != null)) return [3 /*break*/, 3];
                start = new Date(req.query['start']);
                end = new Date(req.query['end']);
                return [4 /*yield*/, word_data_1.Word.get_range(start, end, req.session['username'])];
            case 2:
                words = _a.sent();
                message = "Words between ".concat(start.toLocaleDateString(), " and ").concat(end.toLocaleDateString());
                data = { words: words, message: message, years: years };
                (0, ServerHelper_1.RenderTemplate)(req, res, "Words", "words/range", data);
                return [3 /*break*/, 4];
            case 3:
                (0, ServerHelper_1.RenderTemplate)(req, res, "Words", "words/range", { years: years });
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.word_api.get('/search', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var term, words, message, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(req.query['term'] != null)) return [3 /*break*/, 2];
                term = req.query['term'].toLowerCase();
                return [4 /*yield*/, word_data_1.Word.search(term, req.session['username'])];
            case 1:
                words = _a.sent();
                message = "Words with ".concat(req.query['term']);
                data = { words: words, message: message };
                (0, ServerHelper_1.RenderTemplate)(req, res, "Words", "words/search", data);
                return [3 /*break*/, 3];
            case 2:
                (0, ServerHelper_1.RenderTemplate)(req, res, "Words", "words/search");
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.word_api.get('/browse', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categories;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, word_data_1.Word.get_categories(req.session['username'])];
            case 1:
                categories = _a.sent();
                (0, ServerHelper_1.RenderTemplate)(req, res, "Words", "words_browse", { words: categories });
                return [2 /*return*/];
        }
    });
}); });
exports.word_api.post("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(0, ServerHelper_1.ContainsBodyArgs)(req, res, "title", "content", "date", "number")) return [3 /*break*/, 4];
                if (req.body['title'].length > 30) {
                    (0, ServerHelper_1.RenderTemplate)(req, res, "Words", "words/words", { words: [], message: "Error: Title too long, must be 30 characters or less." });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, word_data_1.Word.add(req.body['date'], req.body['title'], req.body['content'], req.session['username'])];
            case 2:
                _a.sent();
                res.redirect("/words/add");
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.log(e_1);
                (0, ServerHelper_1.RenderTemplate)(req, res, "Words", "words/words", { words: [], message: "Error adding item to database: ".concat(req.body['title'], ". Did not add.") });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=word_api.js.map