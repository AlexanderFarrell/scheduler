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
exports.project_router = void 0;
var express_1 = require("express");
var ServerHelper_1 = require("../../../Modules/ServerHelper");
var project_data_1 = require("./project_data");
exports.project_router = (0, express_1.Router)();
exports.project_router.get("/create", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                data = (req.query['parent'] ? { parent: req.query['parent'] } : {});
                if (req.query['category']) {
                    data['category'] = req.query['category'];
                }
                _a = data;
                _b = 'projects';
                return [4 /*yield*/, project_data_1.Project.get_last_24_hours(req.session['username'])];
            case 1:
                _a[_b] = _c.sent();
                (0, ServerHelper_1.RenderTemplate)(req, res, 'Portfolio', 'portfolio/create.ejs', data);
                return [2 /*return*/];
        }
    });
}); });
exports.project_router.post('/create', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, category, child, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, title = _a.title, category = _a.category;
                if (!(0, ServerHelper_1.IsNotNull)(req, res, title, category)) {
                    (0, ServerHelper_1.RenderTemplate)(req, res, 'Portfolio', 'portfolio/create.ejs', { error: "Please enter all fields" });
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                return [4 /*yield*/, project_data_1.Project.add(title, req.session['username'], category)];
            case 2:
                _b.sent();
                if (!(req.body['parent'] != null)) return [3 /*break*/, 5];
                return [4 /*yield*/, project_data_1.Project.get(title, req.session['username'])];
            case 3:
                child = _b.sent();
                return [4 /*yield*/, project_data_1.Project.set_parent(child, req.session['username'], req.body['parent'])];
            case 4:
                _b.sent();
                // res.redirect('/portfolio/Project/create?category=' + category)
                res.redirect("/portfolio/project/create?category=".concat(category, "&parent=").concat(req.body['parent']));
                return [3 /*break*/, 6];
            case 5:
                // res.redirect('/portfolio')
                res.redirect('/portfolio/project/create?category=' + category);
                _b.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                e_1 = _b.sent();
                console.error(e_1);
                (0, ServerHelper_1.RenderTemplate)(req, res, 'Portfolio', 'portfolio/create.ejs', { error: "Error saving new Project." });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
exports.project_router.post('/update', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var project, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!(0, ServerHelper_1.ContainsBodyArgs)(req, res, 'status', 'time', 'maintenance', 'priority', 'category', 'title')) return [3 /*break*/, 4];
                return [4 /*yield*/, project_data_1.Project.get(req.body['project'], req.session['username'])];
            case 1:
                project = _a.sent();
                return [4 /*yield*/, project_data_1.Project.update(project, req.body['title'], req.body['status'], req.body['time'], req.body['maintenance'], req.body['priority'])];
            case 2:
                _a.sent();
                return [4 /*yield*/, project_data_1.Project.set_category(project, req.body['category'], req.session['username'])];
            case 3:
                _a.sent();
                res.redirect('/portfolio/project/' + req.body['title']);
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                e_2 = _a.sent();
                console.error(e_2);
                res.redirect('/portfolio/project/' + req.body['project']);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports.project_router.post('/update/description', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var project, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!(0, ServerHelper_1.ContainsBodyArgs)(req, res, 'description')) return [3 /*break*/, 3];
                return [4 /*yield*/, project_data_1.Project.get(req.body['project'], req.session['username'])];
            case 1:
                project = _a.sent();
                return [4 /*yield*/, project_data_1.Project.set_description(project, req.body['description'])];
            case 2:
                _a.sent();
                res.redirect('/portfolio/project/' + req.body['project']);
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                e_3 = _a.sent();
                console.error(e_3);
                res.redirect('/portfolio/project/' + req.body['project']);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.project_router.post('/delete', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, project_data_1.Project.delete(req.body['project'], req.session['username'])];
            case 1:
                _a.sent();
                res.redirect('/portfolio');
                return [2 /*return*/];
        }
    });
}); });
exports.project_router.post('/parent', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var project, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, project_data_1.Project.get(req.body['project'], req.session['username'])];
            case 1:
                project = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, project_data_1.Project.set_parent(project, req.session['username'], req.body['parent'])];
            case 3:
                _a.sent();
                res.redirect('/portfolio/project/' + project['title']);
                return [3 /*break*/, 5];
            case 4:
                e_4 = _a.sent();
                console.log(e_4);
                res.redirect('/portfolio');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.project_router.post('/parent/delete', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var project, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                project = project_data_1.Project.get(req.body['project'], req.session['username']);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, project_data_1.Project.remove_parent(project)];
            case 2:
                _a.sent();
                res.redirect('/portfolio/project/' + project['title']);
                return [3 /*break*/, 4];
            case 3:
                e_5 = _a.sent();
                console.log(e_5);
                res.redirect('/portfolio');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.project_router.get('/category/:category', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var projects, on_going, in_dev, not_in_dev, completed, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, project_data_1.Project.get_by_category(req.params['category'], req.session['username'])];
            case 1:
                projects = _a.sent();
                on_going = [];
                in_dev = [];
                not_in_dev = [];
                completed = [];
                projects.forEach(function (project) {
                    if (project['status'] === "On-Going") {
                        on_going.push(project);
                    }
                    else if (project['status'] === "In Development") {
                        in_dev.push(project);
                    }
                    else if (project['status'] == "Completed" || project['status'] === 'Retired') {
                        completed.push(project);
                    }
                    else {
                        not_in_dev.push(project);
                    }
                });
                data = {
                    projects: projects,
                    message: req.params['category'] + " Projects",
                    on_going: on_going,
                    in_dev: in_dev,
                    not_in_dev: not_in_dev,
                    completed: completed,
                    category: req.params['category']
                };
                (0, ServerHelper_1.RenderTemplate)(req, res, req.params['category'] + " Projects", 'portfolio/category_view.ejs', data);
                return [2 /*return*/];
        }
    });
}); });
exports.project_router.post('/category', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var project;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, project_data_1.Project.get(req.body['project'], req.session['username'])];
            case 1:
                project = _a.sent();
                if (!(project != null)) return [3 /*break*/, 3];
                return [4 /*yield*/, project_data_1.Project.set_category(project, req.body['category'], req.session['username'])];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                res.redirect('/portfolio/project/' + req.body['project']);
                return [2 /*return*/];
        }
    });
}); });
exports.project_router.get('/:name', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, render_project_tab(req, res, 'summary.ejs')
                // let title = "error";
                // let data = {};
                // try {
                //     let Project = await Project.get(req.params['name'], req.session['username']);
                //     if (Project != null) {
                //         title = Project['title'];
                //         data['Project'] = Project;
                //     } else {
                //         data['error'] = "Project Not Found";
                //     }
                // } catch (e) {
                //     console.error(e);
                //     data['error'] = "Error loading Project";
                // }
                //
                // RenderTemplate(req, res, `${title} - Projects`, 'portfolio/Project.ejs', data);
            ];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.project_router.get('/:name/summary', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, render_project_tab(req, res, 'summary.ejs')];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.project_router.get('/:name/documents', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, render_project_tab(req, res, 'documents.ejs')];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.project_router.get('/:name/deliverables', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, render_project_tab(req, res, 'deliverables.ejs')];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.project_router.get('/:name/related', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, render_project_tab(req, res, 'related.ejs')];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.project_router.get('/:name/news', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, render_project_tab(req, res, 'news.ejs')];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
function render_project_tab(req, res, tab, data) {
    if (data === void 0) { data = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var title, project, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    title = "error";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, project_data_1.Project.get(req.params['name'], req.session['username'])];
                case 2:
                    project = _a.sent();
                    if (project != null) {
                        title = project['title'];
                        data['project'] = project;
                        data['tab'] = tab;
                    }
                    else {
                        data['error'] = "Project Not Found";
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_6 = _a.sent();
                    console.error(e_6);
                    data['error'] = "Error loading Project";
                    return [3 /*break*/, 4];
                case 4:
                    (0, ServerHelper_1.RenderTemplate)(req, res, "".concat(title, " - Projects"), "portfolio/project2.ejs", data);
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=project_api.js.map