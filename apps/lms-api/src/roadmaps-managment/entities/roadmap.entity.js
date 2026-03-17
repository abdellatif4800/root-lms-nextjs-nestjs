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
exports.RoadmapEdge = exports.RoadmapNode = exports.Roadmap = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("../../users-managment/entities/user.entity");
var tutorial_entity_1 = require("../../tutorials-management/entities/tutorial.entity");
var Roadmap = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('roadmaps')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _author_decorators;
    var _author_initializers = [];
    var _author_extraInitializers = [];
    var _authorId_decorators;
    var _authorId_initializers = [];
    var _authorId_extraInitializers = [];
    var _nodes_decorators;
    var _nodes_initializers = [];
    var _nodes_extraInitializers = [];
    var _edges_decorators;
    var _edges_initializers = [];
    var _edges_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var Roadmap = _classThis = /** @class */ (function () {
        function Roadmap_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.title = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.author = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _author_initializers, void 0));
            this.authorId = (__runInitializers(this, _author_extraInitializers), __runInitializers(this, _authorId_initializers, void 0));
            // 🔹 Nodes inside roadmap
            this.nodes = (__runInitializers(this, _authorId_extraInitializers), __runInitializers(this, _nodes_initializers, void 0));
            // 🔹 Edges inside roadmap
            this.edges = (__runInitializers(this, _nodes_extraInitializers), __runInitializers(this, _edges_initializers, void 0));
            /** Timestamps */
            this.createdAt = (__runInitializers(this, _edges_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return Roadmap_1;
    }());
    __setFunctionName(_classThis, "Roadmap");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _title_decorators = [(0, typeorm_1.Column)()];
        _description_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _author_decorators = [(0, typeorm_1.ManyToOne)(function () { return user_entity_1.Users; }, function (user) { return user.roadmaps; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'authorId' })];
        _authorId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _nodes_decorators = [(0, typeorm_1.OneToMany)(function () { return RoadmapNode; }, function (node) { return node.roadmap; }, {
                cascade: true,
            })];
        _edges_decorators = [(0, typeorm_1.OneToMany)(function () { return RoadmapEdge; }, function (edge) { return edge.roadmap; }, {
                cascade: true,
            })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _author_decorators, { kind: "field", name: "author", static: false, private: false, access: { has: function (obj) { return "author" in obj; }, get: function (obj) { return obj.author; }, set: function (obj, value) { obj.author = value; } }, metadata: _metadata }, _author_initializers, _author_extraInitializers);
        __esDecorate(null, null, _authorId_decorators, { kind: "field", name: "authorId", static: false, private: false, access: { has: function (obj) { return "authorId" in obj; }, get: function (obj) { return obj.authorId; }, set: function (obj, value) { obj.authorId = value; } }, metadata: _metadata }, _authorId_initializers, _authorId_extraInitializers);
        __esDecorate(null, null, _nodes_decorators, { kind: "field", name: "nodes", static: false, private: false, access: { has: function (obj) { return "nodes" in obj; }, get: function (obj) { return obj.nodes; }, set: function (obj, value) { obj.nodes = value; } }, metadata: _metadata }, _nodes_initializers, _nodes_extraInitializers);
        __esDecorate(null, null, _edges_decorators, { kind: "field", name: "edges", static: false, private: false, access: { has: function (obj) { return "edges" in obj; }, get: function (obj) { return obj.edges; }, set: function (obj, value) { obj.edges = value; } }, metadata: _metadata }, _edges_initializers, _edges_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Roadmap = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Roadmap = _classThis;
}();
exports.Roadmap = Roadmap;
var RoadmapNode = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('roadmap_nodes')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _clientId_decorators;
    var _clientId_initializers = [];
    var _clientId_extraInitializers = [];
    var _roadmap_decorators;
    var _roadmap_initializers = [];
    var _roadmap_extraInitializers = [];
    var _roadmapId_decorators;
    var _roadmapId_initializers = [];
    var _roadmapId_extraInitializers = [];
    var _tutorial_decorators;
    var _tutorial_initializers = [];
    var _tutorial_extraInitializers = [];
    var _tutorialId_decorators;
    var _tutorialId_initializers = [];
    var _tutorialId_extraInitializers = [];
    var _positionX_decorators;
    var _positionX_initializers = [];
    var _positionX_extraInitializers = [];
    var _positionY_decorators;
    var _positionY_initializers = [];
    var _positionY_extraInitializers = [];
    var RoadmapNode = _classThis = /** @class */ (function () {
        function RoadmapNode_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.clientId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _clientId_initializers, void 0)); // e.g. "node-1", "node-2"
            // 🔹 Roadmap relation
            this.roadmap = (__runInitializers(this, _clientId_extraInitializers), __runInitializers(this, _roadmap_initializers, void 0));
            this.roadmapId = (__runInitializers(this, _roadmap_extraInitializers), __runInitializers(this, _roadmapId_initializers, void 0));
            // 🔹 Tutorial relation
            this.tutorial = (__runInitializers(this, _roadmapId_extraInitializers), __runInitializers(this, _tutorial_initializers, void 0));
            this.tutorialId = (__runInitializers(this, _tutorial_extraInitializers), __runInitializers(this, _tutorialId_initializers, void 0));
            // 🔹 Position (for React Flow)
            this.positionX = (__runInitializers(this, _tutorialId_extraInitializers), __runInitializers(this, _positionX_initializers, void 0));
            this.positionY = (__runInitializers(this, _positionX_extraInitializers), __runInitializers(this, _positionY_initializers, void 0));
            __runInitializers(this, _positionY_extraInitializers);
        }
        return RoadmapNode_1;
    }());
    __setFunctionName(_classThis, "RoadmapNode");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _clientId_decorators = [(0, typeorm_1.Column)({ type: 'varchar', nullable: true })];
        _roadmap_decorators = [(0, typeorm_1.ManyToOne)(function () { return Roadmap; }, function (roadmap) { return roadmap.nodes; }, {
                onDelete: 'CASCADE',
            }), (0, typeorm_1.JoinColumn)({ name: 'roadmapId' })];
        _roadmapId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _tutorial_decorators = [(0, typeorm_1.ManyToOne)(function () { return tutorial_entity_1.Tutorial; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'tutorialId' })];
        _tutorialId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _positionX_decorators = [(0, typeorm_1.Column)('float')];
        _positionY_decorators = [(0, typeorm_1.Column)('float')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _clientId_decorators, { kind: "field", name: "clientId", static: false, private: false, access: { has: function (obj) { return "clientId" in obj; }, get: function (obj) { return obj.clientId; }, set: function (obj, value) { obj.clientId = value; } }, metadata: _metadata }, _clientId_initializers, _clientId_extraInitializers);
        __esDecorate(null, null, _roadmap_decorators, { kind: "field", name: "roadmap", static: false, private: false, access: { has: function (obj) { return "roadmap" in obj; }, get: function (obj) { return obj.roadmap; }, set: function (obj, value) { obj.roadmap = value; } }, metadata: _metadata }, _roadmap_initializers, _roadmap_extraInitializers);
        __esDecorate(null, null, _roadmapId_decorators, { kind: "field", name: "roadmapId", static: false, private: false, access: { has: function (obj) { return "roadmapId" in obj; }, get: function (obj) { return obj.roadmapId; }, set: function (obj, value) { obj.roadmapId = value; } }, metadata: _metadata }, _roadmapId_initializers, _roadmapId_extraInitializers);
        __esDecorate(null, null, _tutorial_decorators, { kind: "field", name: "tutorial", static: false, private: false, access: { has: function (obj) { return "tutorial" in obj; }, get: function (obj) { return obj.tutorial; }, set: function (obj, value) { obj.tutorial = value; } }, metadata: _metadata }, _tutorial_initializers, _tutorial_extraInitializers);
        __esDecorate(null, null, _tutorialId_decorators, { kind: "field", name: "tutorialId", static: false, private: false, access: { has: function (obj) { return "tutorialId" in obj; }, get: function (obj) { return obj.tutorialId; }, set: function (obj, value) { obj.tutorialId = value; } }, metadata: _metadata }, _tutorialId_initializers, _tutorialId_extraInitializers);
        __esDecorate(null, null, _positionX_decorators, { kind: "field", name: "positionX", static: false, private: false, access: { has: function (obj) { return "positionX" in obj; }, get: function (obj) { return obj.positionX; }, set: function (obj, value) { obj.positionX = value; } }, metadata: _metadata }, _positionX_initializers, _positionX_extraInitializers);
        __esDecorate(null, null, _positionY_decorators, { kind: "field", name: "positionY", static: false, private: false, access: { has: function (obj) { return "positionY" in obj; }, get: function (obj) { return obj.positionY; }, set: function (obj, value) { obj.positionY = value; } }, metadata: _metadata }, _positionY_initializers, _positionY_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RoadmapNode = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RoadmapNode = _classThis;
}();
exports.RoadmapNode = RoadmapNode;
var RoadmapEdge = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('roadmap_edges')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _roadmap_decorators;
    var _roadmap_initializers = [];
    var _roadmap_extraInitializers = [];
    var _roadmapId_decorators;
    var _roadmapId_initializers = [];
    var _roadmapId_extraInitializers = [];
    var _sourceNode_decorators;
    var _sourceNode_initializers = [];
    var _sourceNode_extraInitializers = [];
    var _sourceNodeId_decorators;
    var _sourceNodeId_initializers = [];
    var _sourceNodeId_extraInitializers = [];
    var _targetNode_decorators;
    var _targetNode_initializers = [];
    var _targetNode_extraInitializers = [];
    var _targetNodeId_decorators;
    var _targetNodeId_initializers = [];
    var _targetNodeId_extraInitializers = [];
    var RoadmapEdge = _classThis = /** @class */ (function () {
        function RoadmapEdge_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            // 🔹 Roadmap relation
            this.roadmap = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _roadmap_initializers, void 0));
            this.roadmapId = (__runInitializers(this, _roadmap_extraInitializers), __runInitializers(this, _roadmapId_initializers, void 0));
            // 🔹 Source node
            this.sourceNode = (__runInitializers(this, _roadmapId_extraInitializers), __runInitializers(this, _sourceNode_initializers, void 0));
            this.sourceNodeId = (__runInitializers(this, _sourceNode_extraInitializers), __runInitializers(this, _sourceNodeId_initializers, void 0));
            // 🔹 Target node
            this.targetNode = (__runInitializers(this, _sourceNodeId_extraInitializers), __runInitializers(this, _targetNode_initializers, void 0));
            this.targetNodeId = (__runInitializers(this, _targetNode_extraInitializers), __runInitializers(this, _targetNodeId_initializers, void 0));
            __runInitializers(this, _targetNodeId_extraInitializers);
        }
        return RoadmapEdge_1;
    }());
    __setFunctionName(_classThis, "RoadmapEdge");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _roadmap_decorators = [(0, typeorm_1.ManyToOne)(function () { return Roadmap; }, function (roadmap) { return roadmap.edges; }, {
                onDelete: 'CASCADE',
            }), (0, typeorm_1.JoinColumn)({ name: 'roadmapId' })];
        _roadmapId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _sourceNode_decorators = [(0, typeorm_1.ManyToOne)(function () { return RoadmapNode; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'sourceNodeId' })];
        _sourceNodeId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _targetNode_decorators = [(0, typeorm_1.ManyToOne)(function () { return RoadmapNode; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'targetNodeId' })];
        _targetNodeId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _roadmap_decorators, { kind: "field", name: "roadmap", static: false, private: false, access: { has: function (obj) { return "roadmap" in obj; }, get: function (obj) { return obj.roadmap; }, set: function (obj, value) { obj.roadmap = value; } }, metadata: _metadata }, _roadmap_initializers, _roadmap_extraInitializers);
        __esDecorate(null, null, _roadmapId_decorators, { kind: "field", name: "roadmapId", static: false, private: false, access: { has: function (obj) { return "roadmapId" in obj; }, get: function (obj) { return obj.roadmapId; }, set: function (obj, value) { obj.roadmapId = value; } }, metadata: _metadata }, _roadmapId_initializers, _roadmapId_extraInitializers);
        __esDecorate(null, null, _sourceNode_decorators, { kind: "field", name: "sourceNode", static: false, private: false, access: { has: function (obj) { return "sourceNode" in obj; }, get: function (obj) { return obj.sourceNode; }, set: function (obj, value) { obj.sourceNode = value; } }, metadata: _metadata }, _sourceNode_initializers, _sourceNode_extraInitializers);
        __esDecorate(null, null, _sourceNodeId_decorators, { kind: "field", name: "sourceNodeId", static: false, private: false, access: { has: function (obj) { return "sourceNodeId" in obj; }, get: function (obj) { return obj.sourceNodeId; }, set: function (obj, value) { obj.sourceNodeId = value; } }, metadata: _metadata }, _sourceNodeId_initializers, _sourceNodeId_extraInitializers);
        __esDecorate(null, null, _targetNode_decorators, { kind: "field", name: "targetNode", static: false, private: false, access: { has: function (obj) { return "targetNode" in obj; }, get: function (obj) { return obj.targetNode; }, set: function (obj, value) { obj.targetNode = value; } }, metadata: _metadata }, _targetNode_initializers, _targetNode_extraInitializers);
        __esDecorate(null, null, _targetNodeId_decorators, { kind: "field", name: "targetNodeId", static: false, private: false, access: { has: function (obj) { return "targetNodeId" in obj; }, get: function (obj) { return obj.targetNodeId; }, set: function (obj, value) { obj.targetNodeId = value; } }, metadata: _metadata }, _targetNodeId_initializers, _targetNodeId_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RoadmapEdge = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RoadmapEdge = _classThis;
}();
exports.RoadmapEdge = RoadmapEdge;
