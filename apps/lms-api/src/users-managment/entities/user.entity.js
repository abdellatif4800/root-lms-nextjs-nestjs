"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
var users_models_1 = require("../../common/models/users.models");
var roadmap_entity_1 = require("../../roadmaps-managment/entities/roadmap.entity");
var tutorial_entity_1 = require("../../tutorials-management/entities/tutorial.entity");
var typeorm_1 = require("typeorm");
var Users = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('users')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _username_decorators;
    var _username_initializers = [];
    var _username_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _password_decorators;
    var _password_initializers = [];
    var _password_extraInitializers = [];
    var _isBlocked_decorators;
    var _isBlocked_initializers = [];
    var _isBlocked_extraInitializers = [];
    var _role_decorators;
    var _role_initializers = [];
    var _role_extraInitializers = [];
    var _tutorials_decorators;
    var _tutorials_initializers = [];
    var _tutorials_extraInitializers = [];
    var _roadmaps_decorators;
    var _roadmaps_initializers = [];
    var _roadmaps_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var Users = _classThis = /** @class */ (function () {
        function Users_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.username = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _username_initializers, void 0));
            this.email = (__runInitializers(this, _username_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.password = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _password_initializers, void 0));
            this.isBlocked = (__runInitializers(this, _password_extraInitializers), __runInitializers(this, _isBlocked_initializers, void 0));
            this.role = (__runInitializers(this, _isBlocked_extraInitializers), __runInitializers(this, _role_initializers, void 0));
            this.tutorials = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _tutorials_initializers, void 0));
            this.roadmaps = (__runInitializers(this, _tutorials_extraInitializers), __runInitializers(this, _roadmaps_initializers, void 0));
            /** Timestamps */
            this.createdAt = (__runInitializers(this, _roadmaps_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return Users_1;
    }());
    __setFunctionName(_classThis, "Users");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _username_decorators = [(0, typeorm_1.Column)()];
        _email_decorators = [(0, typeorm_1.Column)()];
        _password_decorators = [(0, typeorm_1.Column)()];
        _isBlocked_decorators = [(0, typeorm_1.Column)({ default: false })];
        _role_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: users_models_1.UserRole,
                default: users_models_1.UserRole.USER,
            })];
        _tutorials_decorators = [(0, typeorm_1.OneToMany)(function () { return tutorial_entity_1.Tutorial; }, function (tutorial) { return tutorial.author; })];
        _roadmaps_decorators = [(0, typeorm_1.OneToMany)(function () { return roadmap_entity_1.Roadmap; }, function (roadmap) { return roadmap.author; })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)({ default: new Date() })];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _username_decorators, { kind: "field", name: "username", static: false, private: false, access: { has: function (obj) { return "username" in obj; }, get: function (obj) { return obj.username; }, set: function (obj, value) { obj.username = value; } }, metadata: _metadata }, _username_initializers, _username_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
        __esDecorate(null, null, _isBlocked_decorators, { kind: "field", name: "isBlocked", static: false, private: false, access: { has: function (obj) { return "isBlocked" in obj; }, get: function (obj) { return obj.isBlocked; }, set: function (obj, value) { obj.isBlocked = value; } }, metadata: _metadata }, _isBlocked_initializers, _isBlocked_extraInitializers);
        __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: function (obj) { return "role" in obj; }, get: function (obj) { return obj.role; }, set: function (obj, value) { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
        __esDecorate(null, null, _tutorials_decorators, { kind: "field", name: "tutorials", static: false, private: false, access: { has: function (obj) { return "tutorials" in obj; }, get: function (obj) { return obj.tutorials; }, set: function (obj, value) { obj.tutorials = value; } }, metadata: _metadata }, _tutorials_initializers, _tutorials_extraInitializers);
        __esDecorate(null, null, _roadmaps_decorators, { kind: "field", name: "roadmaps", static: false, private: false, access: { has: function (obj) { return "roadmaps" in obj; }, get: function (obj) { return obj.roadmaps; }, set: function (obj, value) { obj.roadmaps = value; } }, metadata: _metadata }, _roadmaps_initializers, _roadmaps_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Users = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Users = _classThis;
}();
exports.Users = Users;
