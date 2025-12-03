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
exports.Deliverable = void 0;
var Database_1 = require("../../../Modules/Database");
var Deliverable = /** @class */ (function () {
    function Deliverable() {
    }
    Deliverable.GetDeliverables = function (username, options) {
        return __awaiter(this, void 0, void 0, function () {
            var deliverables;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(options['category'] != null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Database_1.Data.Query("select d.title as title,\n                         p.title as project,\n                         d.completed as completed\n             from deliverable d\n             inner join project p on p.id = d.project_id\n--              inner join project_category_link pcl on p.id = pcl.project_id\n             inner join project_category pc on pc.id = p.category_id\n             where p.account_id=(select id from account where username=$1)\n                    and pc.title=$2\n                    and p.priority>=$3\n                    and (d.completed is null or date(d.completed) = current_date)\n             order by d.completed desc ,p.priority desc ;", username, 
                            // options['order'] || 'priority',
                            options['category'], options['min_priority'] || 0)];
                    case 1:
                        deliverables = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, Database_1.Data.Query("select d.title as title,\n                         p.title as project,\n                         d.completed as completed\n             from deliverable d\n             inner join project p on p.id = d.project_id\n--              inner join project_category_link pcl on p.id = pcl.project_id\n             inner join project_category pc on pc.id = p.category_id\n             where p.account_id=(select id from account where username=$1)\n               and p.priority>=$2\n                and (d.completed is null or date(d.completed) = current_date)\n                 order by d.completed desc ,p.priority desc ;", username, 
                        // options['order'] || 'priority',
                        options['min_priority'] || 0)];
                    case 3:
                        deliverables = _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, deliverables.rows];
                }
            });
        });
    };
    Deliverable.AddDeliverable = function (project, deliverable) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database_1.Data.Execute("insert into deliverable (title, project_id) values ($1, $2);", deliverable, project['id'])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Deliverable;
}());
exports.Deliverable = Deliverable;
//# sourceMappingURL=Deliverable.js.map