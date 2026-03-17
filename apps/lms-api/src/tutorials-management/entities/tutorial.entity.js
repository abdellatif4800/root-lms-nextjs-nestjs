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
exports.Unit = exports.Tutorial = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("../../users-managment/entities/user.entity");
var roadmap_entity_1 = require("../../roadmaps-managment/entities/roadmap.entity");
var Tutorial = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('tutorials')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _tutorialName_decorators;
    var _tutorialName_initializers = [];
    var _tutorialName_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _level_decorators;
    var _level_initializers = [];
    var _level_extraInitializers = [];
    var _thumbnail_decorators;
    var _thumbnail_initializers = [];
    var _thumbnail_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _author_decorators;
    var _author_initializers = [];
    var _author_extraInitializers = [];
    var _roadmapNodes_decorators;
    var _roadmapNodes_initializers = [];
    var _roadmapNodes_extraInitializers = [];
    var _authorId_decorators;
    var _authorId_initializers = [];
    var _authorId_extraInitializers = [];
    var _units_decorators;
    var _units_initializers = [];
    var _units_extraInitializers = [];
    var _publish_decorators;
    var _publish_initializers = [];
    var _publish_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var Tutorial = _classThis = /** @class */ (function () {
        function Tutorial_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.tutorialName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _tutorialName_initializers, void 0));
            this.description = (__runInitializers(this, _tutorialName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.level = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _level_initializers, void 0));
            this.thumbnail = (__runInitializers(this, _level_extraInitializers), __runInitializers(this, _thumbnail_initializers, void 0));
            this.category = (__runInitializers(this, _thumbnail_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.author = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _author_initializers, void 0));
            // 🔹 Roadmap nodes referencing this tutorial
            this.roadmapNodes = (__runInitializers(this, _author_extraInitializers), __runInitializers(this, _roadmapNodes_initializers, void 0));
            this.authorId = (__runInitializers(this, _roadmapNodes_extraInitializers), __runInitializers(this, _authorId_initializers, void 0));
            /** Relations */
            this.units = (__runInitializers(this, _authorId_extraInitializers), __runInitializers(this, _units_initializers, void 0));
            this.publish = (__runInitializers(this, _units_extraInitializers), __runInitializers(this, _publish_initializers, void 0));
            /** Timestamps */
            this.createdAt = (__runInitializers(this, _publish_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return Tutorial_1;
    }());
    __setFunctionName(_classThis, "Tutorial");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _tutorialName_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _description_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _level_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _thumbnail_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _category_decorators = [(0, typeorm_1.Column)()];
        _author_decorators = [(0, typeorm_1.ManyToOne)(function () { return user_entity_1.Users; }, function (user) { return user.tutorials; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'authorId' })];
        _roadmapNodes_decorators = [(0, typeorm_1.OneToMany)(function () { return roadmap_entity_1.RoadmapNode; }, function (node) { return node.tutorial; })];
        _authorId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _units_decorators = [(0, typeorm_1.OneToMany)(function () { return Unit; }, function (unit) { return unit.tutorial; }, {
                cascade: true,
            })];
        _publish_decorators = [(0, typeorm_1.Column)({ default: false })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)({ default: new Date() })];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _tutorialName_decorators, { kind: "field", name: "tutorialName", static: false, private: false, access: { has: function (obj) { return "tutorialName" in obj; }, get: function (obj) { return obj.tutorialName; }, set: function (obj, value) { obj.tutorialName = value; } }, metadata: _metadata }, _tutorialName_initializers, _tutorialName_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _level_decorators, { kind: "field", name: "level", static: false, private: false, access: { has: function (obj) { return "level" in obj; }, get: function (obj) { return obj.level; }, set: function (obj, value) { obj.level = value; } }, metadata: _metadata }, _level_initializers, _level_extraInitializers);
        __esDecorate(null, null, _thumbnail_decorators, { kind: "field", name: "thumbnail", static: false, private: false, access: { has: function (obj) { return "thumbnail" in obj; }, get: function (obj) { return obj.thumbnail; }, set: function (obj, value) { obj.thumbnail = value; } }, metadata: _metadata }, _thumbnail_initializers, _thumbnail_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _author_decorators, { kind: "field", name: "author", static: false, private: false, access: { has: function (obj) { return "author" in obj; }, get: function (obj) { return obj.author; }, set: function (obj, value) { obj.author = value; } }, metadata: _metadata }, _author_initializers, _author_extraInitializers);
        __esDecorate(null, null, _roadmapNodes_decorators, { kind: "field", name: "roadmapNodes", static: false, private: false, access: { has: function (obj) { return "roadmapNodes" in obj; }, get: function (obj) { return obj.roadmapNodes; }, set: function (obj, value) { obj.roadmapNodes = value; } }, metadata: _metadata }, _roadmapNodes_initializers, _roadmapNodes_extraInitializers);
        __esDecorate(null, null, _authorId_decorators, { kind: "field", name: "authorId", static: false, private: false, access: { has: function (obj) { return "authorId" in obj; }, get: function (obj) { return obj.authorId; }, set: function (obj, value) { obj.authorId = value; } }, metadata: _metadata }, _authorId_initializers, _authorId_extraInitializers);
        __esDecorate(null, null, _units_decorators, { kind: "field", name: "units", static: false, private: false, access: { has: function (obj) { return "units" in obj; }, get: function (obj) { return obj.units; }, set: function (obj, value) { obj.units = value; } }, metadata: _metadata }, _units_initializers, _units_extraInitializers);
        __esDecorate(null, null, _publish_decorators, { kind: "field", name: "publish", static: false, private: false, access: { has: function (obj) { return "publish" in obj; }, get: function (obj) { return obj.publish; }, set: function (obj, value) { obj.publish = value; } }, metadata: _metadata }, _publish_initializers, _publish_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Tutorial = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Tutorial = _classThis;
}();
exports.Tutorial = Tutorial;
var Unit = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('units')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _unitTitle_decorators;
    var _unitTitle_initializers = [];
    var _unitTitle_extraInitializers = [];
    var _content_decorators;
    var _content_initializers = [];
    var _content_extraInitializers = [];
    var _order_decorators;
    var _order_initializers = [];
    var _order_extraInitializers = [];
    var _tutorialId_decorators;
    var _tutorialId_initializers = [];
    var _tutorialId_extraInitializers = [];
    var _publish_decorators;
    var _publish_initializers = [];
    var _publish_extraInitializers = [];
    var _tutorial_decorators;
    var _tutorial_initializers = [];
    var _tutorial_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var Unit = _classThis = /** @class */ (function () {
        function Unit_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.unitTitle = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _unitTitle_initializers, void 0));
            this.content = (__runInitializers(this, _unitTitle_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.order = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _order_initializers, void 0));
            /** Relations */
            this.tutorialId = (__runInitializers(this, _order_extraInitializers), __runInitializers(this, _tutorialId_initializers, void 0));
            this.publish = (__runInitializers(this, _tutorialId_extraInitializers), __runInitializers(this, _publish_initializers, void 0));
            this.tutorial = (__runInitializers(this, _publish_extraInitializers), __runInitializers(this, _tutorial_initializers, void 0));
            /** Timestamps */
            this.createdAt = (__runInitializers(this, _tutorial_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return Unit_1;
    }());
    __setFunctionName(_classThis, "Unit");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _unitTitle_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _content_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _order_decorators = [(0, typeorm_1.Column)({ type: 'int', nullable: true })];
        _tutorialId_decorators = [(0, typeorm_1.Column)({ type: 'uuid', nullable: true })];
        _publish_decorators = [(0, typeorm_1.Column)({ default: false })];
        _tutorial_decorators = [(0, typeorm_1.ManyToOne)(function () { return Tutorial; }, function (tutorial) { return tutorial.units; }, {
                onDelete: 'CASCADE',
            }), (0, typeorm_1.JoinColumn)({ name: 'tutorialId' })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _unitTitle_decorators, { kind: "field", name: "unitTitle", static: false, private: false, access: { has: function (obj) { return "unitTitle" in obj; }, get: function (obj) { return obj.unitTitle; }, set: function (obj, value) { obj.unitTitle = value; } }, metadata: _metadata }, _unitTitle_initializers, _unitTitle_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: function (obj) { return "content" in obj; }, get: function (obj) { return obj.content; }, set: function (obj, value) { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _order_decorators, { kind: "field", name: "order", static: false, private: false, access: { has: function (obj) { return "order" in obj; }, get: function (obj) { return obj.order; }, set: function (obj, value) { obj.order = value; } }, metadata: _metadata }, _order_initializers, _order_extraInitializers);
        __esDecorate(null, null, _tutorialId_decorators, { kind: "field", name: "tutorialId", static: false, private: false, access: { has: function (obj) { return "tutorialId" in obj; }, get: function (obj) { return obj.tutorialId; }, set: function (obj, value) { obj.tutorialId = value; } }, metadata: _metadata }, _tutorialId_initializers, _tutorialId_extraInitializers);
        __esDecorate(null, null, _publish_decorators, { kind: "field", name: "publish", static: false, private: false, access: { has: function (obj) { return "publish" in obj; }, get: function (obj) { return obj.publish; }, set: function (obj, value) { obj.publish = value; } }, metadata: _metadata }, _publish_initializers, _publish_extraInitializers);
        __esDecorate(null, null, _tutorial_decorators, { kind: "field", name: "tutorial", static: false, private: false, access: { has: function (obj) { return "tutorial" in obj; }, get: function (obj) { return obj.tutorial; }, set: function (obj, value) { obj.tutorial = value; } }, metadata: _metadata }, _tutorial_initializers, _tutorial_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Unit = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Unit = _classThis;
}();
exports.Unit = Unit;
