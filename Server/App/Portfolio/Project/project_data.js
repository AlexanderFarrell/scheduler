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
exports.Project = void 0;
var Database_1 = require("../../../Modules/Database");
var wiki_data_1 = require("../../Wiki/wiki_data");
var doc_templates_1 = require("../doc_templates");
exports.Project = {
    news_per_page: 20,
    get: function (title, username) {
        return __awaiter(this, void 0, void 0, function () {
            var project, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            var _l;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryFirst("select p.id as id,\n                        p.title as title,\n                        description,\n                        time,\n                        status,\n                        maintenance, \n                        priority,\n                        p.account_id as account_id,\n                        parent_id,\n                        created_on,\n                        pc.id as category_id,\n                        case \n                            when category_id is not null then pc.title\n                            else null\n                        end as category            \n                from project p\n                left join project_category pc \n                    on pc.id = p.category_id\n                where p.title=$1 \n                    and p.account_id=\n                            (select id from account where username=$2) \n                order by priority desc \n                limit 1", [title, username])];
                    case 1:
                        project = _m.sent();
                        if (!(project != null)) return [3 /*break*/, 9];
                        _a = project;
                        _b = 'documents';
                        return [4 /*yield*/, Database_1.Data.QueryRows("select w.title  \n                    from wiki w\n                    inner join project_wiki_link pwl on w.id = pwl.wiki_id\n                    where pwl.project_id=$1", [project['id']])];
                    case 2:
                        _a[_b] = _m.sent();
                        _c = project;
                        _d = 'deliverables';
                        return [4 /*yield*/, Database_1.Data.QueryRows("select d.title, d.completed\n                     from deliverable d\n                     where project_id=$1\n                     order by d.completed desc, \n                              d.created_on", [project['id']])];
                    case 3:
                        _c[_d] = _m.sent();
                        _e = project;
                        _f = 'news';
                        return [4 /*yield*/, exports.Project.get_news(project)
                            // Project['children'] = await Project.get_children(Project);
                        ];
                    case 4:
                        _e[_f] = _m.sent();
                        // Project['children'] = await Project.get_children(Project);
                        _g = project;
                        _h = 'children';
                        _l = {};
                        return [4 /*yield*/, exports.Project.get_children_to_do(project)];
                    case 5:
                        _l.todo = _m.sent();
                        return [4 /*yield*/, exports.Project.get_children_completed(project)];
                    case 6:
                        // Project['children'] = await Project.get_children(Project);
                        _g[_h] = (_l.completed = _m.sent(),
                            _l);
                        if (!(project['parent_id'] != null)) return [3 /*break*/, 8];
                        _j = project;
                        _k = 'parent_title';
                        return [4 /*yield*/, Database_1.Data.QueryFirst('select title from Project where id=$1', [project['parent_id']])];
                    case 7:
                        _j[_k] = (_m.sent())['title'];
                        _m.label = 8;
                    case 8: return [2 /*return*/, project];
                    case 9: return [2 /*return*/, null];
                }
            });
        });
    },
    get_last_24_hours: function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select p.title as title,\n                        c.title as category,\n                        p.description as description,\n                        status\n                from project p\n                left join project_category c on p.category_id = c.id\n                where p.account_id=(select id from account where username=$1)\n                    and created_on >= now() - '1 day'::interval\n--                     and p.status='In Development'\n--                     and parent_id is null\n                    order by created_on desc ", [username])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    add: function (title, username, category) {
        return __awaiter(this, void 0, void 0, function () {
            var project;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.Execute("insert into project (title, account_id) values ($1,                                                             (select id from account where username=$2))", title, username)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, exports.Project.get(title, username)];
                    case 2:
                        project = _a.sent();
                        return [4 /*yield*/, exports.Project.set_category(project, category, username)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    update: function (project, title, status, time, maintenance, priority) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (maintenance == "None") {
                            maintenance = null;
                        }
                        return [4 /*yield*/, (Database_1.Data.Execute("update project\n                set title=$1,\n                    status=$2,\n                    time=$3,\n                    maintenance=$4,\n                    priority=$5\n                    where id=$6", title, status, time, maintenance, priority, project['id']))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    set_description: function (project, description) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (Database_1.Data.Execute("update project\n                  set description=$1\n                  where id=$2", description, project['id']))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    delete: function (project, username) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exports.Project.get(project, username)];
                    case 1:
                        data = _a.sent();
                        if (!(data != null)) return [3 /*break*/, 3];
                        // language=PostgreSQL
                        // ts-ignore
                        return [4 /*yield*/, Database_1.Data.Execute("call delete_project($1)", data['id'])];
                    case 2:
                        // language=PostgreSQL
                        // ts-ignore
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    set_category: function (project, category, username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // language=PostgreSQL
                    return [4 /*yield*/, Database_1.Data.Execute("call set_category_to_project($1, $2, $3)", username, category, project.id)];
                    case 1:
                        // language=PostgreSQL
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    set_parent: function (project, username, parent) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (parent == project.title) {
                            throw new Error("Project cannot be its own parent");
                        }
                        if (project == null) {
                            throw new Error("Project is invalid");
                        }
                        return [4 /*yield*/, Database_1.Data.Execute("update project\n                set parent_id=(select id\n                               from project\n                               where title=$1\n                                and account_id=(select id from account where username=$2))\n                where id=$3", parent, username, project['id'])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    remove_parent: function (project) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.Execute("update project\n                 set parent_id=null\n                 where id=$1", project['id'])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    get_children: function (project) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select * \n                 from project\n                 where parent_id=$1", [project['id']])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    get_without_category: function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select title\n                from project p\n                where account_id=(select id from account \n                                            where username=$1)\n                    and category_id is null\n                    and parent_id is null", [username])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    get_in_progress: function (username, with_parent) {
        if (with_parent === void 0) { with_parent = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select p.title as title,\n                        c.title as category,\n                    p.description as description,\n                        status\n                from project p\n                left join project_category c on p.category_id = c.id\n                where c.account_id=(select id from account where username=$1)\n                    and p.status='In Development'\n                    ".concat(with_parent ? "and parent_id is not null" : "and parent_id is null", "\n                    --and parent_id is null\n                    order by priority desc "), [username])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    get_in_progress_category: function (username, category, with_parent) {
        if (with_parent === void 0) { with_parent = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select p.title as title,\n                        c.title as category,\n                    p.description as description,\n                        status\n                from project p\n                left join project_category c on p.category_id = c.id\n                where c.account_id=(select id from account where username=$1)\n                  and p.category_id=(select id from project_category where c.title=$2)\n                    and p.status='In Development'\n                    ".concat(with_parent ? "and parent_id is not null" : "and parent_id is null", "\n                    --and parent_id is null\n                    order by priority desc "), [username])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    get_on_going: function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select p.title as title,\n                        c.title as category,\n                    p.description as description,\n                        status\n                from project p\n                left join project_category c on p.category_id = c.id\n                where c.account_id=(select id from account where username=$1)\n                    and p.status='On-Going'\n                  and parent_id is null\n                    order by priority desc ", [username])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    get_on_going_category: function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select p.title as title,\n                        c.title as category,\n                    p.description as description,\n                        status\n                from project p\n                left join project_category c on p.category_id = c.id\n                where c.account_id=(select id from account where username=$1)\n                  and p.category_id=(select id from project_category where c.title=$2)\n                    and p.status='On-Going'\n                  and parent_id is null\n                    order by priority desc ", [username])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    get_children_to_do: function (project) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select * \n                 from project\n                 where parent_id=$1\n                 and (status='In Development' or status='Not Started' or status='On Hold')", [project['id']])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    get_children_completed: function (project) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select * \n                 from project\n                 where parent_id=$1\n                 and (status='Completed' or status='On-Going' or status='Retired')", [project['id']])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    get_analysis: function (username, options) {
        return __awaiter(this, void 0, void 0, function () {
            var priority, sort, params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        priority = parseInt(options['min_priority']);
                        sort = "priority";
                        if (options['sort'] === 'Time' || options['sort'] === 'Status' || options['sort'] === "Maintenance") {
                            sort = options['sort'];
                            sort += ", priority";
                        }
                        params = [
                            username,
                            (!isNaN(priority)) ? priority : 0,
                        ];
                        if (options['category'] != 'All' && options['category'] != null)
                            params.push(options['category']);
                        return [4 /*yield*/, Database_1.Data.Pool.query("\n            select p.title as project,\n                        c.title as category,\n                        time,\n                        status,\n                        maintenance,\n                        priority\n                 from project p\n                 left join project_category c on c.id = p.category_id\n                 where p.account_id=(select id from account where username=$1)\n                     and p.priority>=$2\n--                          and p.parent_id is null\n                 ".concat(((options['category'] != 'All' && options['category'] != null) ? "and c.title=$3" : ""), "\n                 order by ").concat(sort, " desc;"), params)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.rows];
                }
            });
        });
    },
    get_by_category: function (category, username, filter_children) {
        if (filter_children === void 0) { filter_children = true; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (Database_1.Data.QueryRows("\n                select p.title as title,\n                       pc.title as category,\n                       p.description as description,\n                       status,\n                       parent_id as parent\n                from project p\n                inner join project_category pc on pc.id = p.category_id\n--                          inner join project_category_link pcl on Project.id = pcl.project_id\n                where p.category_id = (select id from project_category where title=$1)\n                  and p.account_id=(select id from account where username=$2)\n                --and p.parent_id is null\n                order by p.priority desc ;", [category, username]))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    add_wiki_page: function (project, title, username, kind) {
        return __awaiter(this, void 0, void 0, function () {
            var content, document_name;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        content = (doc_templates_1.doc_templates.hasOwnProperty(kind)) ? doc_templates_1.doc_templates[kind] : "";
                        document_name = title + " - " + project['title'];
                        return [4 /*yield*/, wiki_data_1.Wiki.add(document_name, content, username)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Database_1.Data.Execute("insert into project_wiki_link (project_id, wiki_id) VALUES \n                                         (\n                                          $1, (select id from wiki where title=$2)\n                                         )", project['id'], document_name)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    get_categories: function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select title\n                from project_category\n                where account_id=(select id from account where username=$1)", [username])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    get_category_counts: function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select c.title as category,\n                        count(*) as count\n                 from project p \n                 inner join project_category c on c.id = p.category_id\n                 where p.account_id=(select id from account where username=$1)\n                 group by c.title", [username])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    get_category_counts_by_status: function (username, status) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select c.title as category,\n                        count(*) as count\n                 from project p \n                 inner join project_category c on c.id = p.category_id\n                 where p.account_id=(select id from account where username=$1)\n                 and status=$2\n                 group by c.title", [username, status])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    get_news: function (project, page) {
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select * from project_news where project_id=$1", [project['id']])];
                    case 1: 
                    // page -= 1
                    // let limit = Project.news_per_page;
                    // let offset = limit * page;
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    get_news_all_projects: function (username, page) {
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.QueryRows("select n.title as title,\n                        p.title as project,\n                        n.date as date,\n                        n.content as content\n                from project_news n \n                inner join project p on p.id = n.project_id\n                where account_id=(select id from account where username=$1) \n                order by n.date desc\n                limit 100", [username])];
                    case 1: 
                    // page -= 1
                    // let limit = Project.news_per_page;
                    // let offset = limit * page;
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    add_news_article: function (project, title, content, date) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.Execute("insert into project_news (title, content, date, project_id) \n                VALUES ($1,\n                        $2,\n                        $3,\n                        $4)", title, content, Database_1.Data.ToSQLDate(date), project['id'])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    // async get_all_by_user(username: string) {
    //     return await Data.QueryRows(
    //         `select *
    //             from Project
    //             where account_id=(select id from account
    //                                         where username=$1)
    //             order by priority desc
    //             limit 100`,
    //         [username]
    //     );
    // },
};
//# sourceMappingURL=project_data.js.map