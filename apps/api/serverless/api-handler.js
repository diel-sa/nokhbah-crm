var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toESMCache_node;
var __toESMCache_esm;
var __toESM = (mod, isNodeMode, target) => {
  var canCache = mod != null && typeof mod === "object";
  if (canCache) {
    var cache = isNodeMode ? __toESMCache_node ??= new WeakMap : __toESMCache_esm ??= new WeakMap;
    var cached = cache.get(mod);
    if (cached)
      return cached;
  }
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: __accessProp.bind(mod, key),
        enumerable: true
      });
  if (canCache)
    cache.set(mod, to);
  return to;
};
var __toCommonJS = (from) => {
  var entry = (__moduleCache ??= new WeakMap).get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function") {
    for (var key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(entry, key))
        __defProp(entry, key, {
          get: __accessProp.bind(from, key),
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
  }
  __moduleCache.set(from, entry);
  return entry;
};
var __moduleCache;
var __returnValue = (v) => v;
function __exportSetter(name, newValue) {
  this[name] = __returnValue.bind(null, newValue);
}
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: __exportSetter.bind(all, name)
    });
};
var __legacyDecorateClassTS = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1;i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __legacyDecorateParamTS = (index, decorator) => (target, key) => decorator(target, key, index);
var __legacyMetadataTS = (k, v) => {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};

// serverless/handler.ts
var exports_handler = {};
__export(exports_handler, {
  default: () => handler
});
module.exports = __toCommonJS(exports_handler);
var import_reflect_metadata = require("reflect-metadata");

// src/create-app.ts
var import_auth53 = require("@crm/auth");
var import_common140 = require("@nestjs/common");
var import_core2 = require("@nestjs/core");
var import_platform_express = require("@nestjs/platform-express");
var import_swagger9 = require("@nestjs/swagger");
var import_helmet = __toESM(require("helmet"));
var import_nestjs_trpc23 = require("nestjs-trpc");
var import_trpc_to_openapi = require("trpc-to-openapi");

// src/app.module.ts
var import_auth51 = require("@crm/auth");
var import_common139 = require("@nestjs/common");
var import_config7 = require("@nestjs/config");
var import_nestjs_better_auth10 = require("@thallesp/nestjs-better-auth");

// src/activities/activities.module.ts
var import_common13 = require("@nestjs/common");

// src/trpc/trpc.module.ts
var import_common8 = require("@nestjs/common");
var import_nestjs_trpc = require("nestjs-trpc");

// src/logging/context-logger.ts
var import_node_util = require("node:util");
var import_common = require("@nestjs/common");

// src/logging/request-context.ts
var import_node_async_hooks = require("node:async_hooks");
var storage = new import_node_async_hooks.AsyncLocalStorage;
function runInRequestContext(context, fn) {
  return storage.run(context, fn);
}
function getRequestContext() {
  return storage.getStore();
}
function setRequestUserId(userId) {
  const context = storage.getStore();
  if (context) {
    context.userId = userId;
  }
}

// src/logging/context-logger.ts
var PRODUCTION_LEVELS = ["fatal", "error", "warn", "log"];
var DEVELOPMENT_LEVELS = [
  "fatal",
  "error",
  "warn",
  "log",
  "debug",
  "verbose"
];
function consoleLoggerOptions() {
  const isProduction = false;
  return {
    json: isProduction,
    colors: !isProduction,
    timestamp: !isProduction,
    logLevels: isProduction ? PRODUCTION_LEVELS : DEVELOPMENT_LEVELS
  };
}

class ContextLogger extends import_common.ConsoleLogger {
  constructor() {
    super(consoleLoggerOptions());
  }
  getJsonLogObject(message, options) {
    const base = super.getJsonLogObject(message, options);
    const request = getRequestContext();
    const record = isStructuredMessage(message) ? { ...withoutMessage(message), ...base, message: message.message } : base;
    if (!request) {
      return record;
    }
    const correlated = {
      ...record,
      requestId: request.requestId
    };
    if (!request.userId) {
      return correlated;
    }
    return { ...correlated, userId: request.userId };
  }
  stringifyMessage(message, logLevel) {
    if (!isStructuredMessage(message)) {
      return super.stringifyMessage(message, logLevel);
    }
    const fields = withoutMessage(message);
    const text = this.colorize(message.message, logLevel);
    return Object.keys(fields).length === 0 ? text : `${text} ${import_node_util.inspect(fields, this.inspectOptions)}`;
  }
  formatContext(context) {
    const request = getRequestContext();
    if (!context || !request) {
      return super.formatContext(context);
    }
    return super.formatContext(`${context} ${shortId(request.requestId)}`);
  }
}
ContextLogger = __legacyDecorateClassTS([
  import_common.Injectable(),
  __legacyMetadataTS("design:paramtypes", [])
], ContextLogger);
function shortId(requestId) {
  return requestId.slice(0, 8);
}
function isStructuredMessage(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return (prototype === Object.prototype || prototype === null) && typeof value.message === "string";
}
function withoutMessage(value) {
  const { message: _message, ...fields } = value;
  return fields;
}

// src/trpc/error-formatter.ts
var import_zod = require("zod");
var issueShape = import_zod.z.object({
  message: import_zod.z.string().catch(""),
  path: import_zod.z.array(import_zod.z.unknown()).catch([])
}).catch({ message: "", path: [] });
var pathSegment = import_zod.z.string().nullable().catch(null);
var failedParse = import_zod.z.object({ issues: import_zod.z.array(issueShape).min(1) }).nullable().catch(null);
function issuesIn(cause) {
  return failedParse.parse(cause)?.issues ?? null;
}
function sentence(issue) {
  const message = issue.message.trim();
  if (message === "")
    return null;
  if (/[.!?]$/.test(message))
    return message;
  const field = issue.path.flatMap((part) => {
    const segment = pathSegment.parse(part);
    return segment === null ? [] : [segment];
  }).at(-1);
  return field ? `${field}: ${message}` : message;
}
function readableInputError(message, cause) {
  const issues = issuesIn(cause);
  if (!issues)
    return null;
  const sentences = [...new Set(issues.map(sentence).filter(Boolean))];
  return sentences.length > 0 ? sentences.join(" ") : message;
}
var formatTrpcError = ({ shape, error }) => {
  const readable = readableInputError(shape.message, error.cause);
  return readable ? { ...shape, message: readable } : shape;
};

// src/trpc/middlewares/auth.middleware.ts
var import_common2 = require("@nestjs/common");
var import_server = require("@trpc/server");
class AuthMiddleware {
  async use(opts) {
    const ctx = opts.ctx;
    const user = ctx.session?.user;
    if (!user) {
      throw new import_server.TRPCError({ code: "UNAUTHORIZED" });
    }
    setRequestUserId(user.id);
    const nextCtx = { ...ctx, user };
    return opts.next({ ctx: nextCtx });
  }
}
AuthMiddleware = __legacyDecorateClassTS([
  import_common2.Injectable()
], AuthMiddleware);

// src/trpc/middlewares/domain-error.middleware.ts
var import_common3 = require("@nestjs/common");
var import_server2 = require("@trpc/server");
function statusToTrpcCode(status) {
  switch (status) {
    case 400:
      return "BAD_REQUEST";
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 409:
      return "CONFLICT";
    case 429:
      return "TOO_MANY_REQUESTS";
    default:
      return "INTERNAL_SERVER_ERROR";
  }
}

class DomainErrorMiddleware {
  async use(opts) {
    const result = await opts.next();
    if (result.ok) {
      return result;
    }
    const failure = result;
    const cause = failure.error?.cause;
    if (cause instanceof import_common3.HttpException) {
      throw new import_server2.TRPCError({
        code: statusToTrpcCode(cause.getStatus()),
        message: cause.message
      });
    }
    return result;
  }
}
DomainErrorMiddleware = __legacyDecorateClassTS([
  import_common3.Injectable()
], DomainErrorMiddleware);

// src/trpc/middlewares/logging.middleware.ts
var import_common4 = require("@nestjs/common");
class LoggingMiddleware {
  logger = new import_common4.Logger("tRPC");
  async use(opts) {
    const startedAt = Date.now();
    const result = await opts.next();
    const durationMs = Date.now() - startedAt;
    this.logger.log({
      message: `${opts.type} ${opts.path} ${result.ok ? "ok" : "err"} ${durationMs}ms`,
      type: opts.type,
      path: opts.path,
      outcome: result.ok ? "ok" : "err",
      durationMs
    });
    return result;
  }
}
LoggingMiddleware = __legacyDecorateClassTS([
  import_common4.Injectable()
], LoggingMiddleware);

// src/trpc/middlewares/session-only.middleware.ts
var import_auth = require("@crm/auth");
var import_common5 = require("@nestjs/common");
var import_server3 = require("@trpc/server");
class SessionOnlyMiddleware {
  async use(opts) {
    const ctx = opts.ctx;
    if (ctx.req?.headers[import_auth.API_KEY_HEADER]) {
      throw new import_server3.TRPCError({ code: "UNAUTHORIZED" });
    }
    return opts.next();
  }
}
SessionOnlyMiddleware = __legacyDecorateClassTS([
  import_common5.Injectable()
], SessionOnlyMiddleware);

// src/trpc/trpc.context.ts
var import_auth2 = require("@crm/auth");
var import_common6 = require("@nestjs/common");
var import_node = require("better-auth/node");
async function createBaseTrpcContext(req) {
  const session = req ? await import_auth2.auth.api.getSession({ headers: import_node.fromNodeHeaders(req.headers) }).catch(() => null) : null;
  return { req, session };
}

class TrpcContext {
  async create(opts) {
    const req = "req" in opts ? opts.req : undefined;
    return createBaseTrpcContext(req);
  }
}
TrpcContext = __legacyDecorateClassTS([
  import_common6.Injectable()
], TrpcContext);

// src/trpc/trpc-error.handler.ts
var import_telemetry = require("@crm/telemetry");
var import_common7 = require("@nestjs/common");
class TrpcErrorHandler {
  logger = new import_common7.Logger("tRPC");
  onError(opts) {
    const { error, type, path } = opts;
    const message = `${type} ${path ?? "<unknown>"} ${error.code}`;
    if (error.code === "INTERNAL_SERVER_ERROR") {
      this.logger.error({ message, type, path, code: error.code }, error.stack ?? String(error.cause ?? error));
      import_telemetry.apiError({
        error: error.cause ?? error,
        route: path ? `/trpc/${path}` : null,
        status: 500
      });
      return;
    }
    this.logger.warn({ message, type, path, code: error.code });
  }
}
TrpcErrorHandler = __legacyDecorateClassTS([
  import_common7.Injectable()
], TrpcErrorHandler);

// src/trpc/trpc.module.ts
class TrpcModule {
}
TrpcModule = __legacyDecorateClassTS([
  import_common8.Module({
    imports: [
      import_nestjs_trpc.TRPCModule.forRoot({
        basePath: "/api/trpc",
        context: TrpcContext,
        logger: new ContextLogger,
        errorFormatter: formatTrpcError,
        onError: TrpcErrorHandler,
        globalMiddlewares: [LoggingMiddleware, DomainErrorMiddleware]
      })
    ],
    providers: [
      TrpcContext,
      TrpcErrorHandler,
      LoggingMiddleware,
      DomainErrorMiddleware,
      AuthMiddleware,
      SessionOnlyMiddleware
    ],
    exports: [AuthMiddleware, SessionOnlyMiddleware]
  })
], TrpcModule);

// src/activities/activities.router.ts
var import_common12 = require("@nestjs/common");
var import_nestjs_trpc2 = require("nestjs-trpc");

// src/trpc/openapi.ts
var REST_BRIDGE_PATH = "/rest";
function restMeta(method, path, tags, options = {}) {
  return {
    openapi: {
      method,
      path,
      tags,
      protect: options.protect ?? true
    }
  };
}

// src/activities/activities.contracts.ts
var import_db = require("@crm/db");
var import_activity_meta = require("@crm/validation/activity-meta");
var import_zod2 = require("zod");
var COMPOSABLE_TYPES = [
  import_db.ActivityType.NOTE,
  import_db.ActivityType.CALL,
  import_db.ActivityType.EMAIL,
  import_db.ActivityType.MEETING,
  import_db.ActivityType.TASK
];
var composableEnum = import_zod2.z.enum(COMPOSABLE_TYPES);
var ALL_ACTIVITY_TYPES = [
  import_db.ActivityType.NOTE,
  import_db.ActivityType.CALL,
  import_db.ActivityType.EMAIL,
  import_db.ActivityType.MEETING,
  import_db.ActivityType.TASK,
  import_db.ActivityType.STAGE_CHANGE,
  import_db.ActivityType.ENRICHMENT
];
var activityTypeOutput = import_zod2.z.enum(ALL_ACTIVITY_TYPES);
var TIMELINE_FILTERS = [
  "all",
  "history",
  "notes",
  "upcoming",
  "done",
  "email",
  "meetings"
];
var timelineInput = import_zod2.z.object({
  companyId: import_zod2.z.string().optional(),
  contactId: import_zod2.z.string().optional(),
  dealId: import_zod2.z.string().optional(),
  filter: import_zod2.z.enum(TIMELINE_FILTERS).default("all"),
  cursor: import_zod2.z.string().optional(),
  limit: import_zod2.z.number().int().min(1).max(100).default(30)
});
var timelineCountsInput = import_zod2.z.object({
  companyId: import_zod2.z.string().optional(),
  contactId: import_zod2.z.string().optional(),
  dealId: import_zod2.z.string().optional()
});
var activityCreateInput = import_zod2.z.object({
  type: composableEnum,
  subject: import_zod2.z.string().trim().optional(),
  body: import_zod2.z.string().trim().optional(),
  occurredAt: import_zod2.z.string().optional(),
  dueAt: import_zod2.z.string().nullable().optional(),
  companyId: import_zod2.z.string().optional(),
  contactId: import_zod2.z.string().optional(),
  dealId: import_zod2.z.string().optional()
}).refine((input) => input.companyId || input.contactId || input.dealId, {
  message: "An activity has to be about a company, a contact or a deal."
}).refine((input) => input.type !== import_db.ActivityType.TASK || Boolean(input.subject), {
  message: "A task needs a subject — it is the thing to do.",
  path: ["subject"]
});
var completeInput = import_zod2.z.object({
  id: import_zod2.z.string(),
  completed: import_zod2.z.boolean().default(true)
});
var myTasksInput = import_zod2.z.object({
  window: import_zod2.z.enum(["overdue", "upcoming", "all"]).default("all"),
  limit: import_zod2.z.number().int().min(1).max(100).default(25)
});
var activityAuthorOutput = import_zod2.z.object({
  id: import_zod2.z.string(),
  name: import_zod2.z.string(),
  email: import_zod2.z.string(),
  image: import_zod2.z.string().nullable()
});
var activityCompanyRefOutput = import_zod2.z.object({
  id: import_zod2.z.string(),
  name: import_zod2.z.string()
}).nullable();
var activityContactRefOutput = import_zod2.z.object({
  id: import_zod2.z.string(),
  firstName: import_zod2.z.string(),
  lastName: import_zod2.z.string().nullable()
}).nullable();
var activityDealRefOutput = import_zod2.z.object({
  id: import_zod2.z.string(),
  name: import_zod2.z.string()
}).nullable();
var activityEmailThreadOutput = import_zod2.z.object({
  id: import_zod2.z.string(),
  messageCount: import_zod2.z.number(),
  lastMessageAt: import_zod2.z.string()
}).nullable();
var activityCalendarEventOutput = import_zod2.z.object({
  id: import_zod2.z.string(),
  startsAt: import_zod2.z.string(),
  endsAt: import_zod2.z.string(),
  isAllDay: import_zod2.z.boolean(),
  location: import_zod2.z.string().nullable(),
  conferenceUrl: import_zod2.z.string().nullable(),
  attendeeCount: import_zod2.z.number()
}).nullable();
var activityEntryOutput = import_zod2.z.object({
  id: import_zod2.z.string(),
  type: activityTypeOutput,
  subject: import_zod2.z.string().nullable(),
  body: import_zod2.z.string().nullable(),
  occurredAt: import_zod2.z.string().nullable(),
  dueAt: import_zod2.z.string().nullable(),
  completedAt: import_zod2.z.string().nullable(),
  meta: import_activity_meta.activityMeta,
  createdAt: import_zod2.z.string(),
  createdBy: activityAuthorOutput,
  company: activityCompanyRefOutput,
  contact: activityContactRefOutput,
  deal: activityDealRefOutput,
  emailThread: activityEmailThreadOutput,
  calendarEvent: activityCalendarEventOutput
});
var timelineOutput = import_zod2.z.object({
  entries: import_zod2.z.array(activityEntryOutput),
  nextCursor: import_zod2.z.string().nullable()
});
var timelineCountsOutput = import_zod2.z.object({
  all: import_zod2.z.number(),
  notes: import_zod2.z.number(),
  upcoming: import_zod2.z.number(),
  done: import_zod2.z.number(),
  email: import_zod2.z.number(),
  meetings: import_zod2.z.number()
});
var myTasksOutput = import_zod2.z.array(activityEntryOutput);
var activityCreateOutput = activityEntryOutput;
var completeOutput = activityEntryOutput;

// src/activities/activities.service.ts
var import_db4 = require("@crm/db");
var import_activity_meta2 = require("@crm/validation/activity-meta");
var import_common11 = require("@nestjs/common");

// src/crm/activity-stamp.service.ts
var import_db2 = require("@crm/db");
var import_common10 = require("@nestjs/common");

// src/database/database.constants.ts
var import_common9 = require("@nestjs/common");
var DATABASE = Symbol("DATABASE");
var InjectDatabase = () => import_common9.Inject(DATABASE);

// src/crm/activity-stamp.service.ts
function present(ids) {
  return ids.filter((id) => id !== null);
}

class ActivityStampService {
  db;
  logger = new import_common10.Logger(ActivityStampService.name);
  constructor(db) {
    this.db = db;
  }
  async touch(target, at) {
    const stale = {
      OR: [{ lastActivityAt: null }, { lastActivityAt: { lt: at } }]
    };
    await Promise.all([
      target.companyId ? this.db.company.updateMany({
        where: { id: target.companyId, ...stale },
        data: { lastActivityAt: at }
      }) : null,
      target.contactId ? this.db.contact.updateMany({
        where: { id: target.contactId, ...stale },
        data: { lastActivityAt: at }
      }) : null,
      target.dealId ? this.db.deal.updateMany({
        where: { id: target.dealId, ...stale },
        data: { lastActivityAt: at }
      }) : null
    ]);
  }
  async recompute(target) {
    if (target.companyId) {
      const { _max } = await this.db.activity.aggregate({
        where: { companyId: target.companyId },
        _max: { createdAt: true }
      });
      await this.db.company.update({
        where: { id: target.companyId },
        data: { lastActivityAt: _max.createdAt }
      });
    }
    if (target.contactId) {
      const { _max } = await this.db.activity.aggregate({
        where: { contactId: target.contactId },
        _max: { createdAt: true }
      });
      await this.db.contact.update({
        where: { id: target.contactId },
        data: { lastActivityAt: _max.createdAt }
      });
    }
    if (target.dealId) {
      const { _max } = await this.db.activity.aggregate({
        where: { dealId: target.dealId },
        _max: { createdAt: true }
      });
      await this.db.deal.update({
        where: { id: target.dealId },
        data: { lastActivityAt: _max.createdAt }
      });
    }
  }
  async targetsOf(where, client = this.db) {
    const [companies, contacts, deals] = await Promise.all([
      client.activity.groupBy({ by: ["companyId"], where }),
      client.activity.groupBy({ by: ["contactId"], where }),
      client.activity.groupBy({ by: ["dealId"], where })
    ]);
    return {
      companyIds: present(companies.map((row) => row.companyId)),
      contactIds: present(contacts.map((row) => row.contactId)),
      dealIds: present(deals.map((row) => row.dealId))
    };
  }
  async recomputeMany(targets) {
    const statements = [
      this.restamp("company", "companyId", targets.companyIds),
      this.restamp("contact", "contactId", targets.contactIds),
      this.restamp("deal", "dealId", targets.dealIds)
    ].filter((statement) => statement !== null);
    if (statements.length === 0)
      return;
    await this.db.$transaction(statements);
  }
  async recomputeAfterDelete(targets, deleted) {
    try {
      await this.recomputeMany(targets);
    } catch (error) {
      this.logger.error({
        message: "A record was deleted but its activity stamps were not recomputed",
        ...deleted
      }, error instanceof Error ? error.stack : String(error));
    }
  }
  restamp(table, column, ids) {
    if (ids.length === 0)
      return null;
    const record = import_db2.Prisma.raw(`"${table}"`);
    const key = import_db2.Prisma.raw(`"${column}"`);
    return this.db.$executeRaw`
			UPDATE ${record} r
			SET "lastActivityAt" = (
				SELECT MAX(a."createdAt") FROM "activity" a WHERE a.${key} = r.id
			)
			WHERE r.id IN (${import_db2.Prisma.join(ids)})`;
  }
  async recomputeAll() {
    await this.db.$transaction([
      this.db.$executeRaw`
				UPDATE "company" c
				SET "lastActivityAt" = a.max
				FROM (
					SELECT "companyId" AS id, MAX("createdAt") AS max
					FROM "activity" WHERE "companyId" IS NOT NULL GROUP BY "companyId"
				) a
				WHERE c.id = a.id AND c."lastActivityAt" IS DISTINCT FROM a.max`,
      this.db.$executeRaw`
				UPDATE "company" SET "lastActivityAt" = NULL
				WHERE "lastActivityAt" IS NOT NULL
				AND id NOT IN (SELECT "companyId" FROM "activity" WHERE "companyId" IS NOT NULL)`,
      this.db.$executeRaw`
				UPDATE "contact" c
				SET "lastActivityAt" = a.max
				FROM (
					SELECT "contactId" AS id, MAX("createdAt") AS max
					FROM "activity" WHERE "contactId" IS NOT NULL GROUP BY "contactId"
				) a
				WHERE c.id = a.id AND c."lastActivityAt" IS DISTINCT FROM a.max`,
      this.db.$executeRaw`
				UPDATE "contact" SET "lastActivityAt" = NULL
				WHERE "lastActivityAt" IS NOT NULL
				AND id NOT IN (SELECT "contactId" FROM "activity" WHERE "contactId" IS NOT NULL)`,
      this.db.$executeRaw`
				UPDATE "deal" d
				SET "lastActivityAt" = a.max
				FROM (
					SELECT "dealId" AS id, MAX("createdAt") AS max
					FROM "activity" WHERE "dealId" IS NOT NULL GROUP BY "dealId"
				) a
				WHERE d.id = a.id AND d."lastActivityAt" IS DISTINCT FROM a.max`,
      this.db.$executeRaw`
				UPDATE "deal" SET "lastActivityAt" = NULL
				WHERE "lastActivityAt" IS NOT NULL
				AND id NOT IN (SELECT "dealId" FROM "activity" WHERE "dealId" IS NOT NULL)`
    ]);
  }
}
ActivityStampService = __legacyDecorateClassTS([
  import_common10.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db
  ])
], ActivityStampService);

// src/crm/values.ts
var import_db3 = require("@crm/db");
function toCents(amount) {
  return amount === null ? null : amount.times(100).toNumber();
}
function fromCents(cents) {
  return cents === null || cents === undefined ? null : cents / 100;
}
function decimalFromCents(cents) {
  return cents === null || cents === undefined ? null : new import_db3.Prisma.Decimal(cents).dividedBy(100);
}
function blankToNull(value) {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}
function normalizeEmail(value) {
  return blankToNull(value)?.toLowerCase() ?? null;
}

// src/activities/activities.service.ts
var AUTHOR_SELECT = {
  id: true,
  name: true,
  email: true,
  image: true
};
var ENTRY_SELECT = {
  id: true,
  type: true,
  subject: true,
  body: true,
  occurredAt: true,
  dueAt: true,
  completedAt: true,
  meta: true,
  createdAt: true,
  createdBy: { select: AUTHOR_SELECT },
  company: { select: { id: true, name: true } },
  contact: { select: { id: true, firstName: true, lastName: true } },
  deal: { select: { id: true, name: true } },
  emailThread: {
    select: {
      id: true,
      messageCount: true,
      lastMessageAt: true
    }
  },
  calendarEvent: {
    select: {
      id: true,
      startsAt: true,
      endsAt: true,
      isAllDay: true,
      location: true,
      conferenceUrl: true,
      _count: { select: { attendees: true } }
    }
  }
};
var NOTE_TYPES = [
  import_db4.ActivityType.NOTE,
  import_db4.ActivityType.CALL,
  import_db4.ActivityType.EMAIL,
  import_db4.ActivityType.MEETING
];

class ActivitiesService {
  db;
  stamp;
  logger = new import_common11.Logger(ActivitiesService.name);
  constructor(db, stamp) {
    this.db = db;
    this.stamp = stamp;
  }
  async timeline(input) {
    const where = this.anchor(input);
    Object.assign(where, filterClause(input.filter));
    const rows = await this.db.activity.findMany({
      where,
      take: input.limit + 1,
      cursor: input.cursor ? { id: input.cursor } : undefined,
      skip: input.cursor ? 1 : undefined,
      orderBy: [
        { occurredAt: { sort: "desc", nulls: "last" } },
        { id: "desc" }
      ],
      select: ENTRY_SELECT
    });
    const hasMore = rows.length > input.limit;
    const entries = hasMore ? rows.slice(0, input.limit) : rows;
    return {
      entries: entries.map(serializeEntry),
      nextCursor: hasMore ? entries[entries.length - 1]?.id ?? null : null
    };
  }
  async timelineCounts(input) {
    const anchor = this.anchor(input);
    const [all, notes, upcoming, done, email, meetings] = await Promise.all([
      this.db.activity.count({ where: anchor }),
      this.db.activity.count({
        where: { ...anchor, ...filterClause("notes") }
      }),
      this.db.activity.count({
        where: { ...anchor, ...filterClause("upcoming") }
      }),
      this.db.activity.count({ where: { ...anchor, ...filterClause("done") } }),
      this.db.activity.count({
        where: { ...anchor, ...filterClause("email") }
      }),
      this.db.activity.count({
        where: { ...anchor, ...filterClause("meetings") }
      })
    ]);
    return { all, notes, upcoming, done, email, meetings };
  }
  async create(input, actingUserId) {
    const companyId = await this.resolveCompanyId(input);
    const isTask = input.type === import_db4.ActivityType.TASK;
    const activity = await this.db.activity.create({
      data: {
        type: input.type,
        subject: blankToNull(input.subject ?? ""),
        body: blankToNull(input.body ?? ""),
        occurredAt: parseDate(input.occurredAt) ?? new Date,
        dueAt: isTask ? parseDate(input.dueAt) : null,
        companyId,
        contactId: input.contactId ?? null,
        dealId: input.dealId ?? null,
        createdById: actingUserId
      },
      select: ENTRY_SELECT
    });
    await this.stamp.touch({ companyId, contactId: input.contactId, dealId: input.dealId }, activity.createdAt);
    this.logger.log({
      message: "Activity logged",
      activityId: activity.id,
      type: activity.type
    });
    return serializeEntry(activity);
  }
  async complete(id, completed) {
    const activity = await this.db.activity.findUnique({
      where: { id },
      select: { type: true }
    });
    if (!activity) {
      throw new import_common11.NotFoundException(`No activity with id ${id}.`);
    }
    if (activity.type !== import_db4.ActivityType.TASK) {
      throw new import_common11.BadRequestException("Only tasks can be completed.");
    }
    const updated = await this.db.activity.update({
      where: { id },
      data: { completedAt: completed ? new Date : null },
      select: ENTRY_SELECT
    });
    return serializeEntry(updated);
  }
  async myTasks(input, actingUserId) {
    const now = new Date;
    const where = {
      type: import_db4.ActivityType.TASK,
      completedAt: null,
      createdById: actingUserId
    };
    if (input.window === "overdue")
      where.dueAt = { lt: now };
    if (input.window === "upcoming")
      where.dueAt = { gte: now };
    const tasks = await this.db.activity.findMany({
      where,
      take: input.limit,
      orderBy: [
        { dueAt: { sort: "asc", nulls: "last" } },
        { createdAt: "desc" }
      ],
      select: ENTRY_SELECT
    });
    return tasks.map(serializeEntry);
  }
  anchor(input) {
    if (input.dealId)
      return { dealId: input.dealId };
    if (input.contactId)
      return { contactId: input.contactId };
    if (input.companyId)
      return { companyId: input.companyId };
    throw new import_common11.BadRequestException("A timeline needs a company, a contact or a deal.");
  }
  async resolveCompanyId(input) {
    if (input.companyId)
      return input.companyId;
    if (input.dealId) {
      const deal = await this.db.deal.findUnique({
        where: { id: input.dealId },
        select: { companyId: true }
      });
      if (!deal) {
        throw new import_common11.NotFoundException(`No deal with id ${input.dealId}.`);
      }
      return deal.companyId;
    }
    if (input.contactId) {
      const contact = await this.db.contact.findUnique({
        where: { id: input.contactId },
        select: { companyId: true }
      });
      if (!contact) {
        throw new import_common11.NotFoundException(`No contact with id ${input.contactId}.`);
      }
      return contact.companyId;
    }
    return null;
  }
}
ActivitiesService = __legacyDecorateClassTS([
  import_common11.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof ActivityStampService === "undefined" ? Object : ActivityStampService
  ])
], ActivitiesService);
function filterClause(filter) {
  switch (filter) {
    case "notes":
      return { type: { in: NOTE_TYPES } };
    case "upcoming":
      return { type: import_db4.ActivityType.TASK, completedAt: null };
    case "done":
      return { type: import_db4.ActivityType.TASK, completedAt: { not: null } };
    case "history":
      return { NOT: { type: import_db4.ActivityType.TASK, completedAt: null } };
    case "email":
      return { type: import_db4.ActivityType.EMAIL };
    case "meetings":
      return { type: import_db4.ActivityType.MEETING };
    case "all":
      return {};
  }
}
function serializeEntry(entry) {
  return {
    ...entry,
    occurredAt: entry.occurredAt?.toISOString() ?? null,
    dueAt: entry.dueAt?.toISOString() ?? null,
    completedAt: entry.completedAt?.toISOString() ?? null,
    createdAt: entry.createdAt.toISOString(),
    meta: import_activity_meta2.activityMeta.parse(entry.meta),
    emailThread: entry.emailThread ? {
      id: entry.emailThread.id,
      messageCount: entry.emailThread.messageCount,
      lastMessageAt: entry.emailThread.lastMessageAt.toISOString()
    } : null,
    calendarEvent: entry.calendarEvent ? {
      id: entry.calendarEvent.id,
      startsAt: entry.calendarEvent.startsAt.toISOString(),
      endsAt: entry.calendarEvent.endsAt.toISOString(),
      isAllDay: entry.calendarEvent.isAllDay,
      location: entry.calendarEvent.location,
      conferenceUrl: entry.calendarEvent.conferenceUrl,
      attendeeCount: entry.calendarEvent._count.attendees
    } : null
  };
}
function parseDate(value) {
  if (value === null || value === undefined || value === "")
    return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new import_common11.BadRequestException(`"${value}" is not a date.`);
  }
  return date;
}

// src/activities/activities.router.ts
class ActivitiesRouter {
  activities;
  constructor(activities) {
    this.activities = activities;
  }
  async timeline(input) {
    return this.activities.timeline(input);
  }
  async timelineCounts(input) {
    return this.activities.timelineCounts(input);
  }
  async myTasks(ctx, input) {
    return this.activities.myTasks(input, ctx.user.id);
  }
  async create(ctx, input) {
    return this.activities.create(input, ctx.user.id);
  }
  async complete(input) {
    return this.activities.complete(input.id, input.completed);
  }
}
__legacyDecorateClassTS([
  import_nestjs_trpc2.Query({
    input: timelineInput,
    output: timelineOutput,
    meta: restMeta("GET", "/activities", ["Activities"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc2.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ActivitiesRouter.prototype, "timeline", null);
__legacyDecorateClassTS([
  import_nestjs_trpc2.Query({
    input: timelineCountsInput,
    output: timelineCountsOutput,
    meta: restMeta("GET", "/activities/counts", ["Activities"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc2.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ActivitiesRouter.prototype, "timelineCounts", null);
__legacyDecorateClassTS([
  import_nestjs_trpc2.Query({
    input: myTasksInput,
    output: myTasksOutput,
    meta: restMeta("GET", "/activities/my-tasks", ["Activities"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc2.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc2.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ActivitiesRouter.prototype, "myTasks", null);
__legacyDecorateClassTS([
  import_nestjs_trpc2.Mutation({
    input: activityCreateInput,
    output: activityCreateOutput,
    meta: restMeta("POST", "/activities", ["Activities"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc2.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc2.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ActivitiesRouter.prototype, "create", null);
__legacyDecorateClassTS([
  import_nestjs_trpc2.Mutation({
    input: completeInput,
    output: completeOutput,
    meta: restMeta("PATCH", "/activities/{id}/complete", ["Activities"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc2.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ActivitiesRouter.prototype, "complete", null);
ActivitiesRouter = __legacyDecorateClassTS([
  import_nestjs_trpc2.Router({ alias: "activities" }),
  import_nestjs_trpc2.UseMiddlewares(AuthMiddleware),
  __legacyDecorateParamTS(0, import_common12.Inject(ActivitiesService)),
  __legacyMetadataTS("design:paramtypes", [
    typeof ActivitiesService === "undefined" ? Object : ActivitiesService
  ])
], ActivitiesRouter);

// src/activities/activities.module.ts
class ActivitiesModule {
}
ActivitiesModule = __legacyDecorateClassTS([
  import_common13.Module({
    imports: [TrpcModule],
    providers: [ActivitiesService, ActivitiesRouter],
    exports: [ActivitiesService]
  })
], ActivitiesModule);

// src/agent/agent.module.ts
var import_common22 = require("@nestjs/common");

// src/agent/agent-access.service.ts
var import_auth5 = require("@crm/auth");
var import_common14 = require("@nestjs/common");

// src/agent/agent-visibility.ts
var TEAM_AGENT_STATUSES = ["LIVE", "PAUSED", "ARCHIVED"];
function isPrivateAgentDraft(status) {
  return status === "DRAFT" || status === "DEPLOYING";
}
function canReadAgent(status, createdById, userId) {
  return !isPrivateAgentDraft(status) || createdById === userId;
}

// src/agent/agent-access.service.ts
class AgentAccessService {
  db;
  constructor(db) {
    this.db = db;
  }
  async assertMember(userId) {
    const role = await import_auth5.workspaceRoleOf(userId);
    if (!role) {
      throw new import_common14.ForbiddenException("You are not a member of this workspace.");
    }
    return role;
  }
  async assertCanManageInTransaction(tx, agentId, userId) {
    const [member] = await tx.$queryRaw`
			SELECT role
			FROM "member"
			WHERE "organizationId" = ${import_auth5.WORKSPACE_ID}
				AND "userId" = ${userId}
			FOR SHARE
		`;
    if (!member) {
      throw new import_common14.ForbiddenException("You are not a member of this workspace.");
    }
    const role = import_auth5.toWorkspaceRole(member.role);
    const agent = await tx.agentDefinition.findFirst({
      where: { id: agentId, status: { not: "DELETED" } },
      select: {
        id: true,
        createdById: true,
        status: true,
        name: true,
        description: true
      }
    });
    if (!agent) {
      throw new import_common14.NotFoundException(`No agent with id ${agentId}.`);
    }
    if (isPrivateAgentDraft(agent.status) && agent.createdById !== userId) {
      throw new import_common14.NotFoundException(`No agent with id ${agentId}.`);
    }
    if (agent.createdById !== userId && !import_auth5.isWorkspaceAdmin(role)) {
      throw new import_common14.ForbiddenException("Only the creator or a workspace admin can change this agent.");
    }
    return agent;
  }
  async assertCanRead(agentId, userId) {
    const role = await this.assertMember(userId);
    const agent = await this.db.agentDefinition.findFirst({
      where: { id: agentId, status: { not: "DELETED" } },
      select: {
        id: true,
        createdById: true,
        status: true,
        currentVersionId: true
      }
    });
    if (!agent || !canReadAgent(agent.status, agent.createdById, userId)) {
      throw new import_common14.NotFoundException(`No agent with id ${agentId}.`);
    }
    return {
      ...agent,
      role,
      canManage: agent.createdById === userId || import_auth5.isWorkspaceAdmin(role)
    };
  }
}
AgentAccessService = __legacyDecorateClassTS([
  import_common14.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db
  ])
], AgentAccessService);

// src/agent/agent-definitions.service.ts
var import_validation2 = require("@crm/validation");
var import_agent_manifest = require("@crm/validation/agent-manifest");
var import_common16 = require("@nestjs/common");
var import_zod4 = require("zod");

// src/agent/agent-trigger.service.ts
var import_agent_tasks = require("@crm/db/agent-tasks");
var import_fields = require("@crm/db/fields");
var import_idempotency = require("@crm/db/idempotency");
var import_field_backfill = require("@crm/validation/field-backfill");
var import_common15 = require("@nestjs/common");

// src/agent/agent-dispatch.config.ts
var SECOND_MS = 1000;
var MINUTE_MS = 60 * SECOND_MS;
var AGENT_DISPATCH = {
  poke: { timeoutMs: 2 * SECOND_MS },
  heartbeat: { everyMs: MINUTE_MS },
  cancel: {
    errorCode: "CANCELLED_BY_USER",
    message: "A workspace member stopped this run.",
    redeliverWithinMs: 10 * MINUTE_MS,
    redeliverBatch: 20
  },
  fieldBackfill: { concurrency: 8 }
};

// src/agent/bridge.ts
var DEFAULT_AGENT_URL = "http://127.0.0.1:2000";
function bridge() {
  const secret = process.env.AGENT_BRIDGE_SECRET?.trim();
  if (!secret)
    return null;
  const base = process.env.AGENT_URL?.trim() || DEFAULT_AGENT_URL;
  return { url: (path) => new URL(path, base), secret };
}

// src/agent/agent-trigger.service.ts
async function runWithConcurrency(items, concurrency, run) {
  const queue = items[Symbol.iterator]();
  const width = Math.max(1, Math.min(concurrency, items.length));
  await Promise.all(Array.from({ length: width }, async () => {
    for (const item of queue)
      await run(item);
  }));
}

class AgentTriggerService {
  db;
  logger = new import_common15.Logger(AgentTriggerService.name);
  cancellationsDelivered = new Set;
  constructor(db) {
    this.db = db;
  }
  async companyCreated(companyId, reason = "New company") {
    await this.enqueue({
      companyId,
      kind: "brand",
      reason,
      priority: import_agent_tasks.PRIORITY.brand,
      budget: 2
    });
    await this.enqueue({
      companyId,
      kind: "company-profile",
      reason,
      priority: import_agent_tasks.PRIORITY.companyProfile,
      budget: 4
    });
  }
  async companyRequested(companyId, reason) {
    const brand = await this.enqueue({
      companyId,
      kind: "brand",
      reason,
      priority: import_agent_tasks.PRIORITY.brand,
      budget: 2
    }, true);
    const profile = await this.enqueue({
      companyId,
      kind: "company-profile",
      reason,
      priority: import_agent_tasks.PRIORITY.requested,
      budget: 8
    }, true);
    return brand || profile;
  }
  async workspaceChanged(website, reason) {
    await this.enqueue({
      kind: "workspace-profile",
      reason: `${reason} (${website})`,
      priority: import_agent_tasks.PRIORITY.workspace,
      budget: 4
    });
  }
  async contactCreated(contactId, reason, required = false) {
    return this.enqueue({
      contactId,
      kind: "identify",
      reason,
      priority: import_agent_tasks.PRIORITY.identify,
      budget: 4
    }, required);
  }
  async slackPeopleRequested(reason, required = false) {
    await this.enqueue({
      kind: "slack-people-match",
      reason,
      priority: import_agent_tasks.PRIORITY.slackPeople,
      budget: 1
    }, required);
  }
  async slackChannelJoinRequested(channelId, channelName) {
    await this.queueSlackChannelJoin(channelId, channelName);
  }
  async withTasks(work) {
    let queued = false;
    const result = await this.db.$transaction((tx) => work(tx, {
      slackChannelJoinRequested: async (channelId, channelName) => {
        const created = await this.queueSlackChannelJoin(channelId, channelName, tx);
        queued = queued || created;
      }
    }));
    if (queued)
      this.poke();
    return result;
  }
  queueSlackChannelJoin(channelId, channelName, client) {
    return this.enqueue({
      kind: "slack-channel-join",
      reason: `Add Comp AI to #${channelName}`,
      priority: import_agent_tasks.PRIORITY.slackJoin,
      budget: 1,
      subject: { path: ["channelId"], value: channelId },
      payload: {
        type: "slack.channel.join",
        channelId,
        channelName
      }
    }, true, client);
  }
  async withCrmEvents(work) {
    const queued = [];
    const result = await this.db.$transaction((tx) => work(tx, async (input) => {
      await this.createEventTask(tx, input);
      queued.push(input);
    }));
    for (const input of queued) {
      this.logger.log({
        message: "Agent event queued",
        type: input.type,
        recordKind: input.record.kind,
        recordId: input.record.id
      });
    }
    if (queued.length > 0)
      this.poke();
    return result;
  }
  async fieldBackfillRecords(entity, keys, ids, reason) {
    if (ids.length === 0 || keys.length === 0) {
      return { queued: 0, merged: 0 };
    }
    const column = import_fields.RECORD_ID_COLUMNS[entity];
    let queued = 0;
    let merged = 0;
    const queueOne = async (id) => {
      try {
        const outcome = await this.db.$transaction(async (tx) => {
          await import_idempotency.lockIdempotencyKey(tx, `agent-task:field-backfill:${entity}:${id}`);
          const pending = await tx.agentTask.findFirst({
            where: {
              kind: "field-backfill",
              finishedAt: null,
              [column]: id
            },
            select: { id: true, payload: true }
          });
          if (!pending) {
            await tx.agentTask.create({
              data: {
                [column]: id,
                kind: "field-backfill",
                reason,
                priority: import_agent_tasks.PRIORITY.fieldBackfill,
                budget: 8,
                dueAt: new Date,
                payload: { entity, keys }
              }
            });
            return "queued";
          }
          const parsed = import_field_backfill.fieldBackfillPayload.safeParse(pending.payload);
          const priorKeys = parsed.success ? parsed.data.keys : [];
          const nextKeys = [...new Set([...priorKeys, ...keys])];
          if (nextKeys.length === priorKeys.length)
            return "unchanged";
          await tx.agentTask.update({
            where: { id: pending.id },
            data: {
              payload: {
                entity,
                keys: nextKeys
              }
            }
          });
          return "merged";
        });
        if (outcome === "queued")
          queued += 1;
        if (outcome === "merged")
          merged += 1;
      } catch (error) {
        this.logger.error({
          message: "Could not queue agent task",
          kind: "field-backfill",
          entity,
          keys,
          recordId: id
        }, error instanceof Error ? error.stack : String(error));
      }
    };
    await runWithConcurrency(ids, AGENT_DISPATCH.fieldBackfill.concurrency, queueOne);
    this.logger.log({
      message: "Agent task queued",
      kind: "field-backfill",
      entity,
      keys,
      queued,
      merged
    });
    if (queued > 0 || merged > 0)
      this.poke();
    return { queued, merged };
  }
  async meetingSoon(contactId, when) {
    await this.enqueue({
      contactId,
      kind: "meeting-prep",
      reason: `Meeting on ${when.toDateString()} with someone we know nothing about`,
      priority: import_agent_tasks.PRIORITY.meeting,
      budget: 10
    });
  }
  builderConversationQueued() {
    this.pokeRoute("/internal/crm/builder-dispatch");
  }
  deployedAgentRunQueued() {
    this.pokeRoute("/internal/crm/agent-dispatch");
  }
  deployedAgentRunCancelled(runId) {
    this.deliverCancellation(runId);
  }
  async redeliverCancellations() {
    try {
      const since = new Date(Date.now() - AGENT_DISPATCH.cancel.redeliverWithinMs);
      const runs = await this.db.agentRun.findMany({
        where: {
          status: "CANCELLED",
          errorCode: AGENT_DISPATCH.cancel.errorCode,
          startedAt: { not: null },
          finishedAt: { gte: since }
        },
        orderBy: { finishedAt: "desc" },
        take: AGENT_DISPATCH.cancel.redeliverBatch,
        select: { id: true }
      });
      const outstanding = new Set(runs.map((run) => run.id));
      for (const runId of this.cancellationsDelivered) {
        if (!outstanding.has(runId))
          this.cancellationsDelivered.delete(runId);
      }
      for (const run of runs) {
        if (this.cancellationsDelivered.has(run.id))
          continue;
        await this.deliverCancellation(run.id);
      }
    } catch (error) {
      this.logger.error({ message: "Could not redeliver run cancellations" }, error instanceof Error ? error.stack : String(error));
    }
  }
  async deliverCancellation(runId) {
    const delivered = await this.post("/internal/crm/cancel-run", { runId });
    if (delivered)
      this.cancellationsDelivered.add(runId);
  }
  async backfill(input) {
    const subject = input.contactIds ? "contactId" : "companyId";
    const ids = [...new Set(input.contactIds ?? input.companyIds ?? [])];
    if (ids.length === 0)
      return { queued: 0, alreadyQueued: 0 };
    try {
      const outstanding = await this.db.agentTask.findMany({
        where: {
          kind: input.kind,
          finishedAt: null,
          [subject]: { in: ids }
        },
        select: { companyId: true, contactId: true }
      });
      const taken = new Set(outstanding.map((row) => subject === "contactId" ? row.contactId : row.companyId));
      const fresh = ids.filter((id) => !taken.has(id));
      if (fresh.length > 0) {
        await this.db.agentTask.createMany({
          data: fresh.map((id) => ({
            contactId: input.contactIds ? id : null,
            companyId: input.companyIds ? id : null,
            kind: input.kind,
            reason: input.reason,
            priority: input.priority ?? import_agent_tasks.PRIORITY.sweep,
            budget: input.budget ?? 4,
            dueAt: new Date
          }))
        });
      }
      this.logger.log({
        message: "Backfill queued",
        kind: input.kind,
        queued: fresh.length,
        alreadyQueued: ids.length - fresh.length
      });
      if (fresh.length > 0)
        this.poke();
      return {
        queued: fresh.length,
        alreadyQueued: ids.length - fresh.length
      };
    } catch (error) {
      this.logger.error({ message: "Could not queue backfill", kind: input.kind }, error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }
  async enqueue(task, required = false, client) {
    try {
      const write = async (tx) => {
        await import_idempotency.lockIdempotencyKey(tx, `agent-task:${task.kind}:${task.contactId ?? ""}:${task.companyId ?? ""}:${task.subject?.value ?? ""}`);
        const pending = await tx.agentTask.findFirst({
          where: {
            kind: task.kind,
            finishedAt: null,
            contactId: task.contactId ?? undefined,
            companyId: task.companyId ?? undefined,
            payload: task.subject ? { path: task.subject.path, equals: task.subject.value } : undefined
          },
          select: { id: true }
        });
        if (pending)
          return false;
        await tx.agentTask.create({
          data: {
            contactId: task.contactId ?? null,
            companyId: task.companyId ?? null,
            kind: task.kind,
            reason: task.reason,
            priority: task.priority,
            budget: task.budget,
            dueAt: new Date,
            payload: task.payload ?? undefined
          }
        });
        return true;
      };
      const created = client ? await write(client) : await this.db.$transaction(write);
      if (!created)
        return false;
      this.logger.log({
        message: "Agent task queued",
        kind: task.kind,
        contactId: task.contactId,
        companyId: task.companyId
      });
      if (!client)
        this.poke();
      return true;
    } catch (error) {
      this.logger.error({ message: "Could not queue agent task", kind: task.kind }, error instanceof Error ? error.stack : String(error));
      if (required)
        throw error;
      return false;
    }
  }
  async createEventTask(tx, input) {
    const recordIds = {
      contactId: input.record.kind === "contact" ? input.record.id : null,
      companyId: input.record.kind === "company" ? input.record.id : null,
      dealId: input.record.kind === "deal" ? input.record.id : null
    };
    await tx.agentTask.create({
      data: {
        ...recordIds,
        kind: "agent-event",
        reason: input.type,
        payload: {
          type: input.type,
          record: input.record,
          occurredAt: input.occurredAt.toISOString(),
          data: input.data
        },
        priority: import_agent_tasks.PRIORITY.event,
        budget: 1,
        dueAt: new Date
      }
    });
  }
  canReachAgent() {
    return bridge() !== null;
  }
  drainQueues() {
    this.poke();
    this.deployedAgentRunQueued();
    this.builderConversationQueued();
    this.redeliverCancellations();
  }
  poke() {
    this.pokeRoute("/internal/crm/dispatch");
  }
  pokeRoute(path) {
    this.post(path);
  }
  async post(path, body) {
    const agent = bridge();
    if (!agent)
      return false;
    try {
      const headers = new Headers({
        authorization: `Bearer ${agent.secret}`
      });
      if (body)
        headers.set("content-type", "application/json");
      const response = await fetch(agent.url(path), {
        method: "POST",
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(AGENT_DISPATCH.poke.timeoutMs)
      });
      if (!response.ok) {
        throw new Error(`Agent poke returned ${response.status}.`);
      }
      return true;
    } catch (error) {
      this.logger.debug({
        message: "Agent poke did not land; the cron will pick this up",
        reason: error instanceof Error ? error.message : String(error)
      });
      return false;
    }
  }
}
AgentTriggerService = __legacyDecorateClassTS([
  import_common15.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db
  ])
], AgentTriggerService);

// src/agent/agents.contracts.ts
var import_validation = require("@crm/validation");
var import_zod3 = require("zod");
var agentManifest = import_validation.schemas.agents.capabilities.loose();
var agentManifestSummaryOutput = import_zod3.z.object({
  name: import_zod3.z.string().optional(),
  description: import_zod3.z.string().optional(),
  access: import_zod3.z.array(import_zod3.z.string()),
  triggers: import_zod3.z.array(import_zod3.z.object({ type: import_zod3.z.string().optional(), summary: import_zod3.z.string().optional() })),
  actions: import_zod3.z.array(import_zod3.z.object({ summary: import_zod3.z.string().optional() })),
  dataScope: import_zod3.z.object({ summary: import_zod3.z.string().optional() })
});
var agentDefinitionStatus = import_zod3.z.enum([
  "DRAFT",
  "DEPLOYING",
  "LIVE",
  "PAUSED",
  "ARCHIVED",
  "DELETED"
]);
var agentVersionStatus = import_zod3.z.enum([
  "DRAFT",
  "VALIDATING",
  "READY",
  "DEPLOYED",
  "REJECTED"
]);
var agentRunStatus = import_zod3.z.enum([
  "QUEUED",
  "RUNNING",
  "WAITING_FOR_APPROVAL",
  "SUCCEEDED",
  "FAILED",
  "CANCELLED"
]);
var agentActionStatus = import_zod3.z.enum([
  "PLANNED",
  "RUNNING",
  "SUCCEEDED",
  "FAILED",
  "CANCELLED"
]);
var agentTriggerType = import_zod3.z.enum(["MANUAL", "SCHEDULE", "EVENT", "WEBHOOK"]);
var agentUserSummaryOutput = import_zod3.z.object({
  id: import_zod3.z.string(),
  name: import_zod3.z.string(),
  image: import_zod3.z.string().nullable()
});
var agentVersionRefOutput = import_zod3.z.object({
  id: import_zod3.z.string(),
  number: import_zod3.z.number()
});
var agentIdInput = import_zod3.z.object({ id: import_zod3.z.string().min(1) });
var agentHistoryInput = agentIdInput.extend({
  limit: import_zod3.z.number().int().min(1).max(100).default(50)
});
var agentUpdateInput = agentIdInput.extend({
  name: import_zod3.z.string().trim().min(1).max(120),
  description: import_zod3.z.string().trim().max(500).nullable()
});
var agentRunNowInput = agentIdInput.extend({
  clientRequestId: import_zod3.z.uuid()
});
var agentRetryRunInput = agentIdInput.extend({
  runId: import_zod3.z.string().min(1),
  clientRequestId: import_zod3.z.uuid()
});
var agentCancelRunInput = agentIdInput.extend({
  runId: import_zod3.z.string().min(1)
});
var agentDeployInput = agentIdInput.extend({
  versionId: import_zod3.z.string().min(1),
  clientRequestId: import_zod3.z.uuid()
});
var agentReviseInput = agentIdInput.extend({
  clientRequestId: import_zod3.z.uuid(),
  channel: import_zod3.z.object({
    id: import_zod3.z.string().trim().min(1).max(64),
    name: import_zod3.z.string().trim().min(1).max(120)
  }).optional(),
  actions: import_zod3.z.array(import_zod3.z.string().trim().min(1).max(120)).max(20).optional(),
  resources: import_zod3.z.array(import_zod3.z.object({
    id: import_zod3.z.string().trim().min(1).max(160),
    kind: import_zod3.z.enum(["company", "contact", "deal", "integration"]),
    label: import_zod3.z.string().trim().min(1).max(160)
  })).max(50).optional()
});
var agentSaveFileInput = agentIdInput.extend({
  clientRequestId: import_zod3.z.uuid(),
  path: import_zod3.z.string().trim().min(1).max(400),
  content: import_zod3.z.string().max(500000)
});
var agentListItemOutput = import_zod3.z.object({
  id: import_zod3.z.string(),
  name: import_zod3.z.string(),
  description: import_zod3.z.string().nullable(),
  status: agentDefinitionStatus,
  createdAt: import_zod3.z.string(),
  updatedAt: import_zod3.z.string(),
  createdBy: agentUserSummaryOutput,
  currentVersion: import_zod3.z.object({
    id: import_zod3.z.string(),
    number: import_zod3.z.number(),
    deployedAt: import_zod3.z.string().nullable()
  }).nullable(),
  triggers: import_zod3.z.array(import_zod3.z.object({
    id: import_zod3.z.string(),
    type: agentTriggerType,
    name: import_zod3.z.string(),
    nextRunAt: import_zod3.z.string().nullable()
  })),
  runCount: import_zod3.z.number()
});
var agentListOutput = import_zod3.z.array(agentListItemOutput);
var agentReviseOutput = import_zod3.z.object({ versionId: import_zod3.z.string() });
var agentFilesOutput = import_zod3.z.object({
  versionId: import_zod3.z.string().nullable(),
  files: import_zod3.z.array(import_zod3.z.object({
    path: import_zod3.z.string(),
    language: import_zod3.z.string(),
    content: import_zod3.z.string(),
    previousContent: import_zod3.z.string().nullable(),
    revision: import_zod3.z.number()
  }))
});
var agentSaveFileOutput = import_zod3.z.object({
  saved: import_zod3.z.boolean(),
  versionId: import_zod3.z.string().nullable()
});
var agentCapabilitiesResultOutput = import_zod3.z.discriminatedUnion("readable", [
  import_zod3.z.object({
    readable: import_zod3.z.literal(false),
    problem: import_zod3.z.string(),
    actions: import_zod3.z.array(import_validation.schemas.agents.capabilityAction),
    dataScope: import_zod3.z.null(),
    channel: import_zod3.z.null()
  }),
  import_zod3.z.object({
    readable: import_zod3.z.literal(true),
    problem: import_zod3.z.null(),
    actions: import_zod3.z.array(import_validation.schemas.agents.capabilityAction),
    dataScope: import_validation.schemas.agents.capabilities.shape.dataScope,
    channel: import_validation.schemas.agents.capabilityDestination.nullable()
  })
]);
var agentByIdOutput = import_zod3.z.object({
  id: import_zod3.z.string(),
  name: import_zod3.z.string(),
  description: import_zod3.z.string().nullable(),
  status: agentDefinitionStatus,
  createdById: import_zod3.z.string(),
  createdBy: agentUserSummaryOutput,
  canManage: import_zod3.z.boolean(),
  createdAt: import_zod3.z.string(),
  updatedAt: import_zod3.z.string(),
  currentVersion: import_zod3.z.object({
    id: import_zod3.z.string(),
    number: import_zod3.z.number(),
    status: agentVersionStatus,
    manifest: import_zod3.z.unknown(),
    modelId: import_zod3.z.string(),
    sandboxPolicy: import_zod3.z.unknown(),
    approvedAt: import_zod3.z.string().nullable(),
    deployedAt: import_zod3.z.string().nullable()
  }).nullable(),
  reviewVersion: import_zod3.z.object({
    id: import_zod3.z.string(),
    number: import_zod3.z.number(),
    status: import_zod3.z.enum(["DRAFT", "READY"]),
    manifest: agentManifestSummaryOutput,
    modelId: import_zod3.z.string(),
    sandboxPolicy: import_zod3.z.unknown(),
    sourceConversationId: import_zod3.z.string().nullable()
  }).nullable(),
  triggers: import_zod3.z.array(import_zod3.z.object({
    id: import_zod3.z.string(),
    type: agentTriggerType,
    name: import_zod3.z.string(),
    config: import_zod3.z.unknown(),
    enabled: import_zod3.z.boolean(),
    nextRunAt: import_zod3.z.string().nullable(),
    lastRunAt: import_zod3.z.string().nullable()
  })),
  runCount: import_zod3.z.number(),
  capabilities: agentCapabilitiesResultOutput
});
var agentRunEventOutput = import_zod3.z.object({
  id: import_zod3.z.string(),
  sequence: import_zod3.z.number(),
  type: import_zod3.z.string(),
  data: import_zod3.z.unknown(),
  emittedAt: import_zod3.z.string()
});
var agentRunActionOutput = import_zod3.z.object({
  id: import_zod3.z.string(),
  type: import_zod3.z.string(),
  provider: import_zod3.z.string(),
  targetType: import_zod3.z.string().nullable(),
  targetId: import_zod3.z.string().nullable(),
  targetLabel: import_zod3.z.string().nullable(),
  summary: import_zod3.z.string(),
  status: agentActionStatus,
  externalId: import_zod3.z.string().nullable(),
  attemptCount: import_zod3.z.number(),
  errorCode: import_zod3.z.string().nullable(),
  errorMessage: import_zod3.z.string().nullable(),
  plannedAt: import_zod3.z.string(),
  startedAt: import_zod3.z.string().nullable(),
  completedAt: import_zod3.z.string().nullable()
});
var agentRunSummaryOutput = import_zod3.z.object({
  id: import_zod3.z.string(),
  status: agentRunStatus,
  triggerType: agentTriggerType,
  summary: import_zod3.z.string().nullable(),
  modelId: import_zod3.z.string().nullable(),
  inputTokens: import_zod3.z.number().nullable(),
  outputTokens: import_zod3.z.number().nullable(),
  costUsd: import_zod3.z.string().nullable(),
  errorCode: import_zod3.z.string().nullable(),
  errorMessage: import_zod3.z.string().nullable(),
  createdAt: import_zod3.z.string(),
  startedAt: import_zod3.z.string().nullable(),
  finishedAt: import_zod3.z.string().nullable(),
  initiatedBy: agentUserSummaryOutput.nullable(),
  version: agentVersionRefOutput,
  totalEvents: import_zod3.z.number(),
  eventsTruncated: import_zod3.z.boolean(),
  canCancel: import_zod3.z.boolean(),
  events: import_zod3.z.array(agentRunEventOutput),
  actions: import_zod3.z.array(agentRunActionOutput)
});
var agentHistoryOutput = import_zod3.z.array(agentRunSummaryOutput);
var agentAuditEventOutput = import_zod3.z.object({
  id: import_zod3.z.string(),
  type: import_zod3.z.string(),
  summary: import_zod3.z.string(),
  before: import_zod3.z.unknown().nullable(),
  after: import_zod3.z.unknown().nullable(),
  requestId: import_zod3.z.string().nullable(),
  emittedAt: import_zod3.z.string(),
  actorType: import_zod3.z.string(),
  actorId: import_zod3.z.string().nullable(),
  actorUser: agentUserSummaryOutput.nullable(),
  version: agentVersionRefOutput.nullable()
});
var agentActivityOutput = import_zod3.z.array(agentAuditEventOutput);
var agentUpdateOutput = import_zod3.z.object({
  id: import_zod3.z.string(),
  name: import_zod3.z.string(),
  description: import_zod3.z.string().nullable(),
  status: agentDefinitionStatus
});
var agentDeployOutput = import_zod3.z.object({
  id: import_zod3.z.string(),
  versionId: import_zod3.z.string(),
  status: import_zod3.z.literal("LIVE")
});
var agentPauseOutput = import_zod3.z.object({
  id: import_zod3.z.string(),
  name: import_zod3.z.string(),
  status: import_zod3.z.literal("PAUSED"),
  updatedAt: import_zod3.z.string()
});
var agentResumeOutput = import_zod3.z.object({
  id: import_zod3.z.string(),
  name: import_zod3.z.string(),
  status: import_zod3.z.literal("LIVE"),
  updatedAt: import_zod3.z.string()
});
var agentArchiveOutput = import_zod3.z.object({
  id: import_zod3.z.string(),
  name: import_zod3.z.string(),
  status: import_zod3.z.literal("ARCHIVED"),
  updatedAt: import_zod3.z.string()
});
var agentRestoreOutput = import_zod3.z.object({
  id: import_zod3.z.string(),
  name: import_zod3.z.string(),
  status: import_zod3.z.literal("PAUSED"),
  updatedAt: import_zod3.z.string()
});
var agentRemoveOutput = import_zod3.z.object({
  id: import_zod3.z.string(),
  name: import_zod3.z.string(),
  status: import_zod3.z.literal("DELETED"),
  updatedAt: import_zod3.z.string(),
  disabledTriggers: import_zod3.z.number(),
  cancelledRuns: import_zod3.z.number()
});
var agentRunNowOutput = import_zod3.z.object({ id: import_zod3.z.string() });
var agentRetryRunOutput = import_zod3.z.object({ id: import_zod3.z.string() });
var agentCancelRunOutput = import_zod3.z.object({
  id: import_zod3.z.string(),
  status: agentRunStatus,
  cancelled: import_zod3.z.boolean()
});

// src/agent/agent-definitions.service.ts
var INSTRUCTIONS_PATH = "agent/instructions.md";
var capabilityName = import_zod4.z.string().nullable().catch(null);
var versionValidation = import_zod4.z.object({ capabilities: import_zod4.z.array(import_zod4.z.json()).catch([]) }).catchall(import_zod4.z.json()).catch({ capabilities: [] });

class AgentDefinitionsService {
  db;
  access;
  trigger;
  constructor(db, access, trigger) {
    this.db = db;
    this.access = access;
    this.trigger = trigger;
  }
  async list(userId) {
    await this.access.assertMember(userId);
    const rows = await this.db.agentDefinition.findMany({
      where: { status: { in: [...TEAM_AGENT_STATUSES] } },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        createdBy: { select: { id: true, name: true, image: true } },
        currentVersion: {
          select: { id: true, number: true, deployedAt: true }
        },
        triggers: {
          where: { enabled: true },
          orderBy: { nextRunAt: "asc" },
          take: 1,
          select: { id: true, type: true, name: true, nextRunAt: true }
        },
        _count: { select: { runs: true } }
      }
    });
    return rows.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      currentVersion: row.currentVersion ? {
        ...row.currentVersion,
        deployedAt: row.currentVersion.deployedAt?.toISOString() ?? null
      } : null,
      triggers: row.triggers.map((trigger) => ({
        ...trigger,
        nextRunAt: trigger.nextRunAt?.toISOString() ?? null
      })),
      runCount: row._count.runs
    }));
  }
  async byId(id, userId) {
    await this.access.assertCanRead(id, userId);
    const row = await this.db.agentDefinition.findFirst({
      where: { id, status: { not: "DELETED" } },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdById: true,
        createdAt: true,
        updatedAt: true,
        createdBy: { select: { id: true, name: true, image: true } },
        currentVersion: {
          select: {
            id: true,
            number: true,
            status: true,
            manifest: true,
            modelId: true,
            sandboxPolicy: true,
            approvedAt: true,
            deployedAt: true
          }
        },
        versions: {
          where: { status: { in: ["DRAFT", "READY"] } },
          orderBy: { number: "desc" },
          take: 1,
          select: {
            id: true,
            number: true,
            status: true,
            manifest: true,
            modelId: true,
            sandboxPolicy: true,
            sourceConversationId: true
          }
        },
        triggers: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            type: true,
            name: true,
            config: true,
            enabled: true,
            nextRunAt: true,
            lastRunAt: true
          }
        },
        _count: { select: { runs: true } }
      }
    });
    if (!row)
      throw new import_common16.NotFoundException(`No agent with id ${id}.`);
    const { versions, ...agent } = row;
    const draft = versions[0];
    return {
      ...agent,
      canManage: agent.createdById === userId || await this.canAdmin(userId),
      createdAt: agent.createdAt.toISOString(),
      updatedAt: agent.updatedAt.toISOString(),
      currentVersion: agent.currentVersion ? {
        ...agent.currentVersion,
        approvedAt: agent.currentVersion.approvedAt?.toISOString() ?? null,
        deployedAt: agent.currentVersion.deployedAt?.toISOString() ?? null
      } : null,
      reviewVersion: agent.status === "DRAFT" && draft ? { ...draft, manifest: import_agent_manifest.readAgentManifestSummary(draft.manifest) } : null,
      triggers: agent.triggers.map((trigger) => ({
        ...trigger,
        nextRunAt: trigger.nextRunAt?.toISOString() ?? null,
        lastRunAt: trigger.lastRunAt?.toISOString() ?? null
      })),
      runCount: agent._count.runs,
      capabilities: readCapabilities(agent.currentVersion?.manifest ?? draft?.manifest)
    };
  }
  async update(input, userId) {
    const description = input.description?.trim() || null;
    const updated = await this.db.$transaction(async (tx) => {
      await this.access.assertCanManageInTransaction(tx, input.id, userId);
      const agent = await this.lockAgent(tx, input.id);
      const row = await tx.agentDefinition.update({
        where: { id: input.id },
        data: { name: input.name, description },
        select: { id: true, name: true, description: true, status: true }
      });
      await tx.agentAuditEvent.create({
        data: {
          agentId: input.id,
          actorUserId: userId,
          actorType: "USER",
          actorId: userId,
          type: "agent.updated",
          summary: "Changed agent details",
          before: { name: agent.name, description: agent.description },
          after: { name: input.name, description }
        }
      });
      return row;
    });
    return updated;
  }
  async files(id, userId) {
    await this.access.assertCanRead(id, userId);
    const agent = await this.db.agentDefinition.findFirst({
      where: { id, status: { not: "DELETED" } },
      select: { currentVersionId: true }
    });
    if (!agent?.currentVersionId)
      return { versionId: null, files: [] };
    const rows = await this.db.agentBuilderArtifact.findMany({
      where: { versionId: agent.currentVersionId },
      orderBy: [{ path: "asc" }, { revision: "desc" }],
      select: {
        path: true,
        language: true,
        content: true,
        previousContent: true,
        revision: true
      }
    });
    const latest = new Map;
    for (const row of rows)
      if (!latest.has(row.path))
        latest.set(row.path, row);
    return {
      versionId: agent.currentVersionId,
      files: [...latest.values()]
    };
  }
  async saveFile(input, userId) {
    return this.db.$transaction(async (tx) => {
      await this.access.assertCanManageInTransaction(tx, input.id, userId);
      const agent = await this.lockAgent(tx, input.id);
      const replay = await tx.agentAuditEvent.findFirst({
        where: {
          agentId: input.id,
          type: "agent.file.saved",
          requestId: input.clientRequestId
        },
        select: { versionId: true }
      });
      if (replay)
        return { saved: false, versionId: replay.versionId };
      if (!agent.currentVersionId) {
        throw new import_common16.BadRequestException("This agent has no deployed version.");
      }
      const current = await tx.agentVersion.findFirstOrThrow({
        where: { id: agent.currentVersionId },
        select: {
          status: true,
          instructions: true,
          manifest: true,
          modelId: true,
          modelContextWindowTokens: true,
          sandboxPolicy: true,
          validation: true,
          sourceConversationId: true,
          deployedAt: true,
          approvedAt: true
        }
      });
      const file = await tx.agentBuilderArtifact.findFirst({
        where: { versionId: agent.currentVersionId, path: input.path },
        orderBy: { revision: "desc" }
      });
      if (!file)
        throw new import_common16.NotFoundException(`No file at ${input.path}.`);
      if (file.content === input.content) {
        return { saved: false, versionId: agent.currentVersionId };
      }
      const version = await tx.agentVersion.create({
        data: {
          agentId: input.id,
          number: await nextVersionNumber(tx, input.id),
          status: current.status,
          instructions: input.path === INSTRUCTIONS_PATH ? input.content : current.instructions,
          manifest: current.manifest,
          modelId: current.modelId,
          modelContextWindowTokens: current.modelContextWindowTokens,
          sandboxPolicy: current.sandboxPolicy,
          validation: current.validation,
          sourceConversationId: current.sourceConversationId,
          approvedAt: current.approvedAt,
          deployedAt: current.deployedAt,
          createdById: userId
        },
        select: { id: true }
      });
      await carryArtifactsForward(tx, agent.currentVersionId, version.id);
      await tx.agentBuilderArtifact.updateMany({
        where: { versionId: version.id, path: input.path },
        data: { previousContent: file.content, content: input.content }
      });
      await tx.agentDefinition.update({
        where: { id: input.id },
        data: { currentVersionId: version.id }
      });
      const repointed = await tx.agentTrigger.updateMany({
        where: { agentId: input.id, versionId: agent.currentVersionId },
        data: { versionId: version.id }
      });
      await tx.agentAuditEvent.create({
        data: {
          agentId: input.id,
          versionId: version.id,
          actorUserId: userId,
          actorType: "USER",
          actorId: userId,
          type: "agent.file.saved",
          summary: `Edited ${input.path}`,
          before: { path: input.path, bytes: file.content.length },
          after: {
            path: input.path,
            bytes: input.content.length,
            triggers: repointed.count
          },
          requestId: input.clientRequestId
        }
      });
      return { saved: true, versionId: version.id };
    });
  }
  async revise(input, userId) {
    const versionId = await this.trigger.withTasks(async (tx, queue) => {
      await this.access.assertCanManageInTransaction(tx, input.id, userId);
      const agent = await this.lockAgent(tx, input.id);
      const replay = await tx.agentAuditEvent.findFirst({
        where: {
          agentId: input.id,
          type: "agent.revised",
          requestId: input.clientRequestId
        },
        select: { versionId: true }
      });
      if (replay)
        return replay.versionId;
      if (!agent.currentVersionId) {
        throw new import_common16.BadRequestException("This agent has no deployed version.");
      }
      const current = await tx.agentVersion.findFirstOrThrow({
        where: { id: agent.currentVersionId },
        select: {
          status: true,
          instructions: true,
          manifest: true,
          modelId: true,
          modelContextWindowTokens: true,
          sandboxPolicy: true,
          validation: true,
          sourceConversationId: true,
          deployedAt: true,
          approvedAt: true
        }
      });
      const parsed = agentManifest.safeParse(current.manifest);
      if (!parsed.success) {
        throw new import_common16.BadRequestException("This version's manifest cannot be read, so it cannot be changed.");
      }
      const manifest = parsed.data;
      const before = manifest.actions.find((action) => action.destination !== undefined);
      let actions = manifest.actions;
      if (input.actions) {
        const keep = new Set(input.actions);
        actions = actions.filter((action) => keep.has(action.type));
        if (actions.length === 0) {
          throw new import_common16.BadRequestException("An agent needs at least one action.");
        }
      }
      const channel = input.channel;
      if (channel) {
        if (!actions.some((action) => action.destination !== undefined)) {
          throw new import_common16.BadRequestException("None of this agent's actions post to a channel, so its channel cannot be changed.");
        }
        actions = actions.map((action) => action.destination ? {
          ...action,
          destination: {
            ...action.destination,
            id: channel.id,
            label: `#${channel.name}`
          }
        } : action);
      }
      const dataScope = input.resources ? {
        ...manifest.dataScope,
        mode: input.resources.length > 0 ? "SELECTED" : "WORKSPACE",
        resources: input.resources
      } : manifest.dataScope;
      const version = await tx.agentVersion.create({
        data: {
          agentId: input.id,
          number: await nextVersionNumber(tx, input.id),
          status: current.status,
          instructions: current.instructions,
          manifest: {
            ...manifest,
            actions,
            dataScope
          },
          modelId: current.modelId,
          modelContextWindowTokens: current.modelContextWindowTokens,
          sandboxPolicy: current.sandboxPolicy,
          validation: reviseValidation(current.validation, manifest.actions.map((action) => action.type), actions.map((action) => action.type)),
          sourceConversationId: current.sourceConversationId,
          approvedAt: current.approvedAt,
          deployedAt: current.deployedAt,
          createdById: userId
        },
        select: { id: true }
      });
      await carryArtifactsForward(tx, agent.currentVersionId, version.id);
      await tx.agentDefinition.update({
        where: { id: input.id },
        data: { currentVersionId: version.id }
      });
      const repointed = await tx.agentTrigger.updateMany({
        where: { agentId: input.id, versionId: agent.currentVersionId },
        data: { versionId: version.id }
      });
      if (channel && channel.id !== before?.destination?.id) {
        await queue.slackChannelJoinRequested(channel.id, channel.name);
      }
      await tx.agentAuditEvent.create({
        data: {
          agentId: input.id,
          versionId: version.id,
          actorUserId: userId,
          actorType: "USER",
          actorId: userId,
          type: "agent.revised",
          summary: reviseSummary(input),
          before: {
            channel: before?.destination?.label ?? null,
            actions: manifest.actions.map((action) => action.type),
            resources: manifest.dataScope.resources.length
          },
          after: {
            channel: channel ? `#${channel.name}` : null,
            actions: input.actions ?? null,
            resources: input.resources?.length ?? null,
            triggers: repointed.count
          },
          requestId: input.clientRequestId
        }
      });
      return version.id;
    });
    return { versionId };
  }
  async deploy(input, userId) {
    return this.db.$transaction(async (tx) => {
      await this.access.assertCanManageInTransaction(tx, input.id, userId);
      const agent = await this.lockAgent(tx, input.id);
      const existing = await tx.agentAuditEvent.findFirst({
        where: {
          agentId: input.id,
          type: "agent.deployed",
          requestId: input.clientRequestId
        },
        select: { versionId: true }
      });
      if (existing) {
        if (existing.versionId !== input.versionId) {
          throw new import_common16.BadRequestException("That deployment request has already been used.");
        }
        return { id: input.id, versionId: input.versionId, status: "LIVE" };
      }
      const version = await tx.agentVersion.findFirst({
        where: { id: input.versionId, agentId: input.id },
        select: { id: true, number: true, status: true, manifest: true }
      });
      if (!version) {
        throw new import_common16.NotFoundException(`No version with id ${input.versionId}.`);
      }
      if (version.status !== "READY" && version.status !== "DEPLOYED") {
        throw new import_common16.BadRequestException("Only a validated agent version can be deployed.");
      }
      const metadata = versionMetadata(version.manifest);
      const now = new Date;
      await tx.agentVersion.updateMany({
        where: {
          agentId: input.id,
          status: "DEPLOYED",
          id: { not: input.versionId }
        },
        data: { status: "READY" }
      });
      await tx.agentVersion.update({
        where: { id: input.versionId },
        data: {
          status: "DEPLOYED",
          approvedAt: now,
          deployedAt: now
        }
      });
      await tx.agentDefinition.update({
        where: { id: input.id },
        data: {
          currentVersionId: input.versionId,
          status: "LIVE",
          archivedAt: null,
          ...metadata
        }
      });
      await tx.agentTrigger.updateMany({
        where: { agentId: input.id },
        data: { enabled: false }
      });
      await tx.agentTrigger.updateMany({
        where: { agentId: input.id, versionId: input.versionId },
        data: { enabled: true }
      });
      await tx.agentAuditEvent.create({
        data: {
          agentId: input.id,
          versionId: input.versionId,
          actorUserId: userId,
          actorType: "USER",
          actorId: userId,
          type: "agent.deployed",
          summary: `Made version ${version.number} live for the team`,
          before: { status: agent.status },
          after: { status: "LIVE", version: version.number, ...metadata },
          requestId: input.clientRequestId
        }
      });
      return { id: input.id, versionId: input.versionId, status: "LIVE" };
    });
  }
  async pause(id, userId) {
    return this.changeStatus(id, userId, ["LIVE"], "PAUSED", "agent.paused", "Paused agent", "Only a live agent can be paused.");
  }
  async resume(id, userId) {
    return this.changeStatus(id, userId, ["PAUSED"], "LIVE", "agent.resumed", "Resumed agent", "Only a paused agent can be resumed.");
  }
  async archive(id, userId) {
    return this.changeStatus(id, userId, ["LIVE", "PAUSED"], "ARCHIVED", "agent.archived", "Archived agent", "Only a live or paused agent can be archived.", { archivedAt: new Date });
  }
  async restore(id, userId) {
    return this.changeStatus(id, userId, ["ARCHIVED"], "PAUSED", "agent.restored", "Restored agent", "Only an archived agent can be restored.", { archivedAt: null });
  }
  async remove(id, userId) {
    const now = new Date;
    return this.db.$transaction(async (tx) => {
      await this.access.assertCanManageInTransaction(tx, id, userId);
      const [current] = await tx.$queryRaw`
				SELECT id, status
				FROM "agentDefinition"
				WHERE id = ${id}
				FOR UPDATE
			`;
      if (!current || current.status === "DELETED") {
        throw new import_common16.NotFoundException(`No agent with id ${id}.`);
      }
      const disabledTriggers = await tx.agentTrigger.updateMany({
        where: { agentId: id, enabled: true },
        data: { enabled: false, nextRunAt: null }
      });
      const cancellableRuns = await tx.$queryRaw`
				SELECT id
				FROM "agentRun"
				WHERE "agentId" = ${id}
					AND (
						status IN ('QUEUED', 'WAITING_FOR_APPROVAL')
						OR (status = 'RUNNING' AND "sessionId" IS NULL)
					)
				ORDER BY id
				FOR UPDATE
			`;
      for (const run of cancellableRuns) {
        const cancelled = await tx.agentRun.update({
          where: { id: run.id },
          data: {
            status: "CANCELLED",
            finishedAt: now,
            errorCode: "AGENT_DELETED",
            errorMessage: "The agent was deleted before this run completed.",
            nextEventSequence: { increment: 1 }
          },
          select: { nextEventSequence: true }
        });
        await tx.agentRunEvent.create({
          data: {
            runId: run.id,
            sequence: cancelled.nextEventSequence,
            type: "run.cancelled",
            data: { reason: "agent.deleted" },
            emittedAt: now
          }
        });
      }
      const agent = await tx.agentDefinition.update({
        where: { id },
        data: { status: "DELETED", deletedAt: now },
        select: { id: true, name: true, status: true, updatedAt: true }
      });
      await tx.agentAuditEvent.create({
        data: {
          agentId: id,
          actorUserId: userId,
          actorType: "USER",
          actorId: userId,
          type: "agent.deleted",
          summary: "Deleted agent",
          before: { status: current.status },
          after: {
            status: "DELETED",
            disabledTriggers: disabledTriggers.count,
            cancelledRuns: cancellableRuns.length
          }
        }
      });
      return {
        ...agent,
        updatedAt: agent.updatedAt.toISOString(),
        disabledTriggers: disabledTriggers.count,
        cancelledRuns: cancellableRuns.length
      };
    });
  }
  async changeStatus(id, userId, allowedFrom, status, type, summary, invalidStatusMessage, extra = {}) {
    return this.db.$transaction(async (tx) => {
      await this.access.assertCanManageInTransaction(tx, id, userId);
      const before = await this.lockAgent(tx, id);
      if (!allowedFrom.includes(before.status)) {
        throw new import_common16.BadRequestException(invalidStatusMessage);
      }
      const agent = await tx.agentDefinition.update({
        where: { id },
        data: { status, ...extra },
        select: { id: true, name: true, status: true, updatedAt: true }
      });
      await tx.agentAuditEvent.create({
        data: {
          agentId: id,
          actorUserId: userId,
          actorType: "USER",
          actorId: userId,
          type,
          summary,
          before: { status: before.status },
          after: { status }
        }
      });
      return { ...agent, updatedAt: agent.updatedAt.toISOString() };
    });
  }
  async lockAgent(tx, id) {
    const [agent] = await tx.$queryRaw`
			SELECT id, status, name, description, "currentVersionId"
			FROM "agentDefinition"
			WHERE id = ${id}
			FOR UPDATE
		`;
    if (!agent || agent.status === "DELETED") {
      throw new import_common16.NotFoundException(`No agent with id ${id}.`);
    }
    return agent;
  }
  async canAdmin(userId) {
    const role = await this.access.assertMember(userId);
    return role === "owner" || role === "admin";
  }
}
AgentDefinitionsService = __legacyDecorateClassTS([
  import_common16.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof AgentAccessService === "undefined" ? Object : AgentAccessService,
    typeof AgentTriggerService === "undefined" ? Object : AgentTriggerService
  ])
], AgentDefinitionsService);
function versionMetadata(manifest) {
  const summary = import_agent_manifest.readAgentManifestSummary(manifest);
  const name = summary.name?.trim() ?? "";
  const description = summary.description === undefined ? undefined : summary.description.trim() || null;
  const metadata = {};
  if (name)
    metadata.name = name;
  if (description !== undefined)
    metadata.description = description;
  return metadata;
}
function readCapabilities(manifest) {
  const parsed = import_validation2.schemas.agents.capabilities.safeParse(manifest);
  if (!parsed.success) {
    return {
      readable: false,
      problem: parsed.error.issues.map((issue) => `${issue.path.join(".") || "manifest"} ${issue.message}`).join("; "),
      actions: [],
      dataScope: null,
      channel: null
    };
  }
  const slack = parsed.data.actions.find((action) => action.destination !== undefined);
  return {
    readable: true,
    problem: null,
    actions: parsed.data.actions,
    dataScope: parsed.data.dataScope,
    channel: slack?.destination ?? null
  };
}
function reviseSummary(input) {
  const parts = [];
  if (input.channel)
    parts.push(`moved to #${input.channel.name}`);
  if (input.actions)
    parts.push(`${input.actions.length} actions`);
  if (input.resources)
    parts.push(`${input.resources.length} records`);
  return parts.length > 0 ? `Changed ${parts.join(", ")}` : "Changed settings";
}
function reviseValidation(validation, before, after) {
  const removed = before.filter((type) => !after.includes(type));
  const base = versionValidation.parse(validation);
  const capabilities = base.capabilities.flatMap((entry) => {
    const name = capabilityName.parse(entry);
    return name !== null && !removed.includes(name) ? [name] : [];
  });
  return {
    ...base,
    status: "passed",
    checkedAt: new Date().toISOString(),
    capabilities
  };
}
async function nextVersionNumber(tx, agentId) {
  const latest = await tx.agentVersion.findFirst({
    where: { agentId },
    orderBy: { number: "desc" },
    select: { number: true }
  });
  return (latest?.number ?? 0) + 1;
}
async function carryArtifactsForward(tx, fromVersionId, toVersionId) {
  const rows = await tx.agentBuilderArtifact.findMany({
    where: { versionId: fromVersionId },
    orderBy: [{ path: "asc" }, { revision: "desc" }]
  });
  const latest = new Map;
  for (const row of rows)
    if (!latest.has(row.path))
      latest.set(row.path, row);
  if (latest.size === 0)
    return;
  await tx.agentBuilderArtifact.createMany({
    data: [...latest.values()].map((row) => ({
      versionId: toVersionId,
      path: row.path,
      language: row.language,
      content: row.content,
      previousContent: row.previousContent,
      revision: row.revision,
      status: row.status
    }))
  });
}

// src/agent/agent-queue.service.ts
var import_common17 = require("@nestjs/common");
class AgentQueueService {
  db;
  constructor(db) {
    this.db = db;
  }
  async queuedCompanies(ids) {
    if (ids.length === 0)
      return new Set;
    const rows = await this.db.agentTask.findMany({
      where: this.due({ companyId: { in: [...ids] } }),
      select: { companyId: true },
      distinct: ["companyId"]
    });
    return this.identifiers(rows.map((row) => row.companyId));
  }
  async queuedContacts(ids) {
    if (ids.length === 0)
      return new Set;
    const rows = await this.db.agentTask.findMany({
      where: this.due({ contactId: { in: [...ids] } }),
      select: { contactId: true },
      distinct: ["contactId"]
    });
    return this.identifiers(rows.map((row) => row.contactId));
  }
  async isQueued(subject) {
    const row = await this.db.agentTask.findFirst({
      where: this.due({
        companyId: subject.companyId,
        contactId: subject.contactId
      }),
      select: { id: true }
    });
    return row !== null;
  }
  due(subject) {
    return { ...subject, finishedAt: null, dueAt: { lte: new Date } };
  }
  identifiers(values) {
    return new Set(values.filter((value) => value !== null));
  }
}
AgentQueueService = __legacyDecorateClassTS([
  import_common17.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db
  ])
], AgentQueueService);

// src/agent/agent-runs.service.ts
var import_node_crypto = require("node:crypto");
var import_db5 = require("@crm/db");
var import_idempotency2 = require("@crm/db/idempotency");
var import_common18 = require("@nestjs/common");
var CANCELLABLE_STATUSES = [
  "QUEUED",
  "RUNNING",
  "WAITING_FOR_APPROVAL"
];
var RUN_EVENT_LIMIT = 200;

class AgentRunsService {
  db;
  access;
  trigger;
  constructor(db, access, trigger) {
    this.db = db;
    this.access = access;
    this.trigger = trigger;
  }
  async list(agentId, limit, userId) {
    const agent = await this.readableAgent(agentId, userId);
    const rows = await this.db.agentRun.findMany({
      where: { agentId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        status: true,
        triggerType: true,
        summary: true,
        modelId: true,
        inputTokens: true,
        outputTokens: true,
        costUsd: true,
        errorCode: true,
        errorMessage: true,
        createdAt: true,
        startedAt: true,
        finishedAt: true,
        initiatedBy: { select: { id: true, name: true, image: true } },
        version: { select: { id: true, number: true } },
        _count: { select: { events: true } },
        events: {
          orderBy: { sequence: "asc" },
          take: RUN_EVENT_LIMIT,
          select: {
            id: true,
            sequence: true,
            type: true,
            data: true,
            emittedAt: true
          }
        },
        actions: {
          orderBy: { plannedAt: "asc" },
          select: {
            id: true,
            type: true,
            provider: true,
            targetType: true,
            targetId: true,
            targetLabel: true,
            summary: true,
            status: true,
            externalId: true,
            attemptCount: true,
            errorCode: true,
            errorMessage: true,
            plannedAt: true,
            startedAt: true,
            completedAt: true
          }
        }
      }
    });
    return rows.map(({ _count, ...run }) => ({
      ...run,
      totalEvents: _count.events,
      eventsTruncated: _count.events > run.events.length,
      canCancel: CANCELLABLE_STATUSES.includes(run.status) && (agent.canManage || run.initiatedBy?.id === userId),
      costUsd: run.costUsd?.toString() ?? null,
      createdAt: run.createdAt.toISOString(),
      startedAt: run.startedAt?.toISOString() ?? null,
      finishedAt: run.finishedAt?.toISOString() ?? null,
      events: run.events.map((event) => ({
        ...event,
        emittedAt: event.emittedAt.toISOString()
      })),
      actions: run.actions.map((action) => ({
        ...action,
        plannedAt: action.plannedAt.toISOString(),
        startedAt: action.startedAt?.toISOString() ?? null,
        completedAt: action.completedAt?.toISOString() ?? null
      }))
    }));
  }
  async activity(agentId, limit, userId) {
    await this.readableAgent(agentId, userId);
    const rows = await this.db.agentAuditEvent.findMany({
      where: { agentId },
      orderBy: { emittedAt: "desc" },
      take: limit,
      select: {
        id: true,
        type: true,
        summary: true,
        before: true,
        after: true,
        requestId: true,
        emittedAt: true,
        actorType: true,
        actorId: true,
        actorUser: { select: { id: true, name: true, image: true } },
        version: { select: { id: true, number: true } }
      }
    });
    return rows.map((event) => ({
      ...event,
      emittedAt: event.emittedAt.toISOString()
    }));
  }
  async runNow(input, userId) {
    await this.access.assertMember(userId);
    const existing = await this.db.agentRun.findUnique({
      where: { idempotencyKey: input.clientRequestId },
      select: { id: true, agentId: true }
    });
    if (existing) {
      this.assertReplayMatches(existing.agentId, input.id);
      this.trigger.deployedAgentRunQueued();
      return { id: existing.id };
    }
    const run = await this.db.$transaction(async (tx) => {
      await import_idempotency2.lockIdempotencyKey(tx, input.clientRequestId);
      const replay = await tx.agentRun.findUnique({
        where: { idempotencyKey: input.clientRequestId },
        select: { id: true, agentId: true }
      });
      if (replay) {
        this.assertReplayMatches(replay.agentId, input.id);
        return { id: replay.id };
      }
      const [agent] = await tx.$queryRaw`
					SELECT id, status, "currentVersionId"
					FROM "agentDefinition"
					WHERE id = ${input.id}
					FOR UPDATE
				`;
      if (!agent || agent.status === "DELETED") {
        throw new import_common18.NotFoundException(`No agent with id ${input.id}.`);
      }
      if (agent.status !== "LIVE" || !agent.currentVersionId) {
        throw new import_common18.BadRequestException("This agent is not live yet.");
      }
      const active = await tx.agentRun.findFirst({
        where: {
          agentId: input.id,
          status: { in: [...CANCELLABLE_STATUSES] }
        },
        select: { id: true }
      });
      if (active) {
        throw new import_common18.ConflictException("This agent already has an active run. Stop it or wait for it to finish.");
      }
      const created = await tx.agentRun.create({
        data: {
          agentId: input.id,
          versionId: agent.currentVersionId,
          initiatedById: userId,
          triggerType: "MANUAL",
          idempotencyKey: input.clientRequestId,
          correlationId: import_node_crypto.randomUUID(),
          events: {
            create: { sequence: 0, type: "run.queued", data: {} }
          }
        },
        select: { id: true }
      });
      await tx.agentAuditEvent.create({
        data: {
          agentId: input.id,
          versionId: agent.currentVersionId,
          actorUserId: userId,
          actorType: "USER",
          actorId: userId,
          type: "run.requested",
          summary: "Requested a manual run",
          requestId: input.clientRequestId
        }
      });
      return created;
    });
    this.trigger.deployedAgentRunQueued();
    return run;
  }
  async retryRun(input, userId) {
    await this.access.assertMember(userId);
    const run = await this.db.$transaction(async (tx) => {
      await import_idempotency2.lockIdempotencyKey(tx, input.clientRequestId);
      const replay = await tx.agentRun.findUnique({
        where: { idempotencyKey: input.clientRequestId },
        select: { id: true, agentId: true }
      });
      if (replay) {
        this.assertReplayMatches(replay.agentId, input.id);
        return { id: replay.id };
      }
      const previous = await tx.agentRun.findUnique({
        where: { id: input.runId },
        select: {
          agentId: true,
          status: true,
          versionId: true,
          triggerId: true,
          triggerType: true,
          input: true
        }
      });
      if (!previous || previous.agentId !== input.id) {
        throw new import_common18.NotFoundException(`No run with id ${input.runId}.`);
      }
      if (CANCELLABLE_STATUSES.includes(previous.status)) {
        throw new import_common18.ConflictException("This run has not finished yet.");
      }
      const [agent] = await tx.$queryRaw`
					SELECT id, status, "currentVersionId"
					FROM "agentDefinition"
					WHERE id = ${input.id}
					FOR UPDATE
				`;
      if (!agent || agent.status === "DELETED") {
        throw new import_common18.NotFoundException(`No agent with id ${input.id}.`);
      }
      if (agent.status !== "LIVE" || !agent.currentVersionId) {
        throw new import_common18.BadRequestException("This agent is not live yet.");
      }
      const active = await tx.agentRun.findFirst({
        where: { agentId: input.id, status: { in: [...CANCELLABLE_STATUSES] } },
        select: { id: true }
      });
      if (active) {
        throw new import_common18.ConflictException("This agent already has an active run. Stop it or wait for it to finish.");
      }
      const created = await tx.agentRun.create({
        data: {
          agentId: input.id,
          versionId: previous.versionId,
          initiatedById: userId,
          triggerId: previous.triggerId,
          triggerType: previous.triggerType,
          input: previous.input ?? import_db5.Prisma.DbNull,
          idempotencyKey: input.clientRequestId,
          correlationId: import_node_crypto.randomUUID(),
          events: { create: { sequence: 0, type: "run.queued", data: {} } }
        },
        select: { id: true }
      });
      await tx.agentAuditEvent.create({
        data: {
          agentId: input.id,
          versionId: previous.versionId,
          actorUserId: userId,
          actorType: "USER",
          actorId: userId,
          type: "run.requested",
          summary: `Retried run ${input.runId}`,
          requestId: input.clientRequestId
        }
      });
      return created;
    });
    this.trigger.deployedAgentRunQueued();
    return run;
  }
  async cancelRun(input, userId) {
    const agent = await this.readableAgent(input.id, userId);
    const outcome = await this.db.$transaction(async (tx) => {
      const [run] = await tx.$queryRaw`
				SELECT id, "agentId", "versionId", status, "initiatedById", "nextEventSequence"
				FROM "agentRun"
				WHERE id = ${input.runId}
				FOR UPDATE
			`;
      if (!run || run.agentId !== input.id) {
        throw new import_common18.NotFoundException(`No run with id ${input.runId}.`);
      }
      if (!agent.canManage && run.initiatedById !== userId) {
        throw new import_common18.ForbiddenException("Only the person who started this run, or a workspace admin, can stop it.");
      }
      if (!CANCELLABLE_STATUSES.includes(run.status)) {
        return { id: run.id, status: run.status, cancelled: false };
      }
      const sequence = run.nextEventSequence + 1;
      const finishedAt = new Date;
      await tx.agentRun.update({
        where: { id: run.id },
        data: {
          status: "CANCELLED",
          errorCode: AGENT_DISPATCH.cancel.errorCode,
          errorMessage: AGENT_DISPATCH.cancel.message,
          finishedAt,
          nextEventSequence: sequence
        }
      });
      await tx.agentAction.updateMany({
        where: { runId: run.id, status: { in: ["PLANNED", "RUNNING"] } },
        data: {
          status: "CANCELLED",
          errorCode: AGENT_DISPATCH.cancel.errorCode,
          errorMessage: AGENT_DISPATCH.cancel.message,
          completedAt: finishedAt
        }
      });
      await tx.agentRunEvent.create({
        data: {
          id: `run-terminal:${run.id}:cancelled`,
          runId: run.id,
          sequence,
          type: "run.cancelled",
          data: { reason: "user.cancelled" },
          emittedAt: finishedAt
        }
      });
      await tx.agentAuditEvent.upsert({
        where: {
          agentId_type_requestId: {
            agentId: run.agentId,
            type: "run.cancelled",
            requestId: run.id
          }
        },
        create: {
          agentId: run.agentId,
          versionId: run.versionId,
          actorUserId: userId,
          actorType: "USER",
          actorId: userId,
          type: "run.cancelled",
          summary: "Stopped a run",
          requestId: run.id
        },
        update: {}
      });
      return { id: run.id, status: "CANCELLED", cancelled: true };
    });
    if (outcome.cancelled) {
      this.trigger.deployedAgentRunCancelled(outcome.id);
    }
    return outcome;
  }
  async readableAgent(agentId, userId) {
    return this.access.assertCanRead(agentId, userId);
  }
  assertReplayMatches(existingAgentId, requestedAgentId) {
    if (existingAgentId !== requestedAgentId) {
      throw new import_common18.BadRequestException("That run request has already been used.");
    }
  }
}
AgentRunsService = __legacyDecorateClassTS([
  import_common18.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof AgentAccessService === "undefined" ? Object : AgentAccessService,
    typeof AgentTriggerService === "undefined" ? Object : AgentTriggerService
  ])
], AgentRunsService);

// src/agent/agents.router.ts
var import_common19 = require("@nestjs/common");
var import_nestjs_trpc3 = require("nestjs-trpc");
class AgentsRouter {
  agents;
  runs;
  constructor(agents, runs) {
    this.agents = agents;
    this.runs = runs;
  }
  async list(ctx) {
    return this.agents.list(ctx.user.id);
  }
  async revise(ctx, input) {
    return this.agents.revise(input, ctx.user.id);
  }
  async files(ctx, id) {
    return this.agents.files(id, ctx.user.id);
  }
  async saveFile(ctx, input) {
    return this.agents.saveFile(input, ctx.user.id);
  }
  async byId(ctx, id) {
    return this.agents.byId(id, ctx.user.id);
  }
  async history(ctx, input) {
    return this.runs.list(input.id, input.limit, ctx.user.id);
  }
  async activity(ctx, input) {
    return this.runs.activity(input.id, input.limit, ctx.user.id);
  }
  async update(ctx, input) {
    return this.agents.update(input, ctx.user.id);
  }
  async deploy(ctx, input) {
    return this.agents.deploy(input, ctx.user.id);
  }
  async pause(ctx, id) {
    return this.agents.pause(id, ctx.user.id);
  }
  async resume(ctx, id) {
    return this.agents.resume(id, ctx.user.id);
  }
  async archive(ctx, id) {
    return this.agents.archive(id, ctx.user.id);
  }
  async restore(ctx, id) {
    return this.agents.restore(id, ctx.user.id);
  }
  async remove(ctx, id) {
    return this.agents.remove(id, ctx.user.id);
  }
  async runNow(ctx, input) {
    return this.runs.runNow(input, ctx.user.id);
  }
  async retryRun(ctx, input) {
    return this.runs.retryRun(input, ctx.user.id);
  }
  async cancelRun(ctx, input) {
    return this.runs.cancelRun(input, ctx.user.id);
  }
}
__legacyDecorateClassTS([
  import_nestjs_trpc3.Query({
    output: agentListOutput,
    meta: restMeta("GET", "/agents", ["Agents"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc3.Ctx()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], AgentsRouter.prototype, "list", null);
__legacyDecorateClassTS([
  import_nestjs_trpc3.Mutation({
    input: agentReviseInput,
    output: agentReviseOutput,
    meta: restMeta("POST", "/agents/{id}/revise", ["Agents"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc3.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc3.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], AgentsRouter.prototype, "revise", null);
__legacyDecorateClassTS([
  import_nestjs_trpc3.Query({
    input: agentIdInput,
    output: agentFilesOutput,
    meta: restMeta("GET", "/agents/{id}/files", ["Agents"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc3.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc3.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], AgentsRouter.prototype, "files", null);
__legacyDecorateClassTS([
  import_nestjs_trpc3.Mutation({
    input: agentSaveFileInput,
    output: agentSaveFileOutput,
    meta: restMeta("POST", "/agents/{id}/save-file", ["Agents"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc3.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc3.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], AgentsRouter.prototype, "saveFile", null);
__legacyDecorateClassTS([
  import_nestjs_trpc3.Query({
    input: agentIdInput,
    output: agentByIdOutput,
    meta: restMeta("GET", "/agents/{id}", ["Agents"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc3.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc3.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], AgentsRouter.prototype, "byId", null);
__legacyDecorateClassTS([
  import_nestjs_trpc3.Query({
    input: agentHistoryInput,
    output: agentHistoryOutput,
    meta: restMeta("GET", "/agents/{id}/history", ["Agents"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc3.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc3.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], AgentsRouter.prototype, "history", null);
__legacyDecorateClassTS([
  import_nestjs_trpc3.Query({
    input: agentHistoryInput,
    output: agentActivityOutput,
    meta: restMeta("GET", "/agents/{id}/activity", ["Agents"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc3.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc3.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], AgentsRouter.prototype, "activity", null);
__legacyDecorateClassTS([
  import_nestjs_trpc3.Mutation({
    input: agentUpdateInput,
    output: agentUpdateOutput,
    meta: restMeta("PATCH", "/agents/{id}", ["Agents"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc3.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc3.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], AgentsRouter.prototype, "update", null);
__legacyDecorateClassTS([
  import_nestjs_trpc3.Mutation({
    input: agentDeployInput,
    output: agentDeployOutput,
    meta: restMeta("POST", "/agents/{id}/deploy", ["Agents"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc3.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc3.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], AgentsRouter.prototype, "deploy", null);
__legacyDecorateClassTS([
  import_nestjs_trpc3.Mutation({
    input: agentIdInput,
    output: agentPauseOutput,
    meta: restMeta("POST", "/agents/{id}/pause", ["Agents"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc3.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc3.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], AgentsRouter.prototype, "pause", null);
__legacyDecorateClassTS([
  import_nestjs_trpc3.Mutation({
    input: agentIdInput,
    output: agentResumeOutput,
    meta: restMeta("POST", "/agents/{id}/resume", ["Agents"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc3.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc3.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], AgentsRouter.prototype, "resume", null);
__legacyDecorateClassTS([
  import_nestjs_trpc3.Mutation({
    input: agentIdInput,
    output: agentArchiveOutput,
    meta: restMeta("POST", "/agents/{id}/archive", ["Agents"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc3.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc3.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], AgentsRouter.prototype, "archive", null);
__legacyDecorateClassTS([
  import_nestjs_trpc3.Mutation({
    input: agentIdInput,
    output: agentRestoreOutput,
    meta: restMeta("POST", "/agents/{id}/restore", ["Agents"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc3.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc3.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], AgentsRouter.prototype, "restore", null);
__legacyDecorateClassTS([
  import_nestjs_trpc3.Mutation({
    input: agentIdInput,
    output: agentRemoveOutput,
    meta: restMeta("DELETE", "/agents/{id}", ["Agents"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc3.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc3.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], AgentsRouter.prototype, "remove", null);
__legacyDecorateClassTS([
  import_nestjs_trpc3.Mutation({
    input: agentRunNowInput,
    output: agentRunNowOutput,
    meta: restMeta("POST", "/agents/{id}/run", ["Agents"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc3.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc3.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], AgentsRouter.prototype, "runNow", null);
__legacyDecorateClassTS([
  import_nestjs_trpc3.Mutation({
    input: agentRetryRunInput,
    output: agentRetryRunOutput,
    meta: restMeta("POST", "/agents/{id}/runs/{runId}/retry", ["Agents"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc3.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc3.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], AgentsRouter.prototype, "retryRun", null);
__legacyDecorateClassTS([
  import_nestjs_trpc3.Mutation({
    input: agentCancelRunInput,
    output: agentCancelRunOutput,
    meta: restMeta("POST", "/agents/{id}/runs/{runId}/cancel", ["Agents"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc3.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc3.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], AgentsRouter.prototype, "cancelRun", null);
AgentsRouter = __legacyDecorateClassTS([
  import_nestjs_trpc3.Router({ alias: "agents" }),
  import_nestjs_trpc3.UseMiddlewares(AuthMiddleware),
  __legacyDecorateParamTS(0, import_common19.Inject(AgentDefinitionsService)),
  __legacyDecorateParamTS(1, import_common19.Inject(AgentRunsService)),
  __legacyMetadataTS("design:paramtypes", [
    typeof AgentDefinitionsService === "undefined" ? Object : AgentDefinitionsService,
    typeof AgentRunsService === "undefined" ? Object : AgentRunsService
  ])
], AgentsRouter);

// src/agent/dispatch-heartbeat.service.ts
var import_common20 = require("@nestjs/common");
class DispatchHeartbeatService {
  trigger;
  logger = new import_common20.Logger(DispatchHeartbeatService.name);
  timer = null;
  constructor(trigger) {
    this.trigger = trigger;
  }
  onApplicationBootstrap() {
    if (!this.trigger.canReachAgent()) {
      this.logger.log({
        message: "No agent bridge secret, so queued work waits for the agent's own schedule."
      });
      return;
    }
    this.trigger.drainQueues();
    this.timer = setInterval(() => this.trigger.drainQueues(), AGENT_DISPATCH.heartbeat.everyMs);
    this.timer.unref?.();
  }
  onApplicationShutdown() {
    if (this.timer)
      clearInterval(this.timer);
    this.timer = null;
  }
}
DispatchHeartbeatService = __legacyDecorateClassTS([
  import_common20.Injectable(),
  __legacyMetadataTS("design:paramtypes", [
    typeof AgentTriggerService === "undefined" ? Object : AgentTriggerService
  ])
], DispatchHeartbeatService);

// src/agent/research-key.service.ts
var import_common21 = require("@nestjs/common");
var import_zod5 = require("zod");
var VERIFY_TIMEOUT_MS = 20000;
var verifyAnswer = import_zod5.z.object({
  outcome: import_zod5.z.string().nullable().catch(null),
  reason: import_zod5.z.string().nullable().catch(null)
}).catch({ outcome: null, reason: null });

class ResearchKeyService {
  logger = new import_common21.Logger(ResearchKeyService.name);
  async verify(apiKey) {
    const agent = bridge();
    if (!agent) {
      return {
        outcome: "unknown",
        reason: "This install has no AGENT_BRIDGE_SECRET, so nothing can check."
      };
    }
    try {
      const response = await fetch(agent.url("/internal/crm/verify-key"), {
        method: "POST",
        headers: {
          authorization: `Bearer ${agent.secret}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ apiKey }),
        signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS)
      });
      if (!response.ok) {
        return this.cannotTell(`The agent answered ${response.status}.`);
      }
      const body = verifyAnswer.parse(await response.json());
      if (body.outcome === "valid")
        return { outcome: "valid" };
      if (body.outcome === "invalid") {
        return {
          outcome: "invalid",
          reason: body.reason || "Context did not recognise that API key."
        };
      }
      return this.cannotTell(body.reason ?? "No answer.");
    } catch (error) {
      return this.cannotTell(error instanceof Error ? error.message : String(error));
    }
  }
  cannotTell(reason) {
    this.logger.warn({
      message: "Could not check the Context key; saving it unverified",
      reason
    });
    return { outcome: "unknown", reason };
  }
}
ResearchKeyService = __legacyDecorateClassTS([
  import_common21.Injectable()
], ResearchKeyService);

// src/agent/agent.module.ts
class AgentModule {
}
AgentModule = __legacyDecorateClassTS([
  import_common22.Module({
    imports: [TrpcModule],
    providers: [
      AgentAccessService,
      AgentDefinitionsService,
      AgentQueueService,
      AgentRunsService,
      AgentTriggerService,
      AgentsRouter,
      DispatchHeartbeatService,
      ResearchKeyService
    ],
    exports: [
      AgentAccessService,
      AgentTriggerService,
      AgentQueueService,
      ResearchKeyService
    ]
  })
], AgentModule);

// src/api-keys/api-keys.module.ts
var import_common25 = require("@nestjs/common");

// src/api-keys/api-keys.router.ts
var import_common24 = require("@nestjs/common");
var import_node2 = require("better-auth/node");
var import_nestjs_trpc4 = require("nestjs-trpc");

// src/api-keys/api-keys.contracts.ts
var import_auth7 = require("@crm/auth");
var import_zod7 = require("zod");

// src/trpc/list-input.ts
var import_zod6 = require("zod");
var listInput = import_zod6.z.object({
  q: import_zod6.z.string().default(""),
  sort: import_zod6.z.string().default(""),
  dir: import_zod6.z.enum(["asc", "desc"]).default("asc"),
  page: import_zod6.z.number().int().min(1).default(1),
  pageSize: import_zod6.z.number().int().min(1).max(100).default(25)
});
function paginate(input) {
  return {
    skip: (input.page - 1) * input.pageSize,
    take: input.pageSize
  };
}
function resolveOrderBy(input, columns, fallback) {
  const column = columns[input.sort];
  return column ? column(input.dir) : fallback;
}
function countsByKey(groups, key, nullKey) {
  const counts = {};
  for (const group of groups) {
    const value = group[key] ?? nullKey;
    if (value == null)
      continue;
    counts[value] = (counts[value] ?? 0) + group._count._all;
  }
  return counts;
}
var FACET_UNASSIGNED = "unassigned";
function splitSentinel(values, sentinel) {
  const ids = values.filter((value) => value !== sentinel);
  return { ids, includesSentinel: ids.length !== values.length };
}
function ownerFilter(values) {
  if (values.length === 0)
    return;
  const { ids, includesSentinel } = splitSentinel(values, FACET_UNASSIGNED);
  if (includesSentinel && ids.length === 0)
    return { ownerId: null };
  if (!includesSentinel)
    return { ownerId: { in: ids } };
  return { OR: [{ ownerId: { in: ids } }, { ownerId: null }] };
}
function archivedFilter(archived) {
  return { archivedAt: archived ? { not: null } : null };
}
var ACTIVITY_WINDOWS = ["7", "30", "90"];
var activityWindowSet = new Set(ACTIVITY_WINDOWS);
var activityFacetInput = import_zod6.z.array(import_zod6.z.string()).refine((values) => values.every((value) => activityWindowSet.has(value)), {
  message: `Activity must be one of: ${ACTIVITY_WINDOWS.join(", ")}.`
});
function activityCutoff(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}
function activityFilter(values) {
  if (values.length === 0)
    return;
  const days = values.reduce((max, value) => Math.max(max, Number(value)), 0);
  return { lastActivityAt: { gte: activityCutoff(days) } };
}
async function activityFacetCounts(countWhere) {
  const counts = await Promise.all(ACTIVITY_WINDOWS.map((days) => countWhere({ lastActivityAt: { gte: activityCutoff(Number(days)) } })));
  return Object.fromEntries(ACTIVITY_WINDOWS.map((days, index) => [days, counts[index]]));
}

// src/api-keys/api-keys.contracts.ts
var apiKeyListInput = listInput;
var createApiKeyInput = import_zod7.z.object({
  name: import_zod7.z.string().trim().min(1).max(64),
  expiresInDays: import_zod7.z.number().int().min(import_auth7.API_KEY_EXPIRATION.minDays).max(import_auth7.API_KEY_EXPIRATION.maxDays).nullable()
});
var revokeApiKeyInput = import_zod7.z.object({
  id: import_zod7.z.string().trim().min(1)
});
var apiKeySummaryOutput = import_zod7.z.object({
  id: import_zod7.z.string(),
  name: import_zod7.z.string().nullable(),
  start: import_zod7.z.string().nullable(),
  enabled: import_zod7.z.boolean(),
  createdAt: import_zod7.z.string(),
  lastRequest: import_zod7.z.string().nullable(),
  expiresAt: import_zod7.z.string().nullable()
});
var apiKeyListOutput = import_zod7.z.object({
  rows: import_zod7.z.array(apiKeySummaryOutput),
  total: import_zod7.z.number(),
  facetCounts: import_zod7.z.record(import_zod7.z.string(), import_zod7.z.record(import_zod7.z.string(), import_zod7.z.number()))
});
var createApiKeyOutput = apiKeySummaryOutput.extend({
  key: import_zod7.z.string()
});
var revokeApiKeyOutput = import_zod7.z.object({ id: import_zod7.z.string() });

// src/api-keys/api-keys.service.ts
var import_auth8 = require("@crm/auth");
var import_common23 = require("@nestjs/common");
var import_api = require("better-auth/api");
var KEY_SELECT = {
  id: true,
  name: true,
  start: true,
  enabled: true,
  createdAt: true,
  lastRequest: true,
  expiresAt: true
};
var SORTABLE = {
  name: (dir) => ({ name: dir }),
  createdAt: (dir) => ({ createdAt: dir }),
  lastRequest: (dir) => ({ lastRequest: dir }),
  expiresAt: (dir) => ({ expiresAt: dir })
};
var STATUS_BY_CODE = new Map([
  ["BAD_REQUEST", 400],
  ["UNAUTHORIZED", 401],
  ["FORBIDDEN", 403],
  ["NOT_FOUND", 404],
  ["CONFLICT", 409],
  ["UNPROCESSABLE_ENTITY", 400]
]);
function toSummary(row) {
  return {
    id: row.id,
    name: row.name,
    start: row.start,
    enabled: row.enabled ?? true,
    createdAt: row.createdAt.toISOString(),
    lastRequest: row.lastRequest?.toISOString() ?? null,
    expiresAt: row.expiresAt?.toISOString() ?? null
  };
}

class ApiKeysService {
  db;
  logger = new import_common23.Logger(ApiKeysService.name);
  constructor(db) {
    this.db = db;
  }
  async list(userId, input) {
    const where = this.searchWhere(userId, input.q);
    const { skip, take } = paginate(input);
    const [rows, total] = await Promise.all([
      this.db.apikey.findMany({
        where,
        skip,
        take,
        select: KEY_SELECT,
        orderBy: resolveOrderBy(input, SORTABLE, { createdAt: "desc" })
      }),
      this.db.apikey.count({ where })
    ]);
    return { rows: rows.map(toSummary), total, facetCounts: {} };
  }
  async create(userId, headers, input) {
    const created = await this.call(() => import_auth8.auth.api.createApiKey({
      headers,
      body: {
        name: input.name,
        expiresIn: input.expiresInDays === null ? null : input.expiresInDays * import_auth8.DAY_SECONDS
      }
    }));
    this.logger.log({
      message: "API key created",
      userId,
      apiKeyId: created.id
    });
    return {
      id: created.id,
      name: created.name,
      start: created.start,
      enabled: created.enabled,
      createdAt: created.createdAt.toISOString(),
      lastRequest: created.lastRequest?.toISOString() ?? null,
      expiresAt: created.expiresAt?.toISOString() ?? null,
      key: created.key
    };
  }
  async revoke(userId, headers, input) {
    await this.call(() => import_auth8.auth.api.deleteApiKey({ headers, body: { keyId: input.id } }));
    this.logger.log({
      message: "API key revoked",
      userId,
      apiKeyId: input.id
    });
    return { id: input.id };
  }
  searchWhere(userId, q) {
    const where = { referenceId: userId };
    const term = q.trim();
    if (term) {
      where.name = { contains: term, mode: "insensitive" };
    }
    return where;
  }
  async call(run) {
    try {
      return await run();
    } catch (error) {
      if (error instanceof import_api.APIError) {
        const status = STATUS_BY_CODE.get(error.body?.code ?? "") ?? error.statusCode;
        throw new import_common23.HttpException(error.body?.message ?? "The API key could not be saved.", status);
      }
      this.logger.error({ message: "API key call failed" }, error instanceof Error ? error.stack : String(error));
      throw new import_common23.InternalServerErrorException("Could not reach the auth service.");
    }
  }
}
ApiKeysService = __legacyDecorateClassTS([
  import_common23.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db
  ])
], ApiKeysService);

// src/api-keys/api-keys.router.ts
function headersOf(ctx) {
  return import_node2.fromNodeHeaders(ctx.req?.headers ?? {});
}

class ApiKeysRouter {
  apiKeys;
  constructor(apiKeys) {
    this.apiKeys = apiKeys;
  }
  async list(ctx, input) {
    return this.apiKeys.list(ctx.user.id, input);
  }
  async create(ctx, input) {
    return this.apiKeys.create(ctx.user.id, headersOf(ctx), input);
  }
  async revoke(ctx, input) {
    return this.apiKeys.revoke(ctx.user.id, headersOf(ctx), input);
  }
}
__legacyDecorateClassTS([
  import_nestjs_trpc4.Query({
    input: apiKeyListInput,
    output: apiKeyListOutput,
    meta: restMeta("GET", "/api-keys", ["API Keys"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc4.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc4.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ApiKeysRouter.prototype, "list", null);
__legacyDecorateClassTS([
  import_nestjs_trpc4.Mutation({
    input: createApiKeyInput,
    output: createApiKeyOutput,
    meta: restMeta("POST", "/api-keys", ["API Keys"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc4.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc4.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ApiKeysRouter.prototype, "create", null);
__legacyDecorateClassTS([
  import_nestjs_trpc4.Mutation({
    input: revokeApiKeyInput,
    output: revokeApiKeyOutput,
    meta: restMeta("DELETE", "/api-keys/{id}", ["API Keys"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc4.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc4.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ApiKeysRouter.prototype, "revoke", null);
ApiKeysRouter = __legacyDecorateClassTS([
  import_nestjs_trpc4.Router({ alias: "apiKeys" }),
  import_nestjs_trpc4.UseMiddlewares(AuthMiddleware, SessionOnlyMiddleware),
  __legacyDecorateParamTS(0, import_common24.Inject(ApiKeysService)),
  __legacyMetadataTS("design:paramtypes", [
    typeof ApiKeysService === "undefined" ? Object : ApiKeysService
  ])
], ApiKeysRouter);

// src/api-keys/api-keys.module.ts
class ApiKeysModule {
}
ApiKeysModule = __legacyDecorateClassTS([
  import_common25.Module({
    imports: [TrpcModule],
    providers: [ApiKeysService, ApiKeysRouter],
    exports: [ApiKeysService]
  })
], ApiKeysModule);

// src/archive/archive.module.ts
var import_common48 = require("@nestjs/common");

// src/companies/companies.module.ts
var import_common40 = require("@nestjs/common");

// src/currency/currency.module.ts
var import_common31 = require("@nestjs/common");

// src/currency/conversion.service.ts
var import_db6 = require("@crm/db");
var import_currency = require("@crm/db/currency");
var import_fx = require("@crm/db/fx");
var import_settings = require("@crm/db/settings");
var import_common26 = require("@nestjs/common");
class ConversionService {
  db;
  logger = new import_common26.Logger(ConversionService.name);
  constructor(db) {
    this.db = db;
  }
  async reportingCurrency() {
    return import_settings.readReportingCurrency(this.db);
  }
  async rateFor(currency) {
    const base = await this.reportingCurrency();
    return import_fx.resolveRate(this.db, base, currency);
  }
  async convert(amount, currency) {
    return import_fx.convertToBase(this.db, amount, currency, await this.reportingCurrency());
  }
  async dealFields(amount, currency) {
    const converted = await this.convert(amount, currency);
    if (!converted) {
      return {
        baseAmount: null,
        baseCurrency: null,
        fxRate: null,
        fxRateAt: null
      };
    }
    return {
      baseAmount: converted.baseAmount,
      baseCurrency: converted.baseCurrency,
      fxRate: converted.fxRate,
      fxRateAt: converted.fxRateAt
    };
  }
  countedWhere(base) {
    return { baseAmount: { not: null }, baseCurrency: base };
  }
  pendingWhere(base) {
    return {
      amount: { not: null },
      OR: [
        { baseAmount: null },
        { baseCurrency: null },
        { baseCurrency: { not: base } }
      ]
    };
  }
  async unconverted(where = {}) {
    const base = await this.reportingCurrency();
    const rows = await this.db.deal.groupBy({
      by: ["currency"],
      where: { AND: [where, this.pendingWhere(base)] },
      _count: { _all: true }
    });
    return {
      count: rows.reduce((total, row) => total + row._count._all, 0),
      currencies: rows.map((row) => import_currency.normalizeCurrency(row.currency)).filter((code, index, all) => all.indexOf(code) === index).sort()
    };
  }
  async rerateAll() {
    return this.rerate(false);
  }
  async fillMissing() {
    return this.rerate(true);
  }
  async rerate(onlyMissing) {
    const base = await this.reportingCurrency();
    const groups = await this.db.deal.groupBy({
      by: ["currency"],
      where: onlyMissing ? this.pendingWhere(base) : { amount: { not: null } },
      _count: { _all: true }
    });
    const codes = [
      ...new Set(groups.map((group) => import_currency.normalizeCurrency(group.currency)))
    ];
    const places = import_currency.minorUnitsOf(base);
    let converted = 0;
    let cleared = 0;
    const missing = [];
    for (const code of codes) {
      const rate = await import_fx.resolveRate(this.db, base, code);
      if (!rate) {
        missing.push(code);
        if (!onlyMissing) {
          cleared += await this.clear(code);
        }
        continue;
      }
      converted += await this.write(base, code, rate, places, onlyMissing);
    }
    this.logger.log({
      message: onlyMissing ? "Filled in deal amounts that had no rate" : "Re-rated every deal against the reporting currency",
      base,
      converted,
      cleared,
      missing
    });
    return { converted, cleared, missing: missing.sort() };
  }
  async write(base, code, rate, places, onlyMissing) {
    const value = new import_db6.Prisma.Decimal(rate.rate).toString();
    const filter = onlyMissing ? import_db6.Prisma.sql`AND ("baseAmount" IS NULL OR "baseCurrency" IS DISTINCT FROM ${base})` : import_db6.Prisma.empty;
    return this.db.$executeRaw`
			UPDATE "deal"
			SET "baseAmount" = ROUND("amount" * ${value}::numeric, ${places}::int),
			    "baseCurrency" = ${base},
			    "fxRate" = ${value}::numeric,
			    "fxRateAt" = ${rate.asOf}
			WHERE "amount" IS NOT NULL
			  AND upper(btrim("currency")) = ${code}
			  ${filter}
		`;
  }
  async clear(code) {
    return this.db.$executeRaw`
			UPDATE "deal"
			SET "baseAmount" = NULL,
			    "baseCurrency" = NULL,
			    "fxRate" = NULL,
			    "fxRateAt" = NULL
			WHERE upper(btrim("currency")) = ${code}
			  AND "baseAmount" IS NOT NULL
		`;
  }
}
ConversionService = __legacyDecorateClassTS([
  import_common26.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db
  ])
], ConversionService);

// src/currency/currency.router.ts
var import_common29 = require("@nestjs/common");
var import_nestjs_trpc5 = require("nestjs-trpc");

// src/currency/currency.contracts.ts
var import_db7 = require("@crm/db");
var import_currency2 = require("@crm/db/currency");
var import_zod8 = require("zod");
var currencyCode = import_zod8.z.string().trim().length(3, "A currency code is three letters, like USD.").refine(import_currency2.isCurrencyCode, "That is not a currency this CRM can convert.");
var setReportingCurrencyInput = import_zod8.z.object({
  currency: currencyCode
});
var setManualRateInput = import_zod8.z.object({
  currency: currencyCode,
  rate: import_zod8.z.number().positive("A rate has to be greater than zero.").finite("That is not a rate.")
});
var removeManualRateInput = import_zod8.z.object({
  currency: currencyCode
});
var rateSourceOutput = import_zod8.z.enum([import_db7.RateSource.FETCHED, import_db7.RateSource.MANUAL]);
var currencyRateOutput = import_zod8.z.object({
  currency: import_zod8.z.string(),
  name: import_zod8.z.string().nullable(),
  rate: import_zod8.z.number(),
  asOf: import_zod8.z.string(),
  source: rateSourceOutput,
  provider: import_zod8.z.string().nullable(),
  overriding: import_zod8.z.boolean()
});
var currencyInUseOutput = import_zod8.z.object({
  currency: import_zod8.z.string(),
  name: import_zod8.z.string().nullable(),
  deals: import_zod8.z.number(),
  convertible: import_zod8.z.boolean()
});
var unconvertedOutput = import_zod8.z.object({
  count: import_zod8.z.number(),
  currencies: import_zod8.z.array(import_zod8.z.string())
});
var currencyMetaOutput = import_zod8.z.object({
  code: import_zod8.z.string(),
  name: import_zod8.z.string(),
  minorUnits: import_zod8.z.number()
});
var currencySettingsOutput = import_zod8.z.object({
  reportingCurrency: import_zod8.z.string(),
  refreshedAt: import_zod8.z.string().nullable(),
  rates: import_zod8.z.array(currencyRateOutput),
  inUse: import_zod8.z.array(currencyInUseOutput),
  unconverted: unconvertedOutput,
  catalog: import_zod8.z.array(currencyMetaOutput),
  canManage: import_zod8.z.boolean()
});

// src/currency/currency.service.ts
var import_auth10 = require("@crm/auth");
var import_db9 = require("@crm/db");
var import_currency4 = require("@crm/db/currency");
var import_settings3 = require("@crm/db/settings");
var import_common28 = require("@nestjs/common");

// src/currency/rates.service.ts
var import_db8 = require("@crm/db");
var import_currency3 = require("@crm/db/currency");
var import_settings2 = require("@crm/db/settings");
var import_common27 = require("@nestjs/common");
var import_zod9 = require("zod");
var RATES_PROVIDER = "open.er-api.com";
var RATES_URL = "https://open.er-api.com/v6/latest";
var RATES_TIMEOUT_MS = 6000;
var RATES_ATTEMPTS = 2;
var RETRY_DELAY_MS = 400;
var UNREADABLE_FEED = {
  result: "",
  time_last_update_unix: null,
  rates: {},
  "error-type": null
};
var openExchangeResponse = import_zod9.z.object({
  result: import_zod9.z.string().catch(""),
  time_last_update_unix: import_zod9.z.number().refine(Number.isFinite).nullable().catch(null),
  rates: import_zod9.z.record(import_zod9.z.string(), import_zod9.z.json()).catch({}),
  "error-type": import_zod9.z.string().nullable().catch(null)
}).catch(UNREADABLE_FEED);
function parseAsOf(seconds) {
  if (seconds === null)
    return null;
  const date = new Date(seconds * 1000);
  return Number.isNaN(date.getTime()) ? null : date;
}
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class RatesService {
  db;
  logger = new import_common27.Logger(RatesService.name);
  constructor(db) {
    this.db = db;
  }
  async refreshedAt() {
    return import_settings2.readRatesRefreshedAt(this.db);
  }
  async refresh() {
    const base = await import_settings2.readReportingCurrency(this.db);
    const quotes = await this.fetch(base);
    if (!quotes) {
      return {
        ok: false,
        base,
        written: 0,
        asOf: null,
        reason: `Could not reach ${RATES_PROVIDER}. Rates entered by hand are unaffected.`
      };
    }
    const written = await this.store(base, quotes.rates, quotes.asOf);
    await import_settings2.writeRatesRefreshedAt(this.db, new Date);
    this.logger.log({
      message: "Exchange rates refreshed",
      base,
      written,
      asOf: quotes.asOf.toISOString()
    });
    return {
      ok: true,
      base,
      written,
      asOf: quotes.asOf.toISOString(),
      reason: null
    };
  }
  async store(base, rates, asOf) {
    let written = 0;
    for (const [quoteCurrency, rate] of rates) {
      await this.db.exchangeRate.upsert({
        where: {
          baseCurrency_quoteCurrency_source: {
            baseCurrency: base,
            quoteCurrency,
            source: import_db8.RateSource.FETCHED
          }
        },
        create: {
          baseCurrency: base,
          quoteCurrency,
          rate,
          asOf,
          source: import_db8.RateSource.FETCHED,
          provider: RATES_PROVIDER
        },
        update: { rate, asOf, provider: RATES_PROVIDER }
      });
      written += 1;
    }
    const supported = [...import_currency3.CURRENCY_CODES];
    const stale = await this.db.exchangeRate.deleteMany({
      where: {
        source: import_db8.RateSource.FETCHED,
        OR: [
          { baseCurrency: { notIn: supported } },
          { quoteCurrency: { notIn: supported } }
        ]
      }
    });
    if (stale.count > 0) {
      this.logger.log({
        message: "Dropped fetched rates for currencies that are not supported",
        base,
        dropped: stale.count
      });
    }
    return written;
  }
  async fetch(base) {
    for (let attempt = 1;attempt <= RATES_ATTEMPTS; attempt += 1) {
      const quotes = await this.attempt(base, attempt);
      if (quotes)
        return quotes;
      if (attempt < RATES_ATTEMPTS)
        await wait(RETRY_DELAY_MS);
    }
    return null;
  }
  async attempt(base, attempt) {
    try {
      const response = await fetch(`${RATES_URL}/${encodeURIComponent(base)}`, {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(RATES_TIMEOUT_MS)
      });
      if (!response.ok) {
        this.logger.warn({
          message: "Exchange rate request failed",
          status: response.status,
          base,
          attempt
        });
        return null;
      }
      const body = openExchangeResponse.parse(await response.json());
      if (body.result !== "success") {
        this.logger.warn({
          message: "Exchange rate provider refused the request",
          base,
          attempt,
          errorType: body["error-type"]
        });
        return null;
      }
      const asOf = parseAsOf(body.time_last_update_unix) ?? new Date;
      const rates = new Map;
      for (const [code, value] of Object.entries(body.rates)) {
        const quoteCurrency = import_currency3.normalizeCurrency(code);
        if (!import_currency3.isCurrencyCode(quoteCurrency))
          continue;
        if (quoteCurrency === import_currency3.normalizeCurrency(base))
          continue;
        const perBase = Number(value);
        if (!Number.isFinite(perBase) || perBase <= 0)
          continue;
        rates.set(quoteCurrency, new import_db8.Prisma.Decimal(1).dividedBy(perBase).toDecimalPlaces(10));
      }
      if (rates.size === 0) {
        this.logger.warn({
          message: "Exchange rate response carried no usable rates",
          base,
          attempt
        });
        return null;
      }
      return { rates, asOf };
    } catch (error) {
      this.logger.warn({
        message: "Exchange rates unavailable",
        base,
        attempt,
        reason: error instanceof Error ? error.message : String(error)
      });
      return null;
    }
  }
}
RatesService = __legacyDecorateClassTS([
  import_common27.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db
  ])
], RatesService);

// src/currency/currency.service.ts
class CurrencyService {
  db;
  conversion;
  rates;
  logger = new import_common28.Logger(CurrencyService.name);
  constructor(db, conversion, rates) {
    this.db = db;
    this.conversion = conversion;
    this.rates = rates;
  }
  async settings(actingUserId) {
    const reportingCurrency = await this.conversion.reportingCurrency();
    const [rows, refreshedAt, unconverted, usage] = await Promise.all([
      this.db.exchangeRate.findMany({
        where: { baseCurrency: reportingCurrency },
        select: {
          quoteCurrency: true,
          rate: true,
          asOf: true,
          source: true,
          provider: true
        }
      }),
      this.rates.refreshedAt(),
      this.conversion.unconverted(),
      this.db.deal.groupBy({
        by: ["currency"],
        where: { amount: { not: null } },
        _count: { _all: true }
      })
    ]);
    const manual = new Set(rows.filter((row) => row.source === import_db9.RateSource.MANUAL).map((row) => row.quoteCurrency));
    const effective = new Map;
    for (const row of rows) {
      const currency = import_currency4.normalizeCurrency(row.quoteCurrency);
      if (row.source === import_db9.RateSource.FETCHED && manual.has(row.quoteCurrency)) {
        continue;
      }
      effective.set(currency, {
        currency,
        name: import_currency4.currencyName(currency),
        rate: row.rate.toNumber(),
        asOf: row.asOf.toISOString(),
        source: row.source,
        provider: row.provider,
        overriding: row.source === import_db9.RateSource.MANUAL && manual.has(row.quoteCurrency)
      });
    }
    const convertible = new Set([reportingCurrency, ...effective.keys()]);
    return {
      reportingCurrency,
      refreshedAt: refreshedAt?.toISOString() ?? null,
      rates: [...effective.values()].sort((a, b) => a.currency.localeCompare(b.currency)),
      inUse: usage.map((row) => {
        const currency = import_currency4.normalizeCurrency(row.currency);
        return {
          currency,
          name: import_currency4.currencyName(currency),
          deals: row._count._all,
          convertible: convertible.has(currency)
        };
      }).sort((a, b) => b.deals - a.deals || a.currency.localeCompare(b.currency)),
      unconverted,
      catalog: [...import_currency4.CURRENCIES],
      canManage: import_auth10.canManageCurrency(await import_auth10.workspaceRoleOf(actingUserId))
    };
  }
  async requireManager(userId) {
    if (!import_auth10.canManageCurrency(await import_auth10.workspaceRoleOf(userId))) {
      throw new import_common28.ForbiddenException("Only an owner or an admin can change how money is reported.");
    }
  }
  async setReportingCurrency(actingUserId, code) {
    await this.requireManager(actingUserId);
    const currency = import_currency4.normalizeCurrency(code);
    const current = await this.conversion.reportingCurrency();
    if (currency === current)
      return this.settings(actingUserId);
    await import_settings3.writeReportingCurrency(this.db, currency);
    const refresh = await this.rates.refresh();
    const rerated = await this.conversion.rerateAll();
    this.logger.log({
      message: "Reporting currency changed",
      from: current,
      to: currency,
      ratesFetched: refresh.written,
      converted: rerated.converted,
      cleared: rerated.cleared,
      missing: rerated.missing
    });
    return this.settings(actingUserId);
  }
  async setManualRate(actingUserId, code, rate) {
    await this.requireManager(actingUserId);
    const quoteCurrency = import_currency4.normalizeCurrency(code);
    const baseCurrency = await this.conversion.reportingCurrency();
    if (quoteCurrency === baseCurrency) {
      throw new import_common28.BadRequestException(`${baseCurrency} is the reporting currency — its rate is always 1.`);
    }
    const asOf = new Date;
    await this.db.exchangeRate.upsert({
      where: {
        baseCurrency_quoteCurrency_source: {
          baseCurrency,
          quoteCurrency,
          source: import_db9.RateSource.MANUAL
        }
      },
      create: {
        baseCurrency,
        quoteCurrency,
        rate: new import_db9.Prisma.Decimal(rate),
        asOf,
        source: import_db9.RateSource.MANUAL
      },
      update: { rate: new import_db9.Prisma.Decimal(rate), asOf }
    });
    const filled = await this.conversion.fillMissing();
    this.logger.log({
      message: "Manual exchange rate saved",
      baseCurrency,
      quoteCurrency,
      converted: filled.converted
    });
    return this.settings(actingUserId);
  }
  async removeManualRate(actingUserId, code) {
    await this.requireManager(actingUserId);
    const quoteCurrency = import_currency4.normalizeCurrency(code);
    const baseCurrency = await this.conversion.reportingCurrency();
    await this.db.exchangeRate.deleteMany({
      where: { baseCurrency, quoteCurrency, source: import_db9.RateSource.MANUAL }
    });
    this.logger.log({
      message: "Manual exchange rate removed",
      baseCurrency,
      quoteCurrency
    });
    return this.settings(actingUserId);
  }
  async refresh(actingUserId) {
    await this.requireManager(actingUserId);
    const refresh = await this.rates.refresh();
    if (!refresh.ok) {
      throw new import_common28.BadRequestException(refresh.reason ?? "Could not fetch rates.");
    }
    await this.conversion.fillMissing();
    return this.settings(actingUserId);
  }
}
CurrencyService = __legacyDecorateClassTS([
  import_common28.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof ConversionService === "undefined" ? Object : ConversionService,
    typeof RatesService === "undefined" ? Object : RatesService
  ])
], CurrencyService);

// src/currency/currency.router.ts
class CurrencyRouter {
  currency;
  constructor(currency) {
    this.currency = currency;
  }
  async settings(ctx) {
    return this.currency.settings(ctx.user.id);
  }
  async setReportingCurrency(ctx, input) {
    return this.currency.setReportingCurrency(ctx.user.id, input.currency);
  }
  async setManualRate(ctx, input) {
    return this.currency.setManualRate(ctx.user.id, input.currency, input.rate);
  }
  async removeManualRate(ctx, input) {
    return this.currency.removeManualRate(ctx.user.id, input.currency);
  }
  async refreshRates(ctx) {
    return this.currency.refresh(ctx.user.id);
  }
}
__legacyDecorateClassTS([
  import_nestjs_trpc5.Query({
    output: currencySettingsOutput,
    meta: restMeta("GET", "/currency/settings", ["Currency"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc5.Ctx()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], CurrencyRouter.prototype, "settings", null);
__legacyDecorateClassTS([
  import_nestjs_trpc5.Mutation({
    input: setReportingCurrencyInput,
    output: currencySettingsOutput,
    meta: restMeta("PATCH", "/currency/reporting-currency", ["Currency"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc5.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc5.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], CurrencyRouter.prototype, "setReportingCurrency", null);
__legacyDecorateClassTS([
  import_nestjs_trpc5.Mutation({
    input: setManualRateInput,
    output: currencySettingsOutput,
    meta: restMeta("PUT", "/currency/rates/{currency}", ["Currency"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc5.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc5.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], CurrencyRouter.prototype, "setManualRate", null);
__legacyDecorateClassTS([
  import_nestjs_trpc5.Mutation({
    input: removeManualRateInput,
    output: currencySettingsOutput,
    meta: restMeta("DELETE", "/currency/rates/{currency}", ["Currency"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc5.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc5.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], CurrencyRouter.prototype, "removeManualRate", null);
__legacyDecorateClassTS([
  import_nestjs_trpc5.Mutation({
    output: currencySettingsOutput,
    meta: restMeta("POST", "/currency/rates/refresh", ["Currency"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc5.Ctx()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], CurrencyRouter.prototype, "refreshRates", null);
CurrencyRouter = __legacyDecorateClassTS([
  import_nestjs_trpc5.Router({ alias: "currency" }),
  import_nestjs_trpc5.UseMiddlewares(AuthMiddleware),
  __legacyDecorateParamTS(0, import_common29.Inject(CurrencyService)),
  __legacyMetadataTS("design:paramtypes", [
    typeof CurrencyService === "undefined" ? Object : CurrencyService
  ])
], CurrencyRouter);

// src/currency/rates.controller.ts
var import_common30 = require("@nestjs/common");
var import_config = require("@nestjs/config");
var import_swagger = require("@nestjs/swagger");
var import_nestjs_better_auth = require("@thallesp/nestjs-better-auth");
class RatesController {
  rates;
  conversion;
  logger = new import_common30.Logger(RatesController.name);
  secret;
  constructor(rates, conversion, config) {
    this.rates = rates;
    this.conversion = conversion;
    this.secret = config.get("CRON_SECRET", { infer: true });
  }
  async ratesViaGet(authorization) {
    return this.run(authorization);
  }
  async ratesViaPost(authorization) {
    return this.run(authorization);
  }
  async run(authorization) {
    if (!this.secret) {
      this.logger.error({
        message: "CRON_SECRET is not set — refusing to run the rates route."
      });
      throw new import_common30.ServiceUnavailableException("Rate refresh is not configured.");
    }
    if (!timingSafeEquals(authorization ?? "", `Bearer ${this.secret}`)) {
      throw new import_common30.ForbiddenException;
    }
    const refresh = await this.rates.refresh();
    if (!refresh.ok)
      return refresh;
    const filled = await this.conversion.fillMissing();
    return { ...refresh, converted: filled.converted, missing: filled.missing };
  }
}
__legacyDecorateClassTS([
  import_common30.Get("rates"),
  import_nestjs_better_auth.AllowAnonymous(),
  import_swagger.ApiOperation({
    summary: "Refresh exchange rates and convert amounts left pending"
  }),
  import_swagger.ApiOkResponse({ description: "Rates refreshed; conversion counts." }),
  __legacyDecorateParamTS(0, import_common30.Headers("authorization")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], RatesController.prototype, "ratesViaGet", null);
__legacyDecorateClassTS([
  import_common30.Post("rates"),
  import_nestjs_better_auth.AllowAnonymous(),
  import_swagger.ApiExcludeEndpoint(),
  __legacyDecorateParamTS(0, import_common30.Headers("authorization")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], RatesController.prototype, "ratesViaPost", null);
RatesController = __legacyDecorateClassTS([
  import_swagger.ApiTags("Internal — Cron"),
  import_swagger.ApiHeader({
    name: "authorization",
    description: "`Bearer <CRON_SECRET>`",
    required: true
  }),
  import_swagger.ApiForbiddenResponse({ description: "CRON_SECRET did not match." }),
  import_swagger.ApiServiceUnavailableResponse({ description: "CRON_SECRET is not set." }),
  import_common30.Controller("internal/sync"),
  __legacyMetadataTS("design:paramtypes", [
    typeof RatesService === "undefined" ? Object : RatesService,
    typeof ConversionService === "undefined" ? Object : ConversionService,
    typeof import_config.ConfigService === "undefined" ? Object : import_config.ConfigService
  ])
], RatesController);
function timingSafeEquals(a, b) {
  if (a.length !== b.length)
    return false;
  let mismatch = 0;
  for (let index = 0;index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return mismatch === 0;
}

// src/currency/currency.module.ts
class CurrencyModule {
}
CurrencyModule = __legacyDecorateClassTS([
  import_common31.Module({
    imports: [TrpcModule],
    controllers: [RatesController],
    providers: [ConversionService, RatesService, CurrencyService, CurrencyRouter],
    exports: [ConversionService]
  })
], CurrencyModule);

// src/fields/fields.module.ts
var import_common34 = require("@nestjs/common");

// src/fields/fields.router.ts
var import_common33 = require("@nestjs/common");
var import_nestjs_trpc6 = require("nestjs-trpc");

// src/fields/fields.contracts.ts
var import_fields2 = require("@crm/db/fields");
var import_zod10 = require("zod");
var fieldEntity = import_zod10.z.enum(import_fields2.FIELD_ENTITIES);
var fieldListInput = import_zod10.z.object({
  entity: fieldEntity,
  includeArchived: import_zod10.z.boolean().default(false)
});
var fieldByKeyInput = import_zod10.z.object({
  entity: fieldEntity,
  key: import_zod10.z.string().trim().min(1)
});
var fieldEntityInput = import_zod10.z.object({
  entity: fieldEntity
});
var fieldOptionInput = import_zod10.z.object({
  id: import_zod10.z.string().optional(),
  label: import_zod10.z.string().trim().min(1, "An option needs a label.")
});
var fieldCreateInput = import_zod10.z.object({
  entity: fieldEntity,
  label: import_zod10.z.string().trim().min(1, "A field needs a label."),
  type: import_zod10.z.enum(import_fields2.FIELD_TYPES),
  options: import_zod10.z.array(fieldOptionInput).default([]),
  agentFilled: import_zod10.z.boolean().default(true),
  agentBrief: import_zod10.z.string().trim().nullable().default(null),
  required: import_zod10.z.boolean().default(false),
  showOnSheet: import_zod10.z.boolean().default(true),
  showOnTable: import_zod10.z.boolean().default(false),
  showOnFilter: import_zod10.z.boolean().default(false)
});
var fieldUpdateData = import_zod10.z.object({
  label: import_zod10.z.string().trim().min(1).optional(),
  type: import_zod10.z.enum(import_fields2.FIELD_TYPES).optional(),
  options: import_zod10.z.array(fieldOptionInput).optional(),
  agentFilled: import_zod10.z.boolean().optional(),
  agentBrief: import_zod10.z.string().trim().nullable().optional(),
  required: import_zod10.z.boolean().optional(),
  showOnSheet: import_zod10.z.boolean().optional(),
  showOnTable: import_zod10.z.boolean().optional(),
  showOnFilter: import_zod10.z.boolean().optional()
});
var fieldUpdateArgs = import_zod10.z.object({
  id: import_zod10.z.string(),
  data: fieldUpdateData
});
var fieldIdInput = import_zod10.z.object({ id: import_zod10.z.string() });
var fieldReorderInput = import_zod10.z.object({
  entity: fieldEntity,
  ids: import_zod10.z.array(import_zod10.z.string()).min(1)
});
var recordFieldValue = import_zod10.z.union([import_zod10.z.string(), import_zod10.z.number(), import_zod10.z.boolean(), import_zod10.z.null()], { error: "A field holds text, a number, true or false, or nothing at all." });
var recordFieldValues = import_zod10.z.record(import_zod10.z.string(), recordFieldValue);
var fieldOptionOutput = import_zod10.z.object({
  id: import_zod10.z.string(),
  label: import_zod10.z.string(),
  position: import_zod10.z.number()
});
var serializedFieldOutput = import_zod10.z.object({
  id: import_zod10.z.string(),
  entity: fieldEntity,
  key: import_zod10.z.string(),
  label: import_zod10.z.string(),
  type: import_zod10.z.enum(import_fields2.FIELD_TYPES),
  typeLabel: import_zod10.z.string(),
  agentFilled: import_zod10.z.boolean(),
  agentBrief: import_zod10.z.string().nullable(),
  required: import_zod10.z.boolean(),
  showOnSheet: import_zod10.z.boolean(),
  showOnTable: import_zod10.z.boolean(),
  showOnFilter: import_zod10.z.boolean(),
  position: import_zod10.z.number(),
  archived: import_zod10.z.boolean(),
  options: import_zod10.z.array(fieldOptionOutput)
});
var fieldListOutput = import_zod10.z.array(serializedFieldOutput);
var fieldFiltersOutput = import_zod10.z.array(serializedFieldOutput);
var fieldReorderOutput = import_zod10.z.array(serializedFieldOutput);
var fieldCoverageOutput = import_zod10.z.object({
  filled: import_zod10.z.number(),
  total: import_zod10.z.number()
});
var fieldDeleteOutput = import_zod10.z.object({ id: import_zod10.z.string() });
var fieldBackfillOutput = import_zod10.z.object({ queued: import_zod10.z.boolean() });

// src/fields/fields.service.ts
var import_db10 = require("@crm/db");
var import_fields3 = require("@crm/db/fields");
var import_common32 = require("@nestjs/common");

// src/fields/fields-config.ts
var FIELDS_CONFIG = {
  backfill: {
    maxRecordsPerRun: 500
  }
};

// src/fields/fields.service.ts
var WITH_OPTIONS = {
  options: { orderBy: { position: "asc" } }
};
var RELATIONS = {
  COMPANY: "company",
  CONTACT: "contact",
  DEAL: "deal"
};

class FieldsService {
  db;
  agent;
  constructor(db, agent) {
    this.db = db;
    this.agent = agent;
  }
  async list(entity, includeArchived) {
    const definitions = await this.db.fieldDefinition.findMany({
      where: { entity, archivedAt: includeArchived ? undefined : null },
      include: WITH_OPTIONS,
      orderBy: { position: "asc" }
    });
    return definitions.map(import_fields3.serializeField);
  }
  async byKey(entity, key) {
    const definition = await this.db.fieldDefinition.findUnique({
      where: { entity_key: { entity, key } },
      include: WITH_OPTIONS
    });
    if (!definition)
      throw new import_common32.NotFoundException("That field does not exist.");
    return import_fields3.serializeField(definition);
  }
  async create(input) {
    const key = import_fields3.fieldKeyFromLabel(input.label);
    if (!key) {
      throw new import_common32.BadRequestException("That label does not make a usable key.");
    }
    const taken = await this.db.fieldDefinition.findUnique({
      where: { entity_key: { entity: input.entity, key } },
      select: { id: true }
    });
    if (taken) {
      throw new import_common32.ConflictException(`There is already a field called "${key}".`);
    }
    if (import_fields3.usesOptions(input.type) && input.options.length === 0) {
      throw new import_common32.BadRequestException("A select needs at least one option.");
    }
    const last = await this.db.fieldDefinition.findFirst({
      where: { entity: input.entity },
      orderBy: { position: "desc" },
      select: { position: true }
    });
    const definition = await this.db.fieldDefinition.create({
      data: {
        entity: input.entity,
        key,
        label: input.label,
        type: input.type,
        agentFilled: input.agentFilled,
        agentBrief: input.agentBrief,
        required: input.required,
        showOnSheet: input.showOnSheet,
        showOnTable: input.showOnTable,
        showOnFilter: input.showOnFilter,
        position: (last?.position ?? -1) + 1,
        options: import_fields3.usesOptions(input.type) ? {
          create: input.options.map((option, index) => ({
            label: option.label,
            position: index
          }))
        } : undefined
      },
      include: WITH_OPTIONS
    });
    if (definition.agentFilled) {
      const ids = await this.missingRecordIds(definition.entity, definition.id, FIELDS_CONFIG.backfill.maxRecordsPerRun);
      await this.agent.fieldBackfillRecords(definition.entity, [definition.key], ids, `New field: ${definition.label}`);
    }
    return import_fields3.serializeField(definition);
  }
  async update(id, data) {
    const existing = await this.db.fieldDefinition.findUnique({
      where: { id },
      include: WITH_OPTIONS
    });
    if (!existing)
      throw new import_common32.NotFoundException("That field does not exist.");
    const type = data.type ?? existing.type;
    if (data.type && data.type !== existing.type) {
      const values = await this.db.fieldValue.count({
        where: { fieldId: id }
      });
      if (values > 0) {
        throw new import_common32.ConflictException("This field already holds values, so its type cannot change. Archive it and make a new one.");
      }
    }
    const optionCount = data.options ? data.options.length : existing.options.filter((option) => option.archivedAt === null).length;
    if (import_fields3.usesOptions(type) && optionCount === 0) {
      throw new import_common32.BadRequestException("A select needs at least one option.");
    }
    const definition = await this.db.$transaction(async (tx) => {
      if (data.options && import_fields3.usesOptions(type)) {
        const keep = new Set(data.options.map((option) => option.id).filter((value) => Boolean(value)));
        await tx.fieldOption.updateMany({
          where: { fieldId: id, id: { notIn: [...keep] }, archivedAt: null },
          data: { archivedAt: new Date }
        });
        for (const [index, option] of data.options.entries()) {
          if (option.id) {
            await tx.fieldOption.update({
              where: { id: option.id },
              data: { label: option.label, position: index }
            });
            continue;
          }
          await tx.fieldOption.create({
            data: { fieldId: id, label: option.label, position: index }
          });
        }
      }
      return tx.fieldDefinition.update({
        where: { id },
        data: {
          label: data.label,
          type: data.type,
          agentFilled: data.agentFilled,
          agentBrief: data.agentBrief,
          required: data.required,
          showOnSheet: data.showOnSheet,
          showOnTable: data.showOnTable,
          showOnFilter: data.showOnFilter
        },
        include: WITH_OPTIONS
      });
    });
    const briefChanged = data.agentBrief !== undefined && data.agentBrief !== existing.agentBrief;
    const turnedOn = data.agentFilled === true && !existing.agentFilled;
    if (definition.agentFilled && (briefChanged || turnedOn)) {
      const ids = await this.missingRecordIds(definition.entity, definition.id, FIELDS_CONFIG.backfill.maxRecordsPerRun);
      await this.agent.fieldBackfillRecords(definition.entity, [definition.key], ids, briefChanged ? `Brief changed: ${definition.label}` : `Turned on: ${definition.label}`);
    }
    return import_fields3.serializeField(definition);
  }
  async reorder(input) {
    const owned = await this.db.fieldDefinition.findMany({
      where: { id: { in: input.ids }, entity: input.entity },
      select: { id: true }
    });
    if (owned.length !== input.ids.length) {
      throw new import_common32.BadRequestException("That order names a field which is not on this record type.");
    }
    await this.db.$transaction(input.ids.map((id, index) => this.db.fieldDefinition.update({
      where: { id },
      data: { position: index }
    })));
    return this.list(input.entity, false);
  }
  async archive(id) {
    try {
      const definition = await this.db.fieldDefinition.update({
        where: { id },
        data: { archivedAt: new Date },
        include: WITH_OPTIONS
      });
      return import_fields3.serializeField(definition);
    } catch (error) {
      throw this.translate(error);
    }
  }
  async restore(id) {
    try {
      const definition = await this.db.fieldDefinition.update({
        where: { id },
        data: { archivedAt: null },
        include: WITH_OPTIONS
      });
      return import_fields3.serializeField(definition);
    } catch (error) {
      throw this.translate(error);
    }
  }
  async delete(id) {
    try {
      await this.db.fieldDefinition.delete({ where: { id } });
    } catch (error) {
      throw this.translate(error);
    }
    return { id };
  }
  async backfill(id) {
    const definition = await this.db.fieldDefinition.findUnique({
      where: { id },
      select: {
        entity: true,
        key: true,
        label: true,
        agentFilled: true,
        archivedAt: true
      }
    });
    if (!definition)
      throw new import_common32.NotFoundException("That field does not exist.");
    if (!definition.agentFilled || definition.archivedAt !== null) {
      throw new import_common32.BadRequestException("Your agents do not fill this field, so there is nothing to run.");
    }
    const ids = await this.missingRecordIds(definition.entity, id, FIELDS_CONFIG.backfill.maxRecordsPerRun);
    const result = await this.agent.fieldBackfillRecords(definition.entity, [definition.key], ids, "Asked to fill the rest");
    return { queued: result.queued > 0 || result.merged > 0 };
  }
  async queueBackfillForNewRecord(entity, recordId) {
    const definitions = await this.db.fieldDefinition.findMany({
      where: { entity, archivedAt: null, agentFilled: true },
      select: { key: true }
    });
    if (definitions.length === 0)
      return;
    await this.agent.fieldBackfillRecords(entity, definitions.map((definition) => definition.key), [recordId], "New record");
  }
  async missingRecordIds(entity, fieldId, cap) {
    const where = { fieldValues: { none: { fieldId } } };
    const rows = entity === "COMPANY" ? await this.db.company.findMany({
      where,
      select: { id: true },
      take: cap
    }) : entity === "CONTACT" ? await this.db.contact.findMany({
      where,
      select: { id: true },
      take: cap
    }) : await this.db.deal.findMany({
      where,
      select: { id: true },
      take: cap
    });
    return rows.map((row) => row.id);
  }
  async coverage(id) {
    const definition = await this.db.fieldDefinition.findUnique({
      where: { id },
      select: { entity: true }
    });
    if (!definition)
      throw new import_common32.NotFoundException("That field does not exist.");
    const column = import_fields3.recordColumn(definition.entity);
    const [filled, total] = await Promise.all([
      this.db.fieldValue.count({
        where: { fieldId: id, [column]: { not: null } }
      }),
      definition.entity === "COMPANY" ? this.db.company.count() : definition.entity === "CONTACT" ? this.db.contact.count() : this.db.deal.count()
    ]);
    return { filled, total };
  }
  async definitionsFor(entity, client = this.db) {
    return client.fieldDefinition.findMany({
      where: { entity, archivedAt: null },
      include: WITH_OPTIONS,
      orderBy: { position: "asc" }
    });
  }
  async valuesFor(entity, recordId) {
    const column = import_fields3.recordColumn(entity);
    const [definitions, rows] = await Promise.all([
      this.definitionsFor(entity),
      this.db.fieldValue.findMany({ where: { [column]: recordId } })
    ]);
    return import_fields3.attachValues(definitions, rows);
  }
  async tableValuesFor(entity, recordIds) {
    const byRecord = new Map;
    if (recordIds.length === 0)
      return byRecord;
    const definitions = await this.db.fieldDefinition.findMany({
      where: { entity, archivedAt: null, showOnTable: true },
      include: WITH_OPTIONS,
      orderBy: { position: "asc" }
    });
    if (definitions.length === 0)
      return byRecord;
    const column = import_fields3.recordColumn(entity);
    const rows = await this.db.fieldValue.findMany({
      where: {
        [column]: { in: recordIds },
        fieldId: { in: definitions.map((definition) => definition.id) }
      }
    });
    const byId = new Map(definitions.map((entry) => [entry.id, entry]));
    for (const row of rows) {
      const recordId = row[column];
      if (!recordId)
        continue;
      const definition = byId.get(row.fieldId);
      if (!definition)
        continue;
      const current = byRecord.get(recordId) ?? {};
      current[definition.key] = tableValue(definition, import_fields3.readValue(definition, row));
      byRecord.set(recordId, current);
    }
    return byRecord;
  }
  async filters(entity) {
    const definitions = await this.filterableFieldsFor(entity);
    return definitions.map(import_fields3.serializeField);
  }
  async filterableFieldsFor(entity) {
    return this.db.fieldDefinition.findMany({
      where: {
        entity,
        archivedAt: null,
        showOnFilter: true,
        type: { in: ["SELECT", "USER"] }
      },
      include: WITH_OPTIONS,
      orderBy: { position: "asc" }
    });
  }
  async filterFacetCounts(entity, relationWhere, definitions) {
    const facetCounts = {};
    if (definitions.length === 0)
      return facetCounts;
    const relation = RELATIONS[entity];
    const byId = new Map(definitions.map((definition) => [definition.id, definition]));
    const selectIds = definitions.filter((definition) => definition.type === "SELECT").map((definition) => definition.id);
    const userIds = definitions.filter((definition) => definition.type === "USER").map((definition) => definition.id);
    const [selectGroups, userGroups] = await Promise.all([
      selectIds.length > 0 ? this.db.fieldValue.groupBy({
        by: ["fieldId", "optionId"],
        where: {
          fieldId: { in: selectIds },
          optionId: { not: null },
          [relation]: relationWhere
        },
        _count: { _all: true }
      }) : [],
      userIds.length > 0 ? this.db.fieldValue.groupBy({
        by: ["fieldId", "userId"],
        where: {
          fieldId: { in: userIds },
          userId: { not: null },
          [relation]: relationWhere
        },
        _count: { _all: true }
      }) : []
    ]);
    for (const group of selectGroups) {
      const definition = byId.get(group.fieldId);
      if (!definition || !group.optionId)
        continue;
      const bucket = facetCounts[definition.key] ?? {};
      facetCounts[definition.key] = bucket;
      bucket[group.optionId] = (bucket[group.optionId] ?? 0) + group._count._all;
    }
    for (const group of userGroups) {
      const definition = byId.get(group.fieldId);
      if (!definition || !group.userId)
        continue;
      const bucket = facetCounts[definition.key] ?? {};
      facetCounts[definition.key] = bucket;
      bucket[group.userId] = (bucket[group.userId] ?? 0) + group._count._all;
    }
    return facetCounts;
  }
  fieldFilters(definitions, selected) {
    const byKey = new Map(definitions.map((definition) => [definition.key, definition]));
    return Object.entries(selected).filter(([, values]) => values.length > 0).flatMap(([key, values]) => {
      const definition = byKey.get(key);
      if (!definition)
        return [];
      return [
        {
          fieldValues: {
            some: definition.type === "USER" ? { fieldId: definition.id, userId: { in: values } } : { fieldId: definition.id, optionId: { in: values } }
          }
        }
      ];
    });
  }
  async applyValues(tx, entity, recordId, values) {
    if (Object.keys(values).length === 0)
      return;
    const definitions = await this.definitionsFor(entity, tx);
    try {
      await import_fields3.writeValues(tx, entity, recordId, definitions, values);
    } catch (error) {
      if (error instanceof import_fields3.FieldValueError) {
        throw new import_common32.BadRequestException(error.message);
      }
      throw error;
    }
  }
  translate(cause) {
    if (cause instanceof import_db10.Prisma.PrismaClientKnownRequestError && cause.code === "P2025") {
      throw new import_common32.NotFoundException("That field does not exist.");
    }
    throw cause;
  }
}
FieldsService = __legacyDecorateClassTS([
  import_common32.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof AgentTriggerService === "undefined" ? Object : AgentTriggerService
  ])
], FieldsService);
function tableValue(definition, value) {
  if (definition.type !== "SELECT" || typeof value !== "string")
    return value;
  return definition.options.find((option) => option.id === value)?.label ?? null;
}

// src/fields/fields.router.ts
class FieldsRouter {
  fields;
  constructor(fields) {
    this.fields = fields;
  }
  async list(input) {
    return this.fields.list(input.entity, input.includeArchived);
  }
  async byKey(input) {
    return this.fields.byKey(input.entity, input.key);
  }
  async filters(input) {
    return this.fields.filters(input.entity);
  }
  async coverage(id) {
    return this.fields.coverage(id);
  }
  async create(input) {
    return this.fields.create(input);
  }
  async update(input) {
    return this.fields.update(input.id, input.data);
  }
  async reorder(input) {
    return this.fields.reorder(input);
  }
  async archive(id) {
    return this.fields.archive(id);
  }
  async restore(id) {
    return this.fields.restore(id);
  }
  async delete(id) {
    return this.fields.delete(id);
  }
  async backfill(id) {
    return this.fields.backfill(id);
  }
}
__legacyDecorateClassTS([
  import_nestjs_trpc6.Query({
    input: fieldListInput,
    output: fieldListOutput,
    meta: restMeta("GET", "/fields", ["Fields"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc6.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], FieldsRouter.prototype, "list", null);
__legacyDecorateClassTS([
  import_nestjs_trpc6.Query({
    input: fieldByKeyInput,
    output: serializedFieldOutput,
    meta: restMeta("GET", "/fields/{entity}/{key}", ["Fields"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc6.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], FieldsRouter.prototype, "byKey", null);
__legacyDecorateClassTS([
  import_nestjs_trpc6.Query({
    input: fieldEntityInput,
    output: fieldFiltersOutput,
    meta: restMeta("GET", "/fields/{entity}/filterable", ["Fields"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc6.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], FieldsRouter.prototype, "filters", null);
__legacyDecorateClassTS([
  import_nestjs_trpc6.Query({
    input: fieldIdInput,
    output: fieldCoverageOutput,
    meta: restMeta("GET", "/fields/{id}/coverage", ["Fields"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc6.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], FieldsRouter.prototype, "coverage", null);
__legacyDecorateClassTS([
  import_nestjs_trpc6.Mutation({
    input: fieldCreateInput,
    output: serializedFieldOutput,
    meta: restMeta("POST", "/fields", ["Fields"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc6.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], FieldsRouter.prototype, "create", null);
__legacyDecorateClassTS([
  import_nestjs_trpc6.Mutation({
    input: fieldUpdateArgs,
    output: serializedFieldOutput,
    meta: restMeta("PATCH", "/fields/{id}", ["Fields"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc6.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], FieldsRouter.prototype, "update", null);
__legacyDecorateClassTS([
  import_nestjs_trpc6.Mutation({
    input: fieldReorderInput,
    output: fieldReorderOutput,
    meta: restMeta("POST", "/fields/reorder", ["Fields"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc6.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], FieldsRouter.prototype, "reorder", null);
__legacyDecorateClassTS([
  import_nestjs_trpc6.Mutation({
    input: fieldIdInput,
    output: serializedFieldOutput,
    meta: restMeta("POST", "/fields/{id}/archive", ["Fields"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc6.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], FieldsRouter.prototype, "archive", null);
__legacyDecorateClassTS([
  import_nestjs_trpc6.Mutation({
    input: fieldIdInput,
    output: serializedFieldOutput,
    meta: restMeta("POST", "/fields/{id}/restore", ["Fields"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc6.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], FieldsRouter.prototype, "restore", null);
__legacyDecorateClassTS([
  import_nestjs_trpc6.Mutation({
    input: fieldIdInput,
    output: fieldDeleteOutput,
    meta: restMeta("DELETE", "/fields/{id}", ["Fields"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc6.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], FieldsRouter.prototype, "delete", null);
__legacyDecorateClassTS([
  import_nestjs_trpc6.Mutation({
    input: fieldIdInput,
    output: fieldBackfillOutput,
    meta: restMeta("POST", "/fields/{id}/backfill", ["Fields"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc6.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], FieldsRouter.prototype, "backfill", null);
FieldsRouter = __legacyDecorateClassTS([
  import_nestjs_trpc6.Router({ alias: "fields" }),
  import_nestjs_trpc6.UseMiddlewares(AuthMiddleware),
  __legacyDecorateParamTS(0, import_common33.Inject(FieldsService)),
  __legacyMetadataTS("design:paramtypes", [
    typeof FieldsService === "undefined" ? Object : FieldsService
  ])
], FieldsRouter);

// src/fields/fields.module.ts
class FieldsModule {
}
FieldsModule = __legacyDecorateClassTS([
  import_common34.Module({
    imports: [TrpcModule, AgentModule],
    providers: [FieldsService, FieldsRouter],
    exports: [FieldsService]
  })
], FieldsModule);

// src/companies/companies.router.ts
var import_common38 = require("@nestjs/common");
var import_nestjs_trpc7 = require("nestjs-trpc");

// src/companies/companies.contracts.ts
var import_db11 = require("@crm/db");
var import_fields8 = require("@crm/db/fields");
var import_zod12 = require("zod");

// src/crm/bulk.ts
var import_common35 = require("@nestjs/common");
var import_zod11 = require("zod");
var MAX_BULK_IDS = 100;
var bulkIdsInput = import_zod11.z.object({
  ids: import_zod11.z.array(import_zod11.z.string()).min(1, "Nothing was selected.").max(MAX_BULK_IDS, "Too many records at once — select a page at a time.")
});
async function requireOwner(db, ownerId) {
  if (!ownerId)
    return;
  const owner = await db.user.findUnique({
    where: { id: ownerId },
    select: { id: true }
  });
  if (!owner) {
    throw new import_common35.BadRequestException("That owner does not work here any more.");
  }
}
async function runBulk(ids, act) {
  const unique = [...new Set(ids)];
  let succeeded = 0;
  let skipped = 0;
  let message = null;
  for (const id of unique) {
    try {
      const outcome = await act(id);
      if (outcome === null) {
        skipped += 1;
      } else {
        succeeded += 1;
      }
    } catch (error) {
      message ??= error instanceof Error ? error.message : "Something went wrong.";
    }
  }
  return {
    requested: unique.length,
    succeeded,
    skipped,
    failed: unique.length - succeeded - skipped,
    message
  };
}

// src/companies/companies.contracts.ts
var companyListInput = listInput.extend({
  owner: import_zod12.z.array(import_zod12.z.string()).default([]),
  industry: import_zod12.z.array(import_zod12.z.string()).default([]),
  enrichment: import_zod12.z.array(import_zod12.z.string()).default([]),
  source: import_zod12.z.array(import_zod12.z.string()).default([]),
  activity: activityFacetInput.default([]),
  fields: import_zod12.z.record(import_zod12.z.string(), import_zod12.z.array(import_zod12.z.string())).default({}),
  archived: import_zod12.z.boolean().default(false)
});
var companyCreateInput = import_zod12.z.object({
  name: import_zod12.z.string().trim().min(1, "A company needs a name."),
  domain: import_zod12.z.string().trim().optional(),
  ownerId: import_zod12.z.string().nullable().optional()
});
var companyUpdateInput = import_zod12.z.object({
  name: import_zod12.z.string().trim().min(1).optional(),
  domain: import_zod12.z.string().optional(),
  website: import_zod12.z.string().optional(),
  description: import_zod12.z.string().optional(),
  industry: import_zod12.z.string().optional(),
  city: import_zod12.z.string().optional(),
  stateCode: import_zod12.z.string().optional(),
  country: import_zod12.z.string().optional(),
  phone: import_zod12.z.string().optional(),
  email: import_zod12.z.string().optional(),
  linkedinUrl: import_zod12.z.string().optional(),
  ownerId: import_zod12.z.string().nullable().optional(),
  fields: recordFieldValues.optional()
});
var companyUpdateArgs = import_zod12.z.object({
  id: import_zod12.z.string(),
  data: companyUpdateInput
});
var companyIdInput = import_zod12.z.object({ id: import_zod12.z.string() });
var setPrimaryContactInput = import_zod12.z.object({
  companyId: import_zod12.z.string(),
  contactId: import_zod12.z.string().nullable()
});
var companyOptionsInput = import_zod12.z.object({
  q: import_zod12.z.string().default("")
});
var companyBulkInput = bulkIdsInput;
var companyBulkOwnerInput = bulkIdsInput.extend({
  ownerId: import_zod12.z.string().nullable()
});
var companyEnrichmentStatus = import_zod12.z.enum(Object.values(import_db11.EnrichmentStatus));
var companyRecordSource = import_zod12.z.enum(Object.values(import_db11.RecordSource));
var companyDealStage = import_zod12.z.enum(Object.values(import_db11.DealStage));
var companyFieldType = import_zod12.z.enum(import_fields8.FIELD_TYPES);
var ownerSummaryOutput = import_zod12.z.object({
  id: import_zod12.z.string(),
  name: import_zod12.z.string(),
  email: import_zod12.z.string(),
  image: import_zod12.z.string().nullable()
});
var companyFieldOptionOutput = import_zod12.z.object({
  id: import_zod12.z.string(),
  label: import_zod12.z.string(),
  position: import_zod12.z.number()
});
var companyRecordFieldOutput = import_zod12.z.object({
  id: import_zod12.z.string(),
  entity: fieldEntity,
  key: import_zod12.z.string(),
  label: import_zod12.z.string(),
  type: companyFieldType,
  typeLabel: import_zod12.z.string(),
  agentFilled: import_zod12.z.boolean(),
  agentBrief: import_zod12.z.string().nullable(),
  required: import_zod12.z.boolean(),
  showOnSheet: import_zod12.z.boolean(),
  showOnTable: import_zod12.z.boolean(),
  showOnFilter: import_zod12.z.boolean(),
  position: import_zod12.z.number(),
  archived: import_zod12.z.boolean(),
  options: import_zod12.z.array(companyFieldOptionOutput),
  value: import_zod12.z.union([import_zod12.z.string(), import_zod12.z.number(), import_zod12.z.boolean(), import_zod12.z.null()])
});
var companyRowOutput = import_zod12.z.object({
  id: import_zod12.z.string(),
  name: import_zod12.z.string(),
  domain: import_zod12.z.string().nullable(),
  iconUrl: import_zod12.z.string().nullable(),
  iconDarkUrl: import_zod12.z.string().nullable(),
  iconTone: import_zod12.z.string().nullable(),
  logoUrl: import_zod12.z.string().nullable(),
  brandColor: import_zod12.z.string().nullable(),
  industry: import_zod12.z.string().nullable(),
  enrichmentStatus: companyEnrichmentStatus,
  queued: import_zod12.z.boolean(),
  source: companyRecordSource,
  owner: ownerSummaryOutput.nullable(),
  contactCount: import_zod12.z.number(),
  openDealCount: import_zod12.z.number(),
  lastActivityAt: import_zod12.z.string().nullable(),
  createdAt: import_zod12.z.string(),
  archivedAt: import_zod12.z.string().nullable(),
  fields: recordFieldValues
});
var companyListOutput = import_zod12.z.object({
  rows: import_zod12.z.array(companyRowOutput),
  total: import_zod12.z.number(),
  facetCounts: import_zod12.z.record(import_zod12.z.string(), import_zod12.z.record(import_zod12.z.string(), import_zod12.z.number()))
});
var companyDetailContactOutput = import_zod12.z.object({
  id: import_zod12.z.string(),
  firstName: import_zod12.z.string(),
  lastName: import_zod12.z.string().nullable(),
  email: import_zod12.z.string().nullable(),
  title: import_zod12.z.string().nullable(),
  imageUrl: import_zod12.z.string().nullable(),
  owner: ownerSummaryOutput.nullable()
});
var companyDetailDealOutput = import_zod12.z.object({
  id: import_zod12.z.string(),
  name: import_zod12.z.string(),
  stage: companyDealStage,
  currency: import_zod12.z.string(),
  expectedCloseDate: import_zod12.z.string().nullable(),
  owner: ownerSummaryOutput.nullable(),
  amountCents: import_zod12.z.number().nullable(),
  baseAmountCents: import_zod12.z.number().nullable()
});
var companyDetailPrimaryContactOutput = import_zod12.z.object({
  id: import_zod12.z.string(),
  firstName: import_zod12.z.string(),
  lastName: import_zod12.z.string().nullable(),
  email: import_zod12.z.string().nullable(),
  phone: import_zod12.z.string().nullable(),
  title: import_zod12.z.string().nullable()
});
var companyDetailOutput = import_zod12.z.object({
  id: import_zod12.z.string(),
  name: import_zod12.z.string(),
  domain: import_zod12.z.string().nullable(),
  website: import_zod12.z.string().nullable(),
  description: import_zod12.z.string().nullable(),
  logoUrl: import_zod12.z.string().nullable(),
  logoDarkUrl: import_zod12.z.string().nullable(),
  iconUrl: import_zod12.z.string().nullable(),
  iconDarkUrl: import_zod12.z.string().nullable(),
  iconTone: import_zod12.z.string().nullable(),
  brandColor: import_zod12.z.string().nullable(),
  industry: import_zod12.z.string().nullable(),
  subIndustry: import_zod12.z.string().nullable(),
  city: import_zod12.z.string().nullable(),
  stateCode: import_zod12.z.string().nullable(),
  country: import_zod12.z.string().nullable(),
  countryCode: import_zod12.z.string().nullable(),
  phone: import_zod12.z.string().nullable(),
  email: import_zod12.z.string().nullable(),
  linkedinUrl: import_zod12.z.string().nullable(),
  twitterUrl: import_zod12.z.string().nullable(),
  githubUrl: import_zod12.z.string().nullable(),
  pricingUrl: import_zod12.z.string().nullable(),
  careersUrl: import_zod12.z.string().nullable(),
  enrichmentStatus: companyEnrichmentStatus,
  enrichmentError: import_zod12.z.string().nullable(),
  source: companyRecordSource,
  owner: ownerSummaryOutput.nullable(),
  contacts: import_zod12.z.array(companyDetailContactOutput),
  fields: import_zod12.z.array(companyRecordFieldOutput),
  queued: import_zod12.z.boolean(),
  createdAt: import_zod12.z.string(),
  archivedAt: import_zod12.z.string().nullable(),
  enrichedAt: import_zod12.z.string().nullable(),
  primaryContactId: import_zod12.z.string().nullable(),
  primaryContact: companyDetailPrimaryContactOutput.nullable(),
  reportingCurrency: import_zod12.z.string(),
  deals: import_zod12.z.array(companyDetailDealOutput)
});
var companyOptionOutput = import_zod12.z.array(import_zod12.z.object({
  id: import_zod12.z.string(),
  name: import_zod12.z.string(),
  domain: import_zod12.z.string().nullable(),
  iconUrl: import_zod12.z.string().nullable()
}));
var companySummaryOutput = import_zod12.z.object({
  id: import_zod12.z.string(),
  name: import_zod12.z.string(),
  domain: import_zod12.z.string().nullable()
});
var companyArchiveResultOutput = import_zod12.z.object({
  id: import_zod12.z.string(),
  name: import_zod12.z.string()
});
var companyBulkResultOutput = import_zod12.z.object({
  requested: import_zod12.z.number(),
  succeeded: import_zod12.z.number(),
  failed: import_zod12.z.number(),
  message: import_zod12.z.string().nullable()
});
var companyEnrichOutput = import_zod12.z.object({
  id: import_zod12.z.string(),
  queued: import_zod12.z.boolean()
});
var companyResearchOutput = import_zod12.z.object({
  ok: import_zod12.z.literal(true),
  queued: import_zod12.z.boolean()
});
var companySetPrimaryContactOutput = import_zod12.z.object({
  id: import_zod12.z.string(),
  primaryContactId: import_zod12.z.string().nullable()
});

// src/companies/companies.service.ts
var import_db12 = require("@crm/db");
var import_deal_stage = require("@crm/db/deal-stage");
var import_common37 = require("@nestjs/common");

// src/archive/archive-config.ts
var ARCHIVE = {
  prune: {
    maxBatch: 500
  }
};

// src/companies/domain.ts
function normalizeDomain(input) {
  const trimmed = input?.trim().toLowerCase();
  if (!trimmed)
    return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
  let host;
  try {
    host = new URL(withScheme).hostname;
  } catch {
    return null;
  }
  const bare = host.replace(/^www\./, "");
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(bare) ? bare : null;
}
function domainFromEmail(email) {
  const at = email?.trim().toLowerCase().lastIndexOf("@") ?? -1;
  if (at < 1)
    return null;
  const domain = normalizeDomain(email?.slice(at + 1));
  if (!domain)
    return null;
  return FREE_EMAIL_DOMAINS.has(domain) || isMachineDomain(domain) ? null : domain;
}
function isMachineDomain(input) {
  const domain = normalizeDomain(input);
  if (!domain)
    return false;
  return MACHINE_DOMAINS.has(domain) || MACHINE_SUFFIXES.some((suffix) => domain.endsWith(suffix));
}
var FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "hotmail.com",
  "hotmail.co.uk",
  "outlook.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "gmx.com",
  "gmx.de",
  "mail.com",
  "yandex.ru",
  "qq.com",
  "163.com"
]);
var MACHINE_DOMAINS = new Set([
  "calendar.google.com",
  "googlegroups.com",
  "docs.google.com",
  "drive.google.com",
  "appspotmail.com",
  "amazonses.com",
  "sendgrid.net",
  "zoomcrc.com"
]);
var MACHINE_SUFFIXES = [
  ".calendar.google.com",
  ".bounces.google.com",
  ".appspotmail.com",
  ".amazonses.com",
  ".sendgrid.net",
  ".invalid",
  ".local",
  ".localhost"
];

// src/companies/favicon.service.ts
var import_blob = require("@crm/db/blob");
var import_favicon = require("@crm/db/favicon");
var import_common36 = require("@nestjs/common");
class FaviconService {
  db;
  logger = new import_common36.Logger(FaviconService.name);
  constructor(db) {
    this.db = db;
  }
  async backfill(companyId, domain) {
    try {
      const resolved = await import_favicon.resolveFavicon(domain);
      if (!resolved)
        return false;
      const iconUrl = await import_blob.mirror(resolved, `companies/${companyId}/icon`) ?? resolved;
      const { count } = await this.db.company.updateMany({
        where: { id: companyId, iconUrl: null, domain },
        data: { iconUrl }
      });
      if (count > 0) {
        this.logger.log({ message: "Favicon resolved", companyId, iconUrl });
      }
      return count > 0;
    } catch (error) {
      this.logger.debug({
        message: "Favicon lookup failed",
        companyId,
        domain,
        error: error instanceof Error ? error.message : String(error)
      });
      return false;
    }
  }
}
FaviconService = __legacyDecorateClassTS([
  import_common36.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db
  ])
], FaviconService);

// src/companies/companies.service.ts
var OWNER_SELECT = {
  id: true,
  name: true,
  email: true,
  image: true
};
var SORTABLE2 = {
  name: (dir) => ({ name: dir }),
  domain: (dir) => ({ domain: dir }),
  industry: (dir) => ({ industry: dir }),
  createdAt: (dir) => ({ createdAt: dir }),
  contacts: (dir) => ({ contacts: { _count: dir } }),
  deals: (dir) => ({ deals: { _count: dir } }),
  owner: (dir) => ({ owner: { name: dir } }),
  lastActivity: (dir) => ({ lastActivityAt: { sort: dir, nulls: "last" } }),
  archivedAt: (dir) => ({ archivedAt: { sort: dir, nulls: "last" } })
};

class CompaniesService {
  db;
  agent;
  queue;
  favicon;
  stamp;
  conversion;
  fields;
  logger = new import_common37.Logger(CompaniesService.name);
  constructor(db, agent, queue, favicon, stamp, conversion, fields) {
    this.db = db;
    this.agent = agent;
    this.queue = queue;
    this.favicon = favicon;
    this.stamp = stamp;
    this.conversion = conversion;
    this.fields = fields;
  }
  async list(input) {
    const filterableFields = await this.fields.filterableFieldsFor("COMPANY");
    const where = this.buildWhere(input, filterableFields);
    const { skip, take } = paginate(input);
    const [rows, total, facetCounts] = await Promise.all([
      this.db.company.findMany({
        where,
        skip,
        take,
        orderBy: resolveOrderBy(input, SORTABLE2, {
          createdAt: "desc"
        }),
        select: {
          id: true,
          name: true,
          domain: true,
          iconUrl: true,
          iconDarkUrl: true,
          iconTone: true,
          logoUrl: true,
          brandColor: true,
          industry: true,
          enrichmentStatus: true,
          source: true,
          owner: { select: OWNER_SELECT },
          _count: {
            select: {
              contacts: true,
              deals: { where: { stage: { in: [...import_deal_stage.OPEN_DEAL_STAGES] } } }
            }
          },
          lastActivityAt: true,
          createdAt: true,
          archivedAt: true
        }
      }),
      this.db.company.count({ where }),
      this.facetCounts(input, filterableFields)
    ]);
    const ids = rows.map((row) => row.id);
    const [queued, tableFields] = await Promise.all([
      this.queue.queuedCompanies(ids),
      this.fields.tableValuesFor("COMPANY", ids)
    ]);
    return {
      rows: rows.map((row) => ({
        id: row.id,
        name: row.name,
        domain: row.domain,
        iconUrl: row.iconUrl,
        iconDarkUrl: row.iconDarkUrl,
        iconTone: row.iconTone,
        logoUrl: row.logoUrl,
        brandColor: row.brandColor,
        industry: row.industry,
        enrichmentStatus: row.enrichmentStatus,
        queued: queued.has(row.id),
        source: row.source,
        owner: row.owner,
        contactCount: row._count.contacts,
        openDealCount: row._count.deals,
        lastActivityAt: row.lastActivityAt?.toISOString() ?? null,
        createdAt: row.createdAt.toISOString(),
        archivedAt: row.archivedAt?.toISOString() ?? null,
        fields: tableFields.get(row.id) ?? {}
      })),
      total,
      facetCounts
    };
  }
  async byId(id) {
    const company = await this.db.company.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        domain: true,
        website: true,
        description: true,
        logoUrl: true,
        logoDarkUrl: true,
        iconUrl: true,
        iconDarkUrl: true,
        iconTone: true,
        brandColor: true,
        industry: true,
        subIndustry: true,
        city: true,
        stateCode: true,
        country: true,
        countryCode: true,
        phone: true,
        email: true,
        linkedinUrl: true,
        twitterUrl: true,
        githubUrl: true,
        pricingUrl: true,
        careersUrl: true,
        enrichmentStatus: true,
        enrichedAt: true,
        enrichmentError: true,
        source: true,
        createdAt: true,
        archivedAt: true,
        owner: { select: OWNER_SELECT },
        primaryContact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            title: true
          }
        },
        contacts: {
          orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            title: true,
            imageUrl: true,
            owner: { select: OWNER_SELECT }
          }
        },
        deals: {
          orderBy: [{ stage: "asc" }, { expectedCloseDate: "asc" }],
          select: {
            id: true,
            name: true,
            stage: true,
            amount: true,
            currency: true,
            baseAmount: true,
            expectedCloseDate: true,
            owner: { select: OWNER_SELECT }
          }
        }
      }
    });
    if (!company) {
      throw new import_common37.NotFoundException(`No company with id ${id}.`);
    }
    const {
      deals,
      primaryContact,
      enrichedAt,
      createdAt,
      archivedAt,
      ...rest
    } = company;
    return {
      ...rest,
      fields: await this.fields.valuesFor("COMPANY", id),
      queued: await this.queue.isQueued({ companyId: id }),
      createdAt: createdAt.toISOString(),
      archivedAt: archivedAt?.toISOString() ?? null,
      enrichedAt: enrichedAt?.toISOString() ?? null,
      primaryContactId: primaryContact?.id ?? null,
      primaryContact,
      reportingCurrency: await this.conversion.reportingCurrency(),
      deals: deals.map((deal) => ({
        ...deal,
        amount: undefined,
        baseAmount: undefined,
        amountCents: toCents(deal.amount),
        baseAmountCents: toCents(deal.baseAmount),
        expectedCloseDate: deal.expectedCloseDate?.toISOString() ?? null
      }))
    };
  }
  async options(q) {
    return this.db.company.findMany({
      where: this.searchFilter(q),
      select: { id: true, name: true, domain: true, iconUrl: true },
      orderBy: { name: "asc" },
      take: 100
    });
  }
  async create(input) {
    const domain = normalizeDomain(input.domain);
    if (domain) {
      const existing = await this.db.company.findFirst({
        where: { domain, archivedAt: null },
        select: { id: true, name: true }
      });
      if (existing) {
        throw new import_common37.ConflictException(`${existing.name} already uses the domain ${domain}.`);
      }
    }
    const company = await this.agent.withCrmEvents(async (tx, emit) => {
      const created = await tx.company.create({
        data: {
          name: input.name.trim(),
          domain,
          website: domain ? `https://${domain}` : null,
          ownerId: input.ownerId ?? null
        },
        select: { id: true, name: true, domain: true, createdAt: true }
      });
      await emit({
        type: "company.created",
        record: { kind: "company", id: created.id },
        occurredAt: created.createdAt,
        data: { name: created.name, domain: created.domain }
      });
      return created;
    });
    this.logger.log({
      message: "Company created",
      companyId: company.id,
      domain: company.domain
    });
    await this.agent.companyCreated(company.id);
    this.favicon.backfill(company.id, company.domain);
    this.fields.queueBackfillForNewRecord("COMPANY", company.id);
    return { id: company.id, name: company.name, domain: company.domain };
  }
  async update(id, input) {
    const data = {};
    if (input.name !== undefined)
      data.name = input.name.trim();
    if (input.website !== undefined)
      data.website = blankToNull(input.website);
    if (input.description !== undefined) {
      data.description = blankToNull(input.description);
    }
    if (input.industry !== undefined)
      data.industry = blankToNull(input.industry);
    if (input.city !== undefined)
      data.city = blankToNull(input.city);
    if (input.stateCode !== undefined) {
      data.stateCode = blankToNull(input.stateCode);
    }
    if (input.country !== undefined)
      data.country = blankToNull(input.country);
    if (input.phone !== undefined)
      data.phone = blankToNull(input.phone);
    if (input.email !== undefined)
      data.email = blankToNull(input.email);
    if (input.linkedinUrl !== undefined) {
      data.linkedinUrl = blankToNull(input.linkedinUrl);
    }
    if (input.ownerId !== undefined) {
      data.owner = input.ownerId ? { connect: { id: input.ownerId } } : { disconnect: true };
    }
    if (input.domain !== undefined) {
      const domain = normalizeDomain(input.domain);
      if (input.domain.trim() && !domain) {
        throw new import_common37.BadRequestException(`"${input.domain}" is not a domain — try something like "stripe.com".`);
      }
      data.domain = domain;
      const current = await this.db.company.findUnique({
        where: { id },
        select: { domain: true }
      });
      if (current && current.domain !== domain) {
        data.enrichmentStatus = "PENDING";
        data.enrichmentError = null;
        data.iconUrl = null;
        data.iconDarkUrl = null;
        data.iconTone = null;
      }
    }
    try {
      const updated = await this.db.$transaction(async (tx) => {
        if (input.fields) {
          await this.fields.applyValues(tx, "COMPANY", id, input.fields);
        }
        return tx.company.update({
          where: { id },
          data,
          select: { id: true, name: true, domain: true }
        });
      });
      if (data.enrichmentStatus === "PENDING") {
        await this.agent.companyCreated(id, "Domain changed — anything we knew was about a different company");
        this.favicon.backfill(id, updated.domain);
      }
      return updated;
    } catch (error) {
      throw this.translate(error, id);
    }
  }
  async archive(id) {
    try {
      const company = await this.db.company.update({
        where: { id },
        data: { archivedAt: new Date },
        select: { name: true }
      });
      this.logger.log({ message: "Company archived", companyId: id });
      return { id, name: company.name };
    } catch (error) {
      throw this.translate(error, id);
    }
  }
  async restore(id) {
    try {
      const company = await this.db.company.update({
        where: { id },
        data: { archivedAt: null },
        select: { name: true }
      });
      this.logger.log({ message: "Company restored", companyId: id });
      return { id, name: company.name };
    } catch (error) {
      throw this.translate(error, id);
    }
  }
  async purge(id, guard) {
    let deleted;
    try {
      deleted = await this.db.$transaction(async (tx) => {
        const [row] = await tx.$queryRaw`
					SELECT "archivedAt" FROM company WHERE id = ${id} FOR UPDATE
				`;
        if (!row) {
          if (guard)
            return null;
          throw new import_common37.NotFoundException(`No company with id ${id}.`);
        }
        if (guard && (!row.archivedAt || row.archivedAt > guard.archivedBefore)) {
          return null;
        }
        const targets = await this.stamp.targetsOf({ OR: [{ companyId: id }, { deal: { companyId: id } }] }, tx);
        const deals = await tx.deal.findMany({
          where: { companyId: id },
          select: { id: true }
        });
        await tx.agentTask.deleteMany({
          where: {
            OR: [
              { companyId: id },
              { dealId: { in: deals.map((deal) => deal.id) } }
            ]
          }
        });
        const company = await tx.company.delete({
          where: { id },
          select: { name: true }
        });
        return { targets, name: company.name };
      });
    } catch (error) {
      throw this.translate(error, id);
    }
    if (!deleted)
      return null;
    await this.stamp.recomputeAfterDelete(deleted.targets, { companyId: id });
    this.logger.log({
      message: "Company purged",
      companyId: id,
      name: deleted.name
    });
    return { id, name: deleted.name };
  }
  async purgeExpired(before) {
    const expired = await this.db.company.findMany({
      where: { archivedAt: { lte: before } },
      select: { id: true },
      take: ARCHIVE.prune.maxBatch
    });
    return runBulk(expired.map((row) => row.id), (id) => this.purge(id, { archivedBefore: before }));
  }
  async bulkAssignOwner(input) {
    const ownerId = input.ownerId || null;
    await requireOwner(this.db, ownerId);
    const ids = [...new Set(input.ids)];
    const { count } = await this.db.company.updateMany({
      where: { id: { in: ids } },
      data: { ownerId }
    });
    this.logger.log({
      message: "Companies reassigned",
      count,
      ownerId
    });
    return {
      requested: ids.length,
      succeeded: count,
      skipped: 0,
      failed: ids.length - count,
      message: null
    };
  }
  async bulkEnrich(ids) {
    return runBulk(ids, (id) => this.enrich(id));
  }
  async bulkArchive(ids) {
    return runBulk(ids, (id) => this.archive(id));
  }
  async bulkRestore(ids) {
    return runBulk(ids, (id) => this.restore(id));
  }
  async bulkPurge(ids) {
    return runBulk(ids, (id) => this.purge(id));
  }
  async enrich(id) {
    const company = await this.db.company.findUnique({
      where: { id },
      select: { id: true, updatedAt: true }
    });
    if (!company) {
      throw new import_common37.NotFoundException(`No company with id ${id}.`);
    }
    const queued = await this.agent.companyRequested(id, "A rep asked for a fresh look");
    if (queued) {
      await this.db.company.updateMany({
        where: { id, updatedAt: company.updatedAt },
        data: { enrichmentStatus: "PENDING", enrichmentError: null }
      });
    }
    return { id, queued };
  }
  async research(id, actingUserId) {
    const company = await this.db.company.findUnique({
      where: { id },
      select: { id: true, domain: true }
    });
    if (!company) {
      throw new import_common37.NotFoundException(`No company with id ${id}.`);
    }
    if (!company.domain) {
      throw new import_common37.BadRequestException("There is nothing to read without a domain — add one first.");
    }
    const queued = await this.agent.companyRequested(id, `Briefing requested by a rep (${actingUserId})`);
    return { ok: true, queued };
  }
  async setPrimaryContact(companyId, contactId) {
    if (contactId) {
      const contact = await this.db.contact.findUnique({
        where: { id: contactId },
        select: { companyId: true }
      });
      if (!contact) {
        throw new import_common37.NotFoundException(`No contact with id ${contactId}.`);
      }
      if (contact.companyId !== companyId) {
        throw new import_common37.BadRequestException("That contact does not work at this company.");
      }
    }
    try {
      return await this.db.company.update({
        where: { id: companyId },
        data: { primaryContactId: contactId },
        select: { id: true, primaryContactId: true }
      });
    } catch (error) {
      throw this.translate(error, companyId);
    }
  }
  searchFilter(q) {
    const term = q.trim();
    if (!term)
      return {};
    return {
      OR: [
        { name: { contains: term, mode: "insensitive" } },
        { domain: { contains: term, mode: "insensitive" } }
      ]
    };
  }
  buildWhere(input, filterableFields) {
    const and = [
      this.searchFilter(input.q),
      archivedFilter(input.archived),
      ...this.fields.fieldFilters(filterableFields, input.fields)
    ];
    const owner = ownerFilter(input.owner);
    if (owner)
      and.push(owner);
    if (input.industry.length > 0)
      and.push({ industry: { in: input.industry } });
    if (input.enrichment.length > 0) {
      and.push({
        enrichmentStatus: { in: input.enrichment }
      });
    }
    if (input.source.length > 0) {
      and.push({ source: { in: input.source } });
    }
    const activity = activityFilter(input.activity);
    if (activity)
      and.push(activity);
    return { AND: and };
  }
  async facetCounts(input, filterableFields) {
    const where = {
      AND: [this.searchFilter(input.q), archivedFilter(input.archived)]
    };
    const [owners, industries, enrichment, sources, activity, fieldFacets] = await Promise.all([
      this.db.company.groupBy({
        by: ["ownerId"],
        where,
        _count: { _all: true }
      }),
      this.db.company.groupBy({
        by: ["industry"],
        where,
        _count: { _all: true }
      }),
      this.db.company.groupBy({
        by: ["enrichmentStatus"],
        where,
        _count: { _all: true }
      }),
      this.db.company.groupBy({
        by: ["source"],
        where,
        _count: { _all: true }
      }),
      activityFacetCounts((activityWhere) => this.db.company.count({ where: { AND: [where, activityWhere] } })),
      this.fields.filterFacetCounts("COMPANY", where, filterableFields)
    ]);
    return {
      owner: countsByKey(owners, "ownerId", FACET_UNASSIGNED),
      industry: countsByKey(industries, "industry"),
      enrichment: countsByKey(enrichment, "enrichmentStatus"),
      source: countsByKey(sources, "source"),
      activity,
      ...Object.fromEntries(Object.entries(fieldFacets).map(([key, counts]) => [
        `field:${key}`,
        counts
      ]))
    };
  }
  translate(cause, id) {
    if (cause instanceof import_db12.Prisma.PrismaClientKnownRequestError) {
      if (cause.code === "P2025") {
        throw new import_common37.NotFoundException(`No company with id ${id}.`);
      }
      if (cause.code === "P2002") {
        throw new import_common37.ConflictException("Another company already uses that domain.");
      }
    }
    throw cause;
  }
}
CompaniesService = __legacyDecorateClassTS([
  import_common37.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof AgentTriggerService === "undefined" ? Object : AgentTriggerService,
    typeof AgentQueueService === "undefined" ? Object : AgentQueueService,
    typeof FaviconService === "undefined" ? Object : FaviconService,
    typeof ActivityStampService === "undefined" ? Object : ActivityStampService,
    typeof ConversionService === "undefined" ? Object : ConversionService,
    typeof FieldsService === "undefined" ? Object : FieldsService
  ])
], CompaniesService);

// src/companies/companies.router.ts
class CompaniesRouter {
  companies;
  constructor(companies) {
    this.companies = companies;
  }
  async list(input) {
    return this.companies.list(input);
  }
  async byId(id) {
    return this.companies.byId(id);
  }
  async options(q) {
    return this.companies.options(q);
  }
  async create(input) {
    return this.companies.create(input);
  }
  async update(input) {
    return this.companies.update(input.id, input.data);
  }
  async archive(id) {
    return this.companies.archive(id);
  }
  async restore(id) {
    return this.companies.restore(id);
  }
  async purge(id) {
    return this.companies.purge(id);
  }
  async bulkAssignOwner(input) {
    return this.companies.bulkAssignOwner(input);
  }
  async bulkEnrich(ids) {
    return this.companies.bulkEnrich(ids);
  }
  async bulkArchive(ids) {
    return this.companies.bulkArchive(ids);
  }
  async bulkRestore(ids) {
    return this.companies.bulkRestore(ids);
  }
  async bulkPurge(ids) {
    return this.companies.bulkPurge(ids);
  }
  async enrich(id) {
    return this.companies.enrich(id);
  }
  async research(ctx, id) {
    return this.companies.research(id, ctx.user.id);
  }
  async setPrimaryContact(input) {
    return this.companies.setPrimaryContact(input.companyId, input.contactId);
  }
}
__legacyDecorateClassTS([
  import_nestjs_trpc7.Query({
    input: companyListInput,
    output: companyListOutput,
    meta: restMeta("POST", "/companies/search", ["Companies"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc7.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], CompaniesRouter.prototype, "list", null);
__legacyDecorateClassTS([
  import_nestjs_trpc7.Query({
    input: companyIdInput,
    output: companyDetailOutput,
    meta: restMeta("GET", "/companies/{id}", ["Companies"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc7.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], CompaniesRouter.prototype, "byId", null);
__legacyDecorateClassTS([
  import_nestjs_trpc7.Query({
    input: companyOptionsInput,
    output: companyOptionOutput,
    meta: restMeta("GET", "/companies/options", ["Companies"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc7.Input("q")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], CompaniesRouter.prototype, "options", null);
__legacyDecorateClassTS([
  import_nestjs_trpc7.Mutation({
    input: companyCreateInput,
    output: companySummaryOutput,
    meta: restMeta("POST", "/companies", ["Companies"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc7.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], CompaniesRouter.prototype, "create", null);
__legacyDecorateClassTS([
  import_nestjs_trpc7.Mutation({
    input: companyUpdateArgs,
    output: companySummaryOutput,
    meta: restMeta("PATCH", "/companies/{id}", ["Companies"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc7.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], CompaniesRouter.prototype, "update", null);
__legacyDecorateClassTS([
  import_nestjs_trpc7.Mutation({
    input: companyIdInput,
    output: companyArchiveResultOutput,
    meta: restMeta("POST", "/companies/{id}/archive", ["Companies"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc7.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], CompaniesRouter.prototype, "archive", null);
__legacyDecorateClassTS([
  import_nestjs_trpc7.Mutation({
    input: companyIdInput,
    output: companyArchiveResultOutput,
    meta: restMeta("POST", "/companies/{id}/restore", ["Companies"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc7.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], CompaniesRouter.prototype, "restore", null);
__legacyDecorateClassTS([
  import_nestjs_trpc7.Mutation({
    input: companyIdInput,
    output: companyArchiveResultOutput,
    meta: restMeta("DELETE", "/companies/{id}", ["Companies"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc7.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], CompaniesRouter.prototype, "purge", null);
__legacyDecorateClassTS([
  import_nestjs_trpc7.Mutation({
    input: companyBulkOwnerInput,
    output: companyBulkResultOutput,
    meta: restMeta("POST", "/companies/bulk-assign-owner", ["Companies"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc7.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], CompaniesRouter.prototype, "bulkAssignOwner", null);
__legacyDecorateClassTS([
  import_nestjs_trpc7.Mutation({
    input: companyBulkInput,
    output: companyBulkResultOutput,
    meta: restMeta("POST", "/companies/bulk-enrich", ["Companies"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc7.Input("ids")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    Array
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], CompaniesRouter.prototype, "bulkEnrich", null);
__legacyDecorateClassTS([
  import_nestjs_trpc7.Mutation({
    input: companyBulkInput,
    output: companyBulkResultOutput,
    meta: restMeta("POST", "/companies/bulk-archive", ["Companies"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc7.Input("ids")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    Array
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], CompaniesRouter.prototype, "bulkArchive", null);
__legacyDecorateClassTS([
  import_nestjs_trpc7.Mutation({
    input: companyBulkInput,
    output: companyBulkResultOutput,
    meta: restMeta("POST", "/companies/bulk-restore", ["Companies"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc7.Input("ids")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    Array
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], CompaniesRouter.prototype, "bulkRestore", null);
__legacyDecorateClassTS([
  import_nestjs_trpc7.Mutation({
    input: companyBulkInput,
    output: companyBulkResultOutput,
    meta: restMeta("POST", "/companies/bulk-purge", ["Companies"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc7.Input("ids")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    Array
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], CompaniesRouter.prototype, "bulkPurge", null);
__legacyDecorateClassTS([
  import_nestjs_trpc7.Mutation({
    input: companyIdInput,
    output: companyEnrichOutput,
    meta: restMeta("POST", "/companies/{id}/enrich", ["Companies"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc7.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], CompaniesRouter.prototype, "enrich", null);
__legacyDecorateClassTS([
  import_nestjs_trpc7.Mutation({
    input: companyIdInput,
    output: companyResearchOutput,
    meta: restMeta("POST", "/companies/{id}/research", ["Companies"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc7.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc7.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], CompaniesRouter.prototype, "research", null);
__legacyDecorateClassTS([
  import_nestjs_trpc7.Mutation({
    input: setPrimaryContactInput,
    output: companySetPrimaryContactOutput,
    meta: restMeta("POST", "/companies/{companyId}/set-primary-contact", [
      "Companies"
    ])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc7.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], CompaniesRouter.prototype, "setPrimaryContact", null);
CompaniesRouter = __legacyDecorateClassTS([
  import_nestjs_trpc7.Router({ alias: "companies" }),
  import_nestjs_trpc7.UseMiddlewares(AuthMiddleware),
  __legacyDecorateParamTS(0, import_common38.Inject(CompaniesService)),
  __legacyMetadataTS("design:paramtypes", [
    typeof CompaniesService === "undefined" ? Object : CompaniesService
  ])
], CompaniesRouter);

// src/companies/company-directory.service.ts
var import_db13 = require("@crm/db");
var import_idempotency3 = require("@crm/db/idempotency");
var import_common39 = require("@nestjs/common");
class CompanyDirectoryService {
  agent;
  logger = new import_common39.Logger(CompanyDirectoryService.name);
  constructor(agent) {
    this.agent = agent;
  }
  async companyForEmail(email, options = {}) {
    const domain = domainFromEmail(email);
    if (!domain)
      return null;
    const outcome = await this.agent.withCrmEvents(async (tx, emit) => {
      await import_idempotency3.lockIdempotencyKey(tx, `company-directory:${domain}`);
      const existing = await tx.company.findFirst({
        where: { domain, archivedAt: null },
        select: { id: true }
      });
      if (existing)
        return { id: existing.id, created: false };
      const company = await tx.company.create({
        data: {
          name: domain,
          domain,
          website: `https://${domain}`,
          enrichmentStatus: import_db13.EnrichmentStatus.PENDING,
          ownerId: options.ownerId ?? null
        },
        select: { id: true, name: true, domain: true, createdAt: true }
      });
      await emit({
        type: "company.created",
        record: { kind: "company", id: company.id },
        occurredAt: company.createdAt,
        data: { name: company.name, domain: company.domain }
      });
      return { id: company.id, created: true };
    });
    if (!outcome.created)
      return outcome.id;
    await this.agent.companyCreated(outcome.id, `Created from an email domain (${domain}) — it has no name but the domain`);
    this.logger.log({
      message: "Company created from an email domain",
      companyId: outcome.id,
      domain
    });
    return outcome.id;
  }
}
CompanyDirectoryService = __legacyDecorateClassTS([
  import_common39.Injectable(),
  __legacyMetadataTS("design:paramtypes", [
    typeof AgentTriggerService === "undefined" ? Object : AgentTriggerService
  ])
], CompanyDirectoryService);

// src/companies/companies.module.ts
class CompaniesModule {
}
CompaniesModule = __legacyDecorateClassTS([
  import_common40.Module({
    imports: [FieldsModule, TrpcModule, AgentModule, CurrencyModule],
    providers: [
      CompaniesService,
      CompanyDirectoryService,
      CompaniesRouter,
      FaviconService
    ],
    exports: [CompaniesService, CompanyDirectoryService, FaviconService]
  })
], CompaniesModule);

// src/contacts/contacts.module.ts
var import_common43 = require("@nestjs/common");

// src/contacts/contacts.router.ts
var import_common42 = require("@nestjs/common");
var import_nestjs_trpc8 = require("nestjs-trpc");

// src/contacts/contacts.contracts.ts
var import_db14 = require("@crm/db");
var import_fields12 = require("@crm/db/fields");
var import_zod13 = require("zod");
var contactListInput = listInput.extend({
  owner: import_zod13.z.array(import_zod13.z.string()).default([]),
  company: import_zod13.z.array(import_zod13.z.string()).default([]),
  source: import_zod13.z.array(import_zod13.z.string()).default([]),
  title: import_zod13.z.array(import_zod13.z.string()).default([]),
  seniority: import_zod13.z.array(import_zod13.z.string()).default([]),
  persona: import_zod13.z.array(import_zod13.z.string()).default([]),
  activity: activityFacetInput.default([]),
  fields: import_zod13.z.record(import_zod13.z.string(), import_zod13.z.array(import_zod13.z.string())).default({}),
  archived: import_zod13.z.boolean().default(false)
});
var contactCreateInput = import_zod13.z.object({
  firstName: import_zod13.z.string().trim().min(1, "A contact needs a first name."),
  lastName: import_zod13.z.string().trim().optional(),
  email: import_zod13.z.email("That is not an email address.").optional().or(import_zod13.z.literal("")),
  phone: import_zod13.z.string().trim().optional(),
  title: import_zod13.z.string().trim().optional(),
  companyId: import_zod13.z.string().nullable().optional(),
  ownerId: import_zod13.z.string().nullable().optional()
});
var contactUpdateInput = import_zod13.z.object({
  firstName: import_zod13.z.string().trim().min(1).optional(),
  lastName: import_zod13.z.string().optional(),
  email: import_zod13.z.string().optional(),
  phone: import_zod13.z.string().optional(),
  title: import_zod13.z.string().optional(),
  linkedinUrl: import_zod13.z.string().optional(),
  twitterUrl: import_zod13.z.string().optional(),
  githubUrl: import_zod13.z.string().optional(),
  companyId: import_zod13.z.string().nullable().optional(),
  ownerId: import_zod13.z.string().nullable().optional(),
  fields: recordFieldValues.optional()
});
var contactUpdateArgs = import_zod13.z.object({
  id: import_zod13.z.string(),
  data: contactUpdateInput
});
var contactIdInput = import_zod13.z.object({ id: import_zod13.z.string() });
var contactBulkInput = bulkIdsInput;
var contactBulkOwnerInput = bulkIdsInput.extend({
  ownerId: import_zod13.z.string().nullable()
});
var contactBulkCompanyInput = bulkIdsInput.extend({
  companyId: import_zod13.z.string().nullable()
});
var factDecisionInput = import_zod13.z.object({
  factId: import_zod13.z.string(),
  decision: import_zod13.z.enum(["accept", "dismiss"])
});
var fieldValueOutput = import_zod13.z.union([
  import_zod13.z.string(),
  import_zod13.z.number(),
  import_zod13.z.boolean(),
  import_zod13.z.null()
]);
var fieldOptionOutput2 = import_zod13.z.object({
  id: import_zod13.z.string(),
  label: import_zod13.z.string(),
  position: import_zod13.z.number()
});
var recordFieldOutput = import_zod13.z.object({
  id: import_zod13.z.string(),
  entity: import_zod13.z.enum(import_fields12.FIELD_ENTITIES),
  key: import_zod13.z.string(),
  label: import_zod13.z.string(),
  type: import_zod13.z.enum(import_fields12.FIELD_TYPES),
  typeLabel: import_zod13.z.string(),
  agentFilled: import_zod13.z.boolean(),
  agentBrief: import_zod13.z.string().nullable(),
  required: import_zod13.z.boolean(),
  showOnSheet: import_zod13.z.boolean(),
  showOnTable: import_zod13.z.boolean(),
  showOnFilter: import_zod13.z.boolean(),
  position: import_zod13.z.number(),
  archived: import_zod13.z.boolean(),
  options: import_zod13.z.array(fieldOptionOutput2),
  value: fieldValueOutput
});
var contactCompanyOutput = import_zod13.z.object({
  id: import_zod13.z.string(),
  name: import_zod13.z.string(),
  domain: import_zod13.z.string().nullable(),
  iconUrl: import_zod13.z.string().nullable(),
  iconDarkUrl: import_zod13.z.string().nullable(),
  iconTone: import_zod13.z.string().nullable(),
  logoUrl: import_zod13.z.string().nullable()
});
var contactOwnerOutput = import_zod13.z.object({
  id: import_zod13.z.string(),
  name: import_zod13.z.string(),
  email: import_zod13.z.string(),
  image: import_zod13.z.string().nullable()
});
var contactRowOutput = import_zod13.z.object({
  id: import_zod13.z.string(),
  firstName: import_zod13.z.string(),
  lastName: import_zod13.z.string().nullable(),
  email: import_zod13.z.string().nullable(),
  title: import_zod13.z.string().nullable(),
  imageUrl: import_zod13.z.string().nullable(),
  source: import_zod13.z.enum(Object.values(import_db14.RecordSource)),
  company: contactCompanyOutput.nullable(),
  owner: contactOwnerOutput.nullable(),
  lastActivityAt: import_zod13.z.string().nullable(),
  createdAt: import_zod13.z.string(),
  archivedAt: import_zod13.z.string().nullable(),
  fields: import_zod13.z.record(import_zod13.z.string(), fieldValueOutput)
});
var contactListOutput = import_zod13.z.object({
  rows: import_zod13.z.array(contactRowOutput),
  total: import_zod13.z.number(),
  facetCounts: import_zod13.z.record(import_zod13.z.string(), import_zod13.z.record(import_zod13.z.string(), import_zod13.z.number()))
});
var contactBriefSectionsOutput = import_zod13.z.object({
  currentRole: import_zod13.z.string().optional(),
  tenure: import_zod13.z.string().optional(),
  previousRoles: import_zod13.z.array(import_zod13.z.string()).optional(),
  seniority: import_zod13.z.string().optional(),
  function: import_zod13.z.string().optional(),
  location: import_zod13.z.string().optional()
});
var contactBriefOutput = import_zod13.z.object({
  narrative: import_zod13.z.string(),
  sections: contactBriefSectionsOutput,
  score: import_zod13.z.number(),
  sourceUrl: import_zod13.z.string().nullable(),
  refreshedAt: import_zod13.z.string()
});
var contactFactEvidenceOutput = import_zod13.z.object({
  kind: import_zod13.z.string(),
  detail: import_zod13.z.string(),
  sourceUrl: import_zod13.z.string().optional()
});
var contactFactOutput = import_zod13.z.object({
  id: import_zod13.z.string(),
  field: import_zod13.z.string(),
  value: import_zod13.z.string(),
  score: import_zod13.z.number(),
  band: import_zod13.z.enum(Object.values(import_db14.FactBand)),
  evidence: import_zod13.z.array(contactFactEvidenceOutput),
  method: import_zod13.z.string(),
  sourceUrl: import_zod13.z.string().nullable(),
  status: import_zod13.z.enum(Object.values(import_db14.FactStatus)),
  observedAt: import_zod13.z.string()
});
var contactRelationshipMeetingOutput = import_zod13.z.object({
  title: import_zod13.z.string(),
  startsAt: import_zod13.z.string()
});
var contactRelationshipColleagueOutput = import_zod13.z.object({
  id: import_zod13.z.string(),
  name: import_zod13.z.string(),
  title: import_zod13.z.string().nullable()
});
var contactRelationshipOutput = import_zod13.z.object({
  emails: import_zod13.z.number(),
  threads: import_zod13.z.number(),
  lastReplyAt: import_zod13.z.string().nullable(),
  meetings: import_zod13.z.number(),
  nextMeeting: contactRelationshipMeetingOutput.nullable(),
  colleagues: import_zod13.z.array(contactRelationshipColleagueOutput)
});
var contactDealOutput = import_zod13.z.object({
  id: import_zod13.z.string(),
  name: import_zod13.z.string(),
  stage: import_zod13.z.enum(Object.values(import_db14.DealStage)),
  currency: import_zod13.z.string(),
  expectedCloseDate: import_zod13.z.string().nullable(),
  owner: contactOwnerOutput,
  role: import_zod13.z.string().nullable(),
  amountCents: import_zod13.z.number().nullable()
});
var contactByIdOutput = import_zod13.z.object({
  id: import_zod13.z.string(),
  firstName: import_zod13.z.string(),
  lastName: import_zod13.z.string().nullable(),
  email: import_zod13.z.string().nullable(),
  phone: import_zod13.z.string().nullable(),
  title: import_zod13.z.string().nullable(),
  linkedinUrl: import_zod13.z.string().nullable(),
  twitterUrl: import_zod13.z.string().nullable(),
  githubUrl: import_zod13.z.string().nullable(),
  imageUrl: import_zod13.z.string().nullable(),
  enrichmentStatus: import_zod13.z.enum(Object.values(import_db14.EnrichmentStatus)),
  enrichmentError: import_zod13.z.string().nullable(),
  owner: contactOwnerOutput.nullable(),
  company: contactCompanyOutput.extend({
    industry: import_zod13.z.string().nullable(),
    primaryContactId: import_zod13.z.string().nullable()
  }).nullable(),
  fields: import_zod13.z.array(recordFieldOutput),
  queued: import_zod13.z.boolean(),
  createdAt: import_zod13.z.string(),
  archivedAt: import_zod13.z.string().nullable(),
  brief: contactBriefOutput.nullable(),
  facts: import_zod13.z.array(contactFactOutput),
  relationship: contactRelationshipOutput,
  isPrimaryContact: import_zod13.z.boolean(),
  deals: import_zod13.z.array(contactDealOutput)
});
var contactBasicOutput = import_zod13.z.object({
  id: import_zod13.z.string(),
  firstName: import_zod13.z.string(),
  lastName: import_zod13.z.string().nullable()
});
var contactNameOutput = import_zod13.z.object({
  id: import_zod13.z.string(),
  name: import_zod13.z.string()
});
var contactEnrichOutput = import_zod13.z.object({
  id: import_zod13.z.string(),
  queued: import_zod13.z.boolean()
});
var bulkResultOutput = import_zod13.z.object({
  requested: import_zod13.z.number(),
  succeeded: import_zod13.z.number(),
  failed: import_zod13.z.number(),
  message: import_zod13.z.string().nullable()
});
var decideFactOutput = import_zod13.z.object({
  contactId: import_zod13.z.string(),
  field: import_zod13.z.string(),
  applied: import_zod13.z.boolean()
});

// src/contacts/contacts.service.ts
var import_db15 = require("@crm/db");
var import_common41 = require("@nestjs/common");
var OWNER_SELECT2 = {
  id: true,
  name: true,
  email: true,
  image: true
};
var COMPANY_SELECT = {
  id: true,
  name: true,
  domain: true,
  iconUrl: true,
  iconDarkUrl: true,
  iconTone: true,
  logoUrl: true
};
var NO_COMPANY = "none";
var FACT_COLUMNS = {
  title: "title",
  seniority: "seniority",
  function: "function",
  linkedinUrl: "linkedinUrl",
  twitterUrl: "twitterUrl",
  githubUrl: "githubUrl"
};
var SORTABLE3 = {
  name: (dir) => [{ lastName: dir }, { firstName: dir }],
  email: (dir) => [{ email: dir }],
  title: (dir) => [{ title: dir }, { lastName: "asc" }],
  company: (dir) => [{ company: { name: dir } }, { lastName: "asc" }],
  createdAt: (dir) => [{ createdAt: dir }],
  owner: (dir) => [{ owner: { name: dir } }, { lastName: "asc" }],
  lastActivity: (dir) => [{ lastActivityAt: { sort: dir, nulls: "last" } }],
  archivedAt: (dir) => [{ archivedAt: { sort: dir, nulls: "last" } }]
};

class ContactsService {
  db;
  companies;
  agent;
  queue;
  stamp;
  fields;
  logger = new import_common41.Logger(ContactsService.name);
  constructor(db, companies, agent, queue, stamp, fields) {
    this.db = db;
    this.companies = companies;
    this.agent = agent;
    this.queue = queue;
    this.stamp = stamp;
    this.fields = fields;
  }
  async list(input) {
    const filterableFields = await this.fields.filterableFieldsFor("CONTACT");
    const where = this.buildWhere(input, filterableFields);
    const { skip, take } = paginate(input);
    const [rows, total, facetCounts] = await Promise.all([
      this.db.contact.findMany({
        where,
        skip,
        take,
        orderBy: resolveOrderBy(input, SORTABLE3, [{ createdAt: "desc" }]),
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          title: true,
          imageUrl: true,
          source: true,
          company: { select: COMPANY_SELECT },
          owner: { select: OWNER_SELECT2 },
          lastActivityAt: true,
          createdAt: true,
          archivedAt: true
        }
      }),
      this.db.contact.count({ where }),
      this.facetCounts(input, filterableFields)
    ]);
    const tableFields = await this.fields.tableValuesFor("CONTACT", rows.map((row) => row.id));
    return {
      rows: rows.map((row) => ({
        ...row,
        lastActivityAt: row.lastActivityAt?.toISOString() ?? null,
        createdAt: row.createdAt.toISOString(),
        archivedAt: row.archivedAt?.toISOString() ?? null,
        fields: tableFields.get(row.id) ?? {}
      })),
      total,
      facetCounts
    };
  }
  async byId(id) {
    const contact = await this.db.contact.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        title: true,
        linkedinUrl: true,
        twitterUrl: true,
        githubUrl: true,
        imageUrl: true,
        enrichmentStatus: true,
        enrichmentError: true,
        createdAt: true,
        archivedAt: true,
        brief: {
          select: {
            narrative: true,
            sections: true,
            score: true,
            sourceUrl: true,
            refreshedAt: true
          }
        },
        facts: {
          where: { status: { in: [import_db15.FactStatus.APPLIED, import_db15.FactStatus.PROPOSED] } },
          orderBy: { observedAt: "desc" },
          select: {
            id: true,
            field: true,
            value: true,
            score: true,
            band: true,
            evidence: true,
            method: true,
            sourceUrl: true,
            status: true,
            observedAt: true
          }
        },
        company: {
          select: { ...COMPANY_SELECT, industry: true, primaryContactId: true }
        },
        owner: { select: OWNER_SELECT2 },
        deals: {
          select: {
            role: true,
            deal: {
              select: {
                id: true,
                name: true,
                stage: true,
                amount: true,
                currency: true,
                expectedCloseDate: true,
                owner: { select: OWNER_SELECT2 }
              }
            }
          }
        }
      }
    });
    if (!contact) {
      throw new import_common41.NotFoundException(`No contact with id ${id}.`);
    }
    const relationship = await this.relationship(id, contact.company?.id ?? null);
    const { deals, createdAt, archivedAt, brief, facts, company, ...rest } = contact;
    return {
      ...rest,
      company,
      fields: await this.fields.valuesFor("CONTACT", id),
      queued: await this.queue.isQueued({ contactId: id }),
      createdAt: createdAt.toISOString(),
      archivedAt: archivedAt?.toISOString() ?? null,
      brief: brief ? {
        ...brief,
        sections: brief.sections,
        refreshedAt: brief.refreshedAt.toISOString()
      } : null,
      facts: facts.map((fact) => ({
        ...fact,
        evidence: fact.evidence,
        observedAt: fact.observedAt.toISOString()
      })),
      relationship,
      isPrimaryContact: company?.primaryContactId === contact.id,
      deals: deals.map(({ role, deal }) => ({
        ...deal,
        role,
        amount: undefined,
        amountCents: toCents(deal.amount),
        expectedCloseDate: deal.expectedCloseDate?.toISOString() ?? null
      }))
    };
  }
  async create(input) {
    const email = normalizeEmail(input.email ?? "");
    if (email) {
      const existing = await this.db.contact.findFirst({
        where: {
          email: { equals: email, mode: "insensitive" },
          archivedAt: null
        },
        select: { id: true, firstName: true, lastName: true }
      });
      if (existing) {
        throw new import_common41.ConflictException(`${[existing.firstName, existing.lastName].filter(Boolean).join(" ")} already uses ${email}.`);
      }
    }
    const companyId = input.companyId ?? (email ? await this.companies.companyForEmail(email, {
      ownerId: input.ownerId
    }) : null);
    const contact = await this.agent.withCrmEvents(async (tx, emit) => {
      await this.allowAgain(tx, email);
      const created = await tx.contact.create({
        data: {
          firstName: input.firstName.trim(),
          lastName: blankToNull(input.lastName ?? ""),
          email,
          phone: blankToNull(input.phone ?? ""),
          title: blankToNull(input.title ?? ""),
          companyId,
          ownerId: input.ownerId ?? null
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          companyId: true,
          createdAt: true
        }
      });
      await emit({
        type: "contact.created",
        record: { kind: "contact", id: created.id },
        occurredAt: created.createdAt,
        data: {
          firstName: created.firstName,
          lastName: created.lastName,
          email: created.email,
          companyId: created.companyId
        }
      });
      return created;
    });
    this.logger.log({ message: "Contact created", contactId: contact.id });
    await this.agent.contactCreated(contact.id, "Added by a rep, with nothing on the record yet");
    this.fields.queueBackfillForNewRecord("CONTACT", contact.id).catch((error) => {
      this.logger.error({
        message: "Contact backfill queueing failed",
        contactId: contact.id
      }, error.stack);
    });
    return {
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName
    };
  }
  async archive(id) {
    try {
      const contact = await this.db.contact.update({
        where: { id },
        data: { archivedAt: new Date },
        select: { firstName: true, lastName: true }
      });
      this.logger.log({ message: "Contact archived", contactId: id });
      return { id, name: nameOf(contact) };
    } catch (error) {
      throw this.translate(error, id);
    }
  }
  async restore(id) {
    try {
      const contact = await this.db.contact.update({
        where: { id },
        data: { archivedAt: null },
        select: { firstName: true, lastName: true }
      });
      this.logger.log({ message: "Contact restored", contactId: id });
      return { id, name: nameOf(contact) };
    } catch (error) {
      throw this.translate(error, id);
    }
  }
  async purge(id, guard) {
    let deleted;
    try {
      deleted = await this.db.$transaction(async (tx) => {
        const [row] = await tx.$queryRaw`
					SELECT "archivedAt" FROM contact WHERE id = ${id} FOR UPDATE
				`;
        if (!row) {
          if (guard)
            return null;
          throw new import_common41.NotFoundException(`No contact with id ${id}.`);
        }
        if (guard && (!row.archivedAt || row.archivedAt > guard.archivedBefore)) {
          return null;
        }
        const targets = await this.stamp.targetsOf({ contactId: id }, tx);
        await tx.agentTask.deleteMany({ where: { contactId: id } });
        await tx.agentEvent.deleteMany({ where: { contactId: id } });
        const contact = await tx.contact.delete({
          where: { id },
          select: { firstName: true, lastName: true, email: true }
        });
        const name = nameOf(contact);
        const suppress = normalizeEmail(contact.email ?? "");
        if (suppress) {
          await tx.suppressedContact.upsert({
            where: { email: suppress },
            create: {
              email: suppress,
              reason: `Deleted from the CRM (${name})`
            },
            update: {}
          });
        }
        return { targets, name, suppressed: suppress !== null };
      });
    } catch (error) {
      throw this.translate(error, id);
    }
    if (!deleted)
      return null;
    await this.stamp.recomputeAfterDelete(deleted.targets, { contactId: id });
    this.logger.log({
      message: "Contact purged",
      contactId: id,
      suppressed: deleted.suppressed
    });
    return { id, name: deleted.name };
  }
  async purgeExpired(before) {
    const expired = await this.db.contact.findMany({
      where: { archivedAt: { lte: before } },
      select: { id: true },
      take: ARCHIVE.prune.maxBatch
    });
    return runBulk(expired.map((row) => row.id), (id) => this.purge(id, { archivedBefore: before }));
  }
  async update(id, input) {
    const data = {};
    if (input.firstName !== undefined)
      data.firstName = input.firstName.trim();
    if (input.lastName !== undefined)
      data.lastName = blankToNull(input.lastName);
    const email = input.email === undefined ? null : normalizeEmail(input.email);
    if (input.email !== undefined)
      data.email = email;
    if (input.phone !== undefined)
      data.phone = blankToNull(input.phone);
    if (input.title !== undefined)
      data.title = blankToNull(input.title);
    if (input.linkedinUrl !== undefined) {
      data.linkedinUrl = blankToNull(input.linkedinUrl);
    }
    if (input.twitterUrl !== undefined) {
      data.twitterUrl = blankToNull(input.twitterUrl);
    }
    if (input.githubUrl !== undefined) {
      data.githubUrl = blankToNull(input.githubUrl);
    }
    if (input.companyId !== undefined) {
      data.company = input.companyId ? { connect: { id: input.companyId } } : { disconnect: true };
    }
    if (input.ownerId !== undefined) {
      data.owner = input.ownerId ? { connect: { id: input.ownerId } } : { disconnect: true };
    }
    try {
      return await this.db.$transaction(async (tx) => {
        if (input.fields) {
          await this.fields.applyValues(tx, "CONTACT", id, input.fields);
        }
        const updated = await tx.contact.update({
          where: { id },
          data,
          select: { id: true, firstName: true, lastName: true }
        });
        if (email !== null) {
          await this.allowAgain(tx, email);
        }
        return updated;
      });
    } catch (error) {
      throw this.translate(error, id);
    }
  }
  async bulkAssignOwner(input) {
    const ownerId = input.ownerId || null;
    await requireOwner(this.db, ownerId);
    const ids = [...new Set(input.ids)];
    const { count } = await this.db.contact.updateMany({
      where: { id: { in: ids } },
      data: { ownerId }
    });
    this.logger.log({
      message: "Contacts reassigned",
      count,
      ownerId
    });
    return {
      requested: ids.length,
      succeeded: count,
      skipped: 0,
      failed: ids.length - count,
      message: null
    };
  }
  async bulkSetCompany(input) {
    const companyId = input.companyId || null;
    if (companyId) {
      const company = await this.db.company.findUnique({
        where: { id: companyId },
        select: { id: true }
      });
      if (!company) {
        throw new import_common41.NotFoundException(`No company with id ${companyId}.`);
      }
    }
    const ids = [...new Set(input.ids)];
    const { count } = await this.db.contact.updateMany({
      where: { id: { in: ids } },
      data: { companyId }
    });
    this.logger.log({
      message: "Contacts moved",
      count,
      companyId
    });
    return {
      requested: ids.length,
      succeeded: count,
      skipped: 0,
      failed: ids.length - count,
      message: null
    };
  }
  async bulkEnrich(ids) {
    return runBulk(ids, (id) => this.enrich(id));
  }
  async bulkArchive(ids) {
    return runBulk(ids, (id) => this.archive(id));
  }
  async bulkRestore(ids) {
    return runBulk(ids, (id) => this.restore(id));
  }
  async bulkPurge(ids) {
    return runBulk(ids, (id) => this.purge(id));
  }
  async allowAgain(tx, email) {
    if (!email)
      return;
    await tx.suppressedContact.deleteMany({
      where: { email: { equals: email, mode: "insensitive" } }
    });
  }
  async relationship(contactId, companyId) {
    const now = new Date;
    const [threads, lastReply, meetings, nextMeeting, colleagues] = await Promise.all([
      this.db.emailThread.aggregate({
        where: { contactId },
        _sum: { messageCount: true },
        _count: { _all: true }
      }),
      this.db.emailMessage.findFirst({
        where: { thread: { contactId }, direction: "INBOUND" },
        orderBy: { sentAt: "desc" },
        select: { sentAt: true }
      }),
      this.db.calendarEvent.count({
        where: {
          OR: [{ contactId }, { attendees: { some: { contactId } } }]
        }
      }),
      this.db.calendarEvent.findFirst({
        where: {
          startsAt: { gt: now },
          OR: [{ contactId }, { attendees: { some: { contactId } } }]
        },
        orderBy: { startsAt: "asc" },
        select: { title: true, startsAt: true }
      }),
      companyId ? this.db.contact.findMany({
        where: { companyId, id: { not: contactId } },
        orderBy: { lastActivityAt: { sort: "desc", nulls: "last" } },
        take: 4,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          title: true
        }
      }) : Promise.resolve([])
    ]);
    return {
      emails: threads._sum.messageCount ?? 0,
      threads: threads._count._all,
      lastReplyAt: lastReply?.sentAt.toISOString() ?? null,
      meetings,
      nextMeeting: nextMeeting ? {
        title: nextMeeting.title,
        startsAt: nextMeeting.startsAt.toISOString()
      } : null,
      colleagues: colleagues.map((colleague) => ({
        id: colleague.id,
        name: [colleague.firstName, colleague.lastName].filter(Boolean).join(" "),
        title: colleague.title
      }))
    };
  }
  async enrich(id) {
    const contact = await this.db.contact.findUnique({
      where: { id },
      select: { id: true, imageUrl: true, linkedinUrl: true, updatedAt: true }
    });
    if (!contact) {
      throw new import_common41.NotFoundException(`No contact with id ${id}.`);
    }
    const queued = await this.agent.contactCreated(id, contact.linkedinUrl && !contact.imageUrl ? "A rep asked for a fresh look — they have a LinkedIn profile on file but no picture" : "A rep asked for a fresh look", true);
    if (queued) {
      await this.db.contact.updateMany({
        where: { id, updatedAt: contact.updatedAt },
        data: { enrichmentStatus: "PENDING", enrichmentError: null }
      });
    }
    return { id, queued };
  }
  async decideFact(input, userId) {
    const fact = await this.db.contactFact.findUnique({
      where: { id: input.factId },
      select: {
        id: true,
        contactId: true,
        field: true,
        value: true,
        status: true
      }
    });
    if (!fact) {
      throw new import_common41.NotFoundException(`No fact with id ${input.factId}.`);
    }
    if (fact.status !== import_db15.FactStatus.PROPOSED) {
      throw new import_common41.ConflictException("That suggestion has already been settled.");
    }
    const accepted = input.decision === "accept";
    const column = FACT_COLUMNS[fact.field];
    await this.db.$transaction(async (tx) => {
      if (accepted) {
        await tx.contactFact.updateMany({
          where: {
            contactId: fact.contactId,
            field: fact.field,
            id: { not: fact.id },
            status: { in: [import_db15.FactStatus.APPLIED, import_db15.FactStatus.PROPOSED] }
          },
          data: { status: import_db15.FactStatus.SUPERSEDED, supersededAt: new Date }
        });
      }
      await tx.contactFact.update({
        where: { id: fact.id },
        data: {
          status: accepted ? import_db15.FactStatus.APPLIED : import_db15.FactStatus.DISMISSED,
          decidedById: userId,
          decidedAt: new Date
        }
      });
      if (accepted && column) {
        await tx.contact.update({
          where: { id: fact.contactId },
          data: { [column]: fact.value }
        });
      }
      if (accepted && fact.field === "name") {
        const [firstName, ...rest] = fact.value.trim().split(/\s+/);
        if (firstName) {
          await tx.contact.update({
            where: { id: fact.contactId },
            data: {
              firstName,
              lastName: rest.length > 0 ? rest.join(" ") : null
            }
          });
        }
      }
    });
    this.logger.log({
      message: "Fact decided",
      factId: fact.id,
      contactId: fact.contactId,
      field: fact.field,
      decision: input.decision
    });
    return { contactId: fact.contactId, field: fact.field, applied: accepted };
  }
  searchFilter(q) {
    const term = q.trim();
    if (!term)
      return {};
    return {
      OR: [
        { firstName: { contains: term, mode: "insensitive" } },
        { lastName: { contains: term, mode: "insensitive" } },
        { email: { contains: term, mode: "insensitive" } },
        { company: { name: { contains: term, mode: "insensitive" } } }
      ]
    };
  }
  companyFilter(values) {
    if (values.length === 0)
      return;
    const { ids, includesSentinel } = splitSentinel(values, NO_COMPANY);
    if (includesSentinel && ids.length === 0)
      return { companyId: null };
    if (!includesSentinel)
      return { companyId: { in: ids } };
    return { OR: [{ companyId: { in: ids } }, { companyId: null }] };
  }
  buildWhere(input, filterableFields) {
    const and = [
      this.searchFilter(input.q),
      archivedFilter(input.archived),
      ...this.fields.fieldFilters(filterableFields, input.fields)
    ];
    const owner = ownerFilter(input.owner);
    if (owner)
      and.push(owner);
    const company = this.companyFilter(input.company);
    if (company)
      and.push(company);
    if (input.source.length > 0) {
      and.push({ source: { in: input.source } });
    }
    if (input.title.length > 0)
      and.push({ title: { in: input.title } });
    if (input.seniority.length > 0) {
      and.push({ seniority: { in: input.seniority } });
    }
    if (input.persona.length > 0)
      and.push({ function: { in: input.persona } });
    const activity = activityFilter(input.activity);
    if (activity)
      and.push(activity);
    return { AND: and };
  }
  async facetCounts(input, filterableFields) {
    const where = {
      AND: [this.searchFilter(input.q), archivedFilter(input.archived)]
    };
    const [
      owners,
      companies,
      sources,
      titles,
      seniorities,
      personas,
      activity,
      fieldFacets
    ] = await Promise.all([
      this.db.contact.groupBy({
        by: ["ownerId"],
        where,
        _count: { _all: true }
      }),
      this.db.contact.groupBy({
        by: ["companyId"],
        where,
        _count: { _all: true }
      }),
      this.db.contact.groupBy({
        by: ["source"],
        where,
        _count: { _all: true }
      }),
      this.db.contact.groupBy({
        by: ["title"],
        where,
        _count: { _all: true }
      }),
      this.db.contact.groupBy({
        by: ["seniority"],
        where,
        _count: { _all: true }
      }),
      this.db.contact.groupBy({
        by: ["function"],
        where,
        _count: { _all: true }
      }),
      activityFacetCounts((activityWhere) => this.db.contact.count({ where: { AND: [where, activityWhere] } })),
      this.fields.filterFacetCounts("CONTACT", where, filterableFields)
    ]);
    return {
      owner: countsByKey(owners, "ownerId", FACET_UNASSIGNED),
      company: countsByKey(companies, "companyId", NO_COMPANY),
      source: countsByKey(sources, "source"),
      title: countsByKey(titles, "title"),
      seniority: countsByKey(seniorities, "seniority"),
      persona: countsByKey(personas, "function"),
      activity,
      ...Object.fromEntries(Object.entries(fieldFacets).map(([key, counts]) => [
        `field:${key}`,
        counts
      ]))
    };
  }
  translate(cause, id) {
    if (cause instanceof import_db15.Prisma.PrismaClientKnownRequestError) {
      if (cause.code === "P2025") {
        throw new import_common41.NotFoundException(`No contact with id ${id}.`);
      }
      if (cause.code === "P2002") {
        throw new import_common41.ConflictException("Another contact already uses that email address.");
      }
    }
    throw cause;
  }
}
ContactsService = __legacyDecorateClassTS([
  import_common41.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof CompanyDirectoryService === "undefined" ? Object : CompanyDirectoryService,
    typeof AgentTriggerService === "undefined" ? Object : AgentTriggerService,
    typeof AgentQueueService === "undefined" ? Object : AgentQueueService,
    typeof ActivityStampService === "undefined" ? Object : ActivityStampService,
    typeof FieldsService === "undefined" ? Object : FieldsService
  ])
], ContactsService);
function nameOf(contact) {
  return [contact.firstName, contact.lastName].filter(Boolean).join(" ");
}

// src/contacts/contacts.router.ts
class ContactsRouter {
  contacts;
  constructor(contacts) {
    this.contacts = contacts;
  }
  async list(input) {
    return this.contacts.list(input);
  }
  async byId(id) {
    return this.contacts.byId(id);
  }
  async create(input) {
    return this.contacts.create(input);
  }
  async update(input) {
    return this.contacts.update(input.id, input.data);
  }
  async archive(id) {
    return this.contacts.archive(id);
  }
  async restore(id) {
    return this.contacts.restore(id);
  }
  async purge(id) {
    return this.contacts.purge(id);
  }
  async enrich(id) {
    return this.contacts.enrich(id);
  }
  async bulkAssignOwner(input) {
    return this.contacts.bulkAssignOwner(input);
  }
  async bulkSetCompany(input) {
    return this.contacts.bulkSetCompany(input);
  }
  async bulkEnrich(ids) {
    return this.contacts.bulkEnrich(ids);
  }
  async bulkArchive(ids) {
    return this.contacts.bulkArchive(ids);
  }
  async bulkRestore(ids) {
    return this.contacts.bulkRestore(ids);
  }
  async bulkPurge(ids) {
    return this.contacts.bulkPurge(ids);
  }
  async decideFact(ctx, input) {
    return this.contacts.decideFact(input, ctx.user.id);
  }
}
__legacyDecorateClassTS([
  import_nestjs_trpc8.Query({
    input: contactListInput,
    output: contactListOutput,
    meta: restMeta("POST", "/contacts/search", ["Contacts"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc8.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ContactsRouter.prototype, "list", null);
__legacyDecorateClassTS([
  import_nestjs_trpc8.Query({
    input: contactIdInput,
    output: contactByIdOutput,
    meta: restMeta("GET", "/contacts/{id}", ["Contacts"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc8.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ContactsRouter.prototype, "byId", null);
__legacyDecorateClassTS([
  import_nestjs_trpc8.Mutation({
    input: contactCreateInput,
    output: contactBasicOutput,
    meta: restMeta("POST", "/contacts", ["Contacts"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc8.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ContactsRouter.prototype, "create", null);
__legacyDecorateClassTS([
  import_nestjs_trpc8.Mutation({
    input: contactUpdateArgs,
    output: contactBasicOutput,
    meta: restMeta("PATCH", "/contacts/{id}", ["Contacts"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc8.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ContactsRouter.prototype, "update", null);
__legacyDecorateClassTS([
  import_nestjs_trpc8.Mutation({
    input: contactIdInput,
    output: contactNameOutput,
    meta: restMeta("POST", "/contacts/{id}/archive", ["Contacts"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc8.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ContactsRouter.prototype, "archive", null);
__legacyDecorateClassTS([
  import_nestjs_trpc8.Mutation({
    input: contactIdInput,
    output: contactNameOutput,
    meta: restMeta("POST", "/contacts/{id}/restore", ["Contacts"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc8.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ContactsRouter.prototype, "restore", null);
__legacyDecorateClassTS([
  import_nestjs_trpc8.Mutation({
    input: contactIdInput,
    output: contactNameOutput,
    meta: restMeta("DELETE", "/contacts/{id}", ["Contacts"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc8.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ContactsRouter.prototype, "purge", null);
__legacyDecorateClassTS([
  import_nestjs_trpc8.Mutation({
    input: contactIdInput,
    output: contactEnrichOutput,
    meta: restMeta("POST", "/contacts/{id}/enrich", ["Contacts"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc8.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ContactsRouter.prototype, "enrich", null);
__legacyDecorateClassTS([
  import_nestjs_trpc8.Mutation({
    input: contactBulkOwnerInput,
    output: bulkResultOutput,
    meta: restMeta("POST", "/contacts/bulk-assign-owner", ["Contacts"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc8.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ContactsRouter.prototype, "bulkAssignOwner", null);
__legacyDecorateClassTS([
  import_nestjs_trpc8.Mutation({
    input: contactBulkCompanyInput,
    output: bulkResultOutput,
    meta: restMeta("POST", "/contacts/bulk-set-company", ["Contacts"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc8.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ContactsRouter.prototype, "bulkSetCompany", null);
__legacyDecorateClassTS([
  import_nestjs_trpc8.Mutation({
    input: contactBulkInput,
    output: bulkResultOutput,
    meta: restMeta("POST", "/contacts/bulk-enrich", ["Contacts"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc8.Input("ids")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    Array
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ContactsRouter.prototype, "bulkEnrich", null);
__legacyDecorateClassTS([
  import_nestjs_trpc8.Mutation({
    input: contactBulkInput,
    output: bulkResultOutput,
    meta: restMeta("POST", "/contacts/bulk-archive", ["Contacts"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc8.Input("ids")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    Array
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ContactsRouter.prototype, "bulkArchive", null);
__legacyDecorateClassTS([
  import_nestjs_trpc8.Mutation({
    input: contactBulkInput,
    output: bulkResultOutput,
    meta: restMeta("POST", "/contacts/bulk-restore", ["Contacts"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc8.Input("ids")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    Array
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ContactsRouter.prototype, "bulkRestore", null);
__legacyDecorateClassTS([
  import_nestjs_trpc8.Mutation({
    input: contactBulkInput,
    output: bulkResultOutput,
    meta: restMeta("POST", "/contacts/bulk-purge", ["Contacts"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc8.Input("ids")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    Array
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ContactsRouter.prototype, "bulkPurge", null);
__legacyDecorateClassTS([
  import_nestjs_trpc8.Mutation({
    input: factDecisionInput,
    output: decideFactOutput,
    meta: restMeta("POST", "/contacts/decide-fact", ["Contacts"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc8.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc8.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ContactsRouter.prototype, "decideFact", null);
ContactsRouter = __legacyDecorateClassTS([
  import_nestjs_trpc8.Router({ alias: "contacts" }),
  import_nestjs_trpc8.UseMiddlewares(AuthMiddleware),
  __legacyDecorateParamTS(0, import_common42.Inject(ContactsService)),
  __legacyMetadataTS("design:paramtypes", [
    typeof ContactsService === "undefined" ? Object : ContactsService
  ])
], ContactsRouter);

// src/contacts/contacts.module.ts
class ContactsModule {
}
ContactsModule = __legacyDecorateClassTS([
  import_common43.Module({
    imports: [FieldsModule, TrpcModule, AgentModule, CompaniesModule],
    providers: [ContactsService, ContactsRouter],
    exports: [ContactsService]
  })
], ContactsModule);

// src/deals/deals.module.ts
var import_common46 = require("@nestjs/common");

// src/deals/deals.router.ts
var import_common45 = require("@nestjs/common");
var import_nestjs_trpc9 = require("nestjs-trpc");

// src/deals/deals.contracts.ts
var import_db16 = require("@crm/db");
var import_fields16 = require("@crm/db/fields");
var import_zod14 = require("zod");
var MAX_AMOUNT_CENTS = 99999999999999;
var amountCents = import_zod14.z.number().int().min(0).max(MAX_AMOUNT_CENTS, "That amount is too large to record.").nullable().optional();
var CLOSING_WINDOWS = [
  "overdue",
  "this-month",
  "next-month",
  "later",
  "none"
];
var dealListInput = listInput.extend({
  status: import_zod14.z.string().default("all"),
  owner: import_zod14.z.array(import_zod14.z.string()).default([]),
  stage: import_zod14.z.array(import_zod14.z.string()).default([]),
  closing: import_zod14.z.array(import_zod14.z.string()).default([]),
  fields: import_zod14.z.record(import_zod14.z.string(), import_zod14.z.array(import_zod14.z.string())).default({}),
  archived: import_zod14.z.boolean().default(false)
});
var stageEnum = import_zod14.z.enum(Object.values(import_db16.DealStage));
var dealCreateInput = import_zod14.z.object({
  name: import_zod14.z.string().trim().min(1, "A deal needs a name."),
  companyId: import_zod14.z.string().min(1, "A deal belongs to a company."),
  ownerId: import_zod14.z.string().min(1, "A deal needs an owner."),
  stage: stageEnum.optional(),
  amountCents,
  currency: currencyCode.optional(),
  expectedCloseDate: import_zod14.z.string().nullable().optional()
});
var dealUpdateInput = import_zod14.z.object({
  name: import_zod14.z.string().trim().min(1).optional(),
  description: import_zod14.z.string().nullable().optional(),
  companyId: import_zod14.z.string().optional(),
  ownerId: import_zod14.z.string().optional(),
  amountCents,
  currency: currencyCode.optional(),
  expectedCloseDate: import_zod14.z.string().nullable().optional(),
  fields: recordFieldValues.optional()
});
var dealUpdateArgs = import_zod14.z.object({
  id: import_zod14.z.string(),
  data: dealUpdateInput
});
var dealIdInput = import_zod14.z.object({ id: import_zod14.z.string() });
var setStageInput = import_zod14.z.object({
  id: import_zod14.z.string(),
  stage: stageEnum,
  closedReason: import_zod14.z.string().trim().optional()
});
var dealContactRole = import_zod14.z.string().trim().max(80, "That role is too long.").nullable();
var dealContactsInput = import_zod14.z.object({ dealId: import_zod14.z.string() });
var dealAttachContactInput = import_zod14.z.object({
  dealId: import_zod14.z.string(),
  contactId: import_zod14.z.string().min(1, "Choose somebody to bring onto the deal."),
  role: dealContactRole.optional()
});
var dealDetachContactInput = import_zod14.z.object({
  dealId: import_zod14.z.string(),
  contactId: import_zod14.z.string()
});
var dealContactRoleInput = import_zod14.z.object({
  dealId: import_zod14.z.string(),
  contactId: import_zod14.z.string(),
  role: dealContactRole
});
var dealBulkInput = bulkIdsInput;
var dealBulkOwnerInput = bulkIdsInput.extend({
  ownerId: import_zod14.z.string().min(1, "A deal needs an owner.")
});
var dealBulkStageInput = bulkIdsInput.extend({
  stage: stageEnum,
  closedReason: import_zod14.z.string().trim().optional()
});
var fieldValueOutput2 = import_zod14.z.union([
  import_zod14.z.string(),
  import_zod14.z.number(),
  import_zod14.z.boolean(),
  import_zod14.z.null()
]);
var fieldOptionOutput3 = import_zod14.z.object({
  id: import_zod14.z.string(),
  label: import_zod14.z.string(),
  position: import_zod14.z.number()
});
var recordFieldOutput2 = import_zod14.z.object({
  id: import_zod14.z.string(),
  entity: import_zod14.z.enum(import_fields16.FIELD_ENTITIES),
  key: import_zod14.z.string(),
  label: import_zod14.z.string(),
  type: import_zod14.z.enum(import_fields16.FIELD_TYPES),
  typeLabel: import_zod14.z.string(),
  agentFilled: import_zod14.z.boolean(),
  agentBrief: import_zod14.z.string().nullable(),
  required: import_zod14.z.boolean(),
  showOnSheet: import_zod14.z.boolean(),
  showOnTable: import_zod14.z.boolean(),
  showOnFilter: import_zod14.z.boolean(),
  position: import_zod14.z.number(),
  archived: import_zod14.z.boolean(),
  options: import_zod14.z.array(fieldOptionOutput3),
  value: fieldValueOutput2
});
var dealOwnerOutput = import_zod14.z.object({
  id: import_zod14.z.string(),
  name: import_zod14.z.string(),
  email: import_zod14.z.string(),
  image: import_zod14.z.string().nullable()
});
var dealCompanyOutput = import_zod14.z.object({
  id: import_zod14.z.string(),
  name: import_zod14.z.string(),
  domain: import_zod14.z.string().nullable(),
  iconUrl: import_zod14.z.string().nullable(),
  iconDarkUrl: import_zod14.z.string().nullable(),
  iconTone: import_zod14.z.string().nullable(),
  logoUrl: import_zod14.z.string().nullable()
});
var dealCompanyDetailOutput = dealCompanyOutput.extend({
  industry: import_zod14.z.string().nullable()
});
var dealContactSummaryOutput = import_zod14.z.object({
  id: import_zod14.z.string(),
  firstName: import_zod14.z.string(),
  lastName: import_zod14.z.string().nullable(),
  email: import_zod14.z.string().nullable(),
  title: import_zod14.z.string().nullable(),
  imageUrl: import_zod14.z.string().nullable()
});
var dealContactOutput = dealContactSummaryOutput.extend({
  role: import_zod14.z.string().nullable()
});
var dealListRowOutput = import_zod14.z.object({
  id: import_zod14.z.string(),
  name: import_zod14.z.string(),
  stage: stageEnum,
  currency: import_zod14.z.string(),
  company: dealCompanyOutput,
  owner: dealOwnerOutput,
  amountCents: import_zod14.z.number().nullable(),
  baseAmountCents: import_zod14.z.number().nullable(),
  expectedCloseDate: import_zod14.z.string().nullable(),
  closedAt: import_zod14.z.string().nullable(),
  lastActivityAt: import_zod14.z.string().nullable(),
  createdAt: import_zod14.z.string(),
  archivedAt: import_zod14.z.string().nullable(),
  fields: import_zod14.z.record(import_zod14.z.string(), fieldValueOutput2)
});
var dealListOutput = import_zod14.z.object({
  rows: import_zod14.z.array(dealListRowOutput),
  total: import_zod14.z.number(),
  facetCounts: import_zod14.z.record(import_zod14.z.string(), import_zod14.z.record(import_zod14.z.string(), import_zod14.z.number())),
  openValueCents: import_zod14.z.number().nullable(),
  reportingCurrency: import_zod14.z.string(),
  unconverted: import_zod14.z.object({
    count: import_zod14.z.number(),
    currencies: import_zod14.z.array(import_zod14.z.string())
  })
});
var dealDetailOutput = import_zod14.z.object({
  id: import_zod14.z.string(),
  name: import_zod14.z.string(),
  description: import_zod14.z.string().nullable(),
  stage: stageEnum,
  currency: import_zod14.z.string(),
  closedReason: import_zod14.z.string().nullable(),
  company: dealCompanyDetailOutput,
  owner: dealOwnerOutput,
  fields: import_zod14.z.array(recordFieldOutput2),
  amountCents: import_zod14.z.number().nullable(),
  baseAmountCents: import_zod14.z.number().nullable(),
  reportingCurrency: import_zod14.z.string(),
  fxRate: import_zod14.z.number().nullable(),
  fxRateAt: import_zod14.z.string().nullable(),
  stageChangedAt: import_zod14.z.string(),
  expectedCloseDate: import_zod14.z.string().nullable(),
  closedAt: import_zod14.z.string().nullable(),
  createdAt: import_zod14.z.string(),
  archivedAt: import_zod14.z.string().nullable(),
  contacts: import_zod14.z.array(dealContactOutput)
});
var dealCreateOutput = import_zod14.z.object({
  id: import_zod14.z.string(),
  name: import_zod14.z.string(),
  companyId: import_zod14.z.string()
});
var dealMutateOutput = import_zod14.z.object({
  id: import_zod14.z.string(),
  name: import_zod14.z.string()
});
var dealSetStageOutput = import_zod14.z.object({
  id: import_zod14.z.string(),
  stage: stageEnum,
  changed: import_zod14.z.boolean()
});
var dealContactOptionsOutput = import_zod14.z.array(dealContactSummaryOutput);
var dealContactLinkOutput = import_zod14.z.object({
  dealId: import_zod14.z.string(),
  contactId: import_zod14.z.string()
});
var dealContactRoleOutput = import_zod14.z.object({
  dealId: import_zod14.z.string(),
  contactId: import_zod14.z.string(),
  role: import_zod14.z.string().nullable()
});
var dealBulkResultOutput = import_zod14.z.object({
  requested: import_zod14.z.number(),
  succeeded: import_zod14.z.number(),
  failed: import_zod14.z.number(),
  message: import_zod14.z.string().nullable()
});

// src/deals/deals.service.ts
var import_db17 = require("@crm/db");
var import_currency11 = require("@crm/db/currency");
var import_deal_stage2 = require("@crm/db/deal-stage");
var import_common44 = require("@nestjs/common");
var OWNER_SELECT3 = {
  id: true,
  name: true,
  email: true,
  image: true
};
var COMPANY_SELECT2 = {
  id: true,
  name: true,
  domain: true,
  iconUrl: true,
  iconDarkUrl: true,
  iconTone: true,
  logoUrl: true
};
var CONTACT_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  title: true,
  imageUrl: true
};
var LOSING = new Set(import_deal_stage2.LOSING_DEAL_STAGES);
var SORTABLE4 = {
  name: (dir) => [{ name: dir }],
  company: (dir) => [{ company: { name: dir } }, { name: "asc" }],
  stage: (dir) => [{ stage: dir }, { expectedCloseDate: "asc" }],
  amount: (dir) => [{ baseAmount: { sort: dir, nulls: "last" } }],
  expectedCloseDate: (dir) => [{ expectedCloseDate: dir }],
  createdAt: (dir) => [{ createdAt: dir }],
  owner: (dir) => [{ owner: { name: dir } }, { name: "asc" }],
  lastActivity: (dir) => [{ lastActivityAt: { sort: dir, nulls: "last" } }],
  archivedAt: (dir) => [{ archivedAt: { sort: dir, nulls: "last" } }]
};

class DealsService {
  db;
  agent;
  stamp;
  conversion;
  fields;
  logger = new import_common44.Logger(DealsService.name);
  constructor(db, agent, stamp, conversion, fields) {
    this.db = db;
    this.agent = agent;
    this.stamp = stamp;
    this.conversion = conversion;
    this.fields = fields;
  }
  async list(input) {
    const filterableFields = await this.fields.filterableFieldsFor("DEAL");
    const where = this.buildWhere(input, filterableFields);
    const { skip, take } = paginate(input);
    const openWhere = { ...where, stage: { in: [...import_deal_stage2.OPEN_DEAL_STAGES] } };
    const base = await this.conversion.reportingCurrency();
    const [rows, total, facetCounts, openValue, unconverted] = await Promise.all([
      this.db.deal.findMany({
        where,
        skip,
        take,
        orderBy: resolveOrderBy(input, SORTABLE4, [{ createdAt: "desc" }]),
        select: {
          id: true,
          name: true,
          stage: true,
          amount: true,
          currency: true,
          baseAmount: true,
          expectedCloseDate: true,
          closedAt: true,
          company: { select: COMPANY_SELECT2 },
          owner: { select: OWNER_SELECT3 },
          lastActivityAt: true,
          createdAt: true,
          archivedAt: true
        }
      }),
      this.db.deal.count({ where }),
      this.facetCounts(input, filterableFields),
      this.db.deal.aggregate({
        where: { AND: [openWhere, this.conversion.countedWhere(base)] },
        _sum: { baseAmount: true }
      }),
      this.conversion.unconverted(openWhere)
    ]);
    const tableFields = await this.fields.tableValuesFor("DEAL", rows.map((row) => row.id));
    return {
      rows: rows.map(({
        amount,
        baseAmount,
        expectedCloseDate,
        closedAt,
        lastActivityAt,
        createdAt,
        archivedAt,
        ...row
      }) => ({
        ...row,
        amountCents: toCents(amount),
        baseAmountCents: toCents(baseAmount),
        expectedCloseDate: expectedCloseDate?.toISOString() ?? null,
        closedAt: closedAt?.toISOString() ?? null,
        lastActivityAt: lastActivityAt?.toISOString() ?? null,
        createdAt: createdAt.toISOString(),
        archivedAt: archivedAt?.toISOString() ?? null,
        fields: tableFields.get(row.id) ?? {}
      })),
      total,
      facetCounts,
      openValueCents: toCents(openValue._sum.baseAmount),
      reportingCurrency: base,
      unconverted
    };
  }
  async byId(id) {
    const deal = await this.db.deal.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        stage: true,
        stageChangedAt: true,
        amount: true,
        currency: true,
        baseAmount: true,
        fxRate: true,
        fxRateAt: true,
        expectedCloseDate: true,
        closedAt: true,
        closedReason: true,
        createdAt: true,
        archivedAt: true,
        company: { select: { ...COMPANY_SELECT2, industry: true } },
        owner: { select: OWNER_SELECT3 },
        contacts: {
          select: { role: true, contact: { select: CONTACT_SELECT } },
          orderBy: { contact: { firstName: "asc" } }
        }
      }
    });
    if (!deal) {
      throw new import_common44.NotFoundException(`No deal with id ${id}.`);
    }
    const {
      contacts,
      amount,
      baseAmount,
      fxRate,
      fxRateAt,
      archivedAt,
      ...rest
    } = deal;
    return {
      ...rest,
      fields: await this.fields.valuesFor("DEAL", id),
      amountCents: toCents(amount),
      baseAmountCents: toCents(baseAmount),
      reportingCurrency: await this.conversion.reportingCurrency(),
      fxRate: fxRate?.toNumber() ?? null,
      fxRateAt: fxRateAt?.toISOString() ?? null,
      stageChangedAt: deal.stageChangedAt.toISOString(),
      expectedCloseDate: deal.expectedCloseDate?.toISOString() ?? null,
      closedAt: deal.closedAt?.toISOString() ?? null,
      createdAt: deal.createdAt.toISOString(),
      archivedAt: archivedAt?.toISOString() ?? null,
      contacts: contacts.map(({ role, contact }) => ({ ...contact, role }))
    };
  }
  async create(input) {
    const stage = input.stage ?? "DEMO_BOOKED";
    const closed = import_deal_stage2.isClosedStage(stage);
    const now = new Date;
    const currency = import_currency11.normalizeCurrency(input.currency ?? await this.conversion.reportingCurrency());
    const fx = await this.conversion.dealFields(decimalFromCents(input.amountCents), currency);
    try {
      const deal = await this.agent.withCrmEvents(async (tx, emit) => {
        const created = await tx.deal.create({
          data: {
            name: input.name.trim(),
            companyId: input.companyId,
            ownerId: input.ownerId,
            stage,
            stageChangedAt: now,
            closedAt: closed ? now : null,
            amount: fromCents(input.amountCents),
            currency,
            ...fx,
            expectedCloseDate: parseDate2(input.expectedCloseDate)
          },
          select: { id: true, name: true, companyId: true }
        });
        await emit({
          type: "deal.created",
          record: { kind: "deal", id: created.id },
          occurredAt: now,
          data: { companyId: created.companyId, stage }
        });
        if (closed) {
          await emit({
            type: "deal.closed",
            record: { kind: "deal", id: created.id },
            occurredAt: now,
            data: { companyId: created.companyId, from: null, to: stage }
          });
        }
        return created;
      });
      this.logger.log({ message: "Deal created", dealId: deal.id, stage });
      this.fields.queueBackfillForNewRecord("DEAL", deal.id);
      return deal;
    } catch (error) {
      throw this.translateRelations(error);
    }
  }
  async update(id, input) {
    const data = {};
    if (input.name !== undefined)
      data.name = input.name.trim();
    if (input.description !== undefined) {
      data.description = input.description === null ? null : blankToNull(input.description);
    }
    if (input.companyId !== undefined) {
      data.company = { connect: { id: input.companyId } };
    }
    if (input.ownerId !== undefined) {
      data.owner = { connect: { id: input.ownerId } };
    }
    if (input.amountCents !== undefined) {
      data.amount = fromCents(input.amountCents);
    }
    if (input.currency !== undefined) {
      data.currency = import_currency11.normalizeCurrency(input.currency);
    }
    if (input.expectedCloseDate !== undefined) {
      data.expectedCloseDate = parseDate2(input.expectedCloseDate);
    }
    if (input.amountCents !== undefined || input.currency !== undefined) {
      const current = await this.db.deal.findUnique({
        where: { id },
        select: { amount: true, currency: true }
      });
      if (!current) {
        throw new import_common44.NotFoundException(`No deal with id ${id}.`);
      }
      const amount = input.amountCents !== undefined ? decimalFromCents(input.amountCents) : current.amount;
      const currency = input.currency !== undefined ? import_currency11.normalizeCurrency(input.currency) : import_currency11.normalizeCurrency(current.currency);
      Object.assign(data, await this.conversion.dealFields(amount, currency));
    }
    try {
      return await this.db.$transaction(async (tx) => {
        if (input.fields) {
          await this.fields.applyValues(tx, "DEAL", id, input.fields);
        }
        return tx.deal.update({
          where: { id },
          data,
          select: { id: true, name: true }
        });
      });
    } catch (error) {
      throw this.translate(error, id);
    }
  }
  async archive(id) {
    try {
      const deal = await this.db.deal.update({
        where: { id },
        data: { archivedAt: new Date },
        select: { name: true }
      });
      this.logger.log({ message: "Deal archived", dealId: id });
      return { id, name: deal.name };
    } catch (error) {
      throw this.translate(error, id);
    }
  }
  async restore(id) {
    try {
      const deal = await this.db.deal.update({
        where: { id },
        data: { archivedAt: null },
        select: { name: true }
      });
      this.logger.log({ message: "Deal restored", dealId: id });
      return { id, name: deal.name };
    } catch (error) {
      throw this.translate(error, id);
    }
  }
  async purge(id, guard) {
    let deleted;
    try {
      deleted = await this.db.$transaction(async (tx) => {
        const [row] = await tx.$queryRaw`
					SELECT "archivedAt" FROM deal WHERE id = ${id} FOR UPDATE
				`;
        if (!row) {
          if (guard)
            return null;
          throw new import_common44.NotFoundException(`No deal with id ${id}.`);
        }
        if (guard && (!row.archivedAt || row.archivedAt > guard.archivedBefore)) {
          return null;
        }
        const targets = await this.stamp.targetsOf({ dealId: id }, tx);
        await tx.agentTask.deleteMany({ where: { dealId: id } });
        const deal = await tx.deal.delete({
          where: { id },
          select: { name: true }
        });
        return { targets, name: deal.name };
      });
    } catch (error) {
      throw this.translate(error, id);
    }
    if (!deleted)
      return null;
    await this.stamp.recomputeAfterDelete(deleted.targets, { dealId: id });
    this.logger.log({
      message: "Deal purged",
      dealId: id,
      name: deleted.name
    });
    return { id, name: deleted.name };
  }
  async purgeExpired(before) {
    const expired = await this.db.deal.findMany({
      where: { archivedAt: { lte: before } },
      select: { id: true },
      take: ARCHIVE.prune.maxBatch
    });
    return runBulk(expired.map((row) => row.id), (id) => this.purge(id, { archivedBefore: before }));
  }
  async setStage(input, actingUserId) {
    const closedReason = input.closedReason?.trim();
    const closed = import_deal_stage2.isClosedStage(input.stage);
    const transition = await this.agent.withCrmEvents(async (tx, emit) => {
      const [deal2] = await tx.$queryRaw`
				SELECT id, stage, "companyId"
				FROM deal
				WHERE id = ${input.id}
				FOR UPDATE
			`;
      if (!deal2) {
        throw new import_common44.NotFoundException(`No deal with id ${input.id}.`);
      }
      if (deal2.stage === input.stage) {
        return {
          changed: false,
          deal: deal2,
          updated: { id: deal2.id, stage: deal2.stage },
          now: null
        };
      }
      if (LOSING.has(input.stage) && !closedReason) {
        throw new import_common44.BadRequestException("Say why it was lost — a closed-lost deal with no reason teaches nobody anything.");
      }
      const now2 = new Date;
      const updated2 = await tx.deal.update({
        where: { id: input.id },
        data: {
          stage: input.stage,
          stageChangedAt: now2,
          closedAt: closed ? now2 : null,
          closedReason: closed ? closedReason ?? null : null
        },
        select: { id: true, stage: true }
      });
      await tx.activity.create({
        data: {
          type: import_db17.ActivityType.STAGE_CHANGE,
          subject: "Stage changed",
          body: closedReason ?? null,
          occurredAt: now2,
          companyId: deal2.companyId,
          dealId: deal2.id,
          createdById: actingUserId,
          meta: { from: deal2.stage, to: input.stage }
        }
      });
      await emit({
        type: "deal.stage.changed",
        record: { kind: "deal", id: deal2.id },
        occurredAt: now2,
        data: { companyId: deal2.companyId, from: deal2.stage, to: input.stage }
      });
      if (!import_deal_stage2.isClosedStage(deal2.stage) && closed) {
        await emit({
          type: "deal.closed",
          record: { kind: "deal", id: deal2.id },
          occurredAt: now2,
          data: {
            companyId: deal2.companyId,
            from: deal2.stage,
            to: input.stage
          }
        });
      }
      if (import_deal_stage2.isClosedStage(deal2.stage) && !closed) {
        await emit({
          type: "deal.opened",
          record: { kind: "deal", id: deal2.id },
          occurredAt: now2,
          data: {
            companyId: deal2.companyId,
            from: deal2.stage,
            to: input.stage
          }
        });
      }
      return { changed: true, deal: deal2, updated: updated2, now: now2 };
    });
    if (!transition.changed) {
      return { ...transition.updated, changed: false };
    }
    const { deal, updated, now } = transition;
    await this.stamp.touch({ companyId: deal.companyId, dealId: deal.id }, now);
    this.logger.log({
      message: "Deal stage changed",
      dealId: deal.id,
      from: deal.stage,
      to: input.stage
    });
    return { ...updated, changed: true };
  }
  async contactOptions(dealId) {
    const deal = await this.db.deal.findUnique({
      where: { id: dealId },
      select: { companyId: true, contacts: { select: { contactId: true } } }
    });
    if (!deal) {
      throw new import_common44.NotFoundException(`No deal with id ${dealId}.`);
    }
    return this.db.contact.findMany({
      where: {
        companyId: deal.companyId,
        id: { notIn: deal.contacts.map((row) => row.contactId) }
      },
      select: CONTACT_SELECT,
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
      take: 100
    });
  }
  async attachContact(input) {
    const company = await this.companyOf(input.dealId);
    const contact = await this.db.contact.findUnique({
      where: { id: input.contactId },
      select: { companyId: true }
    });
    if (!contact) {
      throw new import_common44.NotFoundException(`No contact with id ${input.contactId}.`);
    }
    if (contact.companyId !== company.id) {
      throw new import_common44.BadRequestException(`That contact does not work at ${company.name}.`);
    }
    const role = roleOrNull(input.role ?? null);
    await this.db.dealContact.upsert({
      where: {
        dealId_contactId: {
          dealId: input.dealId,
          contactId: input.contactId
        }
      },
      create: { dealId: input.dealId, contactId: input.contactId, role },
      update: role === null ? {} : { role }
    });
    this.logger.log({
      message: "Contact attached to deal",
      dealId: input.dealId,
      contactId: input.contactId
    });
    return { dealId: input.dealId, contactId: input.contactId };
  }
  async detachContact(input) {
    const { count } = await this.db.dealContact.deleteMany({
      where: { dealId: input.dealId, contactId: input.contactId }
    });
    if (count === 0) {
      throw new import_common44.NotFoundException("That contact is not on this deal.");
    }
    this.logger.log({
      message: "Contact detached from deal",
      dealId: input.dealId,
      contactId: input.contactId
    });
    return { dealId: input.dealId, contactId: input.contactId };
  }
  async setContactRole(input) {
    const role = roleOrNull(input.role);
    const { count } = await this.db.dealContact.updateMany({
      where: { dealId: input.dealId, contactId: input.contactId },
      data: { role }
    });
    if (count === 0) {
      throw new import_common44.NotFoundException("That contact is not on this deal.");
    }
    return { dealId: input.dealId, contactId: input.contactId, role };
  }
  async bulkAssignOwner(input) {
    await requireOwner(this.db, input.ownerId);
    const ids = [...new Set(input.ids)];
    const { count } = await this.db.deal.updateMany({
      where: { id: { in: ids } },
      data: { ownerId: input.ownerId }
    });
    this.logger.log({
      message: "Deals reassigned",
      count,
      ownerId: input.ownerId
    });
    return {
      requested: ids.length,
      succeeded: count,
      skipped: 0,
      failed: ids.length - count,
      message: null
    };
  }
  async bulkSetStage(input, actingUserId) {
    const closedReason = input.closedReason?.trim();
    if (LOSING.has(input.stage) && !closedReason) {
      throw new import_common44.BadRequestException("Say why they were lost — a closed-lost deal with no reason teaches nobody anything.");
    }
    return runBulk(input.ids, (id) => this.setStage({ id, stage: input.stage, closedReason }, actingUserId));
  }
  async bulkArchive(ids) {
    return runBulk(ids, (id) => this.archive(id));
  }
  async bulkRestore(ids) {
    return runBulk(ids, (id) => this.restore(id));
  }
  async bulkPurge(ids) {
    return runBulk(ids, (id) => this.purge(id));
  }
  async companyOf(dealId) {
    const deal = await this.db.deal.findUnique({
      where: { id: dealId },
      select: { company: { select: { id: true, name: true } } }
    });
    if (!deal) {
      throw new import_common44.NotFoundException(`No deal with id ${dealId}.`);
    }
    return deal.company;
  }
  searchFilter(q) {
    const term = q.trim();
    if (!term)
      return {};
    return {
      OR: [
        { name: { contains: term, mode: "insensitive" } },
        { company: { name: { contains: term, mode: "insensitive" } } }
      ]
    };
  }
  buildWhere(input, filterableFields) {
    const and = [
      this.searchFilter(input.q),
      archivedFilter(input.archived),
      ...this.fields.fieldFilters(filterableFields, input.fields)
    ];
    const owner = ownerFilter(input.owner);
    if (owner)
      and.push(owner);
    if (input.status === "open") {
      and.push({ stage: { in: [...import_deal_stage2.OPEN_DEAL_STAGES] } });
    } else if (input.status === "closed") {
      and.push({ stage: { in: [...import_deal_stage2.CLOSED_DEAL_STAGES] } });
    }
    if (input.stage.length > 0) {
      and.push({ stage: { in: input.stage } });
    }
    if (input.closing.length > 0) {
      and.push({
        OR: input.closing.map((window) => closingFilter(window))
      });
    }
    return { AND: and };
  }
  async facetCounts(input, filterableFields) {
    const where = {
      AND: [this.searchFilter(input.q), archivedFilter(input.archived)]
    };
    const [owners, stages, fieldFacets, ...closingCounts] = await Promise.all([
      this.db.deal.groupBy({ by: ["ownerId"], where, _count: { _all: true } }),
      this.db.deal.groupBy({ by: ["stage"], where, _count: { _all: true } }),
      this.fields.filterFacetCounts("DEAL", where, filterableFields),
      ...CLOSING_WINDOWS.map((window) => this.db.deal.count({ where: { AND: [where, closingFilter(window)] } }))
    ]);
    const stageCounts = countsByKey(stages, "stage");
    const openCount = import_deal_stage2.OPEN_DEAL_STAGES.reduce((total, stage) => total + (stageCounts[stage] ?? 0), 0);
    const closedCount = import_deal_stage2.CLOSED_DEAL_STAGES.reduce((total, stage) => total + (stageCounts[stage] ?? 0), 0);
    return {
      status: { open: openCount, closed: closedCount },
      owner: countsByKey(owners, "ownerId", FACET_UNASSIGNED),
      stage: stageCounts,
      closing: Object.fromEntries(CLOSING_WINDOWS.map((window, index) => [
        window,
        closingCounts[index] ?? 0
      ])),
      ...Object.fromEntries(Object.entries(fieldFacets).map(([key, counts]) => [
        `field:${key}`,
        counts
      ]))
    };
  }
  translate(cause, id) {
    if (cause instanceof import_db17.Prisma.PrismaClientKnownRequestError && cause.code === "P2025") {
      throw new import_common44.NotFoundException(`No deal with id ${id}.`);
    }
    return this.translateRelations(cause);
  }
  translateRelations(cause) {
    if (cause instanceof import_db17.Prisma.PrismaClientKnownRequestError && (cause.code === "P2003" || cause.code === "P2025")) {
      throw new import_common44.BadRequestException("That company or owner does not exist any more.");
    }
    throw cause;
  }
}
DealsService = __legacyDecorateClassTS([
  import_common44.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof AgentTriggerService === "undefined" ? Object : AgentTriggerService,
    typeof ActivityStampService === "undefined" ? Object : ActivityStampService,
    typeof ConversionService === "undefined" ? Object : ConversionService,
    typeof FieldsService === "undefined" ? Object : FieldsService
  ])
], DealsService);
function closingFilter(window) {
  const now = new Date;
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const startOfMonthAfter = new Date(now.getFullYear(), now.getMonth() + 2, 1);
  switch (window) {
    case "overdue":
      return {
        expectedCloseDate: { lt: now },
        stage: { in: [...import_deal_stage2.OPEN_DEAL_STAGES] }
      };
    case "this-month":
      return {
        expectedCloseDate: { gte: startOfMonth, lt: startOfNextMonth }
      };
    case "next-month":
      return {
        expectedCloseDate: { gte: startOfNextMonth, lt: startOfMonthAfter }
      };
    case "later":
      return { expectedCloseDate: { gte: startOfMonthAfter } };
    case "none":
      return { expectedCloseDate: null };
  }
}
function roleOrNull(value) {
  return value === null ? null : blankToNull(value);
}
function parseDate2(value) {
  if (value === null || value === undefined || value === "")
    return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new import_common44.BadRequestException(`"${value}" is not a date.`);
  }
  return date;
}

// src/deals/deals.router.ts
class DealsRouter {
  deals;
  constructor(deals) {
    this.deals = deals;
  }
  async list(input) {
    return this.deals.list(input);
  }
  async byId(id) {
    return this.deals.byId(id);
  }
  async create(input) {
    return this.deals.create(input);
  }
  async update(input) {
    return this.deals.update(input.id, input.data);
  }
  async archive(id) {
    return this.deals.archive(id);
  }
  async restore(id) {
    return this.deals.restore(id);
  }
  async purge(id) {
    return this.deals.purge(id);
  }
  async setStage(ctx, input) {
    return this.deals.setStage(input, ctx.user.id);
  }
  async contactOptions(dealId) {
    return this.deals.contactOptions(dealId);
  }
  async attachContact(input) {
    return this.deals.attachContact(input);
  }
  async detachContact(input) {
    return this.deals.detachContact(input);
  }
  async setContactRole(input) {
    return this.deals.setContactRole(input);
  }
  async bulkAssignOwner(input) {
    return this.deals.bulkAssignOwner(input);
  }
  async bulkSetStage(ctx, input) {
    return this.deals.bulkSetStage(input, ctx.user.id);
  }
  async bulkArchive(ids) {
    return this.deals.bulkArchive(ids);
  }
  async bulkRestore(ids) {
    return this.deals.bulkRestore(ids);
  }
  async bulkPurge(ids) {
    return this.deals.bulkPurge(ids);
  }
}
__legacyDecorateClassTS([
  import_nestjs_trpc9.Query({
    input: dealListInput,
    output: dealListOutput,
    meta: restMeta("POST", "/deals/search", ["Deals"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc9.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], DealsRouter.prototype, "list", null);
__legacyDecorateClassTS([
  import_nestjs_trpc9.Query({
    input: dealIdInput,
    output: dealDetailOutput,
    meta: restMeta("GET", "/deals/{id}", ["Deals"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc9.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], DealsRouter.prototype, "byId", null);
__legacyDecorateClassTS([
  import_nestjs_trpc9.Mutation({
    input: dealCreateInput,
    output: dealCreateOutput,
    meta: restMeta("POST", "/deals", ["Deals"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc9.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], DealsRouter.prototype, "create", null);
__legacyDecorateClassTS([
  import_nestjs_trpc9.Mutation({
    input: dealUpdateArgs,
    output: dealMutateOutput,
    meta: restMeta("PATCH", "/deals/{id}", ["Deals"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc9.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], DealsRouter.prototype, "update", null);
__legacyDecorateClassTS([
  import_nestjs_trpc9.Mutation({
    input: dealIdInput,
    output: dealMutateOutput,
    meta: restMeta("POST", "/deals/{id}/archive", ["Deals"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc9.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], DealsRouter.prototype, "archive", null);
__legacyDecorateClassTS([
  import_nestjs_trpc9.Mutation({
    input: dealIdInput,
    output: dealMutateOutput,
    meta: restMeta("POST", "/deals/{id}/restore", ["Deals"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc9.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], DealsRouter.prototype, "restore", null);
__legacyDecorateClassTS([
  import_nestjs_trpc9.Mutation({
    input: dealIdInput,
    output: dealMutateOutput,
    meta: restMeta("DELETE", "/deals/{id}", ["Deals"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc9.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], DealsRouter.prototype, "purge", null);
__legacyDecorateClassTS([
  import_nestjs_trpc9.Mutation({
    input: setStageInput,
    output: dealSetStageOutput,
    meta: restMeta("PATCH", "/deals/{id}/stage", ["Deals"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc9.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc9.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], DealsRouter.prototype, "setStage", null);
__legacyDecorateClassTS([
  import_nestjs_trpc9.Query({
    input: dealContactsInput,
    output: dealContactOptionsOutput,
    meta: restMeta("GET", "/deals/{dealId}/contact-options", ["Deals"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc9.Input("dealId")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], DealsRouter.prototype, "contactOptions", null);
__legacyDecorateClassTS([
  import_nestjs_trpc9.Mutation({
    input: dealAttachContactInput,
    output: dealContactLinkOutput,
    meta: restMeta("POST", "/deals/{dealId}/contacts", ["Deals"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc9.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], DealsRouter.prototype, "attachContact", null);
__legacyDecorateClassTS([
  import_nestjs_trpc9.Mutation({
    input: dealDetachContactInput,
    output: dealContactLinkOutput,
    meta: restMeta("DELETE", "/deals/{dealId}/contacts/{contactId}", ["Deals"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc9.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], DealsRouter.prototype, "detachContact", null);
__legacyDecorateClassTS([
  import_nestjs_trpc9.Mutation({
    input: dealContactRoleInput,
    output: dealContactRoleOutput,
    meta: restMeta("PATCH", "/deals/{dealId}/contacts/{contactId}/role", [
      "Deals"
    ])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc9.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], DealsRouter.prototype, "setContactRole", null);
__legacyDecorateClassTS([
  import_nestjs_trpc9.Mutation({
    input: dealBulkOwnerInput,
    output: dealBulkResultOutput,
    meta: restMeta("POST", "/deals/bulk-assign-owner", ["Deals"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc9.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], DealsRouter.prototype, "bulkAssignOwner", null);
__legacyDecorateClassTS([
  import_nestjs_trpc9.Mutation({
    input: dealBulkStageInput,
    output: dealBulkResultOutput,
    meta: restMeta("POST", "/deals/bulk-set-stage", ["Deals"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc9.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc9.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], DealsRouter.prototype, "bulkSetStage", null);
__legacyDecorateClassTS([
  import_nestjs_trpc9.Mutation({
    input: dealBulkInput,
    output: dealBulkResultOutput,
    meta: restMeta("POST", "/deals/bulk-archive", ["Deals"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc9.Input("ids")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    Array
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], DealsRouter.prototype, "bulkArchive", null);
__legacyDecorateClassTS([
  import_nestjs_trpc9.Mutation({
    input: dealBulkInput,
    output: dealBulkResultOutput,
    meta: restMeta("POST", "/deals/bulk-restore", ["Deals"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc9.Input("ids")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    Array
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], DealsRouter.prototype, "bulkRestore", null);
__legacyDecorateClassTS([
  import_nestjs_trpc9.Mutation({
    input: dealBulkInput,
    output: dealBulkResultOutput,
    meta: restMeta("POST", "/deals/bulk-purge", ["Deals"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc9.Input("ids")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    Array
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], DealsRouter.prototype, "bulkPurge", null);
DealsRouter = __legacyDecorateClassTS([
  import_nestjs_trpc9.Router({ alias: "deals" }),
  import_nestjs_trpc9.UseMiddlewares(AuthMiddleware),
  __legacyDecorateParamTS(0, import_common45.Inject(DealsService)),
  __legacyMetadataTS("design:paramtypes", [
    typeof DealsService === "undefined" ? Object : DealsService
  ])
], DealsRouter);

// src/deals/deals.module.ts
class DealsModule {
}
DealsModule = __legacyDecorateClassTS([
  import_common46.Module({
    imports: [AgentModule, FieldsModule, TrpcModule, CurrencyModule],
    providers: [DealsService, DealsRouter],
    exports: [DealsService]
  })
], DealsModule);

// src/archive/archive-retention.controller.ts
var import_settings4 = require("@crm/db/settings");
var import_common47 = require("@nestjs/common");
var import_config2 = require("@nestjs/config");
var import_swagger2 = require("@nestjs/swagger");
var import_nestjs_better_auth2 = require("@thallesp/nestjs-better-auth");
var DAY_MS = 24 * 60 * 60000;

class ArchiveRetentionController {
  db;
  companies;
  contacts;
  deals;
  logger = new import_common47.Logger(ArchiveRetentionController.name);
  secret;
  constructor(db, companies, contacts, deals, config) {
    this.db = db;
    this.companies = companies;
    this.contacts = contacts;
    this.deals = deals;
    this.secret = config.get("CRON_SECRET", { infer: true });
  }
  async pruneViaGet(authorization) {
    return this.run(authorization);
  }
  async pruneViaPost(authorization) {
    return this.run(authorization);
  }
  async run(authorization) {
    if (!this.secret) {
      this.logger.error({
        message: "CRON_SECRET is not set — refusing to run archive pruning."
      });
      throw new import_common47.ServiceUnavailableException("Pruning is not configured.");
    }
    if (!timingSafeEquals2(authorization ?? "", `Bearer ${this.secret}`)) {
      throw new import_common47.ForbiddenException;
    }
    const retentionDays = await import_settings4.readArchiveRetentionDays(this.db);
    const before = new Date(Date.now() - retentionDays * DAY_MS);
    const [companies, contacts, deals] = await Promise.all([
      this.companies.purgeExpired(before),
      this.contacts.purgeExpired(before),
      this.deals.purgeExpired(before)
    ]);
    this.logger.log({
      message: "Archive retention swept",
      retentionDays,
      companies: companies.succeeded,
      companiesSkipped: companies.skipped,
      contacts: contacts.succeeded,
      contactsSkipped: contacts.skipped,
      deals: deals.succeeded,
      dealsSkipped: deals.skipped
    });
    return { retentionDays, companies, contacts, deals };
  }
}
__legacyDecorateClassTS([
  import_common47.Get("prune"),
  import_nestjs_better_auth2.AllowAnonymous(),
  import_swagger2.ApiOperation({
    summary: "Purge companies, contacts and deals past the archive window"
  }),
  import_swagger2.ApiOkResponse({ description: "The prune ran; per-record-type counts." }),
  __legacyDecorateParamTS(0, import_common47.Headers("authorization")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ArchiveRetentionController.prototype, "pruneViaGet", null);
__legacyDecorateClassTS([
  import_common47.Post("prune"),
  import_nestjs_better_auth2.AllowAnonymous(),
  import_swagger2.ApiExcludeEndpoint(),
  __legacyDecorateParamTS(0, import_common47.Headers("authorization")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ArchiveRetentionController.prototype, "pruneViaPost", null);
ArchiveRetentionController = __legacyDecorateClassTS([
  import_swagger2.ApiTags("Internal — Cron"),
  import_swagger2.ApiHeader({
    name: "authorization",
    description: "`Bearer <CRON_SECRET>`",
    required: true
  }),
  import_swagger2.ApiForbiddenResponse({ description: "CRON_SECRET did not match." }),
  import_swagger2.ApiServiceUnavailableResponse({ description: "CRON_SECRET is not set." }),
  import_common47.Controller("internal/archive"),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof CompaniesService === "undefined" ? Object : CompaniesService,
    typeof ContactsService === "undefined" ? Object : ContactsService,
    typeof DealsService === "undefined" ? Object : DealsService,
    typeof import_config2.ConfigService === "undefined" ? Object : import_config2.ConfigService
  ])
], ArchiveRetentionController);
function timingSafeEquals2(a, b) {
  if (a.length !== b.length)
    return false;
  let mismatch = 0;
  for (let index = 0;index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return mismatch === 0;
}

// src/archive/archive.module.ts
class ArchiveModule {
}
ArchiveModule = __legacyDecorateClassTS([
  import_common48.Module({
    imports: [CompaniesModule, ContactsModule, DealsModule],
    controllers: [ArchiveRetentionController]
  })
], ArchiveModule);

// src/auth/auth.module.ts
var import_common52 = require("@nestjs/common");

// src/auth/auth.controller.ts
var import_auth16 = require("@crm/auth");
var import_common50 = require("@nestjs/common");
var import_swagger3 = require("@nestjs/swagger");
var import_nestjs_better_auth3 = require("@thallesp/nestjs-better-auth");

// src/auth/auth.service.ts
var import_cache_manager = require("@nestjs/cache-manager");
var import_common49 = require("@nestjs/common");
var PROFILE_TTL_MS = 5 * 60000;
var profileKey = (userId) => `auth:profile:${userId}`;

class AuthService {
  db;
  cache;
  logger = new import_common49.Logger(AuthService.name);
  constructor(db, cache) {
    this.db = db;
    this.cache = cache;
  }
  async getProfile(userId) {
    const key = profileKey(userId);
    const cached = await this.cache.get(key);
    if (cached) {
      return cached;
    }
    this.logger.debug({ message: "Profile cache miss", userId });
    const user = await this.db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true
      }
    });
    if (!user) {
      this.logger.warn({ message: "Session user no longer exists", userId });
      throw new import_common49.NotFoundException(`No user with id ${userId}.`);
    }
    const profile = {
      ...user,
      createdAt: user.createdAt.toISOString()
    };
    await this.cache.set(key, profile, PROFILE_TTL_MS);
    return profile;
  }
  async invalidateProfile(userId) {
    await this.cache.del(profileKey(userId));
    this.logger.debug({ message: "Invalidated cached profile", userId });
  }
}
AuthService = __legacyDecorateClassTS([
  import_common49.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyDecorateParamTS(1, import_common49.Inject(import_cache_manager.CACHE_MANAGER)),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof Cache === "undefined" ? Object : Cache
  ])
], AuthService);

// src/auth/auth.controller.ts
class AuthController {
  authService;
  constructor(authService) {
    this.authService = authService;
  }
  async getMe(session) {
    return { user: await this.authService.getProfile(session.user.id) };
  }
  getSession(session) {
    if (!session) {
      return { authenticated: false, user: null };
    }
    return {
      authenticated: true,
      user: { id: session.user.id, email: session.user.email },
      expiresAt: session.session.expiresAt
    };
  }
}
__legacyDecorateClassTS([
  import_common50.Get("me"),
  import_swagger3.ApiOperation({ summary: "Get the signed-in user's profile" }),
  import_swagger3.ApiOkResponse({ description: "The signed-in user's profile." }),
  import_swagger3.ApiUnauthorizedResponse({ description: "No valid session." }),
  __legacyDecorateParamTS(0, import_nestjs_better_auth3.Session()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof CrmSession === "undefined" ? Object : CrmSession
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], AuthController.prototype, "getMe", null);
__legacyDecorateClassTS([
  import_common50.Get("session"),
  import_nestjs_better_auth3.OptionalAuth(),
  import_swagger3.ApiOperation({
    summary: "Check whether the current request carries a valid session"
  }),
  import_swagger3.ApiOkResponse({
    description: "Whether the request is authenticated, and as whom."
  }),
  __legacyDecorateParamTS(0, import_nestjs_better_auth3.Session()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof CrmSession === "undefined" ? Object : CrmSession
  ]),
  __legacyMetadataTS("design:returntype", undefined)
], AuthController.prototype, "getSession", null);
AuthController = __legacyDecorateClassTS([
  import_swagger3.ApiTags("Auth"),
  import_swagger3.ApiCookieAuth(import_auth16.SESSION_COOKIE_NAME),
  import_common50.Controller("auth"),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthService === "undefined" ? Object : AuthService
  ])
], AuthController);

// src/auth/auth-hooks.service.ts
var import_common51 = require("@nestjs/common");
var import_nestjs_better_auth4 = require("@thallesp/nestjs-better-auth");
class AuthHooksService {
  authService;
  logger = new import_common51.Logger(AuthHooksService.name);
  constructor(authService) {
    this.authService = authService;
  }
  async onUserUpdated(user) {
    try {
      await this.authService.invalidateProfile(user.id);
    } catch (error) {
      this.logger.error({ message: "Failed to invalidate cached profile", userId: user.id }, error instanceof Error ? error.stack : String(error));
    }
  }
}
__legacyDecorateClassTS([
  import_nestjs_better_auth4.AfterUpdate("user"),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    Object
  ]),
  __legacyMetadataTS("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], AuthHooksService.prototype, "onUserUpdated", null);
AuthHooksService = __legacyDecorateClassTS([
  import_nestjs_better_auth4.DatabaseHook(),
  import_common51.Injectable(),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthService === "undefined" ? Object : AuthService
  ])
], AuthHooksService);

// src/auth/auth.module.ts
class AuthModule {
}
AuthModule = __legacyDecorateClassTS([
  import_common52.Module({
    controllers: [AuthController],
    providers: [AuthService, AuthHooksService],
    exports: [AuthService]
  })
], AuthModule);

// src/backfill/backfill.module.ts
var import_common55 = require("@nestjs/common");

// src/backfill/backfill.service.ts
var import_auth21 = require("@crm/auth");
var import_db18 = require("@crm/db");
var import_agent_tasks2 = require("@crm/db/agent-tasks");
var import_workspace = require("@crm/db/workspace");
var import_cache_manager2 = require("@nestjs/cache-manager");
var import_common54 = require("@nestjs/common");

// src/backfill/image-mirror.service.ts
var import_blob2 = require("@crm/db/blob");
var import_images = require("@crm/db/images");
var import_common53 = require("@nestjs/common");
var MAX_PER_SWEEP = 25;
var EXTERNAL_CONTACT_IMAGE = {
  imageUrl: { not: null },
  NOT: { imageUrl: { contains: import_images.BLOB_HOST_SUFFIX } }
};
var EXTERNAL_USER_IMAGE = {
  image: { not: null },
  NOT: { image: { contains: import_images.BLOB_HOST_SUFFIX } }
};

class ImageMirrorService {
  db;
  logger = new import_common53.Logger(ImageMirrorService.name);
  constructor(db) {
    this.db = db;
  }
  async sweep() {
    if (!import_blob2.blobEnabled())
      return { scanned: 0, copied: 0 };
    const results = [
      await this.sweepCompanies(),
      await this.sweepContacts(),
      await this.sweepUsers()
    ];
    const total = results.reduce((sum, result) => ({
      scanned: sum.scanned + result.scanned,
      copied: sum.copied + result.copied
    }), { scanned: 0, copied: 0 });
    if (total.copied > 0) {
      this.logger.log({ message: "Mirrored external images", ...total });
    }
    return total;
  }
  async sweepCompanies() {
    const rows = await this.db.company.findMany({
      where: {
        OR: import_images.COMPANY_IMAGE_FIELDS.map(externalCompanyImage)
      },
      orderBy: { createdAt: "asc" },
      take: MAX_PER_SWEEP,
      select: {
        id: true,
        logoUrl: true,
        logoDarkUrl: true,
        iconUrl: true,
        iconDarkUrl: true
      }
    });
    let copied = 0;
    for (const row of rows) {
      const data = {};
      for (const field of import_images.COMPANY_IMAGE_FIELDS) {
        const current = row[field];
        if (!current)
          continue;
        const stored = await import_blob2.mirror(current, `companies/${row.id}/${field}`);
        if (!stored || stored === current)
          continue;
        data[field] = stored;
        copied += 1;
      }
      if (Object.keys(data).length === 0)
        continue;
      await this.db.company.updateMany({
        where: { id: row.id, ...unchanged(row) },
        data
      });
    }
    return { scanned: rows.length, copied };
  }
  async sweepContacts() {
    const rows = await this.db.contact.findMany({
      where: EXTERNAL_CONTACT_IMAGE,
      orderBy: { createdAt: "asc" },
      take: MAX_PER_SWEEP,
      select: { id: true, imageUrl: true }
    });
    let copied = 0;
    for (const row of rows) {
      if (!row.imageUrl)
        continue;
      const stored = await import_blob2.mirror(row.imageUrl, `contacts/${row.id}`);
      if (!stored || stored === row.imageUrl)
        continue;
      const { count } = await this.db.contact.updateMany({
        where: { id: row.id, imageUrl: row.imageUrl },
        data: { imageUrl: stored }
      });
      copied += count;
    }
    return { scanned: rows.length, copied };
  }
  async sweepUsers() {
    const rows = await this.db.user.findMany({
      where: EXTERNAL_USER_IMAGE,
      take: MAX_PER_SWEEP,
      select: { id: true, image: true }
    });
    let copied = 0;
    for (const row of rows) {
      if (!row.image)
        continue;
      const stored = await import_blob2.mirror(row.image, `users/${row.id}/avatar`);
      if (!stored || stored === row.image)
        continue;
      const { count } = await this.db.user.updateMany({
        where: { id: row.id, image: row.image },
        data: { image: stored }
      });
      copied += count;
    }
    return { scanned: rows.length, copied };
  }
}
ImageMirrorService = __legacyDecorateClassTS([
  import_common53.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db
  ])
], ImageMirrorService);
function externalCompanyImage(field) {
  const mirrored = {};
  mirrored[field] = { contains: import_images.BLOB_HOST_SUFFIX };
  const where = { NOT: mirrored };
  where[field] = { not: null };
  return where;
}
function unchanged(row) {
  const where = {};
  for (const field of import_images.COMPANY_IMAGE_FIELDS)
    where[field] = row[field] ?? null;
  return where;
}

// src/backfill/backfill.service.ts
var MAX_PER_RUN = 500;
var MAX_FAVICONS = 25;
var NEVER_SUCCEEDED = {
  in: [import_db18.EnrichmentStatus.PENDING, import_db18.EnrichmentStatus.FAILED]
};
var AUTO_KEY = "backfill:auto";
var AUTO_EVERY_MS = 5 * 60000;
var RECHECK_PHOTO_AFTER_MS = 30 * 24 * 60 * 60000;
var RECHECK_BRAND_AFTER_MS = 30 * 24 * 60 * 60000;
var RECHECK_WORKSPACE_AFTER_MS = 7 * 24 * 60 * 60000;

class BackfillService {
  db;
  agent;
  favicon;
  images;
  cache;
  logger = new import_common54.Logger(BackfillService.name);
  constructor(db, agent, favicon, images, cache) {
    this.db = db;
    this.agent = agent;
    this.favicon = favicon;
    this.images = images;
    this.cache = cache;
  }
  onModuleInit() {
    import_auth21.onSignedIn(() => {
      this.auto();
    });
  }
  async auto() {
    if (await this.cache.get(AUTO_KEY))
      return { started: false };
    await this.cache.set(AUTO_KEY, true, AUTO_EVERY_MS);
    (async () => {
      try {
        await this.sweepWorkspace();
        const companies = await this.runCompanies(false);
        const contacts = await this.runContacts();
        const mirrored = await this.images.sweep();
        this.logger.log({
          message: "Automatic backfill swept",
          queued: companies.queued + contacts.queued,
          remaining: companies.remaining + contacts.remaining,
          iconsResolving: companies.iconsResolving,
          imagesMirrored: mirrored.copied
        });
      } catch (error) {
        this.logger.error({ message: "Automatic backfill failed" }, error instanceof Error ? error.stack : String(error));
      }
    })();
    return { started: true };
  }
  async sweepWorkspace() {
    const us = await import_workspace.readWorkspaceIdentity(this.db);
    if (!us?.website || us.profile)
      return;
    const attempted = await this.db.agentTask.findFirst({
      where: {
        kind: "workspace-profile",
        finishedAt: { gte: new Date(Date.now() - RECHECK_WORKSPACE_AFTER_MS) }
      },
      select: { id: true }
    });
    if (attempted)
      return;
    await this.agent.workspaceChanged(us.website, "We still have no profile of the company using this CRM");
  }
  async run(scope) {
    if (scope === "contacts")
      return this.runContacts();
    return this.runCompanies(scope === "deals");
  }
  async runCompanies(dealsOnly) {
    const onDeals = dealsOnly ? { deals: { some: {} } } : {};
    const needsBrand = this.companiesNeedingBrand();
    const needsArtwork = await this.companiesNeedingArtwork();
    const [total, rows, artworkRows] = await Promise.all([
      this.db.company.count({
        where: { ...onDeals, OR: [needsBrand, needsArtwork] }
      }),
      this.db.company.findMany({
        where: { ...needsBrand, ...onDeals },
        orderBy: { createdAt: "asc" },
        take: MAX_PER_RUN,
        select: { id: true }
      }),
      this.db.company.findMany({
        where: { ...needsArtwork, ...onDeals },
        orderBy: { createdAt: "asc" },
        take: MAX_PER_RUN,
        select: { id: true }
      })
    ]);
    const companyIds = [
      ...new Set([
        ...rows.map((row) => row.id),
        ...artworkRows.map((row) => row.id)
      ])
    ].slice(0, MAX_PER_RUN);
    const brand = await this.agent.backfill({
      kind: "brand",
      reason: "Backfill — this company has no logo or icon",
      companyIds,
      budget: 2,
      priority: import_agent_tasks2.PRIORITY.brand
    });
    const profile = await this.agent.backfill({
      kind: "company-profile",
      reason: "Backfill — this company was never successfully looked up",
      companyIds: rows.map((row) => row.id)
    });
    const queued = {
      queued: brand.queued + profile.queued,
      alreadyQueued: brand.alreadyQueued + profile.alreadyQueued
    };
    const iconsResolving = dealsOnly ? 0 : await this.sweepFavicons();
    return {
      ...queued,
      remaining: Math.max(0, total - companyIds.length),
      iconsResolving
    };
  }
  async runContacts() {
    const needsPhoto = await this.contactsNeedingPhoto();
    const [photoTotal, photoRows] = await Promise.all([
      this.db.contact.count({ where: needsPhoto }),
      this.db.contact.findMany({
        where: needsPhoto,
        orderBy: { createdAt: "asc" },
        take: MAX_PER_RUN,
        select: { id: true }
      })
    ]);
    const photos = await this.agent.backfill({
      kind: "portrait",
      reason: "Backfill — somewhere to look for a picture, and no picture",
      contactIds: photoRows.map((row) => row.id),
      budget: 1,
      priority: import_agent_tasks2.PRIORITY.portrait
    });
    const headroom = MAX_PER_RUN - photoRows.length;
    const [researchTotal, researchRows] = await Promise.all([
      this.db.contact.count({ where: this.contactsNeverResearched() }),
      headroom > 0 ? this.db.contact.findMany({
        where: this.contactsNeverResearched(),
        orderBy: { createdAt: "asc" },
        take: headroom,
        select: { id: true }
      }) : Promise.resolve([])
    ]);
    const research = await this.agent.backfill({
      kind: "identify",
      reason: "Backfill — this contact was never researched",
      contactIds: researchRows.map((row) => row.id)
    });
    return {
      queued: photos.queued + research.queued,
      alreadyQueued: photos.alreadyQueued + research.alreadyQueued,
      remaining: Math.max(0, photoTotal - photoRows.length) + Math.max(0, researchTotal - researchRows.length),
      iconsResolving: 0
    };
  }
  async sweepFavicons() {
    const rows = await this.db.company.findMany({
      where: { domain: { not: null }, iconUrl: null },
      orderBy: { createdAt: "asc" },
      take: MAX_FAVICONS,
      select: { id: true, domain: true }
    });
    if (rows.length === 0)
      return 0;
    (async () => {
      let resolved = 0;
      for (const row of rows) {
        if (await this.favicon.backfill(row.id, row.domain))
          resolved += 1;
      }
      this.logger.log({
        message: "Favicon sweep finished",
        attempted: rows.length,
        resolved
      });
    })();
    return rows.length;
  }
  companiesNeedingBrand() {
    return { domain: { not: null }, enrichmentStatus: NEVER_SUCCEEDED };
  }
  async companiesNeedingArtwork() {
    const since = new Date(Date.now() - RECHECK_BRAND_AFTER_MS);
    const checked = await this.db.agentTask.findMany({
      where: { kind: "brand", finishedAt: { gte: since } },
      select: { companyId: true }
    });
    const recentlyChecked = checked.map((row) => row.companyId).filter((id) => id !== null);
    const where = {
      domain: { not: null },
      logoUrl: null,
      iconUrl: null
    };
    if (recentlyChecked.length > 0)
      where.id = { notIn: recentlyChecked };
    return where;
  }
  async contactsNeedingPhoto() {
    const since = new Date(Date.now() - RECHECK_PHOTO_AFTER_MS);
    const checked = await this.db.agentTask.findMany({
      where: { kind: "portrait", finishedAt: { gte: since } },
      select: { contactId: true }
    });
    const recentlyChecked = checked.map((row) => row.contactId).filter((id) => id !== null);
    const where = {
      imageUrl: null,
      OR: [
        { linkedinUrl: { not: null } },
        { githubUrl: { not: null } },
        { company: { domain: { not: null } } }
      ]
    };
    if (recentlyChecked.length > 0)
      where.id = { notIn: recentlyChecked };
    return where;
  }
  contactsNeverResearched() {
    return { enrichmentStatus: NEVER_SUCCEEDED };
  }
}
BackfillService = __legacyDecorateClassTS([
  import_common54.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyDecorateParamTS(4, import_common54.Inject(import_cache_manager2.CACHE_MANAGER)),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof AgentTriggerService === "undefined" ? Object : AgentTriggerService,
    typeof FaviconService === "undefined" ? Object : FaviconService,
    typeof ImageMirrorService === "undefined" ? Object : ImageMirrorService,
    typeof Cache === "undefined" ? Object : Cache
  ])
], BackfillService);

// src/backfill/backfill.module.ts
class BackfillModule {
}
BackfillModule = __legacyDecorateClassTS([
  import_common55.Module({
    imports: [AgentModule, CompaniesModule],
    providers: [BackfillService, ImageMirrorService],
    exports: [BackfillService]
  })
], BackfillModule);

// src/cache/cache.module.ts
var import_redis = __toESM(require("@keyv/redis"));
var import_cache_manager3 = require("@nestjs/cache-manager");
var import_common56 = require("@nestjs/common");
var import_config3 = require("@nestjs/config");
var DEFAULT_TTL_MS = 60000;

class AppCacheModule {
}
AppCacheModule = __legacyDecorateClassTS([
  import_common56.Module({
    imports: [
      import_cache_manager3.CacheModule.registerAsync({
        isGlobal: true,
        inject: [import_config3.ConfigService],
        useFactory: (config) => {
          const logger = new import_common56.Logger("CacheModule");
          const redisUrl = config.get("REDIS_URL", { infer: true });
          const ttl = config.get("CACHE_TTL_MS", { infer: true }) ?? DEFAULT_TTL_MS;
          if (!redisUrl) {
            logger.warn({
              message: "REDIS_URL is not set — falling back to a per-instance in-memory cache.",
              ttl
            });
            return { ttl };
          }
          logger.log({ message: "Cache backed by Redis", ttl });
          return { ttl, stores: [new import_redis.default(redisUrl)] };
        }
      })
    ],
    exports: [import_cache_manager3.CacheModule]
  })
], AppCacheModule);

// src/config/env.validation.ts
var import_class_transformer = require("class-transformer");
var import_class_validator = require("class-validator");
var NodeEnv;
((NodeEnv2) => {
  NodeEnv2["Development"] = "development";
  NodeEnv2["Production"] = "production";
  NodeEnv2["Test"] = "test";
})(NodeEnv ||= {});

class EnvironmentVariables {
  constructor() {
    this.NODE_ENV = "development" /* Development */;
    this.PORT = 3001;
  }
}
__legacyDecorateClassTS([
  import_class_validator.IsEnum(NodeEnv),
  __legacyMetadataTS("design:type", typeof NodeEnv === "undefined" ? Object : NodeEnv)
], EnvironmentVariables.prototype, "NODE_ENV", undefined);
__legacyDecorateClassTS([
  import_class_transformer.Type(() => Number),
  import_class_validator.IsInt(),
  import_class_validator.Min(1),
  import_class_validator.Max(65535),
  __legacyMetadataTS("design:type", Object)
], EnvironmentVariables.prototype, "PORT", undefined);
__legacyDecorateClassTS([
  import_class_validator.IsString(),
  import_class_validator.MinLength(1, {
    message: "DATABASE_URL is required. `docker compose up -d` starts one, or set it to any Postgres connection string."
  }),
  __legacyMetadataTS("design:type", String)
], EnvironmentVariables.prototype, "DATABASE_URL", undefined);
__legacyDecorateClassTS([
  import_class_validator.IsString(),
  import_class_validator.MinLength(32, {
    message: "BETTER_AUTH_SECRET must be at least 32 characters. Generate one with: openssl rand -base64 32"
  }),
  __legacyMetadataTS("design:type", String)
], EnvironmentVariables.prototype, "BETTER_AUTH_SECRET", undefined);
__legacyDecorateClassTS([
  import_class_validator.IsString(),
  import_class_validator.MinLength(1, {
    message: 'ALLOWED_SIGN_IN is required — it is the only thing deciding who can sign in. Set it to your email domain, e.g. ALLOWED_SIGN_IN="acme.com", or to a single address for a one-person install.'
  }),
  __legacyMetadataTS("design:type", String)
], EnvironmentVariables.prototype, "ALLOWED_SIGN_IN", undefined);
__legacyDecorateClassTS([
  import_class_validator.IsOptional(),
  import_class_validator.IsString(),
  __legacyMetadataTS("design:type", String)
], EnvironmentVariables.prototype, "GOOGLE_CLIENT_ID", undefined);
__legacyDecorateClassTS([
  import_class_validator.IsOptional(),
  import_class_validator.IsString(),
  __legacyMetadataTS("design:type", String)
], EnvironmentVariables.prototype, "GOOGLE_CLIENT_SECRET", undefined);
__legacyDecorateClassTS([
  import_class_validator.IsOptional(),
  import_class_validator.IsString(),
  __legacyMetadataTS("design:type", String)
], EnvironmentVariables.prototype, "MICROSOFT_CLIENT_ID", undefined);
__legacyDecorateClassTS([
  import_class_validator.IsOptional(),
  import_class_validator.IsString(),
  __legacyMetadataTS("design:type", String)
], EnvironmentVariables.prototype, "MICROSOFT_CLIENT_SECRET", undefined);
__legacyDecorateClassTS([
  import_class_validator.IsOptional(),
  import_class_validator.IsString(),
  __legacyMetadataTS("design:type", String)
], EnvironmentVariables.prototype, "MICROSOFT_TENANT_ID", undefined);
__legacyDecorateClassTS([
  import_class_validator.IsOptional(),
  import_class_validator.IsString(),
  __legacyMetadataTS("design:type", String)
], EnvironmentVariables.prototype, "SLACK_CLIENT_ID", undefined);
__legacyDecorateClassTS([
  import_class_validator.IsOptional(),
  import_class_validator.IsString(),
  __legacyMetadataTS("design:type", String)
], EnvironmentVariables.prototype, "SLACK_CLIENT_SECRET", undefined);
__legacyDecorateClassTS([
  import_class_validator.IsOptional(),
  import_class_validator.IsUrl({ require_tld: false }),
  __legacyMetadataTS("design:type", String)
], EnvironmentVariables.prototype, "API_URL", undefined);
__legacyDecorateClassTS([
  import_class_validator.IsOptional(),
  import_class_validator.IsString(),
  __legacyMetadataTS("design:type", String)
], EnvironmentVariables.prototype, "APP_URL", undefined);
__legacyDecorateClassTS([
  import_class_validator.IsOptional(),
  import_class_validator.IsString(),
  __legacyMetadataTS("design:type", String)
], EnvironmentVariables.prototype, "AUTH_COOKIE_DOMAIN", undefined);
__legacyDecorateClassTS([
  import_class_validator.IsOptional(),
  import_class_validator.IsString(),
  __legacyMetadataTS("design:type", String)
], EnvironmentVariables.prototype, "REDIS_URL", undefined);
__legacyDecorateClassTS([
  import_class_validator.IsOptional(),
  import_class_transformer.Type(() => Number),
  import_class_validator.IsInt(),
  import_class_validator.Min(0),
  __legacyMetadataTS("design:type", Number)
], EnvironmentVariables.prototype, "CACHE_TTL_MS", undefined);
__legacyDecorateClassTS([
  import_class_validator.IsOptional(),
  import_class_validator.IsString(),
  import_class_validator.MinLength(16, {
    message: "CRON_SECRET must be at least 16 characters."
  }),
  __legacyMetadataTS("design:type", String)
], EnvironmentVariables.prototype, "CRON_SECRET", undefined);
__legacyDecorateClassTS([
  import_class_validator.IsOptional(),
  import_class_validator.IsString(),
  __legacyMetadataTS("design:type", String)
], EnvironmentVariables.prototype, "BLOB_READ_WRITE_TOKEN", undefined);
__legacyDecorateClassTS([
  import_class_validator.IsOptional(),
  import_class_validator.IsUrl({ require_tld: false, require_protocol: true }, {
    message: "AGENT_URL must be a full URL with a scheme, like http://127.0.0.1:2000."
  }),
  __legacyMetadataTS("design:type", String)
], EnvironmentVariables.prototype, "AGENT_URL", undefined);
__legacyDecorateClassTS([
  import_class_validator.IsOptional(),
  import_class_validator.IsString(),
  __legacyMetadataTS("design:type", String)
], EnvironmentVariables.prototype, "AGENT_BRIDGE_SECRET", undefined);
__legacyDecorateClassTS([
  import_class_validator.IsOptional(),
  import_class_validator.IsString(),
  __legacyMetadataTS("design:type", String)
], EnvironmentVariables.prototype, "CRM_TELEMETRY_DISABLED", undefined);
function validateEnv(config) {
  const validated = import_class_transformer.plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
    exposeDefaultValues: true
  });
  const errors = import_class_validator.validateSync(validated, {
    skipMissingProperties: false,
    whitelist: false
  });
  if (errors.length > 0) {
    const details = errors.map((error) => Object.values(error.constraints ?? {}).join(", ")).join(`
  - `);
    throw new Error(`Invalid environment configuration:
  - ${details}

See .env.example at the root of the repo.`);
  }
  return validated;
}

// src/conversations/conversations.module.ts
var import_common61 = require("@nestjs/common");

// src/conversations/conversation-attachments.controller.ts
var import_auth23 = require("@crm/auth");
var import_common58 = require("@nestjs/common");
var import_swagger4 = require("@nestjs/swagger");
var import_nestjs_better_auth5 = require("@thallesp/nestjs-better-auth");

// src/conversations/conversations.service.ts
var import_auth22 = require("@crm/auth");
var import_db19 = require("@crm/db");
var import_agent_manifest2 = require("@crm/validation/agent-manifest");
var import_builder_question = require("@crm/validation/builder-question");
var import_common57 = require("@nestjs/common");

// src/conversations/conversation-attachments.ts
var import_zod15 = require("zod");
var builderMessageFields = import_zod15.z.record(import_zod15.z.string(), import_zod15.z.json()).catch({});
function builderMessageWithAttachments(value, attachments, shareToken) {
  return {
    ...builderMessageFields.parse(value),
    attachments: attachments.map((attachment) => ({
      id: attachment.id,
      name: attachment.name,
      type: attachment.mediaType,
      size: attachment.size,
      previewUrl: isPreviewableImage(attachment.mediaType) ? attachmentUrl(attachment.id, shareToken) : null
    }))
  };
}
function isPreviewableImage(mediaType) {
  return ["image/gif", "image/jpeg", "image/png", "image/webp"].includes(mediaType.toLowerCase());
}
function attachmentUrl(id, shareToken) {
  const path = `/api/conversations/attachments/${encodeURIComponent(id)}`;
  return shareToken ? `${path}?share=${encodeURIComponent(shareToken)}` : path;
}

// src/conversations/conversation-share-token.ts
var import_node_crypto2 = require("node:crypto");
function conversationShareTokenHash(token) {
  return import_node_crypto2.createHash("sha256").update(token).digest("hex");
}

// src/conversations/conversations.service.ts
class ConversationsService {
  db;
  agent;
  logger = new import_common57.Logger(ConversationsService.name);
  constructor(db, agent) {
    this.db = db;
    this.agent = agent;
  }
  async list(input, userId) {
    const recordId = this.recordId(input);
    this.logger.debug({ message: "Conversation list read", recordId });
    const rows = await this.db.agentConversation.findMany({
      where: {
        userId,
        contactId: input.contactId ?? undefined,
        companyId: input.companyId ?? undefined,
        dealId: input.dealId ?? undefined
      },
      orderBy: { lastMessageAt: "desc" },
      take: 20,
      select: {
        id: true,
        sessionId: true,
        continuationToken: true,
        streamIndex: true,
        title: true,
        messageCount: true,
        lastMessageAt: true
      }
    });
    const summaries = rows.flatMap((row) => row.sessionId ? [
      {
        ...row,
        sessionId: row.sessionId,
        lastMessageAt: row.lastMessageAt.toISOString()
      }
    ] : []);
    return summaries;
  }
  async listBuilder(userId) {
    await this.assertWorkspaceMember(userId);
    const rows = await this.db.agentConversation.findMany({
      where: { userId, kind: "BUILDER" },
      orderBy: { lastMessageAt: "desc" },
      take: 50,
      select: {
        id: true,
        sessionId: true,
        continuationToken: true,
        streamIndex: true,
        title: true,
        messageCount: true,
        lastMessageAt: true,
        lastAssistantAt: true,
        lastReadAt: true,
        agent: { select: { id: true, name: true, status: true } },
        _count: {
          select: {
            submissions: { where: { commandType: "CREATE_AGENT" } }
          }
        },
        submissions: {
          where: { status: { in: ["PENDING", "SENDING"] } },
          select: { id: true },
          take: 1
        }
      }
    });
    return rows.map((row) => {
      const unread = Boolean(row.lastAssistantAt && (!row.lastReadAt || row.lastAssistantAt > row.lastReadAt));
      const working = row.submissions.length > 0 || Boolean(row.sessionId && !row.continuationToken);
      return {
        id: row.id,
        sessionId: row.sessionId,
        continuationToken: row.continuationToken,
        streamIndex: row.streamIndex,
        title: row.title,
        messageCount: row.messageCount,
        lastMessageAt: row.lastMessageAt.toISOString(),
        lastAssistantAt: row.lastAssistantAt?.toISOString() ?? null,
        unread,
        state: row._count.submissions > 0 && row.agent?.status === "LIVE" ? "deployed" : working ? "working" : unread ? "unread" : "idle",
        agent: row.agent
      };
    });
  }
  async builderResources(q, userId) {
    await this.assertWorkspaceMember(userId);
    const search = q.trim();
    const contains = search ? { contains: search, mode: "insensitive" } : undefined;
    const [companies, contacts, deals, slackAccount] = await Promise.all([
      this.db.company.findMany({
        where: contains ? { name: contains } : undefined,
        orderBy: { lastActivityAt: { sort: "desc", nulls: "last" } },
        take: 6,
        select: { id: true, name: true, domain: true, logoUrl: true }
      }),
      this.db.contact.findMany({
        where: contains ? {
          OR: [
            { firstName: contains },
            { lastName: contains },
            { email: contains }
          ]
        } : undefined,
        orderBy: { lastActivityAt: { sort: "desc", nulls: "last" } },
        take: 6,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          imageUrl: true,
          company: { select: { name: true } }
        }
      }),
      this.db.deal.findMany({
        where: contains ? { name: contains } : undefined,
        orderBy: { lastActivityAt: { sort: "desc", nulls: "last" } },
        take: 6,
        select: {
          id: true,
          name: true,
          company: { select: { name: true, logoUrl: true } }
        }
      }),
      this.db.account.findFirst({
        where: { providerId: "slack", accessToken: { not: null } },
        select: { id: true }
      })
    ]);
    return [
      ...slackAccount && (!search || "slack".includes(search.toLowerCase())) ? [
        {
          kind: "integration",
          id: "slack:workspace",
          label: "Slack",
          detail: "Connected workspace",
          imageUrl: null
        }
      ] : [],
      ...companies.map((company) => ({
        kind: "company",
        id: company.id,
        label: company.name,
        detail: company.domain,
        imageUrl: company.logoUrl
      })),
      ...contacts.map((contact) => ({
        kind: "contact",
        id: contact.id,
        label: [contact.firstName, contact.lastName].filter(Boolean).join(" "),
        detail: contact.company?.name ?? contact.email,
        imageUrl: contact.imageUrl
      })),
      ...deals.map((deal) => ({
        kind: "deal",
        id: deal.id,
        label: deal.name,
        detail: deal.company.name,
        imageUrl: deal.company.logoUrl
      }))
    ];
  }
  async builderById(id, userId) {
    await this.assertWorkspaceMember(userId);
    const row = await this.db.agentConversation.findFirst({
      where: { id, userId, kind: "BUILDER" },
      select: {
        id: true,
        sessionId: true,
        continuationToken: true,
        pendingInputRequest: true,
        streamIndex: true,
        title: true,
        messageCount: true,
        lastMessageAt: true,
        lastAssistantAt: true,
        lastReadAt: true,
        agent: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
            createdBy: { select: { id: true, name: true } },
            currentVersion: {
              select: {
                id: true,
                number: true,
                status: true,
                manifest: true,
                modelId: true,
                sandboxPolicy: true,
                deployedAt: true
              }
            },
            triggers: {
              orderBy: { createdAt: "asc" },
              select: {
                id: true,
                type: true,
                name: true,
                config: true,
                enabled: true,
                nextRunAt: true
              }
            }
          }
        },
        createdVersions: {
          orderBy: { number: "desc" },
          take: 1,
          select: {
            id: true,
            number: true,
            status: true,
            instructions: true,
            manifest: true,
            modelId: true,
            sandboxPolicy: true,
            validation: true,
            createdAt: true
          }
        },
        builderArtifacts: {
          orderBy: [{ createdAt: "desc" }, { revision: "desc" }],
          take: 100,
          select: {
            id: true,
            versionId: true,
            path: true,
            language: true,
            content: true,
            previousContent: true,
            revision: true,
            status: true,
            createdAt: true
          }
        },
        feedback: {
          where: { userId },
          select: { messageId: true, rating: true }
        },
        submissions: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            clientRequestId: true,
            commandType: true,
            message: true,
            status: true,
            errorCode: true,
            errorMessage: true,
            createdAt: true,
            sentAt: true,
            acceptedAt: true,
            attachments: {
              orderBy: { position: "asc" },
              select: {
                id: true,
                name: true,
                mediaType: true,
                size: true
              }
            }
          }
        }
      }
    });
    if (!row) {
      throw new import_common57.NotFoundException(`No builder conversation with id ${id}.`);
    }
    const { pendingInputRequest, ...conversation } = row;
    return {
      ...conversation,
      pendingQuestion: pendingBuilderQuestionOf(pendingInputRequest),
      lastMessageAt: row.lastMessageAt.toISOString(),
      lastAssistantAt: row.lastAssistantAt?.toISOString() ?? null,
      lastReadAt: row.lastReadAt?.toISOString() ?? null,
      agent: row.agent ? {
        ...row.agent,
        currentVersion: row.agent.currentVersion ? {
          ...row.agent.currentVersion,
          deployedAt: row.agent.currentVersion.deployedAt?.toISOString() ?? null
        } : null,
        triggers: row.agent.triggers.map((trigger) => ({
          ...trigger,
          nextRunAt: trigger.nextRunAt?.toISOString() ?? null
        }))
      } : null,
      createdVersions: row.createdVersions.map((version) => ({
        ...version,
        manifest: import_agent_manifest2.readAgentManifestSummary(version.manifest),
        createdAt: version.createdAt.toISOString()
      })),
      builderArtifacts: row.builderArtifacts.map((artifact) => ({
        ...artifact,
        createdAt: artifact.createdAt.toISOString()
      })),
      submissions: row.submissions.map(({ attachments, ...submission }) => ({
        ...submission,
        message: builderMessageWithAttachments(submission.message, attachments),
        createdAt: submission.createdAt.toISOString(),
        sentAt: submission.sentAt?.toISOString() ?? null,
        acceptedAt: submission.acceptedAt?.toISOString() ?? null
      }))
    };
  }
  async createBuilder(input, userId) {
    await this.assertWorkspaceMember(userId);
    const existing = await this.requestByClientId(input.clientRequestId);
    if (existing) {
      return this.replayBuilderCreation(existing, userId);
    }
    const now = new Date;
    try {
      const conversation = await this.db.agentConversation.create({
        data: {
          kind: "BUILDER",
          userId,
          title: null,
          lastReadAt: now,
          lastMessageAt: now,
          submissions: {
            create: {
              submittedById: userId,
              clientRequestId: input.clientRequestId,
              commandType: input.commandType,
              message: this.builderMessage(input),
              attachments: {
                create: this.attachmentWrites(input.attachments)
              }
            }
          }
        },
        select: { id: true }
      });
      this.agent?.builderConversationQueued();
      return conversation;
    } catch (error) {
      if (!isUniqueConstraint(error))
        throw error;
      const winner = await this.requestByClientId(input.clientRequestId);
      if (!winner)
        throw error;
      return this.replayBuilderCreation(winner, userId);
    }
  }
  async submitBuilder(input, userId) {
    await this.assertWorkspaceMember(userId);
    const existing = await this.requestByClientId(input.clientRequestId);
    if (existing) {
      return this.replayBuilderSubmission(existing, input.id, userId);
    }
    const conversation = await this.db.agentConversation.findFirst({
      where: { id: input.id, userId, kind: "BUILDER" },
      select: { id: true }
    });
    if (!conversation) {
      throw new import_common57.NotFoundException(`No builder conversation with id ${input.id}.`);
    }
    try {
      const attachmentWrites = await this.submissionAttachmentWrites(input, userId);
      const submission = await this.db.$transaction(async (tx) => {
        const created = await tx.agentConversationSubmission.create({
          data: {
            conversationId: input.id,
            submittedById: userId,
            clientRequestId: input.clientRequestId,
            commandType: input.commandType,
            message: this.builderMessage(input),
            attachments: {
              create: attachmentWrites
            }
          },
          select: { id: true }
        });
        await tx.agentConversation.update({
          where: { id: input.id },
          data: { lastMessageAt: new Date, lastReadAt: new Date }
        });
        return created;
      });
      this.agent?.builderConversationQueued();
      return submission;
    } catch (error) {
      if (!isUniqueConstraint(error))
        throw error;
      const winner = await this.requestByClientId(input.clientRequestId);
      if (!winner)
        throw error;
      return this.replayBuilderSubmission(winner, input.id, userId);
    }
  }
  async answerBuilderQuestion(input, userId) {
    await this.assertWorkspaceMember(userId);
    const existing = await this.requestByClientId(input.clientRequestId);
    if (existing) {
      return this.replayBuilderSubmission(existing, input.id, userId);
    }
    const conversation = await this.db.agentConversation.findFirst({
      where: { id: input.id, userId, kind: "BUILDER" },
      select: {
        id: true,
        sessionId: true,
        continuationToken: true,
        pendingInputRequest: true
      }
    });
    if (!conversation) {
      throw new import_common57.NotFoundException(`No builder conversation with id ${input.id}.`);
    }
    if (!conversation.sessionId || !conversation.continuationToken) {
      throw new import_common57.BadRequestException("The agent is no longer waiting for that answer.");
    }
    const question = pendingBuilderQuestionOf(conversation.pendingInputRequest);
    if (!question) {
      throw new import_common57.BadRequestException("The agent is no longer waiting for that answer.");
    }
    if (question.requestId !== input.requestId) {
      throw new import_common57.BadRequestException("That follow-up question is no longer active.");
    }
    const options = question.options;
    const selected = input.optionId ? options.find((option) => option.id === input.optionId) : null;
    if (input.optionId && !selected) {
      throw new import_common57.BadRequestException("That answer is not available for this question.");
    }
    const acceptsText = question.allowFreeform || question.display === "text";
    if (input.text && !acceptsText) {
      throw new import_common57.BadRequestException("Choose one of the available answers for this question.");
    }
    const answer = input.optionId ?? input.text;
    if (!answer) {
      throw new import_common57.BadRequestException("Choose an answer before submitting.");
    }
    const displayText = selected?.label ?? answer;
    const inputResponse = input.optionId ? { requestId: input.requestId, optionId: input.optionId } : { requestId: input.requestId, text: input.text };
    try {
      const submission = await this.db.$transaction(async (tx) => {
        const created = await tx.agentConversationSubmission.create({
          data: {
            conversationId: input.id,
            submittedById: userId,
            clientRequestId: input.clientRequestId,
            inputRequestId: input.requestId,
            commandType: "CREATE_AGENT",
            message: {
              text: displayText,
              resources: [],
              attachments: [],
              inputResponse
            }
          },
          select: { id: true }
        });
        await tx.agentConversation.update({
          where: { id: input.id },
          data: { lastMessageAt: new Date, lastReadAt: new Date }
        });
        return created;
      });
      this.agent?.builderConversationQueued();
      return submission;
    } catch (error) {
      if (!isUniqueConstraint(error))
        throw error;
      const winner = await this.requestByClientId(input.clientRequestId);
      if (winner) {
        return this.replayBuilderSubmission(winner, input.id, userId);
      }
      const answered = await this.db.agentConversationSubmission.findFirst({
        where: {
          conversationId: input.id,
          inputRequestId: input.requestId
        },
        select: { id: true }
      });
      if (answered) {
        throw new import_common57.BadRequestException("That follow-up question has already been answered.");
      }
      throw error;
    }
  }
  async markRead(id, userId) {
    await this.assertWorkspaceMember(userId);
    const updated = await this.db.agentConversation.updateMany({
      where: { id, userId, kind: "BUILDER" },
      data: { lastReadAt: new Date }
    });
    if (updated.count === 0) {
      throw new import_common57.NotFoundException(`No builder conversation with id ${id}.`);
    }
    return { id };
  }
  async attachment(id, userId, shareToken) {
    await this.assertWorkspaceMember(userId);
    const share = shareToken?.trim();
    const row = await this.db.agentConversationAttachment.findFirst({
      where: {
        id,
        submission: {
          conversation: {
            kind: "BUILDER",
            OR: [
              { userId },
              ...share ? [
                {
                  shares: {
                    some: {
                      tokenHash: conversationShareTokenHash(share),
                      revokedAt: null,
                      OR: [
                        { expiresAt: null },
                        { expiresAt: { gt: new Date } }
                      ]
                    }
                  }
                }
              ] : []
            ]
          }
        }
      },
      select: { name: true, mediaType: true, content: true }
    });
    if (!row) {
      throw new import_common57.NotFoundException("That attachment is unavailable.");
    }
    return {
      ...row,
      previewable: isPreviewableImage(row.mediaType)
    };
  }
  async rateBuilderResponse(input, userId) {
    await this.assertWorkspaceMember(userId);
    const conversation = await this.db.agentConversation.findFirst({
      where: { id: input.id, userId, kind: "BUILDER" },
      select: { id: true }
    });
    if (!conversation) {
      throw new import_common57.NotFoundException(`No builder conversation with id ${input.id}.`);
    }
    const key = {
      conversationId_userId_messageId: {
        conversationId: input.id,
        userId,
        messageId: input.messageId
      }
    };
    if (!input.rating) {
      await this.db.agentConversationFeedback.deleteMany({
        where: key.conversationId_userId_messageId
      });
      return { id: input.messageId, rating: null };
    }
    await this.db.agentConversationFeedback.upsert({
      where: key,
      create: {
        conversationId: input.id,
        userId,
        messageId: input.messageId,
        rating: input.rating
      },
      update: { rating: input.rating }
    });
    return { id: input.messageId, rating: input.rating };
  }
  async save(input, userId) {
    const recordId = this.recordId(input);
    const updateExisting = async (existing2) => {
      if (existing2.userId !== userId || existing2.kind !== "RECORD") {
        throw new import_common57.NotFoundException(`No record conversation with session ${input.sessionId}.`);
      }
      const existingRecordId = existing2.contactId ?? existing2.companyId ?? existing2.dealId;
      if (existingRecordId !== recordId) {
        throw new import_common57.BadRequestException("A conversation cannot be moved to another CRM record.");
      }
      const updated = await this.db.agentConversation.updateMany({
        where: {
          id: existing2.id,
          kind: "RECORD",
          userId,
          contactId: input.contactId ?? null,
          companyId: input.companyId ?? null,
          dealId: input.dealId ?? null
        },
        data: {
          continuationToken: input.continuationToken ?? null,
          streamIndex: input.streamIndex ?? 0,
          messageCount: input.messageCount ?? 0,
          lastMessageAt: new Date
        }
      });
      if (updated.count !== 1) {
        throw new import_common57.NotFoundException(`No record conversation with session ${input.sessionId}.`);
      }
      return { id: existing2.id };
    };
    const existing = await this.db.agentConversation.findUnique({
      where: { sessionId: input.sessionId },
      select: {
        id: true,
        kind: true,
        userId: true,
        contactId: true,
        companyId: true,
        dealId: true
      }
    });
    let conversation;
    if (existing) {
      conversation = await updateExisting(existing);
    } else {
      try {
        conversation = await this.db.agentConversation.create({
          data: {
            sessionId: input.sessionId,
            continuationToken: input.continuationToken ?? null,
            streamIndex: input.streamIndex ?? 0,
            title: input.title?.slice(0, 120) ?? null,
            messageCount: input.messageCount ?? 0,
            userId,
            contactId: input.contactId ?? null,
            companyId: input.companyId ?? null,
            dealId: input.dealId ?? null
          },
          select: { id: true }
        });
      } catch (error) {
        if (!isUniqueConstraint(error))
          throw error;
        const winner = await this.db.agentConversation.findUnique({
          where: { sessionId: input.sessionId },
          select: {
            id: true,
            kind: true,
            userId: true,
            contactId: true,
            companyId: true,
            dealId: true
          }
        });
        if (!winner)
          throw error;
        conversation = await updateExisting(winner);
      }
    }
    return conversation;
  }
  async events(input, userId) {
    const conversation = await this.db.agentConversation.findUnique({
      where: { id: input.id },
      select: { kind: true, sessionId: true, userId: true }
    });
    if (!conversation || conversation.userId !== userId) {
      throw new import_common57.NotFoundException(`No conversation with id ${input.id}.`);
    }
    if (conversation.kind === "BUILDER") {
      await this.assertWorkspaceMember(userId);
    }
    const eventWhere = conversation.kind === "BUILDER" ? {
      OR: [
        { conversationId: input.id },
        ...conversation.sessionId ? [{ sessionId: conversation.sessionId }] : []
      ]
    } : conversation.sessionId ? { sessionId: conversation.sessionId } : { id: { in: [] } };
    const events = await this.db.agentEvent.findMany({
      where: eventWhere,
      orderBy: [{ emittedAt: "desc" }, { id: "desc" }],
      take: input.limit,
      select: { id: true, type: true, data: true, emittedAt: true }
    });
    return events.reverse().map((event) => ({
      type: event.type,
      data: event.data,
      meta: { id: event.id, at: event.emittedAt.toISOString() }
    }));
  }
  async remove(id, userId) {
    const conversation = await this.db.agentConversation.findUnique({
      where: { id },
      select: {
        id: true,
        kind: true,
        userId: true,
        sessionId: true
      }
    });
    if (!conversation || conversation.userId !== userId) {
      throw new import_common57.NotFoundException(`No conversation with id ${id}.`);
    }
    if (conversation.kind === "BUILDER") {
      await this.assertWorkspaceMember(userId);
    }
    await this.db.$transaction(async (tx) => {
      await tx.agentBuilderArtifact.deleteMany({
        where: { conversationId: id, versionId: null }
      });
      await tx.agentEvent.deleteMany({
        where: {
          OR: [
            { conversationId: id },
            ...conversation.sessionId ? [{ sessionId: conversation.sessionId }] : []
          ]
        }
      });
      await tx.agentConversation.delete({ where: { id } });
    });
    this.logger.log({ message: "Conversation removed", conversationId: id });
    return { id };
  }
  recordId(input) {
    const recordIds = [input.contactId, input.companyId, input.dealId].filter((recordId2) => Boolean(recordId2));
    const [recordId] = recordIds;
    if (!recordId || recordIds.length !== 1) {
      throw new import_common57.BadRequestException("Choose exactly one contact, company or deal.");
    }
    return recordId;
  }
  builderMessage(input) {
    return {
      text: input.message,
      resources: input.resources,
      attachments: input.attachments.map(({ name, type, size }) => ({
        name,
        type,
        size
      }))
    };
  }
  attachmentWrites(attachments) {
    return attachments.map((attachment, position) => ({
      name: attachment.name,
      mediaType: attachment.type,
      size: attachment.size,
      content: Buffer.from(attachment.contentBase64, "base64"),
      position
    }));
  }
  async submissionAttachmentWrites(input, userId) {
    const referencedIds = input.attachments.flatMap((attachment) => ("contentBase64" in attachment) ? [] : [attachment.id]);
    const referenced = referencedIds.length > 0 ? await this.db.agentConversationAttachment.findMany({
      where: {
        id: { in: referencedIds },
        submission: {
          conversation: { id: input.id, userId, kind: "BUILDER" }
        }
      },
      select: {
        id: true,
        name: true,
        mediaType: true,
        size: true,
        content: true
      }
    }) : [];
    const referencedById = new Map(referenced.map((row) => [row.id, row]));
    if (referencedIds.some((id) => !referencedById.has(id))) {
      throw new import_common57.BadRequestException("One or more attachments are no longer available.");
    }
    return input.attachments.map((attachment, position) => {
      if ("contentBase64" in attachment) {
        return {
          name: attachment.name,
          mediaType: attachment.type,
          size: attachment.size,
          content: Buffer.from(attachment.contentBase64, "base64"),
          position
        };
      }
      const stored = referencedById.get(attachment.id);
      if (!stored) {
        throw new import_common57.BadRequestException("One or more attachments are no longer available.");
      }
      return {
        name: stored.name,
        mediaType: stored.mediaType,
        size: stored.size,
        content: stored.content,
        position
      };
    });
  }
  async assertWorkspaceMember(userId) {
    const member = await this.db.member.findUnique({
      where: {
        organizationId_userId: { organizationId: import_auth22.WORKSPACE_ID, userId }
      },
      select: { id: true }
    });
    if (!member) {
      throw new import_common57.NotFoundException("No workspace membership was found.");
    }
  }
  requestByClientId(clientRequestId) {
    return this.db.agentConversationSubmission.findUnique({
      where: { clientRequestId },
      select: {
        id: true,
        conversationId: true,
        submittedById: true,
        conversation: { select: { id: true, userId: true, kind: true } }
      }
    });
  }
  replayBuilderCreation(existing, userId) {
    if (existing.conversation.userId !== userId || existing.conversation.kind !== "BUILDER") {
      throw new import_common57.BadRequestException("That request has already been used.");
    }
    return { id: existing.conversation.id };
  }
  replayBuilderSubmission(existing, conversationId, userId) {
    if (existing.conversationId !== conversationId || existing.submittedById !== userId) {
      throw new import_common57.BadRequestException("That request has already been used.");
    }
    return { id: existing.id };
  }
}
ConversationsService = __legacyDecorateClassTS([
  import_common57.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyDecorateParamTS(1, import_common57.Optional()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof AgentTriggerService === "undefined" ? Object : AgentTriggerService
  ])
], ConversationsService);
function isUniqueConstraint(cause) {
  return cause instanceof import_db19.Prisma.PrismaClientKnownRequestError && cause.code === "P2002";
}
function pendingBuilderQuestionOf(value) {
  return import_builder_question.builderQuestion.parse(value);
}

// src/conversations/conversation-attachments.controller.ts
class ConversationAttachmentsController {
  conversations;
  constructor(conversations) {
    this.conversations = conversations;
  }
  async read(id, shareToken, session, response) {
    const attachment = await this.conversations.attachment(id, session.user.id, shareToken);
    const content = Buffer.from(attachment.content);
    const disposition = attachment.previewable ? "inline" : "attachment";
    const mediaType = attachment.previewable ? attachment.mediaType : "application/octet-stream";
    response.setHeader("Cache-Control", "private, no-store");
    response.setHeader("Content-Length", content.byteLength.toString());
    response.setHeader("Content-Type", mediaType);
    response.setHeader("Content-Disposition", `${disposition}; filename*=UTF-8''${encodeHeaderValue(attachment.name)}`);
    response.setHeader("X-Content-Type-Options", "nosniff");
    return new import_common58.StreamableFile(content);
  }
}
__legacyDecorateClassTS([
  import_common58.Get(":id"),
  import_swagger4.ApiOperation({ summary: "Download a conversation attachment" }),
  import_swagger4.ApiParam({ name: "id", description: "Attachment id." }),
  import_swagger4.ApiQuery({
    name: "share",
    required: false,
    description: "Share token, for a link opened outside a session."
  }),
  import_swagger4.ApiOkResponse({ description: "The attachment's raw bytes." }),
  __legacyDecorateParamTS(0, import_common58.Param("id")),
  __legacyDecorateParamTS(1, import_common58.Query("share")),
  __legacyDecorateParamTS(2, import_nestjs_better_auth5.Session()),
  __legacyDecorateParamTS(3, import_common58.Res({ passthrough: true })),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String,
    String,
    typeof CrmSession === "undefined" ? Object : CrmSession,
    typeof Response === "undefined" ? Object : Response
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ConversationAttachmentsController.prototype, "read", null);
ConversationAttachmentsController = __legacyDecorateClassTS([
  import_swagger4.ApiTags("Conversations"),
  import_swagger4.ApiCookieAuth(import_auth23.SESSION_COOKIE_NAME),
  import_common58.Controller("api/conversations/attachments"),
  __legacyMetadataTS("design:paramtypes", [
    typeof ConversationsService === "undefined" ? Object : ConversationsService
  ])
], ConversationAttachmentsController);
function encodeHeaderValue(value) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
}

// src/conversations/conversation-sharing.service.ts
var import_node_crypto3 = require("node:crypto");
var import_auth24 = require("@crm/auth");
var import_common59 = require("@nestjs/common");
class ConversationSharingService {
  db;
  constructor(db) {
    this.db = db;
  }
  async status(conversationId, userId) {
    await this.ownedBuilder(conversationId, userId);
    const share = await this.db.agentConversationShare.findFirst({
      where: {
        conversationId,
        revokedAt: null,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date } }]
      },
      select: { createdAt: true, expiresAt: true }
    });
    return {
      enabled: share !== null,
      createdAt: share?.createdAt.toISOString() ?? null,
      expiresAt: share?.expiresAt?.toISOString() ?? null
    };
  }
  async create(conversationId, userId) {
    const token = import_node_crypto3.randomBytes(32).toString("base64url");
    const tokenHash = conversationShareTokenHash(token);
    const created = await this.db.$transaction(async (tx) => {
      if (!await this.lockOwnedBuilder(tx, conversationId, userId)) {
        return false;
      }
      await tx.agentConversationShare.updateMany({
        where: { conversationId, revokedAt: null },
        data: { revokedAt: new Date }
      });
      await tx.agentConversationShare.create({
        data: { conversationId, createdById: userId, tokenHash }
      });
      return true;
    });
    if (!created)
      this.missingBuilder(conversationId);
    return { token };
  }
  async revoke(conversationId, userId) {
    const revoked = await this.db.$transaction(async (tx) => {
      if (!await this.lockOwnedBuilder(tx, conversationId, userId)) {
        return false;
      }
      await tx.agentConversationShare.updateMany({
        where: { conversationId, revokedAt: null },
        data: { revokedAt: new Date }
      });
      return true;
    });
    if (!revoked)
      this.missingBuilder(conversationId);
    return { id: conversationId };
  }
  async resolve(token, userId) {
    await this.assertWorkspaceMember(userId);
    const share = await this.db.agentConversationShare.findFirst({
      where: {
        tokenHash: conversationShareTokenHash(token),
        revokedAt: null,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date } }],
        conversation: { kind: "BUILDER" }
      },
      select: {
        conversation: {
          select: {
            id: true,
            title: true,
            sessionId: true,
            lastMessageAt: true,
            user: { select: { name: true } },
            agent: { select: { id: true, name: true, status: true } },
            builderArtifacts: {
              orderBy: [{ createdAt: "desc" }, { revision: "desc" }],
              take: 100,
              select: {
                id: true,
                versionId: true,
                path: true,
                language: true,
                content: true,
                previousContent: true,
                revision: true,
                status: true,
                createdAt: true
              }
            },
            submissions: {
              orderBy: { createdAt: "asc" },
              select: {
                id: true,
                commandType: true,
                message: true,
                status: true,
                errorMessage: true,
                createdAt: true,
                attachments: {
                  orderBy: { position: "asc" },
                  select: {
                    id: true,
                    name: true,
                    mediaType: true,
                    size: true
                  }
                }
              }
            }
          }
        }
      }
    });
    if (!share) {
      throw new import_common59.NotFoundException("That shared conversation is unavailable.");
    }
    const { conversation } = share;
    const events = await this.db.agentEvent.findMany({
      where: {
        OR: [
          { conversationId: conversation.id },
          ...conversation.sessionId ? [{ sessionId: conversation.sessionId }] : []
        ]
      },
      orderBy: [{ emittedAt: "desc" }, { id: "desc" }],
      take: 5000,
      select: { id: true, type: true, data: true, emittedAt: true }
    });
    return {
      id: conversation.id,
      title: conversation.title,
      ownerName: conversation.user.name,
      lastMessageAt: conversation.lastMessageAt.toISOString(),
      agent: conversation.agent,
      builderArtifacts: conversation.builderArtifacts.map((artifact) => ({
        ...artifact,
        createdAt: artifact.createdAt.toISOString()
      })),
      submissions: conversation.submissions.map(({ attachments, ...submission }) => ({
        ...submission,
        message: builderMessageWithAttachments(submission.message, attachments, token),
        createdAt: submission.createdAt.toISOString()
      })),
      events: events.reverse().map((event) => ({
        type: event.type,
        data: event.data,
        meta: { id: event.id, at: event.emittedAt.toISOString() }
      }))
    };
  }
  async ownedBuilder(conversationId, userId) {
    const conversation = await this.db.agentConversation.findFirst({
      where: { id: conversationId, userId, kind: "BUILDER" },
      select: { id: true }
    });
    if (!conversation) {
      this.missingBuilder(conversationId);
    }
    return conversation;
  }
  async lockOwnedBuilder(tx, conversationId, userId) {
    const rows = await tx.$queryRaw`
			SELECT id
			FROM "agentConversation"
			WHERE id = ${conversationId}
			FOR UPDATE
		`;
    if (rows.length === 0)
      return false;
    return await tx.agentConversation.count({
      where: { id: conversationId, userId, kind: "BUILDER" }
    }) === 1;
  }
  missingBuilder(conversationId) {
    throw new import_common59.NotFoundException(`No builder conversation with id ${conversationId}.`);
  }
  async assertWorkspaceMember(userId) {
    const member = await this.db.member.findUnique({
      where: {
        organizationId_userId: { organizationId: import_auth24.WORKSPACE_ID, userId }
      },
      select: { id: true }
    });
    if (!member) {
      throw new import_common59.ForbiddenException("This conversation belongs to another team.");
    }
  }
}
ConversationSharingService = __legacyDecorateClassTS([
  import_common59.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db
  ])
], ConversationSharingService);

// src/conversations/conversations.router.ts
var import_common60 = require("@nestjs/common");
var import_nestjs_trpc10 = require("nestjs-trpc");

// src/conversations/conversations.contracts.ts
var import_db20 = require("@crm/db");
var import_zod16 = require("zod");
var agentManifestSummaryOutput2 = import_zod16.z.object({
  name: import_zod16.z.string().optional(),
  description: import_zod16.z.string().optional(),
  access: import_zod16.z.array(import_zod16.z.string()),
  triggers: import_zod16.z.array(import_zod16.z.object({ type: import_zod16.z.string().optional(), summary: import_zod16.z.string().optional() })),
  actions: import_zod16.z.array(import_zod16.z.object({ summary: import_zod16.z.string().optional() })),
  dataScope: import_zod16.z.object({ summary: import_zod16.z.string().optional() })
});
var builderQuestionOutput = import_zod16.z.object({
  kind: import_zod16.z.literal("question"),
  requestId: import_zod16.z.string(),
  prompt: import_zod16.z.string(),
  display: import_zod16.z.enum(["confirmation", "select", "text"]).optional(),
  options: import_zod16.z.array(import_zod16.z.object({
    id: import_zod16.z.string(),
    label: import_zod16.z.string(),
    description: import_zod16.z.string().optional(),
    style: import_zod16.z.enum(["danger", "default", "primary"]).optional()
  })),
  allowFreeform: import_zod16.z.boolean().optional()
}).nullable();
var recordShape = {
  contactId: import_zod16.z.string().trim().min(1).optional(),
  companyId: import_zod16.z.string().trim().min(1).optional(),
  dealId: import_zod16.z.string().trim().min(1).optional()
};
var hasExactlyOneRecord = (input) => [input.contactId, input.companyId, input.dealId].filter(Boolean).length === 1;
var recordMessage = "Choose exactly one contact, company or deal.";
var conversationListInput = import_zod16.z.object(recordShape).refine(hasExactlyOneRecord, { message: recordMessage });
var conversationSaveInput = import_zod16.z.object({
  ...recordShape,
  sessionId: import_zod16.z.string().trim().min(1),
  continuationToken: import_zod16.z.string().nullish(),
  streamIndex: import_zod16.z.number().int().min(0).optional(),
  title: import_zod16.z.string().trim().max(120).optional(),
  messageCount: import_zod16.z.number().int().min(0).optional()
}).refine(hasExactlyOneRecord, { message: recordMessage });
var conversationIdInput = import_zod16.z.object({ id: import_zod16.z.string() });
var conversationEventsInput = import_zod16.z.object({
  id: import_zod16.z.string(),
  limit: import_zod16.z.number().int().min(1).max(5000).default(2000)
});
var builderResource = import_zod16.z.object({
  kind: import_zod16.z.enum(["integration", "company", "contact", "deal"]),
  id: import_zod16.z.string().trim().min(1).max(160),
  label: import_zod16.z.string().trim().min(1).max(120),
  detail: import_zod16.z.string().trim().max(160).nullable().optional(),
  imageUrl: import_zod16.z.url().nullable().optional()
});
var builderAttachment = import_zod16.z.object({
  name: import_zod16.z.string().trim().min(1).max(180),
  type: import_zod16.z.string().trim().min(1).max(120),
  size: import_zod16.z.number().int().min(1).max(2000000),
  contentBase64: import_zod16.z.string().min(1).max(2800000).regex(/^(?:[A-Za-z\d+/]{4})*(?:[A-Za-z\d+/]{2}==|[A-Za-z\d+/]{3}=)?$/, "Attachment content must be valid base64.")
}).refine((attachment) => decodedBase64Size(attachment.contentBase64) === attachment.size, { message: "Attachment size does not match its content.", path: ["size"] });
var builderStoredAttachment = import_zod16.z.object({
  id: import_zod16.z.string().trim().min(1),
  name: import_zod16.z.string().trim().min(1).max(180),
  type: import_zod16.z.string().trim().min(1).max(120),
  size: import_zod16.z.number().int().min(1).max(2000000),
  previewUrl: import_zod16.z.string().nullable().optional()
});
var builderPromptShape = {
  clientRequestId: import_zod16.z.uuid(),
  commandType: import_zod16.z.enum(["CHAT", "CREATE_AGENT"]).default("CHAT"),
  message: import_zod16.z.string().trim().min(1).max(20000),
  resources: import_zod16.z.array(builderResource).max(20).default([])
};
var builderConversationCreateInput = import_zod16.z.object({
  ...builderPromptShape,
  attachments: import_zod16.z.array(builderAttachment).max(5).default([])
});
var builderConversationSubmitInput = import_zod16.z.object({
  ...builderPromptShape,
  id: import_zod16.z.string().min(1),
  attachments: import_zod16.z.array(import_zod16.z.union([builderAttachment, builderStoredAttachment])).max(5).default([])
});
var builderQuestionResponseInput = import_zod16.z.object({
  id: import_zod16.z.string().min(1),
  clientRequestId: import_zod16.z.uuid(),
  requestId: import_zod16.z.string().trim().min(1).max(240),
  optionId: import_zod16.z.string().trim().min(1).max(160).optional(),
  text: import_zod16.z.string().trim().min(1).max(20000).optional()
}).refine((input) => Boolean(input.optionId) !== Boolean(input.text), {
  message: "Choose one option or enter a written answer."
});
var sharedConversationInput = import_zod16.z.object({
  token: import_zod16.z.string().trim().min(32).max(256)
});
var builderResourceSearchInput = import_zod16.z.object({
  q: import_zod16.z.string().trim().max(120).default("")
});
var builderResponseRatingInput = import_zod16.z.object({
  id: import_zod16.z.string().min(1),
  messageId: import_zod16.z.string().trim().min(1).max(240),
  rating: import_zod16.z.enum(["UP", "DOWN"]).nullable()
});
function decodedBase64Size(value) {
  const padding = value.endsWith("==") ? 2 : value.endsWith("=") ? 1 : 0;
  return value.length / 4 * 3 - padding;
}
var agentDefinitionStatusOutput = import_zod16.z.enum(Object.values(import_db20.AgentDefinitionStatus));
var agentVersionStatusOutput = import_zod16.z.enum(Object.values(import_db20.AgentVersionStatus));
var agentBuilderArtifactStatusOutput = import_zod16.z.enum(Object.values(import_db20.AgentBuilderArtifactStatus));
var agentTriggerTypeOutput = import_zod16.z.enum(Object.values(import_db20.AgentTriggerType));
var agentConversationCommandTypeOutput = import_zod16.z.enum(Object.values(import_db20.AgentConversationCommandType));
var agentConversationSubmissionStatusOutput = import_zod16.z.enum(Object.values(import_db20.AgentConversationSubmissionStatus));
var agentResponseRatingOutput = import_zod16.z.enum(Object.values(import_db20.AgentResponseRating));
var conversationIdOutput = import_zod16.z.object({ id: import_zod16.z.string() });
var conversationSummaryOutput = import_zod16.z.object({
  id: import_zod16.z.string(),
  sessionId: import_zod16.z.string(),
  continuationToken: import_zod16.z.string().nullable(),
  streamIndex: import_zod16.z.number(),
  title: import_zod16.z.string().nullable(),
  messageCount: import_zod16.z.number(),
  lastMessageAt: import_zod16.z.string()
});
var conversationListOutput = import_zod16.z.array(conversationSummaryOutput);
var builderConversationAgentSummaryOutput = import_zod16.z.object({
  id: import_zod16.z.string(),
  name: import_zod16.z.string(),
  status: agentDefinitionStatusOutput
});
var builderConversationSummaryOutput = import_zod16.z.object({
  id: import_zod16.z.string(),
  sessionId: import_zod16.z.string().nullable(),
  continuationToken: import_zod16.z.string().nullable(),
  streamIndex: import_zod16.z.number(),
  title: import_zod16.z.string().nullable(),
  messageCount: import_zod16.z.number(),
  lastMessageAt: import_zod16.z.string(),
  lastAssistantAt: import_zod16.z.string().nullable(),
  unread: import_zod16.z.boolean(),
  state: import_zod16.z.enum(["working", "unread", "deployed", "idle"]),
  agent: builderConversationAgentSummaryOutput.nullable()
});
var builderListOutput = import_zod16.z.array(builderConversationSummaryOutput);
var builderResourceOutput = import_zod16.z.object({
  kind: import_zod16.z.enum(["integration", "company", "contact", "deal"]),
  id: import_zod16.z.string(),
  label: import_zod16.z.string(),
  detail: import_zod16.z.string().nullable(),
  imageUrl: import_zod16.z.string().nullable()
});
var builderResourcesOutput = import_zod16.z.array(builderResourceOutput);
var agentBuilderArtifactOutput = import_zod16.z.object({
  id: import_zod16.z.string(),
  versionId: import_zod16.z.string().nullable(),
  path: import_zod16.z.string(),
  language: import_zod16.z.string(),
  content: import_zod16.z.string(),
  previousContent: import_zod16.z.string().nullable(),
  revision: import_zod16.z.number(),
  status: agentBuilderArtifactStatusOutput,
  createdAt: import_zod16.z.string()
});
var agentTriggerSummaryOutput = import_zod16.z.object({
  id: import_zod16.z.string(),
  type: agentTriggerTypeOutput,
  name: import_zod16.z.string(),
  config: import_zod16.z.unknown(),
  enabled: import_zod16.z.boolean(),
  nextRunAt: import_zod16.z.string().nullable()
});
var agentCurrentVersionSummaryOutput = import_zod16.z.object({
  id: import_zod16.z.string(),
  number: import_zod16.z.number(),
  status: agentVersionStatusOutput,
  manifest: import_zod16.z.unknown(),
  modelId: import_zod16.z.string(),
  sandboxPolicy: import_zod16.z.unknown(),
  deployedAt: import_zod16.z.string().nullable()
});
var builderAgentDetailOutput = import_zod16.z.object({
  id: import_zod16.z.string(),
  name: import_zod16.z.string(),
  description: import_zod16.z.string().nullable(),
  status: agentDefinitionStatusOutput,
  createdBy: import_zod16.z.object({ id: import_zod16.z.string(), name: import_zod16.z.string() }),
  currentVersion: agentCurrentVersionSummaryOutput.nullable(),
  triggers: import_zod16.z.array(agentTriggerSummaryOutput)
});
var builderCreatedVersionOutput = import_zod16.z.object({
  id: import_zod16.z.string(),
  number: import_zod16.z.number(),
  status: agentVersionStatusOutput,
  instructions: import_zod16.z.string(),
  manifest: agentManifestSummaryOutput2,
  modelId: import_zod16.z.string(),
  sandboxPolicy: import_zod16.z.unknown(),
  validation: import_zod16.z.unknown().nullable(),
  createdAt: import_zod16.z.string()
});
var builderFeedbackOutput = import_zod16.z.object({
  messageId: import_zod16.z.string(),
  rating: agentResponseRatingOutput
});
var builderSubmissionOutput = import_zod16.z.object({
  id: import_zod16.z.string(),
  clientRequestId: import_zod16.z.string(),
  commandType: agentConversationCommandTypeOutput,
  message: import_zod16.z.record(import_zod16.z.string(), import_zod16.z.unknown()),
  status: agentConversationSubmissionStatusOutput,
  errorCode: import_zod16.z.string().nullable(),
  errorMessage: import_zod16.z.string().nullable(),
  createdAt: import_zod16.z.string(),
  sentAt: import_zod16.z.string().nullable(),
  acceptedAt: import_zod16.z.string().nullable()
});
var builderConversationDetailOutput = import_zod16.z.object({
  id: import_zod16.z.string(),
  sessionId: import_zod16.z.string().nullable(),
  continuationToken: import_zod16.z.string().nullable(),
  streamIndex: import_zod16.z.number(),
  title: import_zod16.z.string().nullable(),
  messageCount: import_zod16.z.number(),
  lastMessageAt: import_zod16.z.string(),
  lastAssistantAt: import_zod16.z.string().nullable(),
  lastReadAt: import_zod16.z.string().nullable(),
  pendingQuestion: builderQuestionOutput,
  agent: builderAgentDetailOutput.nullable(),
  createdVersions: import_zod16.z.array(builderCreatedVersionOutput),
  builderArtifacts: import_zod16.z.array(agentBuilderArtifactOutput),
  feedback: import_zod16.z.array(builderFeedbackOutput),
  submissions: import_zod16.z.array(builderSubmissionOutput)
});
var conversationEventOutput = import_zod16.z.object({
  type: import_zod16.z.string(),
  data: import_zod16.z.unknown(),
  meta: import_zod16.z.object({ id: import_zod16.z.string(), at: import_zod16.z.string() })
});
var conversationEventsOutput = import_zod16.z.array(conversationEventOutput);
var builderResponseRatingOutput = import_zod16.z.object({
  id: import_zod16.z.string(),
  rating: agentResponseRatingOutput.nullable()
});
var conversationShareStatusOutput = import_zod16.z.object({
  enabled: import_zod16.z.boolean(),
  createdAt: import_zod16.z.string().nullable(),
  expiresAt: import_zod16.z.string().nullable()
});
var conversationShareTokenOutput = import_zod16.z.object({ token: import_zod16.z.string() });
var sharedConversationAgentOutput = import_zod16.z.object({
  id: import_zod16.z.string(),
  name: import_zod16.z.string(),
  status: agentDefinitionStatusOutput
});
var sharedConversationSubmissionOutput = import_zod16.z.object({
  id: import_zod16.z.string(),
  commandType: agentConversationCommandTypeOutput,
  message: import_zod16.z.record(import_zod16.z.string(), import_zod16.z.unknown()),
  status: agentConversationSubmissionStatusOutput,
  errorMessage: import_zod16.z.string().nullable(),
  createdAt: import_zod16.z.string()
});
var sharedConversationOutput = import_zod16.z.object({
  id: import_zod16.z.string(),
  title: import_zod16.z.string().nullable(),
  ownerName: import_zod16.z.string(),
  lastMessageAt: import_zod16.z.string(),
  agent: sharedConversationAgentOutput.nullable(),
  builderArtifacts: import_zod16.z.array(agentBuilderArtifactOutput),
  submissions: import_zod16.z.array(sharedConversationSubmissionOutput),
  events: conversationEventsOutput
});

// src/conversations/conversations.router.ts
class ConversationsRouter {
  conversations;
  sharing;
  constructor(conversations, sharing) {
    this.conversations = conversations;
    this.sharing = sharing;
  }
  async list(ctx, input) {
    return this.conversations.list(input, ctx.user.id);
  }
  async builderList(ctx) {
    return this.conversations.listBuilder(ctx.user.id);
  }
  async builderResources(ctx, q) {
    return this.conversations.builderResources(q, ctx.user.id);
  }
  async builderById(ctx, id) {
    return this.conversations.builderById(id, ctx.user.id);
  }
  async events(ctx, input) {
    return this.conversations.events(input, ctx.user.id);
  }
  async save(ctx, input) {
    return this.conversations.save(input, ctx.user.id);
  }
  async createBuilder(ctx, input) {
    return this.conversations.createBuilder(input, ctx.user.id);
  }
  async submitBuilder(ctx, input) {
    return this.conversations.submitBuilder(input, ctx.user.id);
  }
  async answerBuilderQuestion(ctx, input) {
    return this.conversations.answerBuilderQuestion(input, ctx.user.id);
  }
  async rateBuilderResponse(ctx, input) {
    return this.conversations.rateBuilderResponse(input, ctx.user.id);
  }
  async markRead(ctx, id) {
    return this.conversations.markRead(id, ctx.user.id);
  }
  async shareStatus(ctx, id) {
    return this.sharing.status(id, ctx.user.id);
  }
  async createShare(ctx, id) {
    return this.sharing.create(id, ctx.user.id);
  }
  async revokeShare(ctx, id) {
    return this.sharing.revoke(id, ctx.user.id);
  }
  async shared(ctx, token) {
    return this.sharing.resolve(token, ctx.user.id);
  }
  async remove(ctx, id) {
    return this.conversations.remove(id, ctx.user.id);
  }
}
__legacyDecorateClassTS([
  import_nestjs_trpc10.Query({
    input: conversationListInput,
    output: conversationListOutput,
    meta: restMeta("GET", "/conversations", ["Conversations"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc10.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc10.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ConversationsRouter.prototype, "list", null);
__legacyDecorateClassTS([
  import_nestjs_trpc10.Query({
    output: builderListOutput,
    meta: restMeta("GET", "/conversations/builder", ["Conversations"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc10.Ctx()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ConversationsRouter.prototype, "builderList", null);
__legacyDecorateClassTS([
  import_nestjs_trpc10.Query({
    input: builderResourceSearchInput,
    output: builderResourcesOutput,
    meta: restMeta("GET", "/conversations/builder-resources", [
      "Conversations"
    ])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc10.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc10.Input("q")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ConversationsRouter.prototype, "builderResources", null);
__legacyDecorateClassTS([
  import_nestjs_trpc10.Query({
    input: conversationIdInput,
    output: builderConversationDetailOutput,
    meta: restMeta("GET", "/conversations/builder/{id}", ["Conversations"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc10.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc10.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ConversationsRouter.prototype, "builderById", null);
__legacyDecorateClassTS([
  import_nestjs_trpc10.Query({
    input: conversationEventsInput,
    output: conversationEventsOutput,
    meta: restMeta("GET", "/conversations/{id}/events", ["Conversations"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc10.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc10.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ConversationsRouter.prototype, "events", null);
__legacyDecorateClassTS([
  import_nestjs_trpc10.Mutation({
    input: conversationSaveInput,
    output: conversationIdOutput,
    meta: restMeta("POST", "/conversations", ["Conversations"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc10.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc10.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ConversationsRouter.prototype, "save", null);
__legacyDecorateClassTS([
  import_nestjs_trpc10.Mutation({
    input: builderConversationCreateInput,
    output: conversationIdOutput,
    meta: restMeta("POST", "/conversations/builder", ["Conversations"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc10.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc10.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ConversationsRouter.prototype, "createBuilder", null);
__legacyDecorateClassTS([
  import_nestjs_trpc10.Mutation({
    input: builderConversationSubmitInput,
    output: conversationIdOutput,
    meta: restMeta("POST", "/conversations/{id}/submit-builder", [
      "Conversations"
    ])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc10.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc10.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ConversationsRouter.prototype, "submitBuilder", null);
__legacyDecorateClassTS([
  import_nestjs_trpc10.Mutation({
    input: builderQuestionResponseInput,
    output: conversationIdOutput,
    meta: restMeta("POST", "/conversations/{id}/answer-builder-question", [
      "Conversations"
    ])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc10.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc10.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ConversationsRouter.prototype, "answerBuilderQuestion", null);
__legacyDecorateClassTS([
  import_nestjs_trpc10.Mutation({
    input: builderResponseRatingInput,
    output: builderResponseRatingOutput,
    meta: restMeta("POST", "/conversations/{id}/rate-builder-response", [
      "Conversations"
    ])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc10.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc10.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ConversationsRouter.prototype, "rateBuilderResponse", null);
__legacyDecorateClassTS([
  import_nestjs_trpc10.Mutation({
    input: conversationIdInput,
    output: conversationIdOutput,
    meta: restMeta("PATCH", "/conversations/{id}/read", ["Conversations"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc10.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc10.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ConversationsRouter.prototype, "markRead", null);
__legacyDecorateClassTS([
  import_nestjs_trpc10.Query({
    input: conversationIdInput,
    output: conversationShareStatusOutput,
    meta: restMeta("GET", "/conversations/{id}/share", ["Conversations"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc10.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc10.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ConversationsRouter.prototype, "shareStatus", null);
__legacyDecorateClassTS([
  import_nestjs_trpc10.Mutation({
    input: conversationIdInput,
    output: conversationShareTokenOutput,
    meta: restMeta("POST", "/conversations/{id}/share", ["Conversations"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc10.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc10.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ConversationsRouter.prototype, "createShare", null);
__legacyDecorateClassTS([
  import_nestjs_trpc10.Mutation({
    input: conversationIdInput,
    output: conversationIdOutput,
    meta: restMeta("DELETE", "/conversations/{id}/share", ["Conversations"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc10.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc10.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ConversationsRouter.prototype, "revokeShare", null);
__legacyDecorateClassTS([
  import_nestjs_trpc10.Query({
    input: sharedConversationInput,
    output: sharedConversationOutput,
    meta: restMeta("GET", "/conversations/shared/{token}", ["Conversations"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc10.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc10.Input("token")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ConversationsRouter.prototype, "shared", null);
__legacyDecorateClassTS([
  import_nestjs_trpc10.Mutation({
    input: conversationIdInput,
    output: conversationIdOutput,
    meta: restMeta("DELETE", "/conversations/{id}", ["Conversations"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc10.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc10.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], ConversationsRouter.prototype, "remove", null);
ConversationsRouter = __legacyDecorateClassTS([
  import_nestjs_trpc10.Router({ alias: "conversations" }),
  import_nestjs_trpc10.UseMiddlewares(AuthMiddleware),
  __legacyDecorateParamTS(0, import_common60.Inject(ConversationsService)),
  __legacyDecorateParamTS(1, import_common60.Inject(ConversationSharingService)),
  __legacyMetadataTS("design:paramtypes", [
    typeof ConversationsService === "undefined" ? Object : ConversationsService,
    typeof ConversationSharingService === "undefined" ? Object : ConversationSharingService
  ])
], ConversationsRouter);

// src/conversations/conversations.module.ts
class ConversationsModule {
}
ConversationsModule = __legacyDecorateClassTS([
  import_common61.Module({
    imports: [TrpcModule, AgentModule],
    controllers: [ConversationAttachmentsController],
    providers: [
      ConversationsService,
      ConversationSharingService,
      ConversationsRouter
    ],
    exports: [ConversationsService]
  })
], ConversationsModule);

// src/crm/crm.module.ts
var import_common63 = require("@nestjs/common");

// src/crm/enrichment-log.service.ts
var import_db21 = require("@crm/db");
var import_common62 = require("@nestjs/common");
class EnrichmentLogService {
  db;
  stamp;
  constructor(db, stamp) {
    this.db = db;
    this.stamp = stamp;
  }
  async record(event) {
    const author = await this.authorFor(event);
    if (!author)
      return null;
    const activity = await this.db.activity.create({
      data: {
        type: import_db21.ActivityType.ENRICHMENT,
        subject: event.subject,
        body: event.body ?? null,
        occurredAt: new Date,
        companyId: event.companyId ?? null,
        contactId: event.contactId ?? null,
        createdById: author,
        meta: { ...event.meta, automated: true }
      },
      select: { id: true, createdAt: true }
    });
    await this.stamp.touch({ companyId: event.companyId, contactId: event.contactId }, activity.createdAt);
    return activity.id;
  }
  async authorFor(event) {
    if (event.contactId) {
      const contact = await this.db.contact.findUnique({
        where: { id: event.contactId },
        select: { ownerId: true }
      });
      if (contact?.ownerId)
        return contact.ownerId;
    }
    if (event.companyId) {
      const company = await this.db.company.findUnique({
        where: { id: event.companyId },
        select: { ownerId: true }
      });
      if (company?.ownerId)
        return company.ownerId;
    }
    const anyUser = await this.db.user.findFirst({ select: { id: true } });
    return anyUser?.id ?? null;
  }
}
EnrichmentLogService = __legacyDecorateClassTS([
  import_common62.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof ActivityStampService === "undefined" ? Object : ActivityStampService
  ])
], EnrichmentLogService);

// src/crm/crm.module.ts
class CrmModule {
}
CrmModule = __legacyDecorateClassTS([
  import_common63.Global(),
  import_common63.Module({
    providers: [ActivityStampService, EnrichmentLogService],
    exports: [ActivityStampService, EnrichmentLogService]
  })
], CrmModule);

// src/dashboard/dashboard.module.ts
var import_common66 = require("@nestjs/common");

// src/dashboard/dashboard.router.ts
var import_common65 = require("@nestjs/common");
var import_nestjs_trpc11 = require("nestjs-trpc");

// src/dashboard/dashboard.contracts.ts
var import_db22 = require("@crm/db");
var import_activity_meta3 = require("@crm/validation/activity-meta");
var import_zod17 = require("zod");
var DASHBOARD_SCOPES = ["me", "everyone"];
var dashboardSummaryInput = import_zod17.z.object({
  scope: import_zod17.z.enum(DASHBOARD_SCOPES).default("me")
});
var stageEnum2 = import_zod17.z.enum(Object.values(import_db22.DealStage));
var ownerOutput = import_zod17.z.object({
  id: import_zod17.z.string(),
  name: import_zod17.z.string(),
  email: import_zod17.z.string(),
  image: import_zod17.z.string().nullable()
});
var companyBriefOutput = import_zod17.z.object({
  id: import_zod17.z.string(),
  name: import_zod17.z.string(),
  iconUrl: import_zod17.z.string().nullable(),
  iconDarkUrl: import_zod17.z.string().nullable(),
  iconTone: import_zod17.z.string().nullable()
});
var linkedRecordOutput = import_zod17.z.object({ id: import_zod17.z.string(), name: import_zod17.z.string() });
var monthlyTotalOutput = import_zod17.z.object({
  count: import_zod17.z.number(),
  valueCents: import_zod17.z.number()
});
var stageBucketOutput = import_zod17.z.object({
  stage: stageEnum2,
  count: import_zod17.z.number(),
  valueCents: import_zod17.z.number()
});
var trendPointOutput = import_zod17.z.object({
  month: import_zod17.z.string(),
  won: import_zod17.z.number(),
  created: import_zod17.z.number()
});
var unconvertedOutput2 = import_zod17.z.object({
  count: import_zod17.z.number(),
  currencies: import_zod17.z.array(import_zod17.z.string())
});
var biggestOpenDealOutput = import_zod17.z.object({
  id: import_zod17.z.string(),
  name: import_zod17.z.string(),
  stage: stageEnum2,
  currency: import_zod17.z.string(),
  company: companyBriefOutput,
  owner: ownerOutput,
  amountCents: import_zod17.z.number().nullable(),
  baseAmountCents: import_zod17.z.number().nullable(),
  expectedCloseDate: import_zod17.z.string().nullable(),
  stageChangedAt: import_zod17.z.string()
});
var overdueTaskOutput = import_zod17.z.object({
  id: import_zod17.z.string(),
  subject: import_zod17.z.string().nullable(),
  company: linkedRecordOutput.nullable(),
  deal: linkedRecordOutput.nullable(),
  dueAt: import_zod17.z.string().nullable()
});
var recentActivityOutput = import_zod17.z.object({
  id: import_zod17.z.string(),
  type: import_zod17.z.nativeEnum(import_db22.ActivityType),
  subject: import_zod17.z.string().nullable(),
  body: import_zod17.z.string().nullable(),
  createdBy: ownerOutput,
  company: linkedRecordOutput.nullable(),
  deal: linkedRecordOutput.nullable(),
  createdAt: import_zod17.z.string(),
  meta: import_activity_meta3.activityMeta
});
var dashboardSummaryOutput = import_zod17.z.object({
  scope: import_zod17.z.enum(DASHBOARD_SCOPES),
  reportingCurrency: import_zod17.z.string(),
  unconverted: unconvertedOutput2,
  pipeline: import_zod17.z.object({
    stages: import_zod17.z.array(stageBucketOutput),
    totalCents: import_zod17.z.number(),
    totalDeals: import_zod17.z.number()
  }),
  wonThisMonth: monthlyTotalOutput,
  wonPrevMonth: monthlyTotalOutput,
  performance: import_zod17.z.object({
    windowDays: import_zod17.z.number(),
    wins: import_zod17.z.number(),
    losses: import_zod17.z.number(),
    winRate: import_zod17.z.number().nullable(),
    avgDealCents: import_zod17.z.number().nullable(),
    avgCycleDays: import_zod17.z.number().nullable()
  }),
  trend: import_zod17.z.array(trendPointOutput),
  closingThisMonthTotal: monthlyTotalOutput,
  biggestOpen: import_zod17.z.array(biggestOpenDealOutput),
  overdueTasks: import_zod17.z.array(overdueTaskOutput),
  recentActivity: import_zod17.z.array(recentActivityOutput)
});

// src/dashboard/dashboard.service.ts
var import_db23 = require("@crm/db");
var import_deal_stage3 = require("@crm/db/deal-stage");
var import_activity_meta4 = require("@crm/validation/activity-meta");
var import_common64 = require("@nestjs/common");
var OWNER_SELECT4 = {
  id: true,
  name: true,
  email: true,
  image: true
};
var TREND_MONTHS = 6;
var RATE_WINDOW_DAYS = 90;
var DAY_MS2 = 24 * 60 * 60 * 1000;
var MONTH_LABEL = new Intl.DateTimeFormat("en-US", { month: "short" });
function monthStart(from, offset) {
  return new Date(from.getFullYear(), from.getMonth() + offset, 1);
}
function monthKey(date) {
  return date.getFullYear() * 12 + date.getMonth();
}

class DashboardService {
  db;
  conversion;
  constructor(db, conversion) {
    this.db = db;
    this.conversion = conversion;
  }
  async summary(actingUserId, input) {
    const mine = input.scope === "me";
    const owned = mine ? { ownerId: actingUserId } : {};
    const now = new Date;
    const startOfMonth = monthStart(now, 0);
    const startOfNextMonth = monthStart(now, 1);
    const startOfPrevMonth = monthStart(now, -1);
    const trendStart = monthStart(now, -(TREND_MONTHS - 1));
    const rateStart = new Date(now.getTime() - RATE_WINDOW_DAYS * DAY_MS2);
    const base = await this.conversion.reportingCurrency();
    const counted = this.conversion.countedWhere(base);
    const [
      openByStage,
      openValueByStage,
      recentDeals,
      closingThisMonthTotals,
      biggestOpen,
      overdueTasks,
      recentActivity,
      unconverted
    ] = await Promise.all([
      this.db.deal.groupBy({
        by: ["stage"],
        where: { ...owned, stage: { in: [...import_deal_stage3.OPEN_DEAL_STAGES] } },
        _count: { _all: true }
      }),
      this.db.deal.groupBy({
        by: ["stage"],
        where: {
          AND: [{ ...owned, stage: { in: [...import_deal_stage3.OPEN_DEAL_STAGES] } }, counted]
        },
        _sum: { baseAmount: true }
      }),
      this.db.deal.findMany({
        where: {
          ...owned,
          OR: [
            { createdAt: { gte: trendStart } },
            { closedAt: { gte: trendStart } }
          ]
        },
        select: {
          baseAmount: true,
          baseCurrency: true,
          stage: true,
          createdAt: true,
          closedAt: true
        }
      }),
      this.db.deal.aggregate({
        where: {
          AND: [
            {
              ...owned,
              stage: { in: [...import_deal_stage3.OPEN_DEAL_STAGES] },
              expectedCloseDate: { gte: startOfMonth, lt: startOfNextMonth }
            },
            counted
          ]
        },
        _count: { _all: true },
        _sum: { baseAmount: true }
      }),
      this.db.deal.findMany({
        where: { ...owned, stage: { in: [...import_deal_stage3.OPEN_DEAL_STAGES] } },
        orderBy: [
          { baseAmount: { sort: "desc", nulls: "last" } },
          { expectedCloseDate: "asc" }
        ],
        take: 6,
        select: {
          id: true,
          name: true,
          stage: true,
          amount: true,
          currency: true,
          baseAmount: true,
          baseCurrency: true,
          expectedCloseDate: true,
          stageChangedAt: true,
          company: {
            select: {
              id: true,
              name: true,
              iconUrl: true,
              iconDarkUrl: true,
              iconTone: true
            }
          },
          owner: { select: OWNER_SELECT4 }
        }
      }),
      this.db.activity.findMany({
        where: {
          type: import_db23.ActivityType.TASK,
          completedAt: null,
          dueAt: { lt: now },
          createdById: actingUserId
        },
        orderBy: [{ dueAt: "asc" }],
        take: 10,
        select: {
          id: true,
          subject: true,
          dueAt: true,
          company: { select: { id: true, name: true } },
          deal: { select: { id: true, name: true } }
        }
      }),
      this.db.activity.findMany({
        where: mine ? { createdById: actingUserId } : {},
        orderBy: [{ createdAt: "desc" }],
        take: 12,
        select: {
          id: true,
          type: true,
          subject: true,
          body: true,
          createdAt: true,
          meta: true,
          createdBy: { select: OWNER_SELECT4 },
          company: { select: { id: true, name: true } },
          deal: { select: { id: true, name: true } }
        }
      }),
      this.conversion.unconverted(owned)
    ]);
    const stages = import_deal_stage3.OPEN_DEAL_STAGES.map((stage) => {
      const group = openByStage.find((row) => row.stage === stage);
      const value = openValueByStage.find((row) => row.stage === stage);
      return {
        stage,
        count: group?._count._all ?? 0,
        valueCents: toCents(value?._sum.baseAmount ?? null) ?? 0
      };
    });
    const firstBucket = monthKey(trendStart);
    const trend = Array.from({ length: TREND_MONTHS }, (_, index) => ({
      month: MONTH_LABEL.format(monthStart(trendStart, index)),
      won: 0,
      created: 0
    }));
    const wonThisMonth = { count: 0, valueCents: 0 };
    const wonPrevMonth = { count: 0, valueCents: 0 };
    let wins = 0;
    let losses = 0;
    let valuedWins = 0;
    let wonCents = 0;
    let cycleDays = 0;
    for (const deal of recentDeals) {
      const valued = deal.baseCurrency === base ? toCents(deal.baseAmount) : null;
      const cents = valued ?? 0;
      const created = trend[monthKey(deal.createdAt) - firstBucket];
      if (created)
        created.created += cents;
      const { closedAt, stage } = deal;
      if (!closedAt)
        continue;
      const won = stage === import_db23.DealStage.CLOSED_WON;
      if (won) {
        const closed = trend[monthKey(closedAt) - firstBucket];
        if (closed)
          closed.won += cents;
        if (closedAt >= startOfMonth && closedAt < startOfNextMonth) {
          wonThisMonth.count += 1;
          wonThisMonth.valueCents += cents;
        } else if (closedAt >= startOfPrevMonth && closedAt < startOfMonth) {
          wonPrevMonth.count += 1;
          wonPrevMonth.valueCents += cents;
        }
      }
      if (closedAt < rateStart)
        continue;
      if (won) {
        wins += 1;
        if (valued !== null) {
          valuedWins += 1;
          wonCents += cents;
        }
        cycleDays += (closedAt.getTime() - deal.createdAt.getTime()) / DAY_MS2;
      } else if (stage === import_db23.DealStage.CLOSED_LOST) {
        losses += 1;
      }
    }
    const decided = wins + losses;
    return {
      scope: input.scope,
      reportingCurrency: base,
      unconverted,
      pipeline: {
        stages,
        totalCents: stages.reduce((total, s) => total + s.valueCents, 0),
        totalDeals: stages.reduce((total, s) => total + s.count, 0)
      },
      wonThisMonth,
      wonPrevMonth,
      performance: {
        windowDays: RATE_WINDOW_DAYS,
        wins,
        losses,
        winRate: decided === 0 ? null : wins / decided,
        avgDealCents: valuedWins === 0 ? null : Math.round(wonCents / valuedWins),
        avgCycleDays: wins === 0 ? null : Math.round(cycleDays / wins)
      },
      trend,
      closingThisMonthTotal: {
        count: closingThisMonthTotals._count._all,
        valueCents: toCents(closingThisMonthTotals._sum.baseAmount) ?? 0
      },
      biggestOpen: biggestOpen.map(({
        amount,
        baseAmount,
        baseCurrency,
        expectedCloseDate,
        stageChangedAt,
        ...deal
      }) => ({
        ...deal,
        amountCents: toCents(amount),
        baseAmountCents: baseCurrency === base ? toCents(baseAmount) : null,
        expectedCloseDate: expectedCloseDate?.toISOString() ?? null,
        stageChangedAt: stageChangedAt.toISOString()
      })).sort((a, b) => (b.baseAmountCents ?? -1) - (a.baseAmountCents ?? -1)),
      overdueTasks: overdueTasks.map(({ dueAt, ...task }) => ({
        ...task,
        dueAt: dueAt?.toISOString() ?? null
      })),
      recentActivity: recentActivity.map(({ createdAt, meta, ...entry }) => ({
        ...entry,
        createdAt: createdAt.toISOString(),
        meta: import_activity_meta4.activityMeta.parse(meta)
      }))
    };
  }
}
DashboardService = __legacyDecorateClassTS([
  import_common64.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof ConversionService === "undefined" ? Object : ConversionService
  ])
], DashboardService);

// src/dashboard/dashboard.router.ts
class DashboardRouter {
  dashboard;
  constructor(dashboard) {
    this.dashboard = dashboard;
  }
  async summary(ctx, input) {
    return this.dashboard.summary(ctx.user.id, input);
  }
}
__legacyDecorateClassTS([
  import_nestjs_trpc11.Query({
    input: dashboardSummaryInput,
    output: dashboardSummaryOutput,
    meta: restMeta("GET", "/dashboard/summary", ["Dashboard"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc11.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc11.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], DashboardRouter.prototype, "summary", null);
DashboardRouter = __legacyDecorateClassTS([
  import_nestjs_trpc11.Router({ alias: "dashboard" }),
  import_nestjs_trpc11.UseMiddlewares(AuthMiddleware),
  __legacyDecorateParamTS(0, import_common65.Inject(DashboardService)),
  __legacyMetadataTS("design:paramtypes", [
    typeof DashboardService === "undefined" ? Object : DashboardService
  ])
], DashboardRouter);

// src/dashboard/dashboard.module.ts
class DashboardModule {
}
DashboardModule = __legacyDecorateClassTS([
  import_common66.Module({
    imports: [TrpcModule, CurrencyModule],
    providers: [DashboardService, DashboardRouter]
  })
], DashboardModule);

// src/database/database.module.ts
var import_db24 = require("@crm/db");
var import_common67 = require("@nestjs/common");
class DatabaseModule {
  db;
  logger = new import_common67.Logger(DatabaseModule.name);
  constructor(db2) {
    this.db = db2;
  }
  async onModuleInit() {
    try {
      await this.db.$connect();
      this.logger.log({ message: "Database connected" });
    } catch (error) {
      this.logger.fatal({ message: "Database connection failed" }, error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }
  async onApplicationShutdown(signal) {
    await this.db.$disconnect();
    this.logger.log({ message: "Database disconnected", signal });
  }
}
DatabaseModule = __legacyDecorateClassTS([
  import_common67.Global(),
  import_common67.Module({
    providers: [{ provide: DATABASE, useValue: import_db24.db }],
    exports: [DATABASE]
  }),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db
  ])
], DatabaseModule);

// src/enrichment/enrichment.module.ts
var import_common70 = require("@nestjs/common");

// src/enrichment/enrichment.router.ts
var import_enrichment_queue2 = require("@crm/validation/enrichment-queue");
var import_common69 = require("@nestjs/common");
var import_nestjs_trpc12 = require("nestjs-trpc");
var import_zod18 = require("zod");

// src/enrichment/enrichment.service.ts
var import_enrichment_queue = require("@crm/validation/enrichment-queue");
var import_common68 = require("@nestjs/common");

// src/enrichment/enrichment-copy.ts
var import_agent_tasks3 = require("@crm/db/agent-tasks");
var STEPS = {
  brand: "Fetching the logo",
  portrait: "Finding their photo",
  "meeting-prep": "Getting ready for your meeting",
  identify: "Reading their profile",
  profile: "Reading their profile",
  recheck: "Checking for anything new",
  "company-profile": "Reading the company website",
  "workspace-profile": "Reading your own website",
  "field-backfill": "Filling in the blank details",
  "slack-people-match": "Matching people in Slack",
  "slack-channel-join": "Joining a Slack channel",
  "agent-event": "Reacting to a change"
};
var STEP_BY_KIND = new Map(Object.entries(STEPS));
var UNKNOWN_STEP = "Looking them up";
var WAITING = "Waiting";
var GAVE_UP = "Could not look this up";
var SECOND_MS2 = 1000;
var DAY_MS3 = 24 * 60 * 60 * SECOND_MS2;
var DAYS_IN_WEEK = 7;
var DAYS_IN_MONTH = 30;
var WEEKS_FROM = 14;
var MONTHS_FROM = 60;
var TODAY = "Later today";
var TOMORROW = "Tomorrow";
function enrichmentStep(kind) {
  return STEP_BY_KIND.get(kind) ?? UNKNOWN_STEP;
}
function enrichmentQueueState(attempts, leasedUntil, now) {
  if (leasedUntil !== null && leasedUntil.getTime() > now.getTime()) {
    return "running";
  }
  return attempts >= import_agent_tasks3.MAX_ATTEMPTS ? "failed" : "queued";
}
function enrichmentQueueLine(state, kind) {
  if (state === "queued")
    return WAITING;
  if (state === "failed")
    return GAVE_UP;
  return enrichmentStep(kind);
}
function enrichmentDueLabel(dueAt, now) {
  const ahead = dueAt.getTime() - now.getTime();
  if (ahead < DAY_MS3)
    return TODAY;
  const days = Math.floor(ahead / DAY_MS3);
  if (days === 1)
    return TOMORROW;
  if (days < WEEKS_FROM)
    return `In ${days} days`;
  if (days < MONTHS_FROM)
    return `In ${Math.round(days / DAYS_IN_WEEK)} weeks`;
  return `In ${Math.round(days / DAYS_IN_MONTH)} months`;
}

// src/enrichment/enrichment.service.ts
var TASK_SELECT = {
  id: true,
  contactId: true,
  companyId: true,
  kind: true,
  attempts: true,
  leasedUntil: true,
  startedAt: true,
  dueAt: true
};

class EnrichmentService {
  db;
  constructor(db2) {
    this.db = db2;
  }
  async queue(limit = import_enrichment_queue.ENRICHMENT_PAGE) {
    const take = import_enrichment_queue.pageSize(limit);
    const now = new Date;
    const named = {
      finishedAt: null,
      OR: [{ contactId: { not: null } }, { companyId: { not: null } }]
    };
    const dueWhere = {
      ...named,
      dueAt: { lte: now }
    };
    const scheduledWhere = {
      ...named,
      dueAt: { gt: now }
    };
    const [tasks, total, booked, scheduledTotal] = await Promise.all([
      this.db.agentTask.findMany({
        where: dueWhere,
        orderBy: [{ priority: "desc" }, { dueAt: "asc" }],
        take,
        select: TASK_SELECT
      }),
      this.db.agentTask.count({ where: dueWhere }),
      this.db.agentTask.findMany({
        where: scheduledWhere,
        orderBy: [{ dueAt: "asc" }],
        take,
        select: TASK_SELECT
      }),
      this.db.agentTask.count({ where: scheduledWhere })
    ]);
    const everyTask = [...tasks, ...booked];
    const contactIds = unique(everyTask.map((task) => task.contactId));
    const companyIds = unique(everyTask.map((task) => task.companyId));
    const [contacts, companies] = await Promise.all([
      contactIds.length === 0 ? [] : this.db.contact.findMany({
        where: { id: { in: contactIds } },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          imageUrl: true
        }
      }),
      companyIds.length === 0 ? [] : this.db.company.findMany({
        where: { id: { in: companyIds } },
        select: {
          id: true,
          name: true,
          iconUrl: true,
          logoUrl: true,
          iconDarkUrl: true,
          logoDarkUrl: true,
          iconTone: true
        }
      })
    ]);
    const contactById = new Map(contacts.map((contact) => [
      contact.id,
      {
        kind: "contact",
        id: contact.id,
        name: [contact.firstName, contact.lastName].filter(Boolean).join(" ") || contact.email || "Unnamed contact",
        email: contact.email,
        imageUrl: contact.imageUrl
      }
    ]));
    const companyById = new Map(companies.map((company) => [
      company.id,
      {
        kind: "company",
        id: company.id,
        name: company.name,
        logoUrl: company.iconUrl ?? company.logoUrl,
        logoDarkUrl: company.iconDarkUrl ?? company.logoDarkUrl,
        logoTone: company.iconTone
      }
    ]));
    const subjectOf = (task) => task.contactId ? contactById.get(task.contactId) : task.companyId ? companyById.get(task.companyId) : undefined;
    const rows = [];
    for (const task of tasks) {
      const subject = subjectOf(task);
      if (!subject)
        continue;
      const state = enrichmentQueueState(task.attempts, task.leasedUntil, now);
      rows.push({
        id: task.id,
        state,
        line: enrichmentQueueLine(state, task.kind),
        startedAt: task.startedAt?.toISOString() ?? null,
        subject
      });
    }
    const scheduled = [];
    for (const task of booked) {
      const subject = subjectOf(task);
      if (!subject)
        continue;
      scheduled.push({
        id: task.id,
        due: enrichmentDueLabel(task.dueAt, now),
        subject
      });
    }
    return { rows, total, scheduled, scheduledTotal };
  }
}
EnrichmentService = __legacyDecorateClassTS([
  import_common68.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db
  ])
], EnrichmentService);
function unique(ids) {
  return [...new Set(ids.filter((id) => id !== null))];
}

// src/enrichment/enrichment.router.ts
var enrichmentContactSubjectOutput = import_zod18.z.object({
  kind: import_zod18.z.literal("contact"),
  id: import_zod18.z.string(),
  name: import_zod18.z.string(),
  email: import_zod18.z.string().nullable(),
  imageUrl: import_zod18.z.string().nullable()
});
var enrichmentCompanySubjectOutput = import_zod18.z.object({
  kind: import_zod18.z.literal("company"),
  id: import_zod18.z.string(),
  name: import_zod18.z.string(),
  logoUrl: import_zod18.z.string().nullable(),
  logoDarkUrl: import_zod18.z.string().nullable(),
  logoTone: import_zod18.z.string().nullable()
});
var enrichmentQueueSubjectOutput = import_zod18.z.discriminatedUnion("kind", [
  enrichmentContactSubjectOutput,
  enrichmentCompanySubjectOutput
]);
var enrichmentQueueRowOutput = import_zod18.z.object({
  id: import_zod18.z.string(),
  state: import_zod18.z.enum(["running", "queued", "failed"]),
  line: import_zod18.z.string(),
  startedAt: import_zod18.z.string().nullable(),
  subject: enrichmentQueueSubjectOutput
});
var enrichmentScheduledRowOutput = import_zod18.z.object({
  id: import_zod18.z.string(),
  due: import_zod18.z.string(),
  subject: enrichmentQueueSubjectOutput
});
var enrichmentQueueOutput = import_zod18.z.object({
  rows: import_zod18.z.array(enrichmentQueueRowOutput),
  total: import_zod18.z.number(),
  scheduled: import_zod18.z.array(enrichmentScheduledRowOutput),
  scheduledTotal: import_zod18.z.number()
});

class EnrichmentRouter {
  enrichment;
  constructor(enrichment) {
    this.enrichment = enrichment;
  }
  async queue(input) {
    return this.enrichment.queue(input.limit);
  }
}
__legacyDecorateClassTS([
  import_nestjs_trpc12.Query({
    input: import_enrichment_queue2.enrichmentQueueInput,
    output: enrichmentQueueOutput,
    meta: restMeta("GET", "/enrichment/queue", ["Enrichment"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc12.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof import_zod18.z === "undefined" || typeof import_zod18.z.infer === "undefined" ? Object : import_zod18.z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], EnrichmentRouter.prototype, "queue", null);
EnrichmentRouter = __legacyDecorateClassTS([
  import_nestjs_trpc12.Router({ alias: "enrichment" }),
  import_nestjs_trpc12.UseMiddlewares(AuthMiddleware),
  __legacyDecorateParamTS(0, import_common69.Inject(EnrichmentService)),
  __legacyMetadataTS("design:paramtypes", [
    typeof EnrichmentService === "undefined" ? Object : EnrichmentService
  ])
], EnrichmentRouter);

// src/enrichment/enrichment.module.ts
class EnrichmentModule {
}
EnrichmentModule = __legacyDecorateClassTS([
  import_common70.Module({
    imports: [TrpcModule],
    providers: [EnrichmentService, EnrichmentRouter]
  })
], EnrichmentModule);

// src/google/google.module.ts
var import_common85 = require("@nestjs/common");

// src/mailbox/mailbox.module.ts
var import_common76 = require("@nestjs/common");

// src/mailbox/mailbox-api.client.ts
var import_common71 = require("@nestjs/common");
var DEFAULT_TIMEOUT_MS = 20000;
var MIN_BACKOFF_MS = 30000;
var MAX_BACKOFF_MS = 15 * 60000;

class MailboxApiClient {
  logger = new import_common71.Logger(MailboxApiClient.name);
  async get(url, accessToken, params = {}) {
    const target = new URL(url);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined)
        target.searchParams.set(key, String(value));
    }
    const controller = new AbortController;
    const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
    try {
      const response = await fetch(target, {
        headers: { authorization: `Bearer ${accessToken}` },
        signal: controller.signal
      });
      return await this.interpret(response, target.pathname);
    } catch (error) {
      const aborted = error instanceof Error && error.name === "AbortError";
      return {
        outcome: "failed",
        reason: aborted ? `Timed out after ${DEFAULT_TIMEOUT_MS}ms.` : error instanceof Error ? error.message : String(error),
        retryable: true
      };
    } finally {
      clearTimeout(timeout);
    }
  }
  async interpret(response, path) {
    if (response.ok) {
      return { outcome: "ok", data: await response.json() };
    }
    const detail = await this.reason(response);
    switch (response.status) {
      case 401:
        return { outcome: "unauthorized", reason: detail };
      case 404:
      case 410:
        return { outcome: "cursor-invalid", reason: detail };
      case 403:
        if (/rate|quota|userRateLimitExceeded|limitExceeded/i.test(detail)) {
          return {
            outcome: "rate-limited",
            reason: detail,
            retryAfterMs: this.backoffFrom(response)
          };
        }
        return { outcome: "failed", reason: detail, retryable: false };
      case 429:
        return {
          outcome: "rate-limited",
          reason: detail,
          retryAfterMs: this.backoffFrom(response)
        };
      default: {
        const retryable = response.status >= 500;
        this.logger.warn({
          message: "Mailbox API call failed",
          path,
          status: response.status,
          retryable
        });
        return { outcome: "failed", reason: detail, retryable };
      }
    }
  }
  backoffFrom(response) {
    const header = response.headers.get("retry-after");
    const seconds = header ? Number(header) : Number.NaN;
    const suggested = Number.isFinite(seconds) ? seconds * 1000 : MIN_BACKOFF_MS;
    return Math.min(Math.max(suggested, MIN_BACKOFF_MS), MAX_BACKOFF_MS);
  }
  async reason(response) {
    try {
      const body = await response.json();
      return body.error?.message ?? body.error?.status ?? body.error?.code ?? `HTTP ${response.status}`;
    } catch {
      return `HTTP ${response.status}`;
    }
  }
}
MailboxApiClient = __legacyDecorateClassTS([
  import_common71.Injectable()
], MailboxApiClient);

// src/mailbox/mailbox-match.service.ts
var import_workspace2 = require("@crm/auth/workspace");
var import_idempotency4 = require("@crm/db/idempotency");
var import_common72 = require("@nestjs/common");

// src/mailbox/participants.ts
var AUTOMATED_LOCAL_PARTS = [
  "noreply",
  "no-reply",
  "donotreply",
  "do-not-reply",
  "notifications",
  "notification",
  "mailer-daemon",
  "postmaster",
  "bounce",
  "bounces",
  "auto-confirm",
  "automated",
  "calendar-invite",
  "calendar",
  "invite",
  "invites",
  "invitations",
  "meetings",
  "scheduling",
  "booking",
  "bookings",
  "reply",
  "support",
  "help",
  "hello",
  "info",
  "contact",
  "sales",
  "billing",
  "accounts",
  "team"
];
function parseAddress(input) {
  const trimmed = input.trim();
  if (!trimmed)
    return null;
  const angled = trimmed.match(/^(.*)<([^<>]+)>\s*$/);
  const rawEmail = (angled?.[2] ?? trimmed).trim().toLowerCase();
  if (!isEmailish(rawEmail))
    return null;
  const rawName = angled?.[1]?.trim() ?? "";
  const name = rawName.replace(/^"(.*)"$/, "$1").trim();
  return { email: rawEmail, name: name || null };
}
function parseAddressList(header) {
  if (!header)
    return [];
  const parts = [];
  let current = "";
  let inQuotes = false;
  let inAngles = false;
  for (const char of header) {
    if (char === '"')
      inQuotes = !inQuotes;
    if (char === "<")
      inAngles = true;
    if (char === ">")
      inAngles = false;
    if (char === "," && !inQuotes && !inAngles) {
      parts.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  parts.push(current);
  const seen = new Set;
  const participants = [];
  for (const part of parts) {
    const parsed = parseAddress(part);
    if (!parsed || seen.has(parsed.email))
      continue;
    seen.add(parsed.email);
    participants.push(parsed);
  }
  return participants;
}
function isAutomatedAddress(email) {
  const local = email.split("@")[0]?.toLowerCase() ?? "";
  if (!local)
    return true;
  return AUTOMATED_LOCAL_PARTS.some((pattern) => local === pattern || local.startsWith(`${pattern}-`) || local.startsWith(`${pattern}+`) || local.startsWith(`${pattern}_`));
}
var OPAQUE_LOCAL_PARTS = [
  /^(c_)?[0-9a-f]{24,}$/,
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
];
function isMachineAddress(email) {
  const at = email.lastIndexOf("@");
  if (at < 1)
    return true;
  if (isMachineDomain(email.slice(at + 1)))
    return true;
  const local = email.slice(0, at).toLowerCase();
  return OPAQUE_LOCAL_PARTS.some((pattern) => pattern.test(local));
}
function isDerivedName(email, firstName, lastName) {
  const derived = splitName(null, email);
  return derived.firstName === firstName && (derived.lastName ?? null) === lastName;
}
function workDomain(email) {
  return domainFromEmail(email);
}
function externalParticipants(participants, options) {
  return participants.filter((participant) => {
    if (options.ourAddresses.has(participant.email))
      return false;
    if (options.suppressedEmails.has(participant.email))
      return false;
    if (isMachineAddress(participant.email))
      return false;
    const domain = workDomain(participant.email);
    if (!domain)
      return false;
    if (options.ourDomains.has(domain))
      return false;
    if (options.suppressedDomains.has(domain))
      return false;
    if (isAutomatedAddress(participant.email))
      return false;
    return true;
  });
}
function dominantDomain(participants, preferKnown = new Set) {
  const counts = new Map;
  for (const participant of participants) {
    const domain = workDomain(participant.email);
    if (!domain)
      continue;
    counts.set(domain, (counts.get(domain) ?? 0) + 1);
  }
  if (counts.size === 0)
    return null;
  let best = null;
  let bestScore = -1;
  for (const [domain, count] of counts) {
    const score = count * 2 + (preferKnown.has(domain) ? 1 : 0);
    if (score > bestScore) {
      best = domain;
      bestScore = score;
    }
  }
  return best;
}
function splitName(name, email) {
  const cleaned = name?.trim().replace(/\s+/g, " ") ?? "";
  if (cleaned && !cleaned.includes("@")) {
    const comma = cleaned.match(/^([^,]+),\s*(.+)$/);
    if (comma?.[1] && comma[2]) {
      return { firstName: comma[2].trim(), lastName: comma[1].trim() };
    }
    const [first, ...rest] = cleaned.split(" ");
    if (first) {
      return {
        firstName: first,
        lastName: rest.length > 0 ? rest.join(" ") : null
      };
    }
  }
  const local = email.split("@")[0] ?? email;
  const words = local.split(/[._-]+/).filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  if (words.length === 0)
    return { firstName: email, lastName: null };
  return {
    firstName: words[0],
    lastName: words.length > 1 ? words.slice(1).join(" ") : null
  };
}
function isEmailish(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// src/mailbox/mailbox-match.service.ts
class MailboxMatchService {
  db;
  companies;
  agent;
  log;
  logger = new import_common72.Logger(MailboxMatchService.name);
  constructor(db2, companies, agent, log) {
    this.db = db2;
    this.companies = companies;
    this.agent = agent;
    this.log = log;
  }
  async internalIdentity() {
    const users = await this.db.user.findMany({ select: { email: true } });
    const addresses = new Set;
    const domains = new Set(import_workspace2.workspaceDomains());
    for (const user of users) {
      const email = user.email.toLowerCase();
      addresses.add(email);
      const domain = workDomain(email);
      if (domain)
        domains.add(domain);
    }
    return { addresses, domains };
  }
  async suppressedDomains() {
    const rows = await this.db.suppressedDomain.findMany({
      select: { domain: true }
    });
    return new Set(rows.map((row) => row.domain));
  }
  async suppressedEmails() {
    const rows = await this.db.suppressedContact.findMany({
      select: { email: true }
    });
    return new Set(rows.map((row) => row.email.toLowerCase()));
  }
  async resolve(request, context) {
    const external = externalParticipants(request.participants, {
      ourDomains: context.ourDomains,
      ourAddresses: context.ourAddresses,
      suppressedDomains: context.suppressedDomains,
      suppressedEmails: context.suppressedEmails
    });
    if (external.length === 0) {
      return { companyId: null, contactId: null, external };
    }
    const contact = await this.db.contact.findFirst({
      where: { email: { in: external.map((person) => person.email) } },
      select: { id: true, companyId: true }
    });
    if (contact) {
      return {
        companyId: contact.companyId,
        contactId: contact.id,
        external
      };
    }
    const domains = [
      ...new Set(external.map((person) => workDomain(person.email)).filter((domain2) => domain2 !== null))
    ];
    const known = await this.db.company.findMany({
      where: { domain: { in: domains } },
      select: { id: true, domain: true }
    });
    const knownDomains = new Set(known.map((company) => company.domain).filter((domain2) => domain2 !== null));
    const domain = dominantDomain(external, knownDomains);
    if (!domain)
      return { companyId: null, contactId: null, external };
    const existing = known.find((company) => company.domain === domain);
    if (existing) {
      return {
        companyId: existing.id,
        contactId: request.allowCreate ? await this.createContact(external, domain, existing.id, request) : null,
        external
      };
    }
    if (!request.allowCreate) {
      return { companyId: null, contactId: null, external };
    }
    return this.create(external, domain, request);
  }
  async create(external, domain, request) {
    const lead = external.find((person) => workDomain(person.email) === domain) ?? external[0];
    if (!lead)
      return { companyId: null, contactId: null, external };
    const companyId = await this.companies.companyForEmail(lead.email, {
      ownerId: request.ownerId
    });
    if (!companyId) {
      return { companyId: null, contactId: null, external };
    }
    await this.db.company.update({
      where: { id: companyId },
      data: { source: request.source }
    });
    const contactId = await this.createContact(external, domain, companyId, request);
    await this.log.record({
      companyId,
      subject: "Company added from your inbox",
      body: `Created because you ${request.source === "CALENDAR" ? "met" : "emailed"} ` + `someone at ${domain}.`,
      meta: { source: request.source, domain }
    });
    this.logger.log({
      message: "Company auto-created from mailbox sync",
      companyId,
      domain,
      source: request.source
    });
    return { companyId, contactId, external };
  }
  async createContact(external, domain, companyId, request) {
    const person = external.find((candidate) => workDomain(candidate.email) === domain);
    if (!person)
      return null;
    const { firstName, lastName } = splitName(person.name, person.email);
    const outcome = await this.agent.withCrmEvents(async (tx, emit) => {
      await import_idempotency4.lockIdempotencyKey(tx, `mailbox-contact:${person.email}`);
      const existing = await tx.contact.findUnique({
        where: { email: person.email },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          companyId: true,
          createdAt: true
        }
      });
      if (existing)
        return { contact: existing, created: false };
      const contact2 = await tx.contact.create({
        data: {
          firstName,
          lastName,
          email: person.email,
          companyId,
          source: request.source,
          ownerId: request.ownerId
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          companyId: true,
          createdAt: true
        }
      });
      await emit({
        type: "contact.created",
        record: { kind: "contact", id: contact2.id },
        occurredAt: contact2.createdAt,
        data: {
          firstName: contact2.firstName,
          lastName: contact2.lastName,
          email: contact2.email,
          companyId: contact2.companyId,
          source: request.source
        }
      });
      return { contact: contact2, created: true };
    });
    const { contact } = outcome;
    if (outcome.created) {
      await this.log.record({
        contactId: contact.id,
        companyId,
        subject: "Contact added from your inbox",
        body: `${person.email} appeared in a ${request.source === "CALENDAR" ? "meeting" : "thread"}.`,
        meta: { source: request.source }
      });
    }
    const hasRealName = Boolean(person.name?.trim());
    const isPlaceholder = isDerivedName(person.email, contact.firstName, contact.lastName);
    if (hasRealName && isPlaceholder) {
      await this.db.contact.update({
        where: { id: contact.id },
        data: { firstName, lastName }
      });
      return contact.id;
    }
    if (isPlaceholder && !hasRealName) {
      await this.agent.contactCreated(contact.id, "Created by the sync from an address, with no name on it");
    }
    return contact.id;
  }
}
MailboxMatchService = __legacyDecorateClassTS([
  import_common72.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof CompanyDirectoryService === "undefined" ? Object : CompanyDirectoryService,
    typeof AgentTriggerService === "undefined" ? Object : AgentTriggerService,
    typeof EnrichmentLogService === "undefined" ? Object : EnrichmentLogService
  ])
], MailboxMatchService);

// src/mailbox/mailbox-token.service.ts
var import_auth30 = require("@crm/auth");
var import_common73 = require("@nestjs/common");

// src/mailbox/mailbox.constants.ts
var import_auth28 = require("@crm/auth");
var import_auth29 = require("@crm/auth");
var GOOGLE_SYNC_SOURCES = ["calendar", "gmail"];
var MICROSOFT_SYNC_SOURCES = ["outlook"];
function isGoogleSyncSource(source) {
  return GOOGLE_SYNC_SOURCES.includes(source);
}
function isMicrosoftSyncSource(source) {
  return MICROSOFT_SYNC_SOURCES.includes(source);
}
var SCOPE_FOR_SOURCE = {
  calendar: import_auth28.CALENDAR_SCOPE,
  gmail: import_auth28.GMAIL_SCOPE,
  outlook: import_auth28.OUTLOOK_MAIL_SCOPE
};
var PROVIDER_FOR_SOURCE = {
  calendar: import_auth28.GOOGLE_PROVIDER_ID,
  gmail: import_auth28.GOOGLE_PROVIDER_ID,
  outlook: import_auth28.MICROSOFT_PROVIDER_ID
};

// src/mailbox/mailbox-token.service.ts
var GOOGLE_REVOKE_URL = "https://oauth2.googleapis.com/revoke";

class MailboxTokenService {
  db;
  logger = new import_common73.Logger(MailboxTokenService.name);
  constructor(db2) {
    this.db = db2;
  }
  async grantedScopes(userId, providerId) {
    const account = await this.db.account.findFirst({
      where: { userId, providerId },
      select: { scope: true }
    });
    return import_auth30.parseScopes(account?.scope);
  }
  async isConnected(userId, source) {
    const scopes = await this.grantedScopes(userId, PROVIDER_FOR_SOURCE[source]);
    return scopes.has(SCOPE_FOR_SOURCE[source]);
  }
  async signInAccounts(userId) {
    return this.db.account.findMany({
      where: { userId },
      select: { providerId: true, scope: true }
    });
  }
  async hasRefreshToken(userId, providerId) {
    const account = await this.db.account.findFirst({
      where: { userId, providerId },
      select: { refreshToken: true }
    });
    return Boolean(account?.refreshToken);
  }
  async accessTokenFor(userId, source) {
    const providerId = PROVIDER_FOR_SOURCE[source];
    if (!await this.isConnected(userId, source)) {
      return {
        outcome: "not-connected",
        reason: `The ${source} scope has not been granted.`
      };
    }
    try {
      const { accessToken } = await import_auth30.auth.api.getAccessToken({
        body: { providerId, userId }
      });
      if (!accessToken) {
        return {
          outcome: "needs-reconnect",
          reason: `${label(providerId)} returned no access token.`
        };
      }
      return { outcome: "ok", accessToken };
    } catch (error) {
      this.logger.warn({
        message: "Mailbox token refresh failed",
        userId,
        providerId,
        source,
        reason: error instanceof Error ? error.message : String(error)
      });
      return {
        outcome: "needs-reconnect",
        reason: `${label(providerId)} would not refresh the access token.`
      };
    }
  }
  async revoke(userId, providerId) {
    if (providerId === import_auth29.GOOGLE_PROVIDER_ID && !await this.revokeWithGoogle(userId)) {
      return false;
    }
    const cleared = await this.db.account.updateMany({
      where: { userId, providerId },
      data: {
        accessToken: null,
        refreshToken: null,
        scope: null,
        accessTokenExpiresAt: null,
        refreshTokenExpiresAt: null
      }
    });
    if (cleared.count === 0)
      return false;
    this.logger.log({ message: "Mailbox access revoked", userId, providerId });
    return true;
  }
  async revokeWithGoogle(userId) {
    const account = await this.db.account.findFirst({
      where: { userId, providerId: import_auth29.GOOGLE_PROVIDER_ID },
      select: { refreshToken: true, accessToken: true }
    });
    const token = account?.refreshToken ?? account?.accessToken;
    if (!token)
      return true;
    const response = await fetch(GOOGLE_REVOKE_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token })
    });
    if (response.ok)
      return true;
    this.logger.warn({
      message: "Google token revocation failed",
      userId,
      status: response.status
    });
    return false;
  }
}
MailboxTokenService = __legacyDecorateClassTS([
  import_common73.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db
  ])
], MailboxTokenService);
function label(providerId) {
  return providerId === import_auth29.GOOGLE_PROVIDER_ID ? "Google" : "Microsoft";
}

// src/mailbox/sync-state.service.ts
var import_db25 = require("@crm/db");
var import_common74 = require("@nestjs/common");
var SYNC_LEASE_MS = 300000;

class SyncStateService {
  db;
  logger = new import_common74.Logger(SyncStateService.name);
  constructor(db2) {
    this.db = db2;
  }
  async get(userId, source) {
    return this.db.mailboxSync.findUnique({
      where: { userId_source: { userId, source } }
    });
  }
  async listForUser(userId, sources) {
    const where = { userId };
    if (sources)
      where.source = { in: [...sources] };
    return this.db.mailboxSync.findMany({ where });
  }
  async due(now) {
    return this.db.mailboxSync.findMany({
      where: dueWhere(now),
      orderBy: [{ lastSyncedAt: { sort: "asc", nulls: "first" } }]
    });
  }
  async claim(row, now) {
    const { count } = await this.db.mailboxSync.updateMany({
      where: { id: row.id, updatedAt: row.updatedAt, ...dueWhere(now) },
      data: {
        status: import_db25.GoogleSyncStatus.RUNNING,
        retryAfter: new Date(now.getTime() + SYNC_LEASE_MS)
      }
    });
    return count === 1;
  }
  async release(id) {
    await this.db.mailboxSync.updateMany({
      where: { id },
      data: { retryAfter: null }
    });
  }
  async ensure(userId, source, options) {
    return this.db.mailboxSync.upsert({
      where: { userId_source: { userId, source } },
      create: {
        userId,
        source,
        status: import_db25.GoogleSyncStatus.IDLE,
        autoCreate: options.autoCreate
      },
      update: {
        status: import_db25.GoogleSyncStatus.IDLE,
        lastError: null,
        retryAfter: null
      }
    });
  }
  async markRunning(id) {
    await this.db.mailboxSync.update({
      where: { id },
      data: { status: import_db25.GoogleSyncStatus.RUNNING, lastError: null }
    });
  }
  async settle(id, update) {
    await this.db.mailboxSync.update({
      where: { id },
      data: {
        ...update,
        lastSyncedAt: new Date,
        lastError: null,
        retryAfter: null
      }
    });
  }
  async clearCursor(id, reason) {
    this.logger.warn({
      message: "Sync cursor invalidated — resuming from now",
      syncId: id,
      reason
    });
    await this.db.mailboxSync.update({
      where: { id },
      data: {
        cursor: null,
        status: import_db25.GoogleSyncStatus.IDLE,
        lastError: null,
        retryAfter: null
      }
    });
  }
  async markNeedsReconnect(id, reason) {
    await this.db.mailboxSync.update({
      where: { id },
      data: {
        status: import_db25.GoogleSyncStatus.NEEDS_RECONNECT,
        lastError: reason,
        retryAfter: null
      }
    });
  }
  async markRateLimited(id, retryAfterMs) {
    await this.db.mailboxSync.update({
      where: { id },
      data: {
        status: import_db25.GoogleSyncStatus.IDLE,
        retryAfter: new Date(Date.now() + retryAfterMs)
      }
    });
  }
  async markFailed(id, reason) {
    await this.db.mailboxSync.update({
      where: { id },
      data: {
        status: import_db25.GoogleSyncStatus.FAILED,
        lastError: reason,
        retryAfter: null
      }
    });
  }
  async setAutoCreate(userId, source, enabled) {
    await this.db.mailboxSync.updateMany({
      where: { userId, source },
      data: { autoCreate: enabled }
    });
  }
  async remove(userId, source) {
    const where = { userId };
    if (source)
      where.source = source;
    await this.db.mailboxSync.deleteMany({ where });
  }
}
SyncStateService = __legacyDecorateClassTS([
  import_common74.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db
  ])
], SyncStateService);
function dueWhere(now) {
  return {
    status: { notIn: [import_db25.GoogleSyncStatus.NEEDS_RECONNECT] },
    OR: [{ retryAfter: null }, { retryAfter: { lte: now } }]
  };
}

// src/mailbox/thread-writer.service.ts
var import_db26 = require("@crm/db");
var import_common75 = require("@nestjs/common");

// src/mailbox/message-text.ts
function decodeBase64Url(data) {
  const normalised = data.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalised.padEnd(normalised.length + (4 - normalised.length % 4) % 4, "=");
  try {
    return Buffer.from(padded, "base64").toString("utf8");
  } catch {
    return "";
  }
}
function stripHtml(html) {
  return html.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<br\s*\/?>/gi, `
`).replace(/<\/(p|div|tr|li|h[1-6])>/gi, `
`).replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\n{3,}/g, `

`).trim();
}
var QUOTE_MARKERS = [
  /^\s*On .+ wrote:\s*$/m,
  /^\s*-{2,}\s*Original Message\s*-{2,}\s*$/im,
  /^\s*_{5,}\s*$/m,
  /^\s*From:\s.+$/m,
  /^\s*Begin forwarded message:\s*$/im,
  /^\s*-{3,}\s*Forwarded message\s*-{3,}\s*$/im
];
function stripQuotedHistory(body) {
  let cut = body.length;
  for (const marker of QUOTE_MARKERS) {
    const match = marker.exec(body);
    if (match && match.index < cut)
      cut = match.index;
  }
  let trimmed = body.slice(0, cut);
  const lines = trimmed.split(`
`);
  while (lines.length > 0 && /^\s*>/.test(lines[lines.length - 1] ?? "")) {
    lines.pop();
  }
  trimmed = lines.join(`
`);
  return trimmed.replace(/\n{3,}/g, `

`).trim();
}
function rootMessageIdFrom(headers) {
  if (headers.references) {
    const first = firstMessageId(headers.references);
    if (first)
      return first;
  }
  if (headers.inReplyTo) {
    const first = firstMessageId(headers.inReplyTo);
    if (first)
      return first;
  }
  return headers.messageId ? normaliseMessageId(headers.messageId) : null;
}
function firstMessageId(value) {
  const found = value.match(/<[^<>]+>|[^\s<>]+/);
  return found ? normaliseMessageId(found[0]) : null;
}
function normaliseMessageId(value) {
  return value.trim().replace(/^</, "").replace(/>$/, "").toLowerCase();
}
function snippetOf(body, limit = 200) {
  const flat = body.replace(/\s+/g, " ").trim();
  if (!flat)
    return null;
  return flat.length > limit ? `${flat.slice(0, limit - 1)}…` : flat;
}

// src/mailbox/thread-writer.service.ts
class ThreadWriterService {
  db;
  match;
  stamp;
  logger = new import_common75.Logger(ThreadWriterService.name);
  constructor(db2, match, stamp) {
    this.db = db2;
    this.match = match;
    this.stamp = stamp;
  }
  async context() {
    const [internal, suppressedDomains, suppressedEmails] = await Promise.all([
      this.match.internalIdentity(),
      this.match.suppressedDomains(),
      this.match.suppressedEmails()
    ]);
    return {
      ourAddresses: internal.addresses,
      ourDomains: internal.domains,
      suppressedDomains,
      suppressedEmails
    };
  }
  async store(row, options, parsed, context) {
    const existing = await this.db.emailMessage.findUnique({
      where: { rfcMessageId: parsed.rfcMessageId },
      select: {
        threadId: true,
        thread: {
          select: {
            companyId: true,
            contactId: true,
            activity: { select: { id: true } }
          }
        }
      }
    });
    if (existing?.thread.activity)
      return false;
    const repair = existing !== null;
    const participants = [parsed.from, ...parsed.recipients];
    const outbound = parsed.from.email === options.mailbox;
    const thread = existing ? {
      id: existing.threadId,
      companyId: existing.thread.companyId,
      contactId: existing.thread.contactId
    } : await this.db.emailThread.findUnique({
      where: { rootMessageId: parsed.rootId },
      select: { id: true, companyId: true, contactId: true }
    });
    let companyId = thread?.companyId ?? null;
    let contactId = thread?.contactId ?? null;
    if (!thread) {
      const repliedTo = outbound || await this.hasOutboundInThread(parsed.rootId, options.mailbox);
      const match = await this.match.resolve({
        participants,
        allowCreate: row.autoCreate && repliedTo,
        source: import_db26.RecordSource.EMAIL,
        ownerId: row.userId
      }, context);
      companyId = match.companyId;
      contactId = match.contactId;
      if (!companyId && !contactId) {
        return false;
      }
    }
    let occurredAt;
    try {
      occurredAt = await this.db.$transaction(async (tx) => {
        const record = existing ? { id: existing.threadId } : await tx.emailThread.upsert({
          where: { rootMessageId: parsed.rootId },
          create: {
            rootMessageId: parsed.rootId,
            subject: parsed.subject,
            companyId,
            contactId,
            firstMessageAt: parsed.sentAt,
            lastMessageAt: parsed.sentAt,
            messageCount: 0
          },
          update: {},
          select: { id: true }
        });
        if (!repair) {
          await tx.emailMessage.create({
            data: {
              threadId: record.id,
              rfcMessageId: parsed.rfcMessageId,
              syncedByUserId: row.userId,
              gmailMessageId: parsed.gmailMessageId ?? null,
              outlookMessageId: parsed.outlookMessageId ?? null,
              outlookWebLink: parsed.outlookWebLink ?? null,
              direction: outbound ? import_db26.EmailDirection.OUTBOUND : import_db26.EmailDirection.INBOUND,
              fromEmail: parsed.from.email,
              fromName: parsed.from.name,
              recipients: parsed.recipients,
              subject: parsed.subject,
              snippet: snippetOf(parsed.body),
              body: parsed.body || null,
              sentAt: parsed.sentAt
            }
          });
        }
        const stats = await tx.emailMessage.aggregate({
          where: { threadId: record.id },
          _count: { _all: true },
          _min: { sentAt: true },
          _max: { sentAt: true }
        });
        const firstMessageAt = stats._min.sentAt ?? parsed.sentAt;
        const lastMessageAt = stats._max.sentAt ?? parsed.sentAt;
        const data = {
          messageCount: stats._count._all,
          firstMessageAt,
          lastMessageAt
        };
        if (parsed.sentAt <= firstMessageAt)
          data.subject = parsed.subject;
        await tx.emailThread.update({ where: { id: record.id }, data });
        return this.project(tx, record.id, row.userId, {
          subject: parsed.subject ?? "(no subject)",
          snippet: snippetOf(parsed.body),
          lastMessageAt,
          companyId,
          contactId,
          origin: options.origin
        });
      });
    } catch (error) {
      if (await this.storedElsewhere(error, parsed.rfcMessageId))
        return false;
      throw error;
    }
    await this.touch({ companyId, contactId }, occurredAt, parsed.rfcMessageId);
    return !repair;
  }
  async storedElsewhere(cause, rfcMessageId) {
    const duplicate = cause instanceof import_db26.Prisma.PrismaClientKnownRequestError && cause.code === "P2002";
    if (!duplicate)
      return false;
    const winner = await this.db.emailMessage.findFirst({
      where: { rfcMessageId, thread: { activity: { isNot: null } } },
      select: { id: true }
    });
    return winner !== null;
  }
  async touch(target, at, rfcMessageId) {
    try {
      await this.stamp.touch(target, at);
    } catch (error) {
      this.logger.error({
        message: "An email was stored but its activity stamps were not moved",
        rfcMessageId,
        ...target
      }, error instanceof Error ? error.stack : String(error));
    }
  }
  async hasOutboundInThread(rootMessageId, mailbox) {
    const found = await this.db.emailMessage.findFirst({
      where: {
        thread: { rootMessageId },
        fromEmail: mailbox
      },
      select: { id: true }
    });
    return found !== null;
  }
  async project(tx, emailThreadId, userId, summary) {
    const activity = await tx.activity.upsert({
      where: { emailThreadId },
      create: {
        type: import_db26.ActivityType.EMAIL,
        subject: summary.subject,
        body: summary.snippet,
        occurredAt: summary.lastMessageAt,
        companyId: summary.companyId,
        contactId: summary.contactId,
        createdById: userId,
        emailThreadId,
        meta: { synced: true, source: summary.origin }
      },
      update: {
        body: summary.snippet,
        occurredAt: summary.lastMessageAt
      },
      select: { createdAt: true }
    });
    return activity.createdAt;
  }
}
ThreadWriterService = __legacyDecorateClassTS([
  import_common75.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof MailboxMatchService === "undefined" ? Object : MailboxMatchService,
    typeof ActivityStampService === "undefined" ? Object : ActivityStampService
  ])
], ThreadWriterService);

// src/mailbox/mailbox.module.ts
class MailboxModule {
}
MailboxModule = __legacyDecorateClassTS([
  import_common76.Module({
    imports: [AgentModule, CompaniesModule],
    providers: [
      MailboxApiClient,
      MailboxTokenService,
      MailboxMatchService,
      SyncStateService,
      ThreadWriterService
    ],
    exports: [
      MailboxApiClient,
      MailboxTokenService,
      MailboxMatchService,
      SyncStateService,
      ThreadWriterService
    ]
  })
], MailboxModule);

// src/google/calendar.client.ts
var import_common77 = require("@nestjs/common");
var EVENTS_URL = "https://www.googleapis.com/calendar/v3/calendars/primary/events";

class CalendarClient {
  api;
  constructor(api) {
    this.api = api;
  }
  async listEvents(accessToken, query) {
    const window = query.syncToken ? {} : { timeMin: query.timeMin, timeMax: query.timeMax };
    return this.api.get(EVENTS_URL, accessToken, {
      singleEvents: true,
      showDeleted: true,
      maxResults: query.maxResults ?? 250,
      syncToken: query.syncToken,
      pageToken: query.pageToken,
      ...window
    });
  }
}
CalendarClient = __legacyDecorateClassTS([
  import_common77.Injectable(),
  __legacyMetadataTS("design:paramtypes", [
    typeof MailboxApiClient === "undefined" ? Object : MailboxApiClient
  ])
], CalendarClient);
function conferenceUrl(event) {
  if (event.hangoutLink)
    return event.hangoutLink;
  const entry = event.conferenceData?.entryPoints?.find((point) => point.entryPointType === "video" && point.uri);
  return entry?.uri ?? null;
}
function eventTime(time) {
  if (time?.dateTime) {
    const at = new Date(time.dateTime);
    return Number.isNaN(at.getTime()) ? null : { at, isAllDay: false };
  }
  if (time?.date) {
    const at = new Date(`${time.date}T00:00:00Z`);
    return Number.isNaN(at.getTime()) ? null : { at, isAllDay: true };
  }
  return null;
}

// src/google/calendar-sync.service.ts
var import_db27 = require("@crm/db");
var import_common78 = require("@nestjs/common");
var MAX_PAGES_PER_TICK = 5;
var HORIZON_DAYS = 180;

class CalendarSyncService {
  db;
  calendar;
  tokens;
  match;
  state;
  stamp;
  agent;
  logger = new import_common78.Logger(CalendarSyncService.name);
  constructor(db2, calendar, tokens, match, state, stamp, agent) {
    this.db = db2;
    this.calendar = calendar;
    this.tokens = tokens;
    this.match = match;
    this.state = state;
    this.stamp = stamp;
    this.agent = agent;
  }
  async sync(row) {
    const token = await this.tokens.accessTokenFor(row.userId, "calendar");
    if (token.outcome === "not-connected") {
      return {
        source: "calendar",
        userId: row.userId,
        status: "skipped",
        reason: token.reason
      };
    }
    if (token.outcome === "needs-reconnect") {
      await this.state.markNeedsReconnect(row.id, token.reason);
      return {
        source: "calendar",
        userId: row.userId,
        status: "reconnect",
        reason: token.reason
      };
    }
    await this.state.markRunning(row.id);
    const [internal, suppressedDomains, suppressedEmails] = await Promise.all([
      this.match.internalIdentity(),
      this.match.suppressedDomains(),
      this.match.suppressedEmails()
    ]);
    const context = {
      ourAddresses: internal.addresses,
      ourDomains: internal.domains,
      suppressedDomains,
      suppressedEmails
    };
    let pageToken;
    let syncToken = row.cursor ?? undefined;
    let written = 0;
    let removed = 0;
    for (let page = 0;page < MAX_PAGES_PER_TICK; page += 1) {
      const result = await this.calendar.listEvents(token.accessToken, {
        syncToken,
        pageToken,
        timeMin: new Date().toISOString(),
        timeMax: this.horizon().toISOString()
      });
      if (result.outcome === "cursor-invalid") {
        await this.state.clearCursor(row.id, result.reason);
        return {
          source: "calendar",
          userId: row.userId,
          status: "synced",
          eventsWritten: written,
          eventsRemoved: removed,
          reason: "Cursor reset; the next tick re-runs the window."
        };
      }
      if (result.outcome === "unauthorized") {
        await this.state.markNeedsReconnect(row.id, result.reason);
        return {
          source: "calendar",
          userId: row.userId,
          status: "reconnect",
          reason: result.reason
        };
      }
      if (result.outcome === "rate-limited") {
        await this.state.markRateLimited(row.id, result.retryAfterMs);
        return {
          source: "calendar",
          userId: row.userId,
          status: "rate-limited",
          reason: result.reason
        };
      }
      if (result.outcome === "failed") {
        await this.state.markFailed(row.id, result.reason);
        return {
          source: "calendar",
          userId: row.userId,
          status: "failed",
          reason: result.reason
        };
      }
      for (const event of result.data.items ?? []) {
        const applied = await this.apply(event, row, context);
        if (applied === "written")
          written += 1;
        if (applied === "removed")
          removed += 1;
      }
      pageToken = result.data.nextPageToken;
      if (!pageToken) {
        syncToken = result.data.nextSyncToken ?? syncToken;
        await this.state.settle(row.id, {
          cursor: syncToken ?? null,
          status: import_db27.GoogleSyncStatus.RUNNING
        });
        this.logger.log({
          message: "Calendar sync complete",
          userId: row.userId,
          eventsWritten: written,
          eventsRemoved: removed
        });
        return {
          source: "calendar",
          userId: row.userId,
          status: "synced",
          eventsWritten: written,
          eventsRemoved: removed
        };
      }
    }
    await this.state.settle(row.id, {
      status: import_db27.GoogleSyncStatus.IDLE
    });
    return {
      source: "calendar",
      userId: row.userId,
      status: "synced",
      eventsWritten: written,
      eventsRemoved: removed,
      reason: "Page budget reached; continuing next tick."
    };
  }
  async apply(event, row, context) {
    const iCalUid = event.iCalUID;
    if (!iCalUid)
      return "ignored";
    const start = eventTime(event.start);
    const originalStart = eventTime(event.originalStartTime) ?? start;
    if (!originalStart)
      return "ignored";
    const key = {
      iCalUid_originalStartTime: {
        iCalUid,
        originalStartTime: originalStart.at
      }
    };
    if (event.status === "cancelled") {
      const deleted = await this.db.calendarEvent.deleteMany({
        where: {
          iCalUid,
          originalStartTime: originalStart.at
        }
      });
      return deleted.count > 0 ? "removed" : "ignored";
    }
    const end = eventTime(event.end);
    if (!start || !end)
      return "ignored";
    const participants = this.participantsOf(event);
    const declinedByUs = event.attendees?.some((attendee) => attendee.self && attendee.responseStatus === "declined");
    const match = await this.match.resolve({
      participants,
      allowCreate: row.autoCreate && !declinedByUs,
      source: import_db27.RecordSource.CALENDAR,
      ownerId: row.userId
    }, context);
    if (!match.companyId && !match.contactId) {
      return "ignored";
    }
    const organizer = event.organizer?.email?.toLowerCase() ?? null;
    const record = await this.db.calendarEvent.upsert({
      where: key,
      create: {
        iCalUid,
        originalStartTime: originalStart.at,
        recurringEventId: event.recurringEventId ?? null,
        title: event.summary ?? null,
        description: event.description ?? null,
        location: event.location ?? null,
        conferenceUrl: conferenceUrl(event),
        startsAt: start.at,
        endsAt: end.at,
        isAllDay: start.isAllDay,
        status: event.status ?? "confirmed",
        organizerEmail: organizer,
        companyId: match.companyId,
        contactId: match.contactId,
        syncedByUserId: row.userId,
        googleEventId: event.id ?? null
      },
      update: {
        title: event.summary ?? null,
        description: event.description ?? null,
        location: event.location ?? null,
        conferenceUrl: conferenceUrl(event),
        startsAt: start.at,
        endsAt: end.at,
        isAllDay: start.isAllDay,
        status: event.status ?? "confirmed",
        organizerEmail: organizer,
        companyId: match.companyId,
        contactId: match.contactId
      },
      select: { id: true }
    });
    await this.syncAttendees(record.id, event);
    await this.prepareForMeeting(record.id, start.at);
    await this.project(record.id, row.userId, {
      title: event.summary ?? "Meeting",
      startsAt: start.at,
      companyId: match.companyId,
      contactId: match.contactId,
      location: event.location ?? null
    });
    return "written";
  }
  async syncAttendees(eventId, event) {
    const attendees = (event.attendees ?? []).filter((attendee) => attendee.email && !attendee.resource && !isMachineAddress(attendee.email.toLowerCase()));
    if (attendees.length === 0)
      return;
    const emails = attendees.map((attendee) => attendee.email.toLowerCase());
    const contacts = await this.db.contact.findMany({
      where: { email: { in: emails } },
      select: { id: true, email: true }
    });
    const contactByEmail = new Map(contacts.map((contact) => [contact.email, contact.id]));
    for (const attendee of attendees) {
      const email = attendee.email.toLowerCase();
      await this.db.calendarAttendee.upsert({
        where: { eventId_email: { eventId, email } },
        create: {
          eventId,
          email,
          name: attendee.displayName ?? null,
          responseStatus: attendee.responseStatus ?? null,
          isOrganizer: attendee.organizer ?? false,
          contactId: contactByEmail.get(email) ?? null
        },
        update: {
          name: attendee.displayName ?? null,
          responseStatus: attendee.responseStatus ?? null,
          isOrganizer: attendee.organizer ?? false,
          contactId: contactByEmail.get(email) ?? null
        }
      });
    }
  }
  async prepareForMeeting(eventId, startsAt) {
    const soon = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    if (startsAt <= new Date || startsAt > soon)
      return;
    const attendees = await this.db.calendarAttendee.findMany({
      where: {
        eventId,
        contactId: { not: null },
        contact: { brief: { is: null } }
      },
      select: { contactId: true }
    });
    for (const attendee of attendees) {
      if (attendee.contactId) {
        await this.agent.meetingSoon(attendee.contactId, startsAt);
      }
    }
  }
  async project(calendarEventId, userId, summary) {
    const body = summary.location ? `Location: ${summary.location}` : null;
    const activity = await this.db.activity.upsert({
      where: { calendarEventId },
      create: {
        type: import_db27.ActivityType.MEETING,
        subject: summary.title,
        body,
        occurredAt: summary.startsAt,
        companyId: summary.companyId,
        contactId: summary.contactId,
        createdById: userId,
        calendarEventId,
        meta: { synced: true, source: "calendar" }
      },
      update: {
        subject: summary.title,
        body,
        occurredAt: summary.startsAt,
        companyId: summary.companyId,
        contactId: summary.contactId
      },
      select: { createdAt: true }
    });
    await this.stamp.touch({ companyId: summary.companyId, contactId: summary.contactId }, activity.createdAt);
  }
  participantsOf(event) {
    const people = [];
    for (const attendee of event.attendees ?? []) {
      if (!attendee.email || attendee.resource)
        continue;
      people.push({
        email: attendee.email.toLowerCase(),
        name: attendee.displayName ?? null
      });
    }
    if (event.organizer?.email) {
      people.push({
        email: event.organizer.email.toLowerCase(),
        name: event.organizer.displayName ?? null
      });
    }
    return people;
  }
  horizon() {
    const to = new Date;
    to.setDate(to.getDate() + HORIZON_DAYS);
    return to;
  }
}
CalendarSyncService = __legacyDecorateClassTS([
  import_common78.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof CalendarClient === "undefined" ? Object : CalendarClient,
    typeof MailboxTokenService === "undefined" ? Object : MailboxTokenService,
    typeof MailboxMatchService === "undefined" ? Object : MailboxMatchService,
    typeof SyncStateService === "undefined" ? Object : SyncStateService,
    typeof ActivityStampService === "undefined" ? Object : ActivityStampService,
    typeof AgentTriggerService === "undefined" ? Object : AgentTriggerService
  ])
], CalendarSyncService);

// src/google/conversation.service.ts
var import_common79 = require("@nestjs/common");
var import_zod19 = require("zod");
var storedRecipient = import_zod19.z.object({
  email: import_zod19.z.string(),
  name: import_zod19.z.string().nullable().catch(null),
  kind: import_zod19.z.string().catch("to")
});
var storedRecipients = import_zod19.z.array(import_zod19.z.json()).catch([]);

class ConversationService {
  db;
  constructor(db2) {
    this.db = db2;
  }
  async thread(threadId) {
    const thread = await this.db.emailThread.findUnique({
      where: { id: threadId },
      select: {
        id: true,
        subject: true,
        messageCount: true,
        firstMessageAt: true,
        lastMessageAt: true,
        company: { select: { id: true, name: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
        messages: {
          orderBy: { sentAt: "asc" },
          select: {
            id: true,
            direction: true,
            fromEmail: true,
            fromName: true,
            recipients: true,
            subject: true,
            body: true,
            snippet: true,
            sentAt: true,
            gmailMessageId: true,
            outlookWebLink: true
          }
        }
      }
    });
    if (!thread) {
      throw new import_common79.NotFoundException(`No email thread with id ${threadId}.`);
    }
    const faces = await this.facesFor(thread.messages.map((message) => message.fromEmail));
    return {
      ...thread,
      firstMessageAt: thread.firstMessageAt.toISOString(),
      lastMessageAt: thread.lastMessageAt.toISOString(),
      messages: thread.messages.map((message) => ({
        ...message,
        sentAt: message.sentAt.toISOString(),
        recipients: recipientsOf(message.recipients),
        fromImageUrl: faces.get(message.fromEmail.toLowerCase()) ?? null,
        mailboxUrl: message.gmailMessageId ? `https://mail.google.com/mail/u/0/#all/${message.gmailMessageId}` : message.outlookWebLink,
        mailboxName: message.gmailMessageId ? "Gmail" : message.outlookWebLink ? "Outlook" : null
      }))
    };
  }
  async facesFor(addresses) {
    const emails = [
      ...new Set(addresses.map((address) => address.toLowerCase()))
    ];
    if (emails.length === 0)
      return new Map;
    const [contacts, users] = await Promise.all([
      this.db.contact.findMany({
        where: { email: { in: emails, mode: "insensitive" } },
        select: { email: true, imageUrl: true }
      }),
      this.db.user.findMany({
        where: { email: { in: emails, mode: "insensitive" } },
        select: { email: true, image: true }
      })
    ]);
    const faces = new Map;
    for (const contact of contacts) {
      if (contact.email && contact.imageUrl) {
        faces.set(contact.email.toLowerCase(), contact.imageUrl);
      }
    }
    for (const user of users) {
      if (user.image)
        faces.set(user.email.toLowerCase(), user.image);
    }
    return faces;
  }
  async event(eventId) {
    const event = await this.db.calendarEvent.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        conferenceUrl: true,
        startsAt: true,
        endsAt: true,
        isAllDay: true,
        status: true,
        organizerEmail: true,
        company: { select: { id: true, name: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
        attendees: {
          orderBy: [{ isOrganizer: "desc" }, { email: "asc" }],
          select: {
            id: true,
            email: true,
            name: true,
            responseStatus: true,
            isOrganizer: true,
            contactId: true,
            contact: { select: { imageUrl: true } }
          }
        }
      }
    });
    if (!event) {
      throw new import_common79.NotFoundException(`No calendar event with id ${eventId}.`);
    }
    return {
      ...event,
      startsAt: event.startsAt.toISOString(),
      endsAt: event.endsAt.toISOString(),
      attendees: event.attendees.map(({ contact, ...attendee }) => ({
        ...attendee,
        imageUrl: contact?.imageUrl ?? null
      }))
    };
  }
}
ConversationService = __legacyDecorateClassTS([
  import_common79.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db
  ])
], ConversationService);
function recipientsOf(value) {
  return storedRecipients.parse(value).flatMap((entry) => {
    const parsed = storedRecipient.safeParse(entry);
    return parsed.success ? [parsed.data] : [];
  });
}

// src/google/gmail.client.ts
var import_common80 = require("@nestjs/common");
var BASE = "https://gmail.googleapis.com/gmail/v1/users/me";
var WORK_MAIL_QUERY = "-in:chats -category:promotions -category:social -category:forums";

class GmailClient {
  api;
  constructor(api) {
    this.api = api;
  }
  async profile(accessToken) {
    return this.api.get(`${BASE}/profile`, accessToken);
  }
  async listMessages(accessToken, options) {
    const after = Math.floor(options.after.getTime() / 1000);
    const before = Math.ceil(options.before.getTime() / 1000);
    return this.api.get(`${BASE}/messages`, accessToken, {
      q: `${WORK_MAIL_QUERY} after:${after} before:${before}`,
      maxResults: options.maxResults ?? 100,
      pageToken: options.pageToken
    });
  }
  async listHistory(accessToken, options) {
    return this.api.get(`${BASE}/history`, accessToken, {
      startHistoryId: options.startHistoryId,
      historyTypes: "messageAdded",
      maxResults: 500,
      pageToken: options.pageToken
    });
  }
  async getMessage(accessToken, id) {
    return this.api.get(`${BASE}/messages/${id}`, accessToken, {
      format: "full"
    });
  }
}
GmailClient = __legacyDecorateClassTS([
  import_common80.Injectable(),
  __legacyMetadataTS("design:paramtypes", [
    typeof MailboxApiClient === "undefined" ? Object : MailboxApiClient
  ])
], GmailClient);

// src/google/gmail-sync.service.ts
var import_db28 = require("@crm/db");
var import_common81 = require("@nestjs/common");

// src/google/gmail-mime.ts
function header(headers, name) {
  const wanted = name.toLowerCase();
  const found = headers?.find((entry) => entry.name?.toLowerCase() === wanted);
  return found?.value?.trim() ?? null;
}
function plainTextBody(payload) {
  if (!payload)
    return "";
  const plain = findPart(payload, "text/plain");
  if (plain?.body?.data)
    return decodeBase64Url(plain.body.data);
  const html = findPart(payload, "text/html");
  if (html?.body?.data)
    return stripHtml(decodeBase64Url(html.body.data));
  if (payload.body?.data && !payload.filename) {
    return decodeBase64Url(payload.body.data);
  }
  return "";
}
function findPart(part, mimeType) {
  if (part.mimeType === mimeType && !part.filename && part.body?.data) {
    return part;
  }
  for (const child of part.parts ?? []) {
    if (isAttachment(child))
      continue;
    const found = findPart(child, mimeType);
    if (found)
      return found;
  }
  return null;
}
function isAttachment(part) {
  if (part.filename)
    return true;
  const disposition = header(part.headers, "content-disposition");
  return disposition?.toLowerCase().startsWith("attachment") ?? false;
}
function rootMessageId(headers) {
  return rootMessageIdFrom({
    references: header(headers, "references"),
    inReplyTo: header(headers, "in-reply-to"),
    messageId: header(headers, "message-id")
  });
}

// src/google/gmail-sync.service.ts
var MAX_MESSAGES_PER_TICK = 120;

class GmailSyncService {
  db;
  gmail;
  tokens;
  state;
  threads;
  logger = new import_common81.Logger(GmailSyncService.name);
  constructor(db2, gmail, tokens, state, threads) {
    this.db = db2;
    this.gmail = gmail;
    this.tokens = tokens;
    this.state = state;
    this.threads = threads;
  }
  async sync(row) {
    const token = await this.tokens.accessTokenFor(row.userId, "gmail");
    if (token.outcome === "not-connected") {
      return {
        source: "gmail",
        userId: row.userId,
        status: "skipped",
        reason: token.reason
      };
    }
    if (token.outcome === "needs-reconnect") {
      await this.state.markNeedsReconnect(row.id, token.reason);
      return {
        source: "gmail",
        userId: row.userId,
        status: "reconnect",
        reason: token.reason
      };
    }
    await this.state.markRunning(row.id);
    const profile = await this.gmail.profile(token.accessToken);
    if (profile.outcome !== "ok") {
      return this.handleFailure(row, profile);
    }
    const mailbox = profile.data.emailAddress?.toLowerCase() ?? null;
    if (!mailbox) {
      await this.state.markFailed(row.id, "Gmail returned no mailbox address.");
      return {
        source: "gmail",
        userId: row.userId,
        status: "failed",
        reason: "No mailbox address."
      };
    }
    if (!row.cursor) {
      return this.start(row, profile.data.historyId ?? null);
    }
    return this.incremental(row, token.accessToken, mailbox, row.cursor);
  }
  async start(row, historyId) {
    if (!historyId) {
      await this.state.markFailed(row.id, "Gmail returned no historyId.");
      return {
        source: "gmail",
        userId: row.userId,
        status: "failed",
        reason: "No historyId to start from."
      };
    }
    await this.state.settle(row.id, {
      cursor: historyId,
      status: import_db28.GoogleSyncStatus.RUNNING
    });
    this.logger.log({
      message: "Gmail sync started — watching for new mail",
      userId: row.userId
    });
    return { source: "gmail", userId: row.userId, status: "synced" };
  }
  async incremental(row, accessToken, mailbox, startHistoryId) {
    const history = await this.gmail.listHistory(accessToken, {
      startHistoryId
    });
    if (history.outcome === "cursor-invalid") {
      await this.state.clearCursor(row.id, history.reason);
      return {
        source: "gmail",
        userId: row.userId,
        status: "synced",
        reason: "History expired; resuming from now."
      };
    }
    if (history.outcome !== "ok") {
      return this.handleFailure(row, history);
    }
    const ids = new Set;
    for (const entry of history.data.history ?? []) {
      for (const added of entry.messagesAdded ?? []) {
        if (added.message?.id)
          ids.add(added.message.id);
      }
    }
    const { written, remaining } = await this.ingest(row, accessToken, mailbox, [...ids]);
    await this.state.settle(row.id, {
      cursor: remaining > 0 ? startHistoryId : history.data.historyId ?? startHistoryId,
      status: import_db28.GoogleSyncStatus.RUNNING
    });
    if (written > 0 || remaining > 0) {
      this.logger.log({
        message: "Gmail incremental sync",
        userId: row.userId,
        messagesWritten: written,
        remaining
      });
    }
    return {
      source: "gmail",
      userId: row.userId,
      status: "synced",
      messagesWritten: written
    };
  }
  async ingest(row, accessToken, mailbox, ids) {
    if (ids.length === 0)
      return { written: 0, remaining: 0 };
    const alreadyHave = await this.db.emailMessage.findMany({
      where: { gmailMessageId: { in: [...ids] } },
      select: { gmailMessageId: true }
    });
    const seen = new Set(alreadyHave.map((existing) => existing.gmailMessageId));
    const pending = ids.filter((id) => !seen.has(id));
    const batch = pending.slice(0, MAX_MESSAGES_PER_TICK);
    const remaining = pending.length - batch.length;
    if (batch.length === 0)
      return { written: 0, remaining };
    const context = await this.threads.context();
    let written = 0;
    for (const id of batch) {
      const message = await this.gmail.getMessage(accessToken, id);
      if (message.outcome !== "ok")
        continue;
      const parsed = this.parse(message.data);
      if (!parsed)
        continue;
      const stored = await this.threads.store(row, { mailbox, origin: "gmail" }, parsed, context);
      if (stored)
        written += 1;
    }
    return { written, remaining };
  }
  parse(message) {
    const headers = message.payload?.headers;
    const rawMessageId = header(headers, "message-id");
    if (!rawMessageId)
      return null;
    const from = parseAddress(header(headers, "from") ?? "");
    if (!from)
      return null;
    const sentAt = this.sentAt(message, headers);
    if (!sentAt)
      return null;
    const rootId = rootMessageId(headers) ?? normaliseMessageId(rawMessageId);
    const to = parseAddressList(header(headers, "to")).map((person) => ({
      email: person.email,
      name: person.name,
      kind: "to"
    }));
    const cc = parseAddressList(header(headers, "cc")).map((person) => ({
      email: person.email,
      name: person.name,
      kind: "cc"
    }));
    const body = stripQuotedHistory(plainTextBody(message.payload));
    return {
      rfcMessageId: normaliseMessageId(rawMessageId),
      rootId,
      subject: header(headers, "subject"),
      from,
      recipients: [...to, ...cc],
      body,
      sentAt,
      gmailMessageId: message.id ?? null
    };
  }
  sentAt(message, headers) {
    if (message.internalDate) {
      const at2 = new Date(Number(message.internalDate));
      if (!Number.isNaN(at2.getTime()))
        return at2;
    }
    const raw = header(headers, "date");
    if (!raw)
      return null;
    const at = new Date(raw);
    return Number.isNaN(at.getTime()) ? null : at;
  }
  async handleFailure(row, result) {
    if (result.outcome === "unauthorized") {
      await this.state.markNeedsReconnect(row.id, result.reason);
      return {
        source: "gmail",
        userId: row.userId,
        status: "reconnect",
        reason: result.reason
      };
    }
    if (result.outcome === "rate-limited") {
      await this.state.markRateLimited(row.id, result.retryAfterMs ?? 60000);
      return {
        source: "gmail",
        userId: row.userId,
        status: "rate-limited",
        reason: result.reason
      };
    }
    await this.state.markFailed(row.id, result.reason);
    return {
      source: "gmail",
      userId: row.userId,
      status: "failed",
      reason: result.reason
    };
  }
}
GmailSyncService = __legacyDecorateClassTS([
  import_common81.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof GmailClient === "undefined" ? Object : GmailClient,
    typeof MailboxTokenService === "undefined" ? Object : MailboxTokenService,
    typeof SyncStateService === "undefined" ? Object : SyncStateService,
    typeof ThreadWriterService === "undefined" ? Object : ThreadWriterService
  ])
], GmailSyncService);

// src/google/google.router.ts
var import_common84 = require("@nestjs/common");
var import_nestjs_trpc13 = require("nestjs-trpc");

// src/google/google.contracts.ts
var import_db29 = require("@crm/db");
var import_zod20 = require("zod");
var setAutoCreateInput = import_zod20.z.object({
  source: import_zod20.z.enum(GOOGLE_SYNC_SOURCES),
  enabled: import_zod20.z.boolean()
});
var suppressDomainInput = import_zod20.z.object({
  domain: import_zod20.z.string().trim().min(1),
  reason: import_zod20.z.string().trim().max(200).optional(),
  purge: import_zod20.z.boolean().default(true)
});
var threadInput = import_zod20.z.object({
  threadId: import_zod20.z.string()
});
var calendarEventInput = import_zod20.z.object({
  eventId: import_zod20.z.string()
});
var googleSyncStatusOutput = import_zod20.z.enum(Object.values(import_db29.GoogleSyncStatus));
var googleSourceStatusOutput = import_zod20.z.object({
  source: import_zod20.z.enum(GOOGLE_SYNC_SOURCES),
  connected: import_zod20.z.boolean(),
  status: googleSyncStatusOutput.nullable(),
  lastSyncedAt: import_zod20.z.string().nullable(),
  lastError: import_zod20.z.string().nullable(),
  autoCreate: import_zod20.z.boolean()
});
var googleConnectionStatusOutput = import_zod20.z.object({
  configured: import_zod20.z.boolean(),
  linked: import_zod20.z.boolean(),
  required: import_zod20.z.boolean(),
  hasRefreshToken: import_zod20.z.boolean(),
  sources: import_zod20.z.array(googleSourceStatusOutput)
});
var purgeSyncedDataOutput = import_zod20.z.object({
  purged: import_zod20.z.number()
});
var revokeAccessOutput = import_zod20.z.object({
  revoked: import_zod20.z.boolean()
});
var suppressDomainOutput = import_zod20.z.object({
  domain: import_zod20.z.string(),
  purged: import_zod20.z.number()
});
var emailThreadCompanyOutput = import_zod20.z.object({
  id: import_zod20.z.string(),
  name: import_zod20.z.string()
});
var emailThreadContactOutput = import_zod20.z.object({
  id: import_zod20.z.string(),
  firstName: import_zod20.z.string(),
  lastName: import_zod20.z.string().nullable()
});
var emailThreadRecipientOutput = import_zod20.z.object({
  email: import_zod20.z.string(),
  name: import_zod20.z.string().nullable(),
  kind: import_zod20.z.string()
});
var emailDirectionOutput = import_zod20.z.enum(Object.values(import_db29.EmailDirection));
var emailThreadMessageOutput = import_zod20.z.object({
  id: import_zod20.z.string(),
  direction: emailDirectionOutput,
  fromEmail: import_zod20.z.string(),
  fromName: import_zod20.z.string().nullable(),
  recipients: import_zod20.z.array(emailThreadRecipientOutput),
  subject: import_zod20.z.string().nullable(),
  body: import_zod20.z.string().nullable(),
  snippet: import_zod20.z.string().nullable(),
  sentAt: import_zod20.z.string(),
  gmailMessageId: import_zod20.z.string().nullable(),
  outlookWebLink: import_zod20.z.string().nullable(),
  fromImageUrl: import_zod20.z.string().nullable(),
  mailboxUrl: import_zod20.z.string().nullable(),
  mailboxName: import_zod20.z.string().nullable()
});
var emailThreadOutput = import_zod20.z.object({
  id: import_zod20.z.string(),
  subject: import_zod20.z.string().nullable(),
  messageCount: import_zod20.z.number(),
  firstMessageAt: import_zod20.z.string(),
  lastMessageAt: import_zod20.z.string(),
  company: emailThreadCompanyOutput.nullable(),
  contact: emailThreadContactOutput.nullable(),
  messages: import_zod20.z.array(emailThreadMessageOutput)
});
var calendarEventCompanyOutput = import_zod20.z.object({
  id: import_zod20.z.string(),
  name: import_zod20.z.string()
});
var calendarEventContactOutput = import_zod20.z.object({
  id: import_zod20.z.string(),
  firstName: import_zod20.z.string(),
  lastName: import_zod20.z.string().nullable()
});
var calendarAttendeeOutput = import_zod20.z.object({
  id: import_zod20.z.string(),
  email: import_zod20.z.string(),
  name: import_zod20.z.string().nullable(),
  responseStatus: import_zod20.z.string().nullable(),
  isOrganizer: import_zod20.z.boolean(),
  contactId: import_zod20.z.string().nullable(),
  imageUrl: import_zod20.z.string().nullable()
});
var calendarEventOutput = import_zod20.z.object({
  id: import_zod20.z.string(),
  title: import_zod20.z.string().nullable(),
  description: import_zod20.z.string().nullable(),
  location: import_zod20.z.string().nullable(),
  conferenceUrl: import_zod20.z.string().nullable(),
  startsAt: import_zod20.z.string(),
  endsAt: import_zod20.z.string(),
  isAllDay: import_zod20.z.boolean(),
  status: import_zod20.z.string(),
  organizerEmail: import_zod20.z.string().nullable(),
  company: calendarEventCompanyOutput.nullable(),
  contact: calendarEventContactOutput.nullable(),
  attendees: import_zod20.z.array(calendarAttendeeOutput)
});

// src/google/google-connection.service.ts
var import_auth31 = require("@crm/auth");
var import_common82 = require("@nestjs/common");
var PURGE_TIMEOUT_MS = 60000;

class GoogleConnectionService {
  db;
  tokens;
  state;
  match;
  stamp;
  logger = new import_common82.Logger(GoogleConnectionService.name);
  constructor(db2, tokens, state, match, stamp) {
    this.db = db2;
    this.tokens = tokens;
    this.state = state;
    this.match = match;
    this.stamp = stamp;
  }
  async status(userId) {
    await this.onConnected(userId);
    const [granted, rows, hasRefreshToken, accounts] = await Promise.all([
      this.tokens.grantedScopes(userId, import_auth29.GOOGLE_PROVIDER_ID),
      this.state.listForUser(userId, GOOGLE_SYNC_SOURCES),
      this.tokens.hasRefreshToken(userId, import_auth29.GOOGLE_PROVIDER_ID),
      this.tokens.signInAccounts(userId)
    ]);
    const bySource = new Map(rows.map((row) => [row.source, row]));
    const sources = GOOGLE_SYNC_SOURCES.map((source) => {
      const row = bySource.get(source);
      const connected = granted.has(SCOPE_FOR_SOURCE[source]);
      return {
        source,
        connected,
        status: row?.status ?? null,
        lastSyncedAt: row?.lastSyncedAt?.toISOString() ?? null,
        lastError: row?.lastError ?? null,
        autoCreate: row?.autoCreate ?? false
      };
    });
    return {
      configured: import_auth31.isGoogleConfigured(),
      linked: accounts.some((account) => account.providerId === import_auth29.GOOGLE_PROVIDER_ID) && sources.some((source) => source.connected),
      required: import_auth31.signsInWithGoogle(accounts),
      hasRefreshToken,
      sources
    };
  }
  async onConnected(userId) {
    const [granted, existing] = await Promise.all([
      this.tokens.grantedScopes(userId, import_auth29.GOOGLE_PROVIDER_ID),
      this.state.listForUser(userId, GOOGLE_SYNC_SOURCES)
    ]);
    const known = new Set(existing.map((row) => row.source));
    const added = [];
    for (const source of GOOGLE_SYNC_SOURCES) {
      if (!granted.has(SCOPE_FOR_SOURCE[source]))
        continue;
      if (known.has(source))
        continue;
      await this.state.ensure(userId, source, {
        autoCreate: source === "calendar"
      });
      added.push(source);
    }
    if (added.length > 0) {
      this.logger.log({ message: "Google connected", userId, sources: added });
    }
  }
  async reconcileAll() {
    const accounts = await this.db.account.findMany({
      where: {
        providerId: import_auth29.GOOGLE_PROVIDER_ID,
        OR: GOOGLE_SYNC_SOURCES.map((source) => ({
          scope: { contains: SCOPE_FOR_SOURCE[source] }
        }))
      },
      select: { userId: true }
    });
    for (const account of new Set(accounts.map((row) => row.userId))) {
      await this.onConnected(account);
    }
  }
  async purgeSyncedData(userId) {
    const mine = {
      syncedByUserId: userId,
      gmailMessageId: { not: null }
    };
    const purged = await this.db.$transaction(async (tx) => {
      const touched = await tx.emailMessage.findMany({
        where: mine,
        select: { threadId: true },
        distinct: ["threadId"]
      });
      const threadIds = touched.map((row) => row.threadId);
      const messages = await tx.emailMessage.deleteMany({ where: mine });
      await tx.emailThread.deleteMany({
        where: { id: { in: threadIds }, messages: { none: {} } }
      });
      await rebuildThreads(tx, threadIds);
      const events = await tx.calendarEvent.deleteMany({
        where: { syncedByUserId: userId }
      });
      return messages.count + events.count;
    }, { timeout: PURGE_TIMEOUT_MS });
    await this.stamp.recomputeAll();
    this.logger.log({ message: "Google data purged", userId, purged });
    return { purged };
  }
  async revoke(userId) {
    for (const source of GOOGLE_SYNC_SOURCES) {
      await this.state.remove(userId, source);
    }
    const revoked = await this.tokens.revoke(userId, import_auth29.GOOGLE_PROVIDER_ID);
    return { revoked };
  }
  async setAutoCreate(userId, source, enabled) {
    const row = await this.state.get(userId, source);
    if (!row) {
      throw new import_common82.NotFoundException(`${source} is not connected.`);
    }
    await this.state.setAutoCreate(userId, source, enabled);
  }
  async suppressDomain(domain, options) {
    const normalised = normalizeDomain(domain);
    if (!normalised) {
      throw new import_common82.NotFoundException(`"${domain}" is not a domain.`);
    }
    const ours = await this.match.internalIdentity();
    if (ours.domains.has(normalised)) {
      throw new import_common82.NotFoundException("That is our own domain — it is already excluded.");
    }
    await this.db.suppressedDomain.upsert({
      where: { domain: normalised },
      create: { domain: normalised, reason: options.reason ?? null },
      update: { reason: options.reason ?? null }
    });
    if (!options.purge)
      return { domain: normalised, purged: 0 };
    const company = await this.db.company.findUnique({
      where: { domain: normalised },
      select: { id: true }
    });
    if (!company)
      return { domain: normalised, purged: 0 };
    const [threads, events] = await this.db.$transaction([
      this.db.emailThread.deleteMany({ where: { companyId: company.id } }),
      this.db.calendarEvent.deleteMany({ where: { companyId: company.id } })
    ]);
    await this.stamp.recomputeAll();
    this.logger.log({
      message: "Domain suppressed",
      domain: normalised,
      purged: threads.count + events.count
    });
    return { domain: normalised, purged: threads.count + events.count };
  }
}
GoogleConnectionService = __legacyDecorateClassTS([
  import_common82.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof MailboxTokenService === "undefined" ? Object : MailboxTokenService,
    typeof SyncStateService === "undefined" ? Object : SyncStateService,
    typeof MailboxMatchService === "undefined" ? Object : MailboxMatchService,
    typeof ActivityStampService === "undefined" ? Object : ActivityStampService
  ])
], GoogleConnectionService);
async function rebuildThreads(tx, threadIds) {
  if (threadIds.length === 0)
    return;
  const remaining = await tx.emailMessage.findMany({
    where: { threadId: { in: threadIds } },
    select: { threadId: true, sentAt: true, subject: true, snippet: true },
    orderBy: { sentAt: "asc" }
  });
  const byThread = new Map;
  for (const message of remaining) {
    const group = byThread.get(message.threadId);
    if (group)
      group.push(message);
    else
      byThread.set(message.threadId, [message]);
  }
  for (const [threadId, messages] of byThread) {
    const first = messages.at(0);
    const last = messages.at(-1);
    if (!first || !last)
      continue;
    await tx.emailThread.update({
      where: { id: threadId },
      data: {
        messageCount: messages.length,
        firstMessageAt: first.sentAt,
        lastMessageAt: last.sentAt,
        subject: first.subject
      }
    });
    await tx.activity.updateMany({
      where: { emailThreadId: threadId },
      data: { body: last.snippet, occurredAt: last.sentAt }
    });
  }
}

// src/google/google-sync.service.ts
var import_common83 = require("@nestjs/common");
class GoogleSyncService {
  state;
  calendar;
  gmail;
  constructor(state, calendar, gmail) {
    this.state = state;
    this.calendar = calendar;
    this.gmail = gmail;
  }
  async runOne(userId, source) {
    const row = await this.state.get(userId, source);
    if (!row)
      return null;
    return source === "calendar" ? this.calendar.sync(row) : this.gmail.sync(row);
  }
  async runForUser(userId) {
    for (const source of GOOGLE_SYNC_SOURCES) {
      await this.runOne(userId, source);
    }
  }
}
GoogleSyncService = __legacyDecorateClassTS([
  import_common83.Injectable(),
  __legacyMetadataTS("design:paramtypes", [
    typeof SyncStateService === "undefined" ? Object : SyncStateService,
    typeof CalendarSyncService === "undefined" ? Object : CalendarSyncService,
    typeof GmailSyncService === "undefined" ? Object : GmailSyncService
  ])
], GoogleSyncService);

// src/google/google.router.ts
class GoogleRouter {
  connection;
  sync;
  conversations;
  constructor(connection, sync, conversations) {
    this.connection = connection;
    this.sync = sync;
    this.conversations = conversations;
  }
  async status(ctx) {
    return this.connection.status(ctx.user.id);
  }
  async purgeSyncedData(ctx) {
    return this.connection.purgeSyncedData(ctx.user.id);
  }
  async revokeAccess(ctx) {
    return this.connection.revoke(ctx.user.id);
  }
  async syncNow(ctx) {
    await this.sync.runForUser(ctx.user.id);
    return this.connection.status(ctx.user.id);
  }
  async setAutoCreate(ctx, input) {
    await this.connection.setAutoCreate(ctx.user.id, input.source, input.enabled);
    return this.connection.status(ctx.user.id);
  }
  async suppressDomain(input) {
    return this.connection.suppressDomain(input.domain, {
      reason: input.reason,
      purge: input.purge
    });
  }
  async thread(threadId) {
    return this.conversations.thread(threadId);
  }
  async event(eventId) {
    return this.conversations.event(eventId);
  }
}
__legacyDecorateClassTS([
  import_nestjs_trpc13.Query({
    output: googleConnectionStatusOutput,
    meta: restMeta("GET", "/google/status", ["Google"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc13.Ctx()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], GoogleRouter.prototype, "status", null);
__legacyDecorateClassTS([
  import_nestjs_trpc13.Mutation({
    output: purgeSyncedDataOutput,
    meta: restMeta("POST", "/google/purge-synced-data", ["Google"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc13.Ctx()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], GoogleRouter.prototype, "purgeSyncedData", null);
__legacyDecorateClassTS([
  import_nestjs_trpc13.Mutation({
    output: revokeAccessOutput,
    meta: restMeta("POST", "/google/revoke", ["Google"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc13.Ctx()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], GoogleRouter.prototype, "revokeAccess", null);
__legacyDecorateClassTS([
  import_nestjs_trpc13.Mutation({
    output: googleConnectionStatusOutput,
    meta: restMeta("POST", "/google/sync", ["Google"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc13.Ctx()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], GoogleRouter.prototype, "syncNow", null);
__legacyDecorateClassTS([
  import_nestjs_trpc13.Mutation({
    input: setAutoCreateInput,
    output: googleConnectionStatusOutput,
    meta: restMeta("PATCH", "/google/auto-create", ["Google"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc13.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc13.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], GoogleRouter.prototype, "setAutoCreate", null);
__legacyDecorateClassTS([
  import_nestjs_trpc13.Mutation({
    input: suppressDomainInput,
    output: suppressDomainOutput,
    meta: restMeta("POST", "/google/suppress-domain", ["Google"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc13.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], GoogleRouter.prototype, "suppressDomain", null);
__legacyDecorateClassTS([
  import_nestjs_trpc13.Query({
    input: threadInput,
    output: emailThreadOutput,
    meta: restMeta("GET", "/google/threads/{threadId}", ["Google"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc13.Input("threadId")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], GoogleRouter.prototype, "thread", null);
__legacyDecorateClassTS([
  import_nestjs_trpc13.Query({
    input: calendarEventInput,
    output: calendarEventOutput,
    meta: restMeta("GET", "/google/events/{eventId}", ["Google"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc13.Input("eventId")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], GoogleRouter.prototype, "event", null);
GoogleRouter = __legacyDecorateClassTS([
  import_nestjs_trpc13.Router({ alias: "google" }),
  import_nestjs_trpc13.UseMiddlewares(AuthMiddleware),
  __legacyDecorateParamTS(0, import_common84.Inject(GoogleConnectionService)),
  __legacyDecorateParamTS(1, import_common84.Inject(GoogleSyncService)),
  __legacyDecorateParamTS(2, import_common84.Inject(ConversationService)),
  __legacyMetadataTS("design:paramtypes", [
    typeof GoogleConnectionService === "undefined" ? Object : GoogleConnectionService,
    typeof GoogleSyncService === "undefined" ? Object : GoogleSyncService,
    typeof ConversationService === "undefined" ? Object : ConversationService
  ])
], GoogleRouter);

// src/google/google.module.ts
class GoogleModule {
}
GoogleModule = __legacyDecorateClassTS([
  import_common85.Module({
    imports: [TrpcModule, MailboxModule, AgentModule],
    providers: [
      CalendarClient,
      CalendarSyncService,
      GmailClient,
      GmailSyncService,
      GoogleSyncService,
      GoogleConnectionService,
      ConversationService,
      GoogleRouter
    ],
    exports: [GoogleSyncService, GoogleConnectionService]
  })
], GoogleModule);

// src/health/health.module.ts
var import_common87 = require("@nestjs/common");

// src/health/health.controller.ts
var import_common86 = require("@nestjs/common");
var import_swagger5 = require("@nestjs/swagger");
var import_nestjs_better_auth6 = require("@thallesp/nestjs-better-auth");
var SLOW_PROBE_MS = 250;

class HealthController {
  db;
  logger = new import_common86.Logger(HealthController.name);
  constructor(db2) {
    this.db = db2;
  }
  async check() {
    const startedAt = process.hrtime.bigint();
    try {
      await this.db.$queryRaw`SELECT 1`;
    } catch (error) {
      this.logger.error({ message: "Database health check failed" }, error instanceof Error ? error.stack : String(error));
      throw new import_common86.ServiceUnavailableException({
        status: "error",
        database: "down"
      });
    }
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    if (durationMs > SLOW_PROBE_MS) {
      this.logger.warn({
        message: "Database health check was slow",
        durationMs: Number(durationMs.toFixed(1)),
        thresholdMs: SLOW_PROBE_MS
      });
    }
    return { status: "ok", database: "up" };
  }
}
__legacyDecorateClassTS([
  import_common86.Get(),
  import_nestjs_better_auth6.AllowAnonymous(),
  import_swagger5.ApiOperation({ summary: "Report API and database liveness" }),
  import_swagger5.ApiOkResponse({
    description: "The API and its database are reachable.",
    schema: { example: { status: "ok", database: "up" } }
  }),
  import_swagger5.ApiServiceUnavailableResponse({
    description: "The database did not respond.",
    schema: { example: { status: "error", database: "down" } }
  }),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", []),
  __legacyMetadataTS("design:returntype", Promise)
], HealthController.prototype, "check", null);
HealthController = __legacyDecorateClassTS([
  import_swagger5.ApiTags("Health"),
  import_common86.Controller("health"),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db
  ])
], HealthController);

// src/health/health.module.ts
class HealthModule {
}
HealthModule = __legacyDecorateClassTS([
  import_common87.Module({
    controllers: [HealthController]
  })
], HealthModule);

// src/logging/logging.module.ts
var import_common92 = require("@nestjs/common");
var import_core = require("@nestjs/core");

// src/logging/all-exceptions.filter.ts
var import_telemetry2 = require("@crm/telemetry");
var import_common88 = require("@nestjs/common");
class AllExceptionsFilter {
  logger = new import_common88.Logger("ExceptionsHandler");
  catch(exception, host) {
    if (host.getType() !== "http") {
      throw exception;
    }
    const http = host.switchToHttp();
    const request = http.getRequest();
    const response = http.getResponse();
    const status = exception instanceof import_common88.HttpException ? exception.getStatus() : import_common88.HttpStatus.INTERNAL_SERVER_ERROR;
    const requestId = getRequestContext()?.requestId;
    this.log(exception, status, request);
    if (response.headersSent) {
      return;
    }
    response.status(status).json(body(exception, status, requestId));
  }
  log(exception, status, request) {
    const payload = {
      message: describe(exception),
      method: request.method,
      path: request.originalUrl,
      statusCode: status,
      exception: exception?.constructor?.name
    };
    if (status >= import_common88.HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(payload, exception instanceof Error ? exception.stack : undefined);
      import_telemetry2.apiError({ error: exception, route: routePattern(request), status });
      return;
    }
    this.logger.debug(payload);
  }
}
AllExceptionsFilter = __legacyDecorateClassTS([
  import_common88.Catch()
], AllExceptionsFilter);
function routePattern(request) {
  const route = request.route;
  return typeof route?.path === "string" ? route.path : null;
}
function describe(exception) {
  if (exception instanceof Error) {
    return exception.message;
  }
  return typeof exception === "string" ? exception : "Unknown exception";
}
function body(exception, status, requestId) {
  const reported = exceptionBody(exception, status);
  return requestId ? { ...reported, requestId } : reported;
}
function exceptionBody(exception, status) {
  if (!(exception instanceof import_common88.HttpException)) {
    return { statusCode: status, message: "Internal server error" };
  }
  const original = exception.getResponse();
  return typeof original === "string" ? { statusCode: status, message: original } : { ...original };
}

// src/logging/prisma-log.bridge.ts
var import_db30 = require("@crm/db");
var import_common89 = require("@nestjs/common");
class PrismaLogBridge {
  logger = new import_common89.Logger("Prisma");
  onModuleInit() {
    import_db30.setPrismaLogSink(({ level, message, target, durationMs }) => {
      const payload = durationMs === undefined ? { message, target } : { message, target, durationMs };
      if (level === "error") {
        this.logger.error(payload);
        return;
      }
      if (level === "warn") {
        this.logger.warn(payload);
        return;
      }
      this.logger.debug(payload);
    });
  }
  onApplicationShutdown() {
    import_db30.setPrismaLogSink(null);
  }
}
PrismaLogBridge = __legacyDecorateClassTS([
  import_common89.Injectable()
], PrismaLogBridge);

// src/logging/request-logger.middleware.ts
var import_node_crypto4 = require("node:crypto");
var import_common90 = require("@nestjs/common");
var REQUEST_ID_HEADER = "x-request-id";
var QUIET_PATHS = new Set(["/health"]);

class RequestLoggerMiddleware {
  logger = new import_common90.Logger("HTTP");
  use(request, response, next) {
    const requestId = incomingRequestId(request) ?? import_node_crypto4.randomUUID();
    response.setHeader(REQUEST_ID_HEADER, requestId);
    const context = {
      requestId,
      method: request.method,
      path: request.originalUrl
    };
    const startedAt = process.hrtime.bigint();
    runInRequestContext(context, () => {
      response.on("finish", () => {
        runInRequestContext(context, () => {
          this.logCompleted(request, response, context, startedAt);
        });
      });
      next();
    });
  }
  logCompleted(request, response, context, startedAt) {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    const { statusCode } = response;
    const userId = sessionUserId(request);
    if (userId) {
      context.userId = userId;
    }
    const payload = {
      message: `${context.method} ${context.path} ${statusCode} ${durationMs.toFixed(1)}ms`,
      method: context.method,
      path: context.path,
      statusCode,
      durationMs: Number(durationMs.toFixed(1)),
      ip: request.ip,
      userAgent: request.get("user-agent")
    };
    if (statusCode >= 500) {
      this.logger.error(payload);
      return;
    }
    if (statusCode >= 400) {
      this.logger.warn(payload);
      return;
    }
    if (QUIET_PATHS.has(request.path)) {
      this.logger.verbose(payload);
      return;
    }
    this.logger.log(payload);
  }
}
RequestLoggerMiddleware = __legacyDecorateClassTS([
  import_common90.Injectable()
], RequestLoggerMiddleware);
function incomingRequestId(request) {
  const header2 = request.get(REQUEST_ID_HEADER);
  if (!header2 || header2.length > 200 || !/^[\w.:-]+$/.test(header2)) {
    return;
  }
  return header2;
}
var sharedInstance = new RequestLoggerMiddleware;
function logAuthRoute(request, response, next) {
  sharedInstance.use(request, response, next);
}
function sessionUserId(request) {
  const { session } = request;
  return session?.user?.id;
}

// src/logging/user-context.interceptor.ts
var import_common91 = require("@nestjs/common");
class UserContextInterceptor {
  intercept(context, next) {
    if (context.getType() !== "http") {
      return next.handle();
    }
    const request = context.switchToHttp().getRequest();
    const userId = request.session?.user?.id;
    if (userId) {
      setRequestUserId(userId);
    }
    return next.handle();
  }
}
UserContextInterceptor = __legacyDecorateClassTS([
  import_common91.Injectable()
], UserContextInterceptor);

// src/logging/logging.module.ts
class LoggingModule {
  configure(consumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes({ path: "{*splat}", method: import_common92.RequestMethod.ALL });
  }
}
LoggingModule = __legacyDecorateClassTS([
  import_common92.Global(),
  import_common92.Module({
    providers: [
      ContextLogger,
      PrismaLogBridge,
      { provide: import_core.APP_FILTER, useClass: AllExceptionsFilter },
      { provide: import_core.APP_INTERCEPTOR, useClass: UserContextInterceptor }
    ],
    exports: [ContextLogger]
  })
], LoggingModule);

// src/microsoft/microsoft.module.ts
var import_common98 = require("@nestjs/common");

// src/microsoft/graph.client.ts
var import_common93 = require("@nestjs/common");
var BASE2 = "https://graph.microsoft.com/v1.0/me";
var MESSAGE_FIELDS = [
  "id",
  "internetMessageId",
  "conversationId",
  "subject",
  "from",
  "sender",
  "toRecipients",
  "ccRecipients",
  "receivedDateTime",
  "sentDateTime",
  "body",
  "bodyPreview",
  "internetMessageHeaders",
  "parentFolderId",
  "webLink"
].join(",");

class GraphClient {
  api;
  constructor(api) {
    this.api = api;
  }
  async me(accessToken) {
    return this.api.get(BASE2, accessToken, {
      $select: "mail,userPrincipalName"
    });
  }
  async folder(accessToken, wellKnownName) {
    return this.api.get(`${BASE2}/mailFolders/${wellKnownName}`, accessToken, { $select: "id" });
  }
  async listMessages(accessToken, options) {
    return this.api.get(`${BASE2}/messages`, accessToken, {
      $select: MESSAGE_FIELDS,
      $filter: `receivedDateTime gt ${options.after.toISOString()} and isDraft eq false`,
      $orderby: "receivedDateTime asc",
      $top: options.top
    });
  }
  async nextPage(accessToken, nextLink) {
    return this.api.get(nextLink, accessToken);
  }
}
GraphClient = __legacyDecorateClassTS([
  import_common93.Injectable(),
  __legacyMetadataTS("design:paramtypes", [
    typeof MailboxApiClient === "undefined" ? Object : MailboxApiClient
  ])
], GraphClient);

// src/microsoft/microsoft.router.ts
var import_common97 = require("@nestjs/common");
var import_nestjs_trpc14 = require("nestjs-trpc");

// src/microsoft/microsoft.contracts.ts
var import_db31 = require("@crm/db");
var import_zod21 = require("zod");
var setOutlookAutoCreateInput = import_zod21.z.object({
  source: import_zod21.z.enum(MICROSOFT_SYNC_SOURCES),
  enabled: import_zod21.z.boolean()
});
var microsoftSyncStatusOutput = import_zod21.z.enum(Object.values(import_db31.GoogleSyncStatus));
var microsoftSourceStatusOutput = import_zod21.z.object({
  source: import_zod21.z.enum(MICROSOFT_SYNC_SOURCES),
  connected: import_zod21.z.boolean(),
  status: microsoftSyncStatusOutput.nullable(),
  lastSyncedAt: import_zod21.z.string().nullable(),
  lastError: import_zod21.z.string().nullable(),
  autoCreate: import_zod21.z.boolean()
});
var microsoftConnectionStatusOutput = import_zod21.z.object({
  configured: import_zod21.z.boolean(),
  linked: import_zod21.z.boolean(),
  required: import_zod21.z.boolean(),
  hasRefreshToken: import_zod21.z.boolean(),
  sources: import_zod21.z.array(microsoftSourceStatusOutput)
});
var purgeSyncedDataOutput2 = import_zod21.z.object({
  purged: import_zod21.z.number()
});
var revokeAccessOutput2 = import_zod21.z.object({
  revoked: import_zod21.z.boolean()
});

// src/microsoft/microsoft-connection.service.ts
var import_auth33 = require("@crm/auth");
var import_common94 = require("@nestjs/common");
var PURGE_TIMEOUT_MS2 = 60000;

class MicrosoftConnectionService {
  db;
  tokens;
  state;
  stamp;
  logger = new import_common94.Logger(MicrosoftConnectionService.name);
  constructor(db2, tokens, state, stamp) {
    this.db = db2;
    this.tokens = tokens;
    this.state = state;
    this.stamp = stamp;
  }
  async status(userId) {
    await this.onConnected(userId);
    const [granted, rows, hasRefreshToken, accounts] = await Promise.all([
      this.tokens.grantedScopes(userId, import_auth29.MICROSOFT_PROVIDER_ID),
      this.state.listForUser(userId, MICROSOFT_SYNC_SOURCES),
      this.tokens.hasRefreshToken(userId, import_auth29.MICROSOFT_PROVIDER_ID),
      this.tokens.signInAccounts(userId)
    ]);
    const bySource = new Map(rows.map((row) => [row.source, row]));
    const sources = MICROSOFT_SYNC_SOURCES.map((source) => {
      const row = bySource.get(source);
      return {
        source,
        connected: granted.has(SCOPE_FOR_SOURCE[source]),
        status: row?.status ?? null,
        lastSyncedAt: row?.lastSyncedAt?.toISOString() ?? null,
        lastError: row?.lastError ?? null,
        autoCreate: row?.autoCreate ?? false
      };
    });
    return {
      configured: import_auth33.isMicrosoftConfigured(),
      linked: accounts.some((account) => account.providerId === import_auth29.MICROSOFT_PROVIDER_ID) && sources.some((source) => source.connected),
      required: import_auth33.signsInWithMicrosoft(accounts),
      hasRefreshToken,
      sources
    };
  }
  async onConnected(userId) {
    const [granted, existing] = await Promise.all([
      this.tokens.grantedScopes(userId, import_auth29.MICROSOFT_PROVIDER_ID),
      this.state.listForUser(userId, MICROSOFT_SYNC_SOURCES)
    ]);
    const known = new Set(existing.map((row) => row.source));
    const added = [];
    for (const source of MICROSOFT_SYNC_SOURCES) {
      if (!granted.has(SCOPE_FOR_SOURCE[source]))
        continue;
      if (known.has(source))
        continue;
      await this.state.ensure(userId, source, { autoCreate: false });
      added.push(source);
    }
    if (added.length > 0) {
      this.logger.log({
        message: "Microsoft connected",
        userId,
        sources: added
      });
    }
  }
  async reconcileAll() {
    const accounts = await this.db.account.findMany({
      where: {
        providerId: import_auth29.MICROSOFT_PROVIDER_ID,
        OR: MICROSOFT_SYNC_SOURCES.map((source) => ({
          scope: { contains: SCOPE_FOR_SOURCE[source] }
        }))
      },
      select: { userId: true }
    });
    for (const userId of new Set(accounts.map((row) => row.userId))) {
      await this.onConnected(userId);
    }
  }
  async purgeSyncedData(userId) {
    const mine = {
      syncedByUserId: userId,
      outlookMessageId: { not: null }
    };
    const purged = await this.db.$transaction(async (tx) => {
      const touched = await tx.emailMessage.findMany({
        where: mine,
        select: { threadId: true },
        distinct: ["threadId"]
      });
      const threadIds = touched.map((row) => row.threadId);
      const messages = await tx.emailMessage.deleteMany({ where: mine });
      await tx.emailThread.deleteMany({
        where: { id: { in: threadIds }, messages: { none: {} } }
      });
      await rebuildThreads2(tx, threadIds);
      return messages.count;
    }, { timeout: PURGE_TIMEOUT_MS2 });
    await this.stamp.recomputeAll();
    this.logger.log({ message: "Outlook data purged", userId, purged });
    return { purged };
  }
  async revoke(userId) {
    for (const source of MICROSOFT_SYNC_SOURCES) {
      await this.state.remove(userId, source);
    }
    const revoked = await this.tokens.revoke(userId, import_auth29.MICROSOFT_PROVIDER_ID);
    return { revoked };
  }
  async setAutoCreate(userId, source, enabled) {
    const row = await this.state.get(userId, source);
    if (!row) {
      throw new import_common94.NotFoundException(`${source} is not connected.`);
    }
    await this.state.setAutoCreate(userId, source, enabled);
  }
}
MicrosoftConnectionService = __legacyDecorateClassTS([
  import_common94.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof MailboxTokenService === "undefined" ? Object : MailboxTokenService,
    typeof SyncStateService === "undefined" ? Object : SyncStateService,
    typeof ActivityStampService === "undefined" ? Object : ActivityStampService
  ])
], MicrosoftConnectionService);
async function rebuildThreads2(tx, threadIds) {
  if (threadIds.length === 0)
    return;
  const remaining = await tx.emailMessage.findMany({
    where: { threadId: { in: threadIds } },
    select: { threadId: true, sentAt: true, subject: true, snippet: true },
    orderBy: { sentAt: "asc" }
  });
  const byThread = new Map;
  for (const message of remaining) {
    const group = byThread.get(message.threadId);
    if (group)
      group.push(message);
    else
      byThread.set(message.threadId, [message]);
  }
  for (const [threadId, messages] of byThread) {
    const first = messages.at(0);
    const last = messages.at(-1);
    if (!first || !last)
      continue;
    await tx.emailThread.update({
      where: { id: threadId },
      data: {
        messageCount: messages.length,
        firstMessageAt: first.sentAt,
        lastMessageAt: last.sentAt,
        subject: first.subject
      }
    });
    await tx.activity.updateMany({
      where: { emailThreadId: threadId },
      data: { body: last.snippet, occurredAt: last.sentAt }
    });
  }
}

// src/microsoft/microsoft-sync.service.ts
var import_common96 = require("@nestjs/common");

// src/microsoft/outlook-sync.service.ts
var import_db32 = require("@crm/db");
var import_common95 = require("@nestjs/common");
var MAX_MESSAGES_PER_TICK2 = 120;
var PAGE_SIZE = 50;
var OVERLAP_MS = 1000;
var EXCLUDED_FOLDERS = ["junkemail", "deleteditems"];
var CONVERSATION_ROOT_PREFIX = "outlook-conversation:";

class OutlookSyncService {
  graph;
  tokens;
  state;
  threads;
  logger = new import_common95.Logger(OutlookSyncService.name);
  constructor(graph, tokens, state, threads) {
    this.graph = graph;
    this.tokens = tokens;
    this.state = state;
    this.threads = threads;
  }
  async sync(row) {
    const initializedAt = new Date;
    const token = await this.tokens.accessTokenFor(row.userId, "outlook");
    if (token.outcome === "not-connected") {
      return {
        source: "outlook",
        userId: row.userId,
        status: "skipped",
        reason: token.reason
      };
    }
    if (token.outcome === "needs-reconnect") {
      await this.state.markNeedsReconnect(row.id, token.reason);
      return {
        source: "outlook",
        userId: row.userId,
        status: "reconnect",
        reason: token.reason
      };
    }
    await this.state.markRunning(row.id);
    const me = await this.graph.me(token.accessToken);
    if (me.outcome !== "ok") {
      return this.handleFailure(row, me);
    }
    const mailbox = (me.data.mail ?? me.data.userPrincipalName ?? "").toLowerCase();
    if (!mailbox) {
      await this.state.markFailed(row.id, "Microsoft returned no mailbox address.");
      return {
        source: "outlook",
        userId: row.userId,
        status: "failed",
        reason: "No mailbox address."
      };
    }
    if (!row.cursor) {
      return this.start(row, initializedAt);
    }
    return this.incremental(row, token.accessToken, mailbox, row.cursor);
  }
  async start(row, initializedAt) {
    await this.state.settle(row.id, {
      cursor: initializedAt.toISOString(),
      status: import_db32.GoogleSyncStatus.RUNNING
    });
    this.logger.log({
      message: "Outlook sync started — watching for new mail",
      userId: row.userId
    });
    return { source: "outlook", userId: row.userId, status: "synced" };
  }
  async incremental(row, accessToken, mailbox, cursor) {
    const from = new Date(cursor);
    if (Number.isNaN(from.getTime())) {
      await this.state.clearCursor(row.id, "The stored cursor was not a date.");
      return {
        source: "outlook",
        userId: row.userId,
        status: "synced",
        reason: "Cursor reset; resuming from now."
      };
    }
    const folders = await this.excludedFolderIds(accessToken);
    if (folders.outcome !== "ok") {
      return this.handleFailure(row, folders.failure);
    }
    const excluded = folders.ids;
    let page = await this.graph.listMessages(accessToken, {
      after: new Date(from.getTime() - OVERLAP_MS),
      top: PAGE_SIZE
    });
    let context = null;
    let written = 0;
    let seen = 0;
    let furthest = from;
    while (page.outcome === "ok") {
      const remaining = MAX_MESSAGES_PER_TICK2 - seen;
      const messages = (page.data.value ?? []).slice(0, Math.max(remaining, 0));
      for (const message of messages) {
        seen += 1;
        const receivedAt = message.receivedDateTime ? new Date(message.receivedDateTime) : null;
        if (receivedAt && !Number.isNaN(receivedAt.getTime())) {
          if (receivedAt > furthest)
            furthest = receivedAt;
        }
        if (message.parentFolderId && excluded.has(message.parentFolderId)) {
          continue;
        }
        const parsed = this.parse(message);
        if (!parsed)
          continue;
        context ??= await this.threads.context();
        const stored = await this.threads.store(row, { mailbox, origin: "outlook" }, parsed, context);
        if (stored)
          written += 1;
      }
      const nextLink = page.data["@odata.nextLink"];
      if (!nextLink || seen >= MAX_MESSAGES_PER_TICK2)
        break;
      page = await this.graph.nextPage(accessToken, nextLink);
    }
    if (page.outcome !== "ok") {
      return this.handleFailure(row, page);
    }
    await this.state.settle(row.id, {
      cursor: furthest.toISOString(),
      status: import_db32.GoogleSyncStatus.RUNNING
    });
    if (written > 0) {
      this.logger.log({
        message: "Outlook incremental sync",
        userId: row.userId,
        messagesWritten: written,
        messagesSeen: seen
      });
    }
    return {
      source: "outlook",
      userId: row.userId,
      status: "synced",
      messagesWritten: written
    };
  }
  async excludedFolderIds(accessToken) {
    const ids = new Set;
    for (const name of EXCLUDED_FOLDERS) {
      const folder = await this.graph.folder(accessToken, name);
      if (folder.outcome === "ok") {
        if (folder.data.id)
          ids.add(folder.data.id);
        continue;
      }
      if (isMissingFolder(folder))
        continue;
      return { outcome: "lookup-failed", failure: folder };
    }
    return { outcome: "ok", ids };
  }
  parse(message) {
    const internetMessageId = message.internetMessageId?.trim();
    if (!internetMessageId)
      return null;
    const from = addressOf(message.from ?? message.sender);
    if (!from)
      return null;
    const sentAt = this.sentAt(message);
    if (!sentAt)
      return null;
    const rootId = this.rootIdOf(message, internetMessageId);
    const to = addressList(message.toRecipients, "to");
    const cc = addressList(message.ccRecipients, "cc");
    const raw = message.body?.content ?? message.bodyPreview ?? "";
    const text = message.body?.contentType?.toLowerCase() === "html" ? stripHtml(raw) : raw;
    return {
      rfcMessageId: normaliseMessageId(internetMessageId),
      rootId,
      subject: message.subject?.trim() || null,
      from,
      recipients: [...to, ...cc],
      body: stripQuotedHistory(text),
      sentAt,
      outlookMessageId: message.id ?? null,
      outlookWebLink: message.webLink ?? null
    };
  }
  rootIdOf(message, internetMessageId) {
    const headers = message.internetMessageHeaders ?? [];
    const value = (name) => {
      const wanted = name.toLowerCase();
      const found = headers.find((entry) => entry.name?.toLowerCase() === wanted);
      return found?.value?.trim() || null;
    };
    const references = value("references");
    const inReplyTo = value("in-reply-to");
    if (references || inReplyTo) {
      const root = rootMessageIdFrom({
        references,
        inReplyTo,
        messageId: internetMessageId
      });
      if (root)
        return root;
    }
    if (message.conversationId) {
      return `${CONVERSATION_ROOT_PREFIX}${message.conversationId}`;
    }
    return normaliseMessageId(internetMessageId);
  }
  sentAt(message) {
    for (const raw of [message.sentDateTime, message.receivedDateTime]) {
      if (!raw)
        continue;
      const at = new Date(raw);
      if (!Number.isNaN(at.getTime()))
        return at;
    }
    return null;
  }
  async handleFailure(row, result) {
    if (result.outcome === "unauthorized") {
      await this.state.markNeedsReconnect(row.id, result.reason);
      return {
        source: "outlook",
        userId: row.userId,
        status: "reconnect",
        reason: result.reason
      };
    }
    if (result.outcome === "rate-limited") {
      await this.state.markRateLimited(row.id, result.retryAfterMs ?? 60000);
      return {
        source: "outlook",
        userId: row.userId,
        status: "rate-limited",
        reason: result.reason
      };
    }
    await this.state.markFailed(row.id, result.reason);
    return {
      source: "outlook",
      userId: row.userId,
      status: "failed",
      reason: result.reason
    };
  }
}
OutlookSyncService = __legacyDecorateClassTS([
  import_common95.Injectable(),
  __legacyMetadataTS("design:paramtypes", [
    typeof GraphClient === "undefined" ? Object : GraphClient,
    typeof MailboxTokenService === "undefined" ? Object : MailboxTokenService,
    typeof SyncStateService === "undefined" ? Object : SyncStateService,
    typeof ThreadWriterService === "undefined" ? Object : ThreadWriterService
  ])
], OutlookSyncService);
function isMissingFolder(failure) {
  return failure.outcome === "cursor-invalid";
}
function addressOf(entry) {
  const address = entry?.emailAddress?.address?.trim();
  if (!address)
    return null;
  const name = entry?.emailAddress?.name?.trim();
  return parseAddress(name ? `${name} <${address}>` : address) ?? null;
}
function addressList(entries, kind) {
  const seen = new Set;
  const people = [];
  for (const entry of entries ?? []) {
    const person = addressOf(entry);
    if (!person || seen.has(person.email))
      continue;
    seen.add(person.email);
    people.push({ email: person.email, name: person.name, kind });
  }
  return people;
}

// src/microsoft/microsoft-sync.service.ts
class MicrosoftSyncService {
  state;
  outlook;
  constructor(state, outlook) {
    this.state = state;
    this.outlook = outlook;
  }
  async runOne(userId, source) {
    const row = await this.state.get(userId, source);
    if (!row)
      return null;
    return this.outlook.sync(row);
  }
  async runForUser(userId) {
    for (const source of MICROSOFT_SYNC_SOURCES) {
      await this.runOne(userId, source);
    }
  }
}
MicrosoftSyncService = __legacyDecorateClassTS([
  import_common96.Injectable(),
  __legacyMetadataTS("design:paramtypes", [
    typeof SyncStateService === "undefined" ? Object : SyncStateService,
    typeof OutlookSyncService === "undefined" ? Object : OutlookSyncService
  ])
], MicrosoftSyncService);

// src/microsoft/microsoft.router.ts
class MicrosoftRouter {
  connection;
  sync;
  constructor(connection, sync) {
    this.connection = connection;
    this.sync = sync;
  }
  async status(ctx) {
    return this.connection.status(ctx.user.id);
  }
  async purgeSyncedData(ctx) {
    return this.connection.purgeSyncedData(ctx.user.id);
  }
  async revokeAccess(ctx) {
    return this.connection.revoke(ctx.user.id);
  }
  async syncNow(ctx) {
    await this.sync.runForUser(ctx.user.id);
    return this.connection.status(ctx.user.id);
  }
  async setAutoCreate(ctx, input) {
    await this.connection.setAutoCreate(ctx.user.id, input.source, input.enabled);
    return this.connection.status(ctx.user.id);
  }
}
__legacyDecorateClassTS([
  import_nestjs_trpc14.Query({
    output: microsoftConnectionStatusOutput,
    meta: restMeta("GET", "/microsoft/status", ["Microsoft"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc14.Ctx()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], MicrosoftRouter.prototype, "status", null);
__legacyDecorateClassTS([
  import_nestjs_trpc14.Mutation({
    output: purgeSyncedDataOutput2,
    meta: restMeta("POST", "/microsoft/purge-synced-data", ["Microsoft"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc14.Ctx()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], MicrosoftRouter.prototype, "purgeSyncedData", null);
__legacyDecorateClassTS([
  import_nestjs_trpc14.Mutation({
    output: revokeAccessOutput2,
    meta: restMeta("POST", "/microsoft/revoke", ["Microsoft"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc14.Ctx()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], MicrosoftRouter.prototype, "revokeAccess", null);
__legacyDecorateClassTS([
  import_nestjs_trpc14.Mutation({
    output: microsoftConnectionStatusOutput,
    meta: restMeta("POST", "/microsoft/sync", ["Microsoft"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc14.Ctx()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], MicrosoftRouter.prototype, "syncNow", null);
__legacyDecorateClassTS([
  import_nestjs_trpc14.Mutation({
    input: setOutlookAutoCreateInput,
    output: microsoftConnectionStatusOutput,
    meta: restMeta("PATCH", "/microsoft/auto-create", ["Microsoft"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc14.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc14.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], MicrosoftRouter.prototype, "setAutoCreate", null);
MicrosoftRouter = __legacyDecorateClassTS([
  import_nestjs_trpc14.Router({ alias: "microsoft" }),
  import_nestjs_trpc14.UseMiddlewares(AuthMiddleware),
  __legacyDecorateParamTS(0, import_common97.Inject(MicrosoftConnectionService)),
  __legacyDecorateParamTS(1, import_common97.Inject(MicrosoftSyncService)),
  __legacyMetadataTS("design:paramtypes", [
    typeof MicrosoftConnectionService === "undefined" ? Object : MicrosoftConnectionService,
    typeof MicrosoftSyncService === "undefined" ? Object : MicrosoftSyncService
  ])
], MicrosoftRouter);

// src/microsoft/microsoft.module.ts
class MicrosoftModule {
}
MicrosoftModule = __legacyDecorateClassTS([
  import_common98.Module({
    imports: [TrpcModule, MailboxModule],
    providers: [
      GraphClient,
      OutlookSyncService,
      MicrosoftSyncService,
      MicrosoftConnectionService,
      MicrosoftRouter
    ],
    exports: [MicrosoftSyncService, MicrosoftConnectionService]
  })
], MicrosoftModule);

// src/saved-views/saved-views.module.ts
var import_common101 = require("@nestjs/common");

// src/saved-views/saved-views.router.ts
var import_common100 = require("@nestjs/common");
var import_nestjs_trpc15 = require("nestjs-trpc");

// src/saved-views/saved-views.contracts.ts
var import_fields20 = require("@crm/db/fields");
var import_saved_view = require("@crm/validation/saved-view");
var import_zod22 = require("zod");
var savedViewEntity = import_zod22.z.enum(import_fields20.FIELD_ENTITIES);
var savedViewListInput = import_zod22.z.object({
  entity: savedViewEntity
});
var savedViewCreateInput = import_zod22.z.object({
  entity: savedViewEntity,
  name: import_zod22.z.string().trim().min(1, "A view needs a name.").max(120),
  shared: import_zod22.z.boolean().default(false),
  filters: import_saved_view.savedViewFilters
});
var savedViewUpdateData = import_zod22.z.object({
  name: import_zod22.z.string().trim().min(1).max(120).optional(),
  shared: import_zod22.z.boolean().optional(),
  filters: import_saved_view.savedViewFilters.optional()
});
var savedViewUpdateArgs = import_zod22.z.object({
  id: import_zod22.z.string(),
  data: savedViewUpdateData
});
var savedViewIdInput = import_zod22.z.object({ id: import_zod22.z.string() });
var savedViewOutput = import_zod22.z.object({
  id: import_zod22.z.string(),
  entity: savedViewEntity,
  name: import_zod22.z.string(),
  shared: import_zod22.z.boolean(),
  filters: import_saved_view.savedViewFilters,
  mine: import_zod22.z.boolean(),
  createdAt: import_zod22.z.string(),
  updatedAt: import_zod22.z.string()
});
var savedViewListOutput = import_zod22.z.array(savedViewOutput);
var savedViewDeleteOutput = import_zod22.z.object({ id: import_zod22.z.string() });

// src/saved-views/saved-views.service.ts
var import_db33 = require("@crm/db");
var import_saved_view2 = require("@crm/validation/saved-view");
var import_common99 = require("@nestjs/common");
class SavedViewsService {
  db;
  constructor(db2) {
    this.db = db2;
  }
  async list(entity, userId) {
    const rows = await this.db.savedView.findMany({
      where: { entity, OR: [{ shared: true }, { ownerId: userId }] },
      orderBy: { name: "asc" }
    });
    return rows.map((row) => this.serialize(row, userId));
  }
  async create(input, userId) {
    try {
      const row = await this.db.savedView.create({
        data: {
          entity: input.entity,
          name: input.name,
          shared: input.shared,
          filters: input.filters,
          ownerId: userId
        }
      });
      return this.serialize(row, userId);
    } catch (error) {
      throw this.translate(error);
    }
  }
  async update(id, data, userId) {
    const existing = await this.db.savedView.findUnique({ where: { id } });
    if (!existing || existing.ownerId !== userId) {
      throw new import_common99.NotFoundException(`No saved view with id ${id}.`);
    }
    try {
      const row = await this.db.savedView.update({
        where: { id },
        data: {
          name: data.name,
          shared: data.shared,
          filters: data.filters
        }
      });
      return this.serialize(row, userId);
    } catch (error) {
      throw this.translate(error, id);
    }
  }
  async delete(id, userId) {
    const existing = await this.db.savedView.findUnique({ where: { id } });
    if (!existing || existing.ownerId !== userId) {
      throw new import_common99.NotFoundException(`No saved view with id ${id}.`);
    }
    try {
      await this.db.savedView.delete({ where: { id } });
    } catch (error) {
      throw this.translate(error, id);
    }
    return { id };
  }
  serialize(row, userId) {
    return {
      id: row.id,
      entity: row.entity,
      name: row.name,
      shared: row.shared,
      filters: import_saved_view2.parseSavedViewFilters(row.filters),
      mine: row.ownerId === userId,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString()
    };
  }
  translate(cause, id) {
    if (cause instanceof import_db33.Prisma.PrismaClientKnownRequestError) {
      if (cause.code === "P2002") {
        throw new import_common99.ConflictException("You already have a view with that name.");
      }
      if (cause.code === "P2025") {
        throw new import_common99.NotFoundException(`No saved view with id ${id}.`);
      }
    }
    throw cause;
  }
}
SavedViewsService = __legacyDecorateClassTS([
  import_common99.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db
  ])
], SavedViewsService);

// src/saved-views/saved-views.router.ts
class SavedViewsRouter {
  savedViews;
  constructor(savedViews) {
    this.savedViews = savedViews;
  }
  async list(ctx, input) {
    return this.savedViews.list(input.entity, ctx.user.id);
  }
  async create(ctx, input) {
    return this.savedViews.create(input, ctx.user.id);
  }
  async update(ctx, input) {
    return this.savedViews.update(input.id, input.data, ctx.user.id);
  }
  async delete(ctx, id) {
    return this.savedViews.delete(id, ctx.user.id);
  }
}
__legacyDecorateClassTS([
  import_nestjs_trpc15.Query({
    input: savedViewListInput,
    output: savedViewListOutput,
    meta: restMeta("GET", "/saved-views", ["Saved Views"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc15.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc15.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], SavedViewsRouter.prototype, "list", null);
__legacyDecorateClassTS([
  import_nestjs_trpc15.Mutation({
    input: savedViewCreateInput,
    output: savedViewOutput,
    meta: restMeta("POST", "/saved-views", ["Saved Views"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc15.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc15.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], SavedViewsRouter.prototype, "create", null);
__legacyDecorateClassTS([
  import_nestjs_trpc15.Mutation({
    input: savedViewUpdateArgs,
    output: savedViewOutput,
    meta: restMeta("PATCH", "/saved-views/{id}", ["Saved Views"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc15.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc15.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], SavedViewsRouter.prototype, "update", null);
__legacyDecorateClassTS([
  import_nestjs_trpc15.Mutation({
    input: savedViewIdInput,
    output: savedViewDeleteOutput,
    meta: restMeta("DELETE", "/saved-views/{id}", ["Saved Views"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc15.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc15.Input("id")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], SavedViewsRouter.prototype, "delete", null);
SavedViewsRouter = __legacyDecorateClassTS([
  import_nestjs_trpc15.Router({ alias: "savedViews" }),
  import_nestjs_trpc15.UseMiddlewares(AuthMiddleware),
  __legacyDecorateParamTS(0, import_common100.Inject(SavedViewsService)),
  __legacyMetadataTS("design:paramtypes", [
    typeof SavedViewsService === "undefined" ? Object : SavedViewsService
  ])
], SavedViewsRouter);

// src/saved-views/saved-views.module.ts
class SavedViewsModule {
}
SavedViewsModule = __legacyDecorateClassTS([
  import_common101.Module({
    imports: [TrpcModule],
    providers: [SavedViewsService, SavedViewsRouter],
    exports: [SavedViewsService]
  })
], SavedViewsModule);

// src/search/search.module.ts
var import_common104 = require("@nestjs/common");

// src/search/search.router.ts
var import_common103 = require("@nestjs/common");
var import_nestjs_trpc16 = require("nestjs-trpc");
var import_zod23 = require("zod");

// src/search/search.service.ts
var import_common102 = require("@nestjs/common");
var PER_KIND = 5;

class SearchService {
  db;
  constructor(db2) {
    this.db = db2;
  }
  async quick(q) {
    const term = q.trim();
    if (term.length < 2)
      return { hits: [] };
    const [companies, contacts, deals] = await Promise.all([
      this.db.company.findMany({
        where: {
          OR: [
            { name: { contains: term, mode: "insensitive" } },
            { domain: { contains: term, mode: "insensitive" } }
          ]
        },
        take: PER_KIND,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          domain: true,
          iconUrl: true,
          iconDarkUrl: true,
          iconTone: true
        }
      }),
      this.db.contact.findMany({
        where: {
          OR: [
            { firstName: { contains: term, mode: "insensitive" } },
            { lastName: { contains: term, mode: "insensitive" } },
            { email: { contains: term, mode: "insensitive" } }
          ]
        },
        take: PER_KIND,
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          imageUrl: true,
          company: { select: { name: true } }
        }
      }),
      this.db.deal.findMany({
        where: { name: { contains: term, mode: "insensitive" } },
        take: PER_KIND,
        orderBy: [{ stage: "asc" }, { name: "asc" }],
        select: {
          id: true,
          name: true,
          company: {
            select: {
              name: true,
              iconUrl: true,
              iconDarkUrl: true,
              iconTone: true
            }
          }
        }
      })
    ]);
    return {
      hits: [
        ...companies.map((company) => ({
          kind: "company",
          id: company.id,
          label: company.name,
          detail: company.domain,
          iconUrl: company.iconUrl,
          iconDarkUrl: company.iconDarkUrl,
          iconTone: company.iconTone,
          imageUrl: null
        })),
        ...contacts.map((contact) => ({
          kind: "contact",
          id: contact.id,
          label: [contact.firstName, contact.lastName].filter(Boolean).join(" ") || (contact.email ?? "Unnamed"),
          detail: contact.company?.name ?? contact.email,
          iconUrl: null,
          iconDarkUrl: null,
          iconTone: null,
          imageUrl: contact.imageUrl
        })),
        ...deals.map((deal) => ({
          kind: "deal",
          id: deal.id,
          label: deal.name,
          detail: deal.company.name,
          iconUrl: deal.company.iconUrl,
          iconDarkUrl: deal.company.iconDarkUrl,
          iconTone: deal.company.iconTone,
          imageUrl: null
        }))
      ]
    };
  }
}
SearchService = __legacyDecorateClassTS([
  import_common102.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db
  ])
], SearchService);

// src/search/search.router.ts
var quickInput = import_zod23.z.object({ q: import_zod23.z.string().default("") });
var searchHitOutput = import_zod23.z.object({
  kind: import_zod23.z.enum(["company", "contact", "deal"]),
  id: import_zod23.z.string(),
  label: import_zod23.z.string(),
  detail: import_zod23.z.string().nullable(),
  iconUrl: import_zod23.z.string().nullable(),
  iconDarkUrl: import_zod23.z.string().nullable(),
  iconTone: import_zod23.z.string().nullable(),
  imageUrl: import_zod23.z.string().nullable()
});
var quickOutput = import_zod23.z.object({ hits: import_zod23.z.array(searchHitOutput) });

class SearchRouter {
  search;
  constructor(search) {
    this.search = search;
  }
  async quick(q) {
    return this.search.quick(q);
  }
}
__legacyDecorateClassTS([
  import_nestjs_trpc16.Query({
    input: quickInput,
    output: quickOutput,
    meta: restMeta("GET", "/search", ["Search"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc16.Input("q")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], SearchRouter.prototype, "quick", null);
SearchRouter = __legacyDecorateClassTS([
  import_nestjs_trpc16.Router({ alias: "search" }),
  import_nestjs_trpc16.UseMiddlewares(AuthMiddleware),
  __legacyDecorateParamTS(0, import_common103.Inject(SearchService)),
  __legacyMetadataTS("design:paramtypes", [
    typeof SearchService === "undefined" ? Object : SearchService
  ])
], SearchRouter);

// src/search/search.module.ts
class SearchModule {
}
SearchModule = __legacyDecorateClassTS([
  import_common104.Module({
    imports: [TrpcModule],
    providers: [SearchService, SearchRouter]
  })
], SearchModule);

// src/settings/settings.module.ts
var import_common108 = require("@nestjs/common");

// src/settings/model-catalog.service.ts
var import_cache_manager4 = require("@nestjs/cache-manager");
var import_common105 = require("@nestjs/common");
var import_zod24 = require("zod");
var CATALOG_URL = "https://ai-gateway.vercel.sh/v1/models";
var CATALOG_TTL_MS = 30 * 60000;
var CATALOG_KEY = "settings:model-catalog";
var CATALOG_TIMEOUT_MS = 5000;
var gatewayRate = import_zod24.z.union([import_zod24.z.number(), import_zod24.z.string()]).transform((value) => Number(value)).refine((value) => Number.isFinite(value)).nullable().catch(null);
var gatewayModel = import_zod24.z.object({
  id: import_zod24.z.string(),
  name: import_zod24.z.string().catch(""),
  owned_by: import_zod24.z.string().catch(""),
  type: import_zod24.z.string().catch(""),
  tags: import_zod24.z.array(import_zod24.z.json()).catch([]),
  context_window: import_zod24.z.number(),
  pricing: import_zod24.z.object({ input: gatewayRate, output: gatewayRate }).nullable().catch(null)
});
var gatewayCatalog = import_zod24.z.object({ data: import_zod24.z.array(import_zod24.z.json()).catch([]) }).catch({ data: [] });
function usable(model) {
  return model.type === "language" && model.tags.includes("tool-use");
}
function toCatalogModel(model) {
  const input = model.pricing?.input ?? null;
  const output = model.pricing?.output ?? null;
  return {
    id: model.id,
    name: model.name || model.id,
    provider: model.owned_by || (model.id.split("/")[0] ?? model.id),
    contextWindowTokens: model.context_window,
    pricing: input !== null && output !== null ? { input, output } : null
  };
}

class ModelCatalogService {
  cache;
  logger = new import_common105.Logger(ModelCatalogService.name);
  constructor(cache) {
    this.cache = cache;
  }
  async models() {
    const cached = await this.cache.get(CATALOG_KEY);
    if (cached)
      return cached;
    const models = await this.fetchCatalog();
    if (!models)
      return null;
    await this.cache.set(CATALOG_KEY, models, CATALOG_TTL_MS);
    return models;
  }
  async find(id) {
    const models = await this.models();
    return models?.find((model) => model.id === id) ?? null;
  }
  async fetchCatalog() {
    try {
      const response = await fetch(CATALOG_URL, {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(CATALOG_TIMEOUT_MS)
      });
      if (!response.ok) {
        this.logger.warn({
          message: "Model catalog request failed",
          status: response.status
        });
        return null;
      }
      const body2 = gatewayCatalog.parse(await response.json());
      const models = body2.data.flatMap((entry) => {
        const parsed = gatewayModel.safeParse(entry);
        return parsed.success && usable(parsed.data) ? [toCatalogModel(parsed.data)] : [];
      });
      models.sort((a, b) => a.provider.localeCompare(b.provider) || a.name.localeCompare(b.name));
      this.logger.log({
        message: "Model catalog loaded",
        models: models.length
      });
      return models;
    } catch (error) {
      this.logger.warn({
        message: "Model catalog unavailable",
        reason: error instanceof Error ? error.message : String(error)
      });
      return null;
    }
  }
}
ModelCatalogService = __legacyDecorateClassTS([
  import_common105.Injectable(),
  __legacyDecorateParamTS(0, import_common105.Inject(import_cache_manager4.CACHE_MANAGER)),
  __legacyMetadataTS("design:paramtypes", [
    typeof Cache === "undefined" ? Object : Cache
  ])
], ModelCatalogService);

// src/settings/settings.router.ts
var import_common107 = require("@nestjs/common");
var import_nestjs_trpc17 = require("nestjs-trpc");

// src/settings/settings.contracts.ts
var import_settings5 = require("@crm/db/settings");
var import_zod25 = require("zod");
var catalogModelOutput = import_zod25.z.object({
  id: import_zod25.z.string(),
  name: import_zod25.z.string(),
  provider: import_zod25.z.string(),
  contextWindowTokens: import_zod25.z.number(),
  pricing: import_zod25.z.object({ input: import_zod25.z.number(), output: import_zod25.z.number() }).nullable()
});
var agentModelOutput = import_zod25.z.object({
  selectedId: import_zod25.z.string().nullable(),
  effectiveId: import_zod25.z.string(),
  defaultId: import_zod25.z.string(),
  effective: catalogModelOutput.nullable(),
  updatedAt: import_zod25.z.string().nullable()
});
var modelCatalogOutput = import_zod25.z.object({
  models: import_zod25.z.array(catalogModelOutput),
  available: import_zod25.z.boolean()
});
var researchKeyOutput = import_zod25.z.object({
  configured: import_zod25.z.boolean(),
  hint: import_zod25.z.string().nullable()
});
var archiveRetentionOutput = import_zod25.z.object({
  days: import_zod25.z.number()
});
var setAgentModelInput = import_zod25.z.object({
  modelId: import_zod25.z.string().trim().min(1).max(200).nullable()
});
var setResearchKeyInput = import_zod25.z.object({
  apiKey: import_zod25.z.string().trim().min(8, "That does not look like a Context API key — it is too short.").max(500, "That does not look like a Context API key — it is too long.").refine((value) => !/\s/.test(value), "An API key has no spaces in it. Paste the whole key on its own.")
});
var setArchiveRetentionDaysInput = import_zod25.z.object({
  days: import_zod25.z.number().int().min(import_settings5.MIN_ARCHIVE_RETENTION_DAYS, `Retention has to be at least ${import_settings5.MIN_ARCHIVE_RETENTION_DAYS} day.`).max(import_settings5.MAX_ARCHIVE_RETENTION_DAYS, `Retention cannot be longer than ${import_settings5.MAX_ARCHIVE_RETENTION_DAYS} days.`)
});

// src/settings/settings.service.ts
var import_settings6 = require("@crm/db/settings");
var import_common106 = require("@nestjs/common");
class SettingsService {
  db;
  catalog;
  researchKeys;
  backfill;
  logger = new import_common106.Logger(SettingsService.name);
  constructor(db2, catalog, researchKeys, backfill) {
    this.db = db2;
    this.catalog = catalog;
    this.researchKeys = researchKeys;
    this.backfill = backfill;
  }
  async agentModel() {
    const [model, row] = await Promise.all([
      import_settings6.readAgentModel(this.db),
      this.db.appSetting.findFirst({ select: { updatedAt: true } })
    ]);
    return {
      selectedId: model.isDefault ? null : model.id,
      effectiveId: model.id,
      defaultId: import_settings6.DEFAULT_AGENT_MODEL.id,
      effective: await this.catalog.find(model.id),
      updatedAt: row?.updatedAt.toISOString() ?? null
    };
  }
  async setAgentModel(modelId) {
    if (modelId === null) {
      await import_settings6.writeAgentModel(this.db, null);
      this.logger.log({ message: "Agent model reset to the default" });
      return this.agentModel();
    }
    const models = await this.catalog.models();
    if (!models) {
      throw new import_common106.BadRequestException("Could not reach the AI Gateway to check that model. Try again in a moment.");
    }
    const chosen = models.find((model) => model.id === modelId);
    if (!chosen) {
      throw new import_common106.BadRequestException(`The AI Gateway does not serve a tool-using model called "${modelId}".`);
    }
    await import_settings6.writeAgentModel(this.db, {
      id: chosen.id,
      contextWindowTokens: chosen.contextWindowTokens
    });
    this.logger.log({ message: "Agent model changed", modelId: chosen.id });
    return this.agentModel();
  }
  async modelCatalog() {
    const models = await this.catalog.models();
    return { models: models ?? [], available: models !== null };
  }
  async researchKey() {
    const key = await import_settings6.readContextDevKey(this.db);
    return { configured: key !== null, hint: key ? import_settings6.maskKey(key) : null };
  }
  async setResearchKey(apiKey) {
    const check = await this.researchKeys.verify(apiKey);
    if (check.outcome === "invalid") {
      throw new import_common106.BadRequestException(check.reason);
    }
    await import_settings6.writeContextDevKey(this.db, apiKey);
    this.logger.log({
      message: "Context key saved",
      verified: check.outcome === "valid"
    });
    this.backfill.run("companies").then(({ queued, remaining }) => {
      if (queued > 0) {
        this.logger.log({
          message: "Queued the research that was waiting on a key",
          queued,
          remaining
        });
      }
    }).catch((cause) => {
      this.logger.warn({ message: "Could not queue the waiting research" }, cause instanceof Error ? cause.stack : String(cause));
    });
    return this.researchKey();
  }
  async archiveRetention() {
    return { days: await import_settings6.readArchiveRetentionDays(this.db) };
  }
  async setArchiveRetention(days) {
    const saved = await import_settings6.writeArchiveRetentionDays(this.db, days);
    this.logger.log({
      message: "Archive retention changed",
      days: saved
    });
    return { days: saved };
  }
}
SettingsService = __legacyDecorateClassTS([
  import_common106.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof ModelCatalogService === "undefined" ? Object : ModelCatalogService,
    typeof ResearchKeyService === "undefined" ? Object : ResearchKeyService,
    typeof BackfillService === "undefined" ? Object : BackfillService
  ])
], SettingsService);

// src/settings/settings.router.ts
class SettingsRouter {
  settings;
  constructor(settings) {
    this.settings = settings;
  }
  async agentModel() {
    return this.settings.agentModel();
  }
  async modelCatalog() {
    return this.settings.modelCatalog();
  }
  async setAgentModel(input) {
    return this.settings.setAgentModel(input.modelId);
  }
  async researchKey() {
    return this.settings.researchKey();
  }
  async setResearchKey(input) {
    return this.settings.setResearchKey(input.apiKey);
  }
  async archiveRetention() {
    return this.settings.archiveRetention();
  }
  async setArchiveRetention(input) {
    return this.settings.setArchiveRetention(input.days);
  }
}
__legacyDecorateClassTS([
  import_nestjs_trpc17.Query({
    output: agentModelOutput,
    meta: restMeta("GET", "/settings/agent-model", ["Settings"])
  }),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", []),
  __legacyMetadataTS("design:returntype", Promise)
], SettingsRouter.prototype, "agentModel", null);
__legacyDecorateClassTS([
  import_nestjs_trpc17.Query({
    output: modelCatalogOutput,
    meta: restMeta("GET", "/settings/model-catalog", ["Settings"])
  }),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", []),
  __legacyMetadataTS("design:returntype", Promise)
], SettingsRouter.prototype, "modelCatalog", null);
__legacyDecorateClassTS([
  import_nestjs_trpc17.Mutation({
    input: setAgentModelInput,
    output: agentModelOutput,
    meta: restMeta("PATCH", "/settings/agent-model", ["Settings"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc17.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], SettingsRouter.prototype, "setAgentModel", null);
__legacyDecorateClassTS([
  import_nestjs_trpc17.Query({
    output: researchKeyOutput,
    meta: restMeta("GET", "/settings/research-key", ["Settings"])
  }),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", []),
  __legacyMetadataTS("design:returntype", Promise)
], SettingsRouter.prototype, "researchKey", null);
__legacyDecorateClassTS([
  import_nestjs_trpc17.Mutation({
    input: setResearchKeyInput,
    output: researchKeyOutput,
    meta: restMeta("PATCH", "/settings/research-key", ["Settings"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc17.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], SettingsRouter.prototype, "setResearchKey", null);
__legacyDecorateClassTS([
  import_nestjs_trpc17.Query({
    output: archiveRetentionOutput,
    meta: restMeta("GET", "/settings/archive-retention", ["Settings"])
  }),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", []),
  __legacyMetadataTS("design:returntype", Promise)
], SettingsRouter.prototype, "archiveRetention", null);
__legacyDecorateClassTS([
  import_nestjs_trpc17.Mutation({
    input: setArchiveRetentionDaysInput,
    output: archiveRetentionOutput,
    meta: restMeta("PATCH", "/settings/archive-retention", ["Settings"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc17.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], SettingsRouter.prototype, "setArchiveRetention", null);
SettingsRouter = __legacyDecorateClassTS([
  import_nestjs_trpc17.Router({ alias: "settings" }),
  import_nestjs_trpc17.UseMiddlewares(AuthMiddleware),
  __legacyDecorateParamTS(0, import_common107.Inject(SettingsService)),
  __legacyMetadataTS("design:paramtypes", [
    typeof SettingsService === "undefined" ? Object : SettingsService
  ])
], SettingsRouter);

// src/settings/settings.module.ts
class SettingsModule {
}
SettingsModule = __legacyDecorateClassTS([
  import_common108.Module({
    imports: [TrpcModule, AgentModule, BackfillModule],
    providers: [ModelCatalogService, SettingsService, SettingsRouter],
    exports: [SettingsService]
  })
], SettingsModule);

// src/slack/slack.module.ts
var import_common112 = require("@nestjs/common");

// src/slack/slack.router.ts
var import_common111 = require("@nestjs/common");
var import_nestjs_trpc18 = require("nestjs-trpc");

// src/slack/slack.contracts.ts
var import_zod26 = require("zod");

// src/slack/slack-config.ts
var SECOND_MS3 = 1000;
var MINUTE_MS2 = 60 * SECOND_MS3;
var SLACK = {
  sync: {
    activeMs: 30 * SECOND_MS3,
    stalledAfterMs: 3 * MINUTE_MS2
  },
  channels: {
    pageSize: 50,
    maxPageSize: 100
  }
};
var SLACK_SYNC_STATES = ["idle", "syncing", "stalled"];

// src/slack/slack.contracts.ts
var slackChannelsInput = import_zod26.z.object({
  cursor: import_zod26.z.string().trim().min(1).max(64).nullish(),
  limit: import_zod26.z.number().int().min(1).max(SLACK.channels.maxPageSize).optional(),
  query: import_zod26.z.string().trim().max(120).optional()
});
var slackJoinChannelInput = import_zod26.z.object({
  channelId: import_zod26.z.string().trim().min(1).max(64)
});
var slackCreateChannelInput = import_zod26.z.object({
  name: import_zod26.z.string().trim().min(1).max(80).regex(/^[a-z0-9-_]+$/, "Use lowercase letters, numbers and dashes."),
  isPrivate: import_zod26.z.boolean().default(false)
});
var slackCreateChannelReply = import_zod26.z.union([
  import_zod26.z.object({
    channel: import_zod26.z.object({
      id: import_zod26.z.string().trim().min(1).max(64),
      name: import_zod26.z.string().trim().min(1).max(120)
    })
  }),
  import_zod26.z.object({ error: import_zod26.z.string().trim().min(1).max(500) })
]);
var slackSyncStateOutput = import_zod26.z.enum(SLACK_SYNC_STATES);
var slackAgentSummaryOutput = import_zod26.z.object({
  id: import_zod26.z.string(),
  name: import_zod26.z.string(),
  description: import_zod26.z.string().nullable(),
  status: import_zod26.z.enum([
    "DRAFT",
    "DEPLOYING",
    "LIVE",
    "PAUSED",
    "ARCHIVED",
    "DELETED"
  ])
});
var slackStatusOutput = import_zod26.z.object({
  configured: import_zod26.z.boolean(),
  connected: import_zod26.z.boolean(),
  workspace: import_zod26.z.string().nullable(),
  lastConnectedAt: import_zod26.z.string().nullable(),
  scopes: import_zod26.z.array(import_zod26.z.string()),
  canInviteItself: import_zod26.z.boolean(),
  canManage: import_zod26.z.boolean(),
  agents: import_zod26.z.array(slackAgentSummaryOutput),
  people: import_zod26.z.object({
    matched: import_zod26.z.number(),
    reviewed: import_zod26.z.number()
  })
});
var slackMemberMatchOutput = import_zod26.z.object({
  slackUserId: import_zod26.z.string().nullable(),
  slackHandle: import_zod26.z.string().nullable(),
  slackEmail: import_zod26.z.string().nullable()
});
var slackMatchesOutput = import_zod26.z.object({
  rows: import_zod26.z.array(import_zod26.z.object({
    crmUserId: import_zod26.z.string(),
    name: import_zod26.z.string(),
    email: import_zod26.z.string(),
    match: slackMemberMatchOutput.nullable()
  })),
  sync: slackSyncStateOutput
});
var slackChannelsOutput = import_zod26.z.object({
  canInviteItself: import_zod26.z.boolean(),
  sync: slackSyncStateOutput,
  nextCursor: import_zod26.z.string().nullable(),
  rows: import_zod26.z.array(import_zod26.z.object({
    id: import_zod26.z.string(),
    name: import_zod26.z.string(),
    memberCount: import_zod26.z.number().nullable(),
    isPrivate: import_zod26.z.boolean(),
    isMember: import_zod26.z.boolean(),
    classified: import_zod26.z.boolean(),
    inviteRequestedAt: import_zod26.z.string().nullable()
  }))
});
var slackJoinChannelOutput = import_zod26.z.object({
  queued: import_zod26.z.boolean(),
  alreadyJoined: import_zod26.z.boolean()
});
var slackRefreshPeopleOutput = import_zod26.z.object({
  requested: import_zod26.z.boolean()
});
var slackCreateChannelOutput = import_zod26.z.object({
  channel: import_zod26.z.object({
    id: import_zod26.z.string(),
    name: import_zod26.z.string()
  })
});
var slackDisconnectOutput = import_zod26.z.object({
  disconnected: import_zod26.z.boolean()
});

// src/slack/slack-connection.service.ts
var import_auth38 = require("@crm/auth");
var import_validation3 = require("@crm/validation");
var import_common110 = require("@nestjs/common");

// src/slack/slack-channels.service.ts
var import_common109 = require("@nestjs/common");
var CREATE_TIMEOUT_MS = 20000;
var SERVER_ERROR_STATUS = 500;

class SlackChannelsService {
  logger = new import_common109.Logger(SlackChannelsService.name);
  async create(name, isPrivate) {
    const agent = bridge();
    if (!agent) {
      throw new import_common109.ServiceUnavailableException("This install has no AGENT_BRIDGE_SECRET, so nothing can reach Slack.");
    }
    let response;
    try {
      response = await fetch(agent.url("/internal/crm/slack/create-channel"), {
        method: "POST",
        headers: {
          authorization: `Bearer ${agent.secret}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          type: "slack.channel.create",
          channelName: name,
          isPrivate
        }),
        signal: AbortSignal.timeout(CREATE_TIMEOUT_MS)
      });
    } catch (error) {
      this.logger.error({ message: "Could not reach the agent to create a channel", name }, error instanceof Error ? error.stack : String(error));
      throw new import_common109.ServiceUnavailableException("The agent is not answering, so the channel was not created.");
    }
    if (response.status >= SERVER_ERROR_STATUS) {
      this.logger.error({
        message: "The agent failed while creating a channel",
        name,
        status: response.status
      });
      throw new import_common109.ServiceUnavailableException("The agent failed, so the channel was not created.");
    }
    const reply = slackCreateChannelReply.safeParse(await response.json().catch(() => null));
    if (!reply.success) {
      this.logger.error({
        message: "The agent returned an unreadable channel reply",
        name,
        status: response.status
      });
      throw new import_common109.ServiceUnavailableException("The agent answered with something unreadable, so the channel was not created.");
    }
    if ("error" in reply.data) {
      throw new import_common109.BadRequestException(reply.data.error);
    }
    if (!response.ok) {
      throw new import_common109.BadRequestException("Slack refused to create that channel.");
    }
    return { channel: reply.data.channel };
  }
}
SlackChannelsService = __legacyDecorateClassTS([
  import_common109.Injectable()
], SlackChannelsService);

// src/slack/slack-connection.service.ts
var SLACK_WORKSPACE_RESOURCE_ID = import_validation3.schemas.agents.CAPABILITY_RESOURCE_IDS.slack;

class SlackConnectionService {
  db;
  agent;
  slackChannels;
  access;
  constructor(db2, agent, slackChannels, access) {
    this.db = db2;
    this.agent = agent;
    this.slackChannels = slackChannels;
    this.access = access;
  }
  async status(userId) {
    const role = await this.access.assertMember(userId);
    const [account, agents, matches, memberCount, grant] = await Promise.all([
      this.db.account.findFirst({
        where: { providerId: "slack", accessToken: { not: null } },
        orderBy: { updatedAt: "desc" },
        select: { accountId: true, updatedAt: true, scope: true }
      }),
      this.db.agentDefinition.findMany({
        where: {
          status: { in: ["LIVE", "PAUSED"] },
          deletedAt: null,
          currentVersionId: { not: null },
          currentVersion: {
            manifest: {
              path: ["dataScope", "resources"],
              array_contains: [{ id: SLACK_WORKSPACE_RESOURCE_ID }]
            }
          }
        },
        orderBy: { updatedAt: "desc" },
        take: 30,
        select: { id: true, name: true, description: true, status: true }
      }),
      this.db.slackMemberMatch.findMany({
        where: {
          crmUser: { members: { some: { organizationId: import_auth38.WORKSPACE_ID } } }
        },
        select: { slackUserId: true, updatedAt: true }
      }),
      this.db.member.count({ where: { organizationId: import_auth38.WORKSPACE_ID } }),
      this.db.slackWorkspaceGrant.findFirst({
        select: { id: true, teamName: true }
      })
    ]);
    const matched = matches.filter((match) => match.slackUserId).length;
    const reviewed = matches.length;
    const inventoryFresh = account && reviewed === memberCount && matches.every((match) => match.updatedAt >= account.updatedAt);
    if (account && !inventoryFresh) {
      await this.agent.slackPeopleRequested("Match workspace members to Slack accounts by exact email");
    }
    return {
      configured: import_auth38.isSlackConfigured(),
      connected: Boolean(account),
      workspace: account ? grant?.teamName ?? null : null,
      lastConnectedAt: account?.updatedAt.toISOString() ?? null,
      scopes: (account?.scope ?? "").split(",").map((scope) => scope.trim()).filter(Boolean),
      canInviteItself: Boolean(grant),
      canManage: import_auth38.canManageConnections(role),
      agents,
      people: { matched, reviewed }
    };
  }
  async matches(userId) {
    await this.access.assertMember(userId);
    const [members, syncing] = await Promise.all([
      this.db.member.findMany({
        where: { organizationId: import_auth38.WORKSPACE_ID },
        orderBy: { user: { name: "asc" } },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              slackMemberMatch: {
                select: {
                  slackUserId: true,
                  slackHandle: true,
                  slackEmail: true
                }
              }
            }
          }
        }
      }),
      this.peopleSyncState()
    ]);
    return {
      rows: members.map(({ user }) => ({
        crmUserId: user.id,
        name: user.name,
        email: user.email,
        match: user.slackMemberMatch
      })),
      sync: syncing
    };
  }
  async peopleSyncState() {
    const pending = await this.db.agentTask.findFirst({
      where: { kind: "slack-people-match", finishedAt: null },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true, startedAt: true, leasedUntil: true }
    });
    if (!pending)
      return "idle";
    const now = Date.now();
    const leaseHeld = pending.leasedUntil ? pending.leasedUntil.getTime() > now : false;
    if (leaseHeld || pending.startedAt)
      return "syncing";
    return now - pending.createdAt.getTime() < SLACK.sync.stalledAfterMs ? "syncing" : "stalled";
  }
  async refreshPeople(userId) {
    await this.access.assertMember(userId);
    const account = await this.db.account.findFirst({
      where: { providerId: "slack", accessToken: { not: null } },
      orderBy: { updatedAt: "desc" },
      select: { id: true }
    });
    if (!account)
      throw new import_common110.NotFoundException("Slack is not connected.");
    await this.agent.slackPeopleRequested("Refresh Slack people and channels from the connection page", true);
    return { requested: true };
  }
  async channels(input, userId) {
    await this.access.assertMember(userId);
    const take = input.limit ?? SLACK.channels.pageSize;
    const needle = input.query?.trim() ?? "";
    const where = { available: true };
    if (needle)
      where.name = { contains: needle, mode: "insensitive" };
    const [rows, grant, sync] = await Promise.all([
      this.db.slackChannel.findMany({
        where,
        orderBy: [{ isMember: "desc" }, { name: "asc" }, { id: "asc" }],
        take: take + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        skip: input.cursor ? 1 : undefined,
        select: {
          id: true,
          name: true,
          memberCount: true,
          isPrivate: true,
          isMember: true,
          classifiedAt: true,
          inviteRequestedAt: true
        }
      }),
      this.db.slackWorkspaceGrant.findFirst({ select: { id: true } }),
      this.peopleSyncState()
    ]);
    const page = rows.slice(0, take);
    return {
      canInviteItself: Boolean(grant),
      sync,
      nextCursor: rows.length > take ? page.at(-1)?.id ?? null : null,
      rows: page.map(({ classifiedAt, ...row }) => ({
        ...row,
        classified: classifiedAt !== null,
        inviteRequestedAt: row.inviteRequestedAt?.toISOString() ?? null
      }))
    };
  }
  async joinChannel(input, userId) {
    await this.access.assertMember(userId);
    const channel = await this.db.slackChannel.findUnique({
      where: { id: input.channelId },
      select: { id: true, name: true, isMember: true, isPrivate: true }
    });
    if (!channel)
      throw new import_common110.NotFoundException("No such Slack channel.");
    if (channel.isMember)
      return { queued: false, alreadyJoined: true };
    const grant = await this.db.slackWorkspaceGrant.findFirst({
      select: { id: true }
    });
    if (channel.isPrivate && !grant) {
      await this.db.slackChannel.update({
        where: { id: channel.id },
        data: { inviteRequestedAt: new Date }
      });
      return { queued: false, alreadyJoined: false };
    }
    await this.agent.slackChannelJoinRequested(channel.id, channel.name);
    return { queued: true, alreadyJoined: false };
  }
  async createChannel(input, userId) {
    await this.access.assertMember(userId);
    const existing = await this.db.slackChannel.findFirst({
      where: { name: input.name },
      select: { id: true }
    });
    if (existing) {
      throw new import_common110.BadRequestException("A channel with that name already exists.");
    }
    return this.slackChannels.create(input.name, input.isPrivate);
  }
  async disconnect(userId) {
    const role = await this.access.assertMember(userId);
    if (!import_auth38.canManageConnections(role)) {
      throw new import_common110.ForbiddenException("Only an owner or an admin can disconnect Slack.");
    }
    const removed = await this.db.$transaction(async (tx) => {
      const accounts = await tx.account.deleteMany({
        where: { providerId: "slack" }
      });
      await tx.slackChannel.deleteMany({});
      await tx.slackWorkspaceGrant.deleteMany({});
      return accounts.count;
    });
    if (removed === 0)
      throw new import_common110.NotFoundException("Slack is not connected.");
    return { disconnected: true };
  }
}
SlackConnectionService = __legacyDecorateClassTS([
  import_common110.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof AgentTriggerService === "undefined" ? Object : AgentTriggerService,
    typeof SlackChannelsService === "undefined" ? Object : SlackChannelsService,
    typeof AgentAccessService === "undefined" ? Object : AgentAccessService
  ])
], SlackConnectionService);

// src/slack/slack.router.ts
class SlackRouter {
  connection;
  constructor(connection) {
    this.connection = connection;
  }
  status(ctx) {
    return this.connection.status(ctx.user.id);
  }
  matches(ctx) {
    return this.connection.matches(ctx.user.id);
  }
  channels(ctx, input) {
    return this.connection.channels(input, ctx.user.id);
  }
  joinChannel(ctx, input) {
    return this.connection.joinChannel(input, ctx.user.id);
  }
  refreshPeople(ctx) {
    return this.connection.refreshPeople(ctx.user.id);
  }
  createChannel(ctx, input) {
    return this.connection.createChannel(input, ctx.user.id);
  }
  disconnect(ctx) {
    return this.connection.disconnect(ctx.user.id);
  }
}
__legacyDecorateClassTS([
  import_nestjs_trpc18.Query({
    output: slackStatusOutput,
    meta: restMeta("GET", "/slack/status", ["Slack"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc18.Ctx()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext
  ]),
  __legacyMetadataTS("design:returntype", undefined)
], SlackRouter.prototype, "status", null);
__legacyDecorateClassTS([
  import_nestjs_trpc18.Query({
    output: slackMatchesOutput,
    meta: restMeta("GET", "/slack/matches", ["Slack"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc18.Ctx()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext
  ]),
  __legacyMetadataTS("design:returntype", undefined)
], SlackRouter.prototype, "matches", null);
__legacyDecorateClassTS([
  import_nestjs_trpc18.Query({
    input: slackChannelsInput,
    output: slackChannelsOutput,
    meta: restMeta("GET", "/slack/channels", ["Slack"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc18.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc18.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", undefined)
], SlackRouter.prototype, "channels", null);
__legacyDecorateClassTS([
  import_nestjs_trpc18.Mutation({
    input: slackJoinChannelInput,
    output: slackJoinChannelOutput,
    meta: restMeta("POST", "/slack/channels/{channelId}/join", ["Slack"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc18.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc18.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", undefined)
], SlackRouter.prototype, "joinChannel", null);
__legacyDecorateClassTS([
  import_nestjs_trpc18.Mutation({
    output: slackRefreshPeopleOutput,
    meta: restMeta("POST", "/slack/people/refresh", ["Slack"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc18.Ctx()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext
  ]),
  __legacyMetadataTS("design:returntype", undefined)
], SlackRouter.prototype, "refreshPeople", null);
__legacyDecorateClassTS([
  import_nestjs_trpc18.Mutation({
    input: slackCreateChannelInput,
    output: slackCreateChannelOutput,
    meta: restMeta("POST", "/slack/channels", ["Slack"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc18.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc18.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", undefined)
], SlackRouter.prototype, "createChannel", null);
__legacyDecorateClassTS([
  import_nestjs_trpc18.Mutation({
    output: slackDisconnectOutput,
    meta: restMeta("DELETE", "/slack/connection", ["Slack"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc18.Ctx()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext
  ]),
  __legacyMetadataTS("design:returntype", undefined)
], SlackRouter.prototype, "disconnect", null);
SlackRouter = __legacyDecorateClassTS([
  import_nestjs_trpc18.Router({ alias: "slack" }),
  import_nestjs_trpc18.UseMiddlewares(AuthMiddleware),
  __legacyDecorateParamTS(0, import_common111.Inject(SlackConnectionService)),
  __legacyMetadataTS("design:paramtypes", [
    typeof SlackConnectionService === "undefined" ? Object : SlackConnectionService
  ])
], SlackRouter);

// src/slack/slack.module.ts
class SlackModule {
}
SlackModule = __legacyDecorateClassTS([
  import_common112.Module({
    imports: [TrpcModule, AgentModule],
    providers: [SlackChannelsService, SlackConnectionService, SlackRouter],
    exports: [SlackConnectionService]
  })
], SlackModule);

// src/sso/sso.module.ts
var import_common115 = require("@nestjs/common");

// src/sso/sso.router.ts
var import_common114 = require("@nestjs/common");
var import_node3 = require("better-auth/node");
var import_nestjs_trpc19 = require("nestjs-trpc");

// src/sso/sso.contracts.ts
var import_zod27 = require("zod");
var ssoProviderListInput = listInput;
var registerSsoProviderInput = import_zod27.z.object({
  providerId: import_zod27.z.string().trim().min(1).max(64).regex(/^[a-z0-9][a-z0-9-]*$/, "Use lower-case letters, numbers and hyphens."),
  issuer: import_zod27.z.string().trim().url().max(512),
  domain: import_zod27.z.string().trim().min(1).max(255),
  clientId: import_zod27.z.string().trim().min(1).max(512),
  clientSecret: import_zod27.z.string().trim().min(1).max(1024)
});
var deleteSsoProviderInput = import_zod27.z.object({
  providerId: import_zod27.z.string().trim().min(1).max(64)
});
var ssoPublicProviderOutput = import_zod27.z.object({
  providerId: import_zod27.z.string(),
  name: import_zod27.z.string()
});
var ssoSignInOptionsOutput = import_zod27.z.object({
  google: import_zod27.z.boolean(),
  microsoft: import_zod27.z.boolean(),
  providers: import_zod27.z.array(ssoPublicProviderOutput)
});
var ssoSettingsOutput = import_zod27.z.object({
  canConfigure: import_zod27.z.boolean(),
  callbackBase: import_zod27.z.string()
});
var ssoProviderOutput = import_zod27.z.object({
  providerId: import_zod27.z.string(),
  name: import_zod27.z.string(),
  type: import_zod27.z.enum(["oidc", "saml"]),
  issuer: import_zod27.z.string(),
  domains: import_zod27.z.array(import_zod27.z.string()),
  clientIdLastFour: import_zod27.z.string().nullable(),
  callbackURL: import_zod27.z.string()
});
var ssoProviderListOutput = import_zod27.z.object({
  rows: import_zod27.z.array(ssoProviderOutput),
  total: import_zod27.z.number(),
  facetCounts: import_zod27.z.record(import_zod27.z.string(), import_zod27.z.record(import_zod27.z.string(), import_zod27.z.number()))
});
var deleteSsoProviderOutput = import_zod27.z.object({
  providerId: import_zod27.z.string()
});

// src/sso/sso.service.ts
var import_auth40 = require("@crm/auth");
var import_common113 = require("@nestjs/common");
var import_api2 = require("better-auth/api");
var import_zod28 = require("zod");
var PROVIDER_SELECT = {
  providerId: true,
  issuer: true,
  domain: true,
  oidcConfig: true,
  samlConfig: true
};
var SORTABLE5 = {
  providerId: (dir) => ({ providerId: dir }),
  domain: (dir) => ({ domain: dir }),
  issuer: (dir) => ({ issuer: dir })
};
var STATUS_BY_CODE2 = new Map([
  ["BAD_REQUEST", 400],
  ["UNAUTHORIZED", 401],
  ["FORBIDDEN", 403],
  ["NOT_FOUND", 404],
  ["CONFLICT", 409],
  ["UNPROCESSABLE_ENTITY", 400]
]);
function splitDomains(value) {
  return value.split(",").map((part) => part.trim().replace(/^https?:\/\//i, "").replace(/\/.*$/, "")).map((part) => part.toLowerCase()).filter(Boolean);
}
var oidcConfig = import_zod28.z.object({ clientId: import_zod28.z.string().catch("") }).catch({ clientId: "" });
function lastFour(clientId) {
  return clientId.length >= 4 ? clientId.slice(-4) : null;
}
function readOidcConfig(value) {
  if (!value)
    return null;
  try {
    return oidcConfig.parse(JSON.parse(value));
  } catch {
    return null;
  }
}
function toProvider(row) {
  const oidc = readOidcConfig(row.oidcConfig);
  return {
    providerId: row.providerId,
    name: import_auth40.ssoProviderName(row.providerId),
    type: row.samlConfig ? "saml" : "oidc",
    issuer: row.issuer,
    domains: splitDomains(row.domain),
    clientIdLastFour: oidc ? lastFour(oidc.clientId) : null,
    callbackURL: import_auth40.ssoCallbackURL(row.providerId)
  };
}

class SsoService {
  db;
  logger = new import_common113.Logger(SsoService.name);
  constructor(db2) {
    this.db = db2;
  }
  async signInOptions() {
    const rows = await this.db.ssoProvider.findMany({
      where: { organizationId: import_auth40.WORKSPACE_ID },
      select: { providerId: true },
      orderBy: { providerId: "asc" }
    });
    return {
      google: import_auth40.isGoogleConfigured(),
      microsoft: import_auth40.isMicrosoftConfigured(),
      providers: rows.map((row) => ({
        providerId: row.providerId,
        name: import_auth40.ssoProviderName(row.providerId)
      }))
    };
  }
  async settings(userId) {
    return {
      canConfigure: import_auth40.canConfigureSso(await import_auth40.workspaceRoleOf(userId, this.db)),
      callbackBase: import_auth40.ssoCallbackBase()
    };
  }
  async list(input) {
    const where = this.searchWhere(input.q);
    const { skip, take } = paginate(input);
    const [rows, total] = await Promise.all([
      this.db.ssoProvider.findMany({
        where,
        skip,
        take,
        select: PROVIDER_SELECT,
        orderBy: resolveOrderBy(input, SORTABLE5, { providerId: "asc" })
      }),
      this.db.ssoProvider.count({ where })
    ]);
    return { rows: rows.map(toProvider), total, facetCounts: {} };
  }
  async register(userId, headers, input) {
    await this.requireConfigurer(userId);
    const domains = splitDomains(input.domain);
    if (domains.length === 0) {
      throw new import_common113.BadRequestException("Give the email domain your people sign in with, for example acme.com.");
    }
    await this.call(() => import_auth40.auth.api.registerSSOProvider({
      headers,
      body: {
        providerId: input.providerId,
        issuer: input.issuer,
        domain: domains.join(","),
        organizationId: import_auth40.WORKSPACE_ID,
        oidcConfig: {
          clientId: input.clientId,
          clientSecret: input.clientSecret,
          pkce: true
        }
      }
    }));
    this.logger.log({
      message: "SSO provider registered",
      userId,
      providerId: input.providerId,
      issuer: input.issuer
    });
    const row = await this.db.ssoProvider.findUniqueOrThrow({
      where: { providerId: input.providerId },
      select: PROVIDER_SELECT
    });
    return toProvider(row);
  }
  async remove(userId, headers, input) {
    await this.requireConfigurer(userId);
    await this.call(() => import_auth40.auth.api.deleteSSOProvider({
      headers,
      body: { providerId: input.providerId }
    }));
    this.logger.log({
      message: "SSO provider removed",
      userId,
      providerId: input.providerId
    });
    return { providerId: input.providerId };
  }
  searchWhere(q) {
    const term = q.trim();
    const where = {
      organizationId: import_auth40.WORKSPACE_ID
    };
    if (term) {
      where.OR = [
        { providerId: { contains: term, mode: "insensitive" } },
        { domain: { contains: term, mode: "insensitive" } },
        { issuer: { contains: term, mode: "insensitive" } }
      ];
    }
    return where;
  }
  async call(run) {
    try {
      return await run();
    } catch (error) {
      if (error instanceof import_api2.APIError) {
        const status = STATUS_BY_CODE2.get(error.body?.code ?? "") ?? error.statusCode;
        throw new import_common113.HttpException(error.body?.message ?? "The identity provider could not be saved.", status);
      }
      this.logger.error({ message: "SSO provider call failed" }, error instanceof Error ? error.stack : String(error));
      throw new import_common113.InternalServerErrorException("Could not reach the identity provider.");
    }
  }
  async requireConfigurer(userId) {
    if (!import_auth40.canConfigureSso(await import_auth40.workspaceRoleOf(userId, this.db))) {
      throw new import_common113.ForbiddenException("Only an owner or an admin can change how people sign in.");
    }
  }
}
SsoService = __legacyDecorateClassTS([
  import_common113.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db
  ])
], SsoService);

// src/sso/sso.router.ts
function headersOf2(ctx) {
  return import_node3.fromNodeHeaders(ctx.req?.headers ?? {});
}

class SsoRouter {
  sso;
  constructor(sso) {
    this.sso = sso;
  }
  async signInOptions() {
    return this.sso.signInOptions();
  }
  async settings(ctx) {
    return this.sso.settings(ctx.user.id);
  }
  async list(input) {
    return this.sso.list(input);
  }
  async register(ctx, input) {
    return this.sso.register(ctx.user.id, headersOf2(ctx), input);
  }
  async remove(ctx, input) {
    return this.sso.remove(ctx.user.id, headersOf2(ctx), input);
  }
}
__legacyDecorateClassTS([
  import_nestjs_trpc19.Query({
    output: ssoSignInOptionsOutput,
    meta: restMeta("GET", "/sso/sign-in-options", ["SSO"], {
      protect: false
    })
  }),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", []),
  __legacyMetadataTS("design:returntype", Promise)
], SsoRouter.prototype, "signInOptions", null);
__legacyDecorateClassTS([
  import_nestjs_trpc19.Query({
    output: ssoSettingsOutput,
    meta: restMeta("GET", "/sso/settings", ["SSO"])
  }),
  import_nestjs_trpc19.UseMiddlewares(AuthMiddleware),
  __legacyDecorateParamTS(0, import_nestjs_trpc19.Ctx()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], SsoRouter.prototype, "settings", null);
__legacyDecorateClassTS([
  import_nestjs_trpc19.Query({
    input: ssoProviderListInput,
    output: ssoProviderListOutput,
    meta: restMeta("GET", "/sso", ["SSO"])
  }),
  import_nestjs_trpc19.UseMiddlewares(AuthMiddleware),
  __legacyDecorateParamTS(0, import_nestjs_trpc19.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], SsoRouter.prototype, "list", null);
__legacyDecorateClassTS([
  import_nestjs_trpc19.Mutation({
    input: registerSsoProviderInput,
    output: ssoProviderOutput,
    meta: restMeta("POST", "/sso", ["SSO"])
  }),
  import_nestjs_trpc19.UseMiddlewares(AuthMiddleware),
  __legacyDecorateParamTS(0, import_nestjs_trpc19.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc19.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], SsoRouter.prototype, "register", null);
__legacyDecorateClassTS([
  import_nestjs_trpc19.Mutation({
    input: deleteSsoProviderInput,
    output: deleteSsoProviderOutput,
    meta: restMeta("DELETE", "/sso/{providerId}", ["SSO"])
  }),
  import_nestjs_trpc19.UseMiddlewares(AuthMiddleware),
  __legacyDecorateParamTS(0, import_nestjs_trpc19.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc19.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], SsoRouter.prototype, "remove", null);
SsoRouter = __legacyDecorateClassTS([
  import_nestjs_trpc19.Router({ alias: "sso" }),
  __legacyDecorateParamTS(0, import_common114.Inject(SsoService)),
  __legacyMetadataTS("design:paramtypes", [
    typeof SsoService === "undefined" ? Object : SsoService
  ])
], SsoRouter);

// src/sso/sso.module.ts
class SsoModule {
}
SsoModule = __legacyDecorateClassTS([
  import_common115.Module({
    imports: [TrpcModule],
    providers: [SsoService, SsoRouter],
    exports: [SsoService]
  })
], SsoModule);

// src/sync/sync.module.ts
var import_common118 = require("@nestjs/common");

// src/sync/mailbox-sync.service.ts
var import_telemetry3 = require("@crm/telemetry");
var import_common116 = require("@nestjs/common");
var TICK_BUDGET_MS = 60000;

class MailboxSyncService {
  state;
  google;
  microsoft;
  googleConnections;
  microsoftConnections;
  logger = new import_common116.Logger(MailboxSyncService.name);
  constructor(state, google, microsoft, googleConnections, microsoftConnections) {
    this.state = state;
    this.google = google;
    this.microsoft = microsoft;
    this.googleConnections = googleConnections;
    this.microsoftConnections = microsoftConnections;
  }
  async runDue() {
    const startedAt = Date.now();
    const summary = {
      attempted: 0,
      synced: 0,
      skipped: 0,
      rateLimited: 0,
      failed: 0,
      durationMs: 0
    };
    await this.googleConnections.reconcileAll();
    await this.microsoftConnections.reconcileAll();
    const due = await this.state.due(new Date);
    for (const [index, row] of due.entries()) {
      if (Date.now() - startedAt > TICK_BUDGET_MS) {
        this.logger.log({
          message: "Sync tick budget reached",
          remaining: due.length - index
        });
        break;
      }
      if (!await this.state.claim(row, new Date))
        continue;
      summary.attempted += 1;
      try {
        const outcome = await this.runOne(row.userId, row.source);
        if (outcome === null || outcome.status === "skipped") {
          summary.skipped += 1;
          await this.state.release(row.id);
        } else if (outcome.status === "rate-limited") {
          summary.rateLimited += 1;
        } else if (outcome.status === "failed" || outcome.status === "reconnect") {
          summary.failed += 1;
        } else {
          summary.synced += 1;
        }
      } catch (error) {
        summary.failed += 1;
        await this.state.markFailed(row.id, error instanceof Error ? error.message : String(error));
        this.logger.error({
          message: "Sync threw",
          userId: row.userId,
          source: row.source
        }, error instanceof Error ? error.stack : String(error));
        import_telemetry3.syncError({ error, source: row.source });
      }
    }
    summary.durationMs = Date.now() - startedAt;
    this.logger.log({
      message: "Mailbox sync tick",
      attempted: summary.attempted,
      synced: summary.synced,
      skipped: summary.skipped,
      rateLimited: summary.rateLimited,
      failed: summary.failed,
      durationMs: summary.durationMs
    });
    return summary;
  }
  async runOne(userId, source) {
    if (isGoogleSyncSource(source))
      return this.google.runOne(userId, source);
    if (isMicrosoftSyncSource(source)) {
      return this.microsoft.runOne(userId, source);
    }
    return null;
  }
}
MailboxSyncService = __legacyDecorateClassTS([
  import_common116.Injectable(),
  __legacyMetadataTS("design:paramtypes", [
    typeof SyncStateService === "undefined" ? Object : SyncStateService,
    typeof GoogleSyncService === "undefined" ? Object : GoogleSyncService,
    typeof MicrosoftSyncService === "undefined" ? Object : MicrosoftSyncService,
    typeof GoogleConnectionService === "undefined" ? Object : GoogleConnectionService,
    typeof MicrosoftConnectionService === "undefined" ? Object : MicrosoftConnectionService
  ])
], MailboxSyncService);

// src/sync/sync.controller.ts
var import_common117 = require("@nestjs/common");
var import_config4 = require("@nestjs/config");
var import_swagger6 = require("@nestjs/swagger");
var import_nestjs_better_auth7 = require("@thallesp/nestjs-better-auth");
class SyncController {
  sync;
  logger = new import_common117.Logger(SyncController.name);
  secret;
  constructor(sync, config) {
    this.sync = sync;
    this.secret = config.get("CRON_SECRET", { infer: true });
  }
  async mailboxesViaGet(authorization) {
    return this.run(authorization);
  }
  async mailboxesViaPost(authorization) {
    return this.run(authorization);
  }
  async googleViaGet(authorization) {
    return this.run(authorization);
  }
  async googleViaPost(authorization) {
    return this.run(authorization);
  }
  async run(authorization) {
    if (!this.secret) {
      this.logger.error({
        message: "CRON_SECRET is not set — refusing to run the sync route."
      });
      throw new import_common117.ServiceUnavailableException("Sync is not configured.");
    }
    if (!timingSafeEquals3(authorization ?? "", `Bearer ${this.secret}`)) {
      throw new import_common117.ForbiddenException;
    }
    return this.sync.runDue();
  }
}
__legacyDecorateClassTS([
  import_common117.Get("mailboxes"),
  import_nestjs_better_auth7.AllowAnonymous(),
  import_swagger6.ApiOperation({ summary: "Run any due Gmail, Outlook or calendar sync" }),
  import_swagger6.ApiOkResponse({ description: "The sync ran; per-mailbox results." }),
  __legacyDecorateParamTS(0, import_common117.Headers("authorization")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], SyncController.prototype, "mailboxesViaGet", null);
__legacyDecorateClassTS([
  import_common117.Post("mailboxes"),
  import_nestjs_better_auth7.AllowAnonymous(),
  import_swagger6.ApiExcludeEndpoint(),
  __legacyDecorateParamTS(0, import_common117.Headers("authorization")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], SyncController.prototype, "mailboxesViaPost", null);
__legacyDecorateClassTS([
  import_common117.Get("google"),
  import_nestjs_better_auth7.AllowAnonymous(),
  import_swagger6.ApiOperation({
    summary: "Alias of `mailboxes`, kept for existing cron deployments"
  }),
  import_swagger6.ApiOkResponse({ description: "The sync ran; per-mailbox results." }),
  __legacyDecorateParamTS(0, import_common117.Headers("authorization")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], SyncController.prototype, "googleViaGet", null);
__legacyDecorateClassTS([
  import_common117.Post("google"),
  import_nestjs_better_auth7.AllowAnonymous(),
  import_swagger6.ApiExcludeEndpoint(),
  __legacyDecorateParamTS(0, import_common117.Headers("authorization")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], SyncController.prototype, "googleViaPost", null);
SyncController = __legacyDecorateClassTS([
  import_swagger6.ApiTags("Internal — Cron"),
  import_swagger6.ApiHeader({
    name: "authorization",
    description: "`Bearer <CRON_SECRET>`",
    required: true
  }),
  import_swagger6.ApiForbiddenResponse({ description: "CRON_SECRET did not match." }),
  import_swagger6.ApiServiceUnavailableResponse({ description: "CRON_SECRET is not set." }),
  import_common117.Controller("internal/sync"),
  __legacyMetadataTS("design:paramtypes", [
    typeof MailboxSyncService === "undefined" ? Object : MailboxSyncService,
    typeof import_config4.ConfigService === "undefined" ? Object : import_config4.ConfigService
  ])
], SyncController);
function timingSafeEquals3(a, b) {
  if (a.length !== b.length)
    return false;
  let mismatch = 0;
  for (let index = 0;index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return mismatch === 0;
}

// src/sync/sync.module.ts
class SyncModule {
}
SyncModule = __legacyDecorateClassTS([
  import_common118.Module({
    imports: [MailboxModule, GoogleModule, MicrosoftModule],
    controllers: [SyncController],
    providers: [MailboxSyncService],
    exports: [MailboxSyncService]
  })
], SyncModule);

// src/telemetry/telemetry.module.ts
var import_common123 = require("@nestjs/common");

// src/telemetry/funnel.service.ts
var import_db34 = require("@crm/db");
var import_telemetry4 = require("@crm/telemetry");
var import_common119 = require("@nestjs/common");

// src/telemetry/seed.ts
var SEED_OWNER_PREFIX = "seed-";

// src/telemetry/funnel.service.ts
class FunnelService {
  db;
  logger = new import_common119.Logger(FunnelService.name);
  constructor(db2) {
    this.db = db2;
  }
  async sweep() {
    const reached = new Set(await import_telemetry4.reachedMilestones());
    const outstanding = import_telemetry4.MILESTONES.filter((step) => !reached.has(step));
    if (outstanding.length === 0)
      return [];
    const sent = [];
    for (const step of outstanding) {
      try {
        const at = await this.when(step);
        if (!at)
          continue;
        if (await import_telemetry4.milestone(step, at))
          sent.push(step);
      } catch (error) {
        this.logger.debug({
          message: "Could not settle a telemetry milestone",
          step,
          reason: error instanceof Error ? error.message : String(error)
        });
      }
    }
    return sent;
  }
  async when(step) {
    switch (step) {
      case "migrations_applied":
        return (await import_telemetry4.readInstall())?.createdAt ?? null;
      case "first_sign_in":
        return this.earliest(this.db.session.findFirst({
          orderBy: { createdAt: "asc" },
          select: { createdAt: true }
        }), (row) => row.createdAt);
      case "google_oauth_configured": {
        const configured = process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim();
        if (!configured)
          return null;
        const linked = await this.earliest(this.db.account.findFirst({
          where: { providerId: import_auth29.GOOGLE_PROVIDER_ID },
          orderBy: { createdAt: "asc" },
          select: { createdAt: true }
        }), (row) => row.createdAt);
        return linked ?? new Date;
      }
      case "first_mailbox_sync":
        return this.earliest(this.db.mailboxSync.findFirst({
          where: { lastSyncedAt: { not: null } },
          orderBy: { lastSyncedAt: "asc" },
          select: { lastSyncedAt: true }
        }), (row) => row.lastSyncedAt);
      case "first_non_seed_contact":
        return this.earliest(this.db.contact.findFirst({
          where: {
            OR: [
              { ownerId: null },
              { ownerId: { not: { startsWith: SEED_OWNER_PREFIX } } }
            ]
          },
          orderBy: { createdAt: "asc" },
          select: { createdAt: true }
        }), (row) => row.createdAt);
      case "first_agent_task_claimed":
        return this.earliest(this.db.agentTask.findFirst({
          where: { startedAt: { not: null } },
          orderBy: { startedAt: "asc" },
          select: { startedAt: true }
        }), (row) => row.startedAt);
      case "first_agent_task_completed":
        return this.earliest(this.db.agentTask.findFirst({
          where: { finishedAt: { not: null } },
          orderBy: { finishedAt: "asc" },
          select: { finishedAt: true }
        }), (row) => row.finishedAt);
      case "first_fact_applied":
        return this.firstApplied();
    }
  }
  async firstApplied() {
    const everApplied = {
      status: { in: [import_db34.FactStatus.APPLIED, import_db34.FactStatus.SUPERSEDED] }
    };
    const [decided, undecided] = await Promise.all([
      this.db.contactFact.findFirst({
        where: { ...everApplied, decidedAt: { not: null } },
        orderBy: { decidedAt: "asc" },
        select: { decidedAt: true }
      }),
      this.db.contactFact.findFirst({
        where: { ...everApplied, decidedAt: null },
        orderBy: { observedAt: "asc" },
        select: { observedAt: true }
      })
    ]);
    const applied = [decided?.decidedAt, undecided?.observedAt].filter((at) => at instanceof Date);
    if (applied.length === 0)
      return null;
    return new Date(Math.min(...applied.map((at) => at.getTime())));
  }
  async earliest(query, pick) {
    const row = await query;
    return row ? pick(row) : null;
  }
}
FunnelService = __legacyDecorateClassTS([
  import_common119.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db
  ])
], FunnelService);

// src/telemetry/rollup.service.ts
var import_db35 = require("@crm/db");
var import_agent_tasks4 = require("@crm/db/agent-tasks");
var import_settings11 = require("@crm/db/settings");
var import_tracking = require("@crm/db/tracking");
var import_workspace3 = require("@crm/db/workspace");
var import_telemetry5 = require("@crm/telemetry");
var import_common120 = require("@nestjs/common");
var WINDOW_HOURS = 24;
var HOUR_MS = 60 * 60 * 1000;
var SUPERSEDE_WINDOW_DAYS = 7;
var SANDBOX_TOOLS = new Set([
  "bash",
  "glob",
  "grep",
  "read_file",
  "write_file"
]);

class RollupService {
  db;
  funnel;
  logger = new import_common120.Logger(RollupService.name);
  constructor(db2, funnel) {
    this.db = db2;
    this.funnel = funnel;
  }
  async run(force = false) {
    if (import_telemetry5.telemetryDisabled()) {
      return { sent: false, reason: "telemetry is off", milestones: [] };
    }
    const milestones = await this.funnel.sweep();
    const now = new Date;
    const claim = await import_telemetry5.claimRollup(now, force);
    if (!claim.claimed) {
      return { sent: false, reason: claim.reason, milestones };
    }
    const since = new Date(now.getTime() - WINDOW_HOURS * HOUR_MS);
    let counters = {};
    try {
      const gathered = await this.gather(since);
      counters = gathered.counters;
      if (!await import_telemetry5.installDaily(gathered.properties, now)) {
        await this.giveBack(claim.previous, counters);
        return { sent: false, reason: "not delivered", milestones };
      }
      this.logger.log({
        message: "Telemetry rollup sent",
        windowHours: WINDOW_HOURS,
        milestones: milestones.length
      });
      return { sent: true, milestones };
    } catch (error) {
      await this.giveBack(claim.previous, counters);
      this.logger.debug({
        message: "Telemetry rollup could not be built",
        reason: error instanceof Error ? error.message : String(error)
      });
      return { sent: false, reason: "failed", milestones };
    }
  }
  async giveBack(previous, counters) {
    await import_telemetry5.releaseRollup(previous);
    await import_telemetry5.restoreCounters(counters);
  }
  async gather(since) {
    const counters = await import_telemetry5.drainCounters();
    const [shape, agent, ledger, crm] = await Promise.all([
      this.shape(),
      this.agent(since, counters),
      this.ledger(),
      this.crm(since)
    ]);
    return {
      properties: { ...shape, ...agent, ...ledger, ...crm },
      counters
    };
  }
  async shape() {
    const [model, members, ssoProviders, postgres, contextKey] = await Promise.all([
      import_settings11.readAgentModel(this.db).catch(() => null),
      this.db.member.count({ where: { organizationId: import_workspace3.WORKSPACE_ID } }),
      this.db.ssoProvider.count(),
      this.postgresMajor(),
      this.db.appSetting.findFirst({ select: { contextDevApiKey: true } })
    ]);
    return {
      node_version: process.versions.node.split(".")[0] ?? null,
      postgres_version: postgres,
      members_bucket: import_telemetry5.bucket(members),
      cap_perplexity: isSet("PERPLEXITY_API_KEY"),
      cap_context_dev: Boolean(contextKey?.contextDevApiKey?.trim()),
      cap_blob: isSet("BLOB_READ_WRITE_TOKEN"),
      cap_github: isSet("GITHUB_TOKEN"),
      cap_redis: isSet("REDIS_URL"),
      cap_agent_bridge: isSet("AGENT_BRIDGE_SECRET"),
      cap_cron_secret: isSet("CRON_SECRET"),
      cap_ai_gateway: isSet("AI_GATEWAY_API_KEY"),
      cap_google_oauth: isSet("GOOGLE_CLIENT_ID") && isSet("GOOGLE_CLIENT_SECRET"),
      cap_sso_provider: ssoProviders > 0,
      is_marketing: process.env.IS_MARKETING === "true",
      agent_model_id: model?.id ?? null,
      agent_model_context_window: model?.contextWindowTokens ?? null
    };
  }
  async postgresMajor() {
    try {
      const rows = await this.db.$queryRaw`
				SELECT current_setting('server_version_num') AS version;
			`;
      const raw = Number(rows[0]?.version);
      if (!Number.isFinite(raw))
        return null;
      return String(Math.floor(raw / 1e4));
    } catch {
      return null;
    }
  }
  async agent(since, counters) {
    const [tools, sessions, tasks, attempts, rechecks, conversations] = await Promise.all([
      this.toolCalls(since),
      this.sessions(since),
      this.tasks(since),
      this.attempts(since),
      this.rechecks(since),
      this.db.agentConversation.count()
    ]);
    const total = Object.values(tools.calls).reduce((sum, n) => sum + n, 0);
    return {
      tool_calls: tools.calls,
      tool_calls_total: total,
      tool_errors: tools.errors,
      sandbox_used: tools.sandbox,
      sessions_started: sessions.started,
      sessions_completed: sessions.completed,
      sessions_failed: sessions.failed,
      tools_per_session_mean: sessions.withTools ? round(total / sessions.withTools) : 0,
      tasks_claimed: tasks.claimed,
      tasks_completed: tasks.completed,
      tasks_retired: tasks.retired,
      task_attempts_mean: attempts.mean,
      task_attempts_max: attempts.max,
      budget_exhausted: counters.budget_exhausted ?? 0,
      recheck_scheduled: rechecks.total,
      recheck_interval_days: rechecks.buckets,
      agent_conversations: conversations
    };
  }
  async toolCalls(since) {
    const rows = await this.db.$queryRaw`
			SELECT
				"data"->'result'->>'toolName' AS tool,
				COALESCE("data"->>'status', 'completed') <> 'completed' AS failed,
				COUNT(*) AS count
			FROM "agentEvent"
			WHERE "type" = 'action.result' AND "emittedAt" >= ${since}
			GROUP BY 1, 2;
		`;
    const calls = {};
    const errors = {};
    let sandbox = false;
    for (const row of rows) {
      const tool = import_telemetry5.permittedTool(row.tool);
      const count = Number(row.count);
      calls[tool] = (calls[tool] ?? 0) + count;
      if (row.failed)
        errors[tool] = (errors[tool] ?? 0) + count;
      if (SANDBOX_TOOLS.has(tool))
        sandbox = true;
    }
    return { calls, errors, sandbox };
  }
  async sessions(since) {
    const rows = await this.db.$queryRaw`
			SELECT "type", COUNT(DISTINCT "sessionId") AS sessions
			FROM "agentEvent"
			WHERE "emittedAt" >= ${since}
				AND "type" IN ('session.started', 'session.waiting', 'session.failed', 'action.result')
			GROUP BY 1;
		`;
    const of = (type) => Number(rows.find((row) => row.type === type)?.sessions ?? 0);
    return {
      started: of("session.started"),
      completed: of("session.waiting"),
      failed: of("session.failed"),
      withTools: of("action.result")
    };
  }
  async tasks(since) {
    const [claimed, finished] = await Promise.all([
      this.db.agentTask.groupBy({
        by: ["kind"],
        where: { startedAt: { gte: since } },
        _count: { _all: true }
      }),
      this.db.agentTask.groupBy({
        by: ["kind", "outcome"],
        where: { finishedAt: { gte: since } },
        _count: { _all: true }
      })
    ]);
    const completed = {};
    const retired = {};
    for (const row of finished) {
      const kind = import_telemetry5.permittedTaskKind(row.kind);
      const into = row.outcome === import_agent_tasks4.RETIRED_OUTCOME ? retired : completed;
      into[kind] = (into[kind] ?? 0) + row._count._all;
    }
    return {
      claimed: byKind(claimed.map((row) => ({ key: row.kind, count: row._count._all }))),
      completed,
      retired
    };
  }
  async attempts(since) {
    const rows = await this.db.agentTask.groupBy({
      by: ["kind"],
      where: { finishedAt: { gte: since } },
      _avg: { attempts: true },
      _max: { attempts: true }
    });
    const mean = {};
    const max = {};
    for (const row of rows) {
      const kind = import_telemetry5.permittedTaskKind(row.kind);
      mean[kind] = round(row._avg.attempts ?? 0);
      max[kind] = row._max.attempts ?? 0;
    }
    return { mean, max };
  }
  async rechecks(since) {
    const rows = await this.db.agentTask.findMany({
      where: { kind: "recheck", createdAt: { gte: since } },
      select: { createdAt: true, dueAt: true }
    });
    const buckets = {};
    for (const row of rows) {
      const days = Math.max(0, (row.dueAt.getTime() - row.createdAt.getTime()) / (24 * HOUR_MS));
      const label2 = import_telemetry5.dayBucket(days);
      buckets[label2] = (buckets[label2] ?? 0) + 1;
    }
    return { total: rows.length, buckets };
  }
  async ledger() {
    const [byStatus, byBand, methods, kinds, decided, superseded] = await Promise.all([
      this.db.contactFact.groupBy({
        by: ["status"],
        _count: { _all: true }
      }),
      this.db.contactFact.groupBy({ by: ["band"], _count: { _all: true } }),
      this.db.contactFact.groupBy({
        by: ["method"],
        _count: { _all: true }
      }),
      this.evidenceKinds(),
      this.decisionHours(),
      this.supersededWithin(SUPERSEDE_WINDOW_DAYS)
    ]);
    const statuses = countsOf(byStatus.map((row) => ({ key: row.status, count: row._count._all })), Object.values(import_db35.FactStatus));
    const dismissed = statuses[import_db35.FactStatus.DISMISSED] ?? 0;
    const proposed = statuses[import_db35.FactStatus.PROPOSED] ?? 0;
    const judged = dismissed + (statuses[import_db35.FactStatus.APPLIED] ?? 0) + proposed;
    return {
      facts_by_status: statuses,
      facts_by_band: countsOf(byBand.map((row) => ({ key: row.band, count: row._count._all })), Object.values(import_db35.FactBand)),
      facts_by_method: merge(methods.map((row) => ({
        key: import_telemetry5.permittedMethod(row.method),
        count: row._count._all
      }))),
      facts_by_evidence_kind: kinds,
      fact_dismissal_rate: judged ? round(dismissed / judged) : 0,
      fact_decision_median_hours: decided,
      facts_superseded_within_7_days: superseded
    };
  }
  async evidenceKinds() {
    const rows = await this.db.$queryRaw`
			SELECT item->>'kind' AS kind, COUNT(*) AS count
			FROM "contactFact", jsonb_array_elements("evidence") AS item
			WHERE jsonb_typeof("evidence") = 'array'
			GROUP BY 1;
		`;
    return merge(rows.map((row) => ({
      key: import_telemetry5.permittedEvidenceKind(row.kind),
      count: Number(row.count)
    })));
  }
  async decisionHours() {
    const rows = await this.db.$queryRaw`
			SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (
				ORDER BY EXTRACT(EPOCH FROM ("decidedAt" - "observedAt")) / 3600
			) AS median
			FROM "contactFact"
			WHERE "decidedAt" IS NOT NULL;
		`;
    const median = rows[0]?.median;
    return median === null || median === undefined ? null : round(median);
  }
  async supersededWithin(days) {
    const rows = await this.db.$queryRaw`
			SELECT COUNT(*) AS count
			FROM "contactFact"
			WHERE "supersededAt" IS NOT NULL
				AND "supersededAt" - "observedAt" < make_interval(days => ${days});
		`;
    return Number(rows[0]?.count ?? 0);
  }
  async crm(since) {
    const [
      contacts,
      companies,
      deals,
      activities,
      contactSources,
      companySources,
      stages,
      types,
      syncs,
      threads,
      messages,
      enrichment,
      suppressedDomains,
      suppressedContacts,
      workspaceProfile,
      nonSeedContacts
    ] = await Promise.all([
      this.db.contact.count(),
      this.db.company.count(),
      this.db.deal.count(),
      this.db.activity.count(),
      this.db.contact.groupBy({ by: ["source"], _count: { _all: true } }),
      this.db.company.groupBy({ by: ["source"], _count: { _all: true } }),
      this.db.deal.groupBy({ by: ["stage"], _count: { _all: true } }),
      this.db.activity.groupBy({ by: ["type"], _count: { _all: true } }),
      this.db.mailboxSync.groupBy({ by: ["status"], _count: { _all: true } }),
      this.db.emailThread.count({ where: { createdAt: { gte: since } } }),
      this.db.emailMessage.count({ where: { createdAt: { gte: since } } }),
      this.db.company.groupBy({
        by: ["enrichmentStatus"],
        _count: { _all: true }
      }),
      this.db.suppressedDomain.count(),
      this.db.suppressedContact.count(),
      this.db.workspaceProfile.count(),
      this.db.contact.count({
        where: {
          OR: [
            { ownerId: null },
            { ownerId: { not: { startsWith: SEED_OWNER_PREFIX } } }
          ]
        }
      })
    ]);
    const [
      trackingSite,
      trackingDomains,
      trackingViews,
      trackingForms,
      trackingContacts,
      trackingCapped,
      trackingPaused
    ] = await Promise.all([
      this.db.appSetting.count({ where: { trackingSiteId: { not: null } } }),
      this.db.trackedDomain.count(),
      this.db.trackedEvent.count({
        where: { type: "page_view", occurredAt: { gte: since } }
      }),
      this.db.formSubmission.count({ where: { createdAt: { gte: since } } }),
      this.db.contact.count({
        where: { createdAt: { gte: since }, source: import_db35.RecordSource.TRACKING }
      }),
      this.db.formSubmission.count({
        where: { createdAt: { gte: since }, skipReason: import_tracking.CONTACT_CAP_REASON }
      }),
      this.db.appSetting.count({ where: { trackingPaused: true } })
    ]);
    const configured = syncs.reduce((sum, row) => sum + row._count._all, 0);
    return {
      seed_only: contacts > 0 && nonSeedContacts === 0,
      contacts_bucket: import_telemetry5.bucket(contacts),
      companies_bucket: import_telemetry5.bucket(companies),
      deals_bucket: import_telemetry5.bucket(deals),
      activities_bucket: import_telemetry5.bucket(activities),
      contacts_by_source: countsOf(contactSources.map((row) => ({
        key: row.source,
        count: row._count._all
      })), Object.values(import_db35.RecordSource)),
      companies_by_source: countsOf(companySources.map((row) => ({
        key: row.source,
        count: row._count._all
      })), Object.values(import_db35.RecordSource)),
      deals_by_stage: countsOf(stages.map((row) => ({ key: row.stage, count: row._count._all })), Object.values(import_db35.DealStage)),
      activities_by_type: countsOf(types.map((row) => ({ key: row.type, count: row._count._all })), Object.values(import_db35.ActivityType)),
      cap_tracking: trackingSite > 0,
      tracking_domains: import_telemetry5.bucket(trackingDomains),
      tracking_page_views: trackingViews,
      tracking_forms: trackingForms,
      tracking_contacts_created: trackingContacts,
      tracking_capped: trackingCapped,
      tracking_paused: trackingPaused > 0,
      mailbox_sync_configured: configured > 0,
      mailbox_sync_status: merge(syncs.map((row) => ({ key: row.status, count: row._count._all }))),
      threads_ingested: threads,
      messages_ingested: messages,
      enrichment_by_status: countsOf(enrichment.map((row) => ({
        key: row.enrichmentStatus,
        count: row._count._all
      })), Object.values(import_db35.EnrichmentStatus)),
      suppressed_domains: suppressedDomains,
      suppressed_contacts: suppressedContacts,
      workspace_profile_written: workspaceProfile > 0
    };
  }
}
RollupService = __legacyDecorateClassTS([
  import_common120.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof FunnelService === "undefined" ? Object : FunnelService
  ])
], RollupService);
function isSet(name) {
  return Boolean(process.env[name]?.trim());
}
function byKind(rows) {
  return merge(rows.map((row) => ({ ...row, key: import_telemetry5.permittedTaskKind(row.key) })));
}
function merge(rows) {
  const counts = {};
  for (const row of rows) {
    counts[row.key] = (counts[row.key] ?? 0) + row.count;
  }
  return counts;
}
function countsOf(rows, keys) {
  const merged = merge(rows);
  const complete = {};
  for (const key of keys)
    complete[key] = merged[key] ?? 0;
  return complete;
}
function round(value) {
  return Math.round(value * 100) / 100;
}

// src/telemetry/telemetry.controller.ts
var import_common121 = require("@nestjs/common");
var import_config5 = require("@nestjs/config");
var import_swagger7 = require("@nestjs/swagger");
var import_nestjs_better_auth8 = require("@thallesp/nestjs-better-auth");
class TelemetryController {
  rollup;
  logger = new import_common121.Logger(TelemetryController.name);
  secret;
  constructor(rollup, config) {
    this.rollup = rollup;
    this.secret = config.get("CRON_SECRET", { infer: true });
  }
  async rollupViaGet(authorization) {
    return this.run(authorization);
  }
  async rollupViaPost(authorization) {
    return this.run(authorization);
  }
  async run(authorization) {
    if (!this.secret) {
      this.logger.error({
        message: "CRON_SECRET is not set — refusing to run the rollup route."
      });
      throw new import_common121.ServiceUnavailableException("Telemetry is not configured.");
    }
    if (!timingSafeEquals4(authorization ?? "", `Bearer ${this.secret}`)) {
      throw new import_common121.ForbiddenException;
    }
    return this.rollup.run();
  }
}
__legacyDecorateClassTS([
  import_common121.Get("rollup"),
  import_nestjs_better_auth8.AllowAnonymous(),
  import_swagger7.ApiOperation({ summary: "Roll up raw telemetry events into daily counts" }),
  import_swagger7.ApiOkResponse({ description: "The rollup ran." }),
  __legacyDecorateParamTS(0, import_common121.Headers("authorization")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], TelemetryController.prototype, "rollupViaGet", null);
__legacyDecorateClassTS([
  import_common121.Post("rollup"),
  import_nestjs_better_auth8.AllowAnonymous(),
  import_swagger7.ApiExcludeEndpoint(),
  __legacyDecorateParamTS(0, import_common121.Headers("authorization")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], TelemetryController.prototype, "rollupViaPost", null);
TelemetryController = __legacyDecorateClassTS([
  import_swagger7.ApiTags("Internal — Cron"),
  import_swagger7.ApiHeader({
    name: "authorization",
    description: "`Bearer <CRON_SECRET>`",
    required: true
  }),
  import_swagger7.ApiForbiddenResponse({ description: "CRON_SECRET did not match." }),
  import_swagger7.ApiServiceUnavailableResponse({ description: "CRON_SECRET is not set." }),
  import_common121.Controller("internal/telemetry"),
  __legacyMetadataTS("design:paramtypes", [
    typeof RollupService === "undefined" ? Object : RollupService,
    typeof import_config5.ConfigService === "undefined" ? Object : import_config5.ConfigService
  ])
], TelemetryController);
function timingSafeEquals4(a, b) {
  if (a.length !== b.length)
    return false;
  let mismatch = 0;
  for (let index = 0;index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return mismatch === 0;
}

// src/telemetry/telemetry.service.ts
var import_telemetry6 = require("@crm/telemetry");
var import_common122 = require("@nestjs/common");
var ROLLUP_INTERVAL_MS = 60 * 60 * 1000;

class TelemetryService {
  rollup;
  logger = new import_common122.Logger(TelemetryService.name);
  timer = null;
  constructor(rollup) {
    this.rollup = rollup;
  }
  async onModuleInit() {
    import_telemetry6.onTelemetryProblem((message) => this.logger.debug({ message }));
    if (import_telemetry6.telemetryDisabled()) {
      this.logger.log({
        message: "Anonymous usage telemetry is off for this install."
      });
      return;
    }
    const install = await import_telemetry6.syncVersion();
    this.logger.log({
      message: "Anonymous usage telemetry is on. See docs/telemetry.md.",
      crmVersion: install?.version
    });
    this.rollup.run().catch(() => {});
    this.timer = setInterval(() => {
      this.rollup.run().catch(() => {});
    }, ROLLUP_INTERVAL_MS);
    this.timer.unref?.();
  }
  async onApplicationShutdown() {
    if (this.timer)
      clearInterval(this.timer);
    this.timer = null;
    await import_telemetry6.flushTelemetry();
    await import_telemetry6.shutdownTelemetry();
  }
}
TelemetryService = __legacyDecorateClassTS([
  import_common122.Injectable(),
  __legacyMetadataTS("design:paramtypes", [
    typeof RollupService === "undefined" ? Object : RollupService
  ])
], TelemetryService);

// src/telemetry/telemetry.module.ts
class TelemetryModule {
}
TelemetryModule = __legacyDecorateClassTS([
  import_common123.Module({
    controllers: [TelemetryController],
    providers: [FunnelService, RollupService, TelemetryService],
    exports: [TelemetryService]
  })
], TelemetryModule);

// src/tracking/tracking.module.ts
var import_common132 = require("@nestjs/common");

// src/tracking/tracking.controller.ts
var import_tracking6 = require("@crm/db/tracking");
var import_common129 = require("@nestjs/common");
var import_config6 = require("@nestjs/config");
var import_swagger8 = require("@nestjs/swagger");
var import_nestjs_better_auth9 = require("@thallesp/nestjs-better-auth");
var import_zod30 = require("zod");

// src/tracking/tracking-config.service.ts
var import_settings12 = require("@crm/db/settings");
var import_tracking2 = require("@crm/db/tracking");
var import_cache_manager5 = require("@nestjs/cache-manager");
var import_common124 = require("@nestjs/common");
var CONFIG_TTL_MS = 5 * 60000;
var CONFIG_KEY = "tracking:config";

class TrackingConfigService {
  db;
  cache;
  logger = new import_common124.Logger(TrackingConfigService.name);
  generation = 0;
  constructor(db2, cache) {
    this.db = db2;
    this.cache = cache;
  }
  async compiled() {
    const cached = await this.cache.get(CONFIG_KEY);
    if (cached)
      return cached;
    const read = this.generation;
    const config = await import_tracking2.readTrackingConfig(this.db);
    if (!config)
      return null;
    const compiled = { config, hash: import_tracking2.configHash(config) };
    if (read === this.generation && await this.current(compiled.hash)) {
      await this.cache.set(CONFIG_KEY, compiled, CONFIG_TTL_MS);
    }
    return compiled;
  }
  async current(hash) {
    const row = await this.db.appSetting.findUnique({
      where: { id: import_settings12.SETTINGS_ID },
      select: { trackingConfigHash: true }
    });
    return row?.trackingConfigHash === hash;
  }
  async forSite(siteId) {
    const compiled = await this.compiled();
    return compiled?.config.siteId === siteId ? compiled : null;
  }
  async invalidate() {
    this.generation += 1;
    const written = this.generation;
    await this.cache.del(CONFIG_KEY);
    const config = await import_tracking2.readTrackingConfig(this.db);
    if (!config) {
      await this.db.appSetting.updateMany({
        where: { id: import_settings12.SETTINGS_ID },
        data: { trackingConfigHash: null }
      });
      return;
    }
    const hash = import_tracking2.configHash(config);
    await this.db.appSetting.update({
      where: { id: import_settings12.SETTINGS_ID },
      data: { trackingConfigHash: hash }
    });
    if (written !== this.generation)
      return;
    if (!await this.current(hash))
      return;
    await this.cache.set(CONFIG_KEY, { config, hash }, CONFIG_TTL_MS);
  }
  async ensureSiteId() {
    const existing = await this.db.appSetting.findUnique({
      where: { id: import_settings12.SETTINGS_ID },
      select: { trackingSiteId: true }
    });
    if (existing?.trackingSiteId)
      return existing.trackingSiteId;
    const trackingSiteId = import_tracking2.mintSiteId();
    await this.db.appSetting.upsert({
      where: { id: import_settings12.SETTINGS_ID },
      create: { id: import_settings12.SETTINGS_ID, trackingSiteId },
      update: { trackingSiteId }
    });
    await this.invalidate();
    this.logger.log({ message: "Tracking site id minted" });
    return trackingSiteId;
  }
  async rotateSiteId() {
    const trackingSiteId = import_tracking2.mintSiteId();
    await this.db.appSetting.upsert({
      where: { id: import_settings12.SETTINGS_ID },
      create: { id: import_settings12.SETTINGS_ID, trackingSiteId },
      update: { trackingSiteId }
    });
    await this.invalidate();
    this.logger.warn({ message: "Tracking site id rotated" });
    return trackingSiteId;
  }
}
TrackingConfigService = __legacyDecorateClassTS([
  import_common124.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyDecorateParamTS(1, import_common124.Inject(import_cache_manager5.CACHE_MANAGER)),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof Cache === "undefined" ? Object : Cache
  ])
], TrackingConfigService);

// src/tracking/tracking-counter.service.ts
var import_tracking3 = require("@crm/db/tracking");
var import_common125 = require("@nestjs/common");
class TrackingCounterService {
  db;
  logger = new import_common125.Logger(TrackingCounterService.name);
  constructor(db2) {
    this.db = db2;
  }
  async take(key, limit, amount = 1) {
    if (amount <= 0)
      return true;
    if (amount > limit)
      return false;
    try {
      const charged = await this.db.$queryRaw`
				INSERT INTO "trackingCounter" ("key", "value", "expiresAt")
				VALUES (${key}, ${amount}, ${import_tracking3.windowExpiry(key)})
				ON CONFLICT ("key") DO UPDATE
					SET "value" = "trackingCounter"."value" + ${amount}
					WHERE "trackingCounter"."value" + ${amount} <= ${limit}
				RETURNING "value";
			`;
      return charged.length > 0;
    } catch (error) {
      this.logger.error({ message: "Tracking counter could not be read — refusing the write" }, error instanceof Error ? error.stack : String(error));
      return false;
    }
  }
  async release(key, amount = 1) {
    try {
      await this.db.$executeRaw`
				UPDATE "trackingCounter"
				SET "value" = GREATEST("value" - ${amount}, 0)
				WHERE "key" = ${key};
			`;
    } catch (error) {
      this.logger.error({ message: "Tracking counter could not be released" }, error instanceof Error ? error.stack : String(error));
    }
  }
  async sweep() {
    const removed = await this.db.trackingCounter.deleteMany({
      where: { expiresAt: { lt: new Date } }
    });
    return removed.count;
  }
}
TrackingCounterService = __legacyDecorateClassTS([
  import_common125.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db
  ])
], TrackingCounterService);

// src/tracking/tracking-ingest.service.ts
var import_attribution = require("@crm/db/attribution");
var import_tracking5 = require("@crm/db/tracking");
var import_common127 = require("@nestjs/common");
var import_zod29 = require("zod");

// src/tracking/tracking-filing.service.ts
var import_auth42 = require("@crm/auth");
var import_db36 = require("@crm/db");
var import_tracking4 = require("@crm/db/tracking");
var import_common126 = require("@nestjs/common");
function columns(touch, prefix) {
  if (!touch)
    return {};
  return {
    [`${prefix}Source`]: touch.source,
    [`${prefix}Medium`]: touch.medium,
    [`${prefix}Campaign`]: touch.campaign,
    [`${prefix}Term`]: touch.term,
    [`${prefix}Content`]: touch.content,
    [`${prefix}Referrer`]: touch.referrer,
    [`${prefix}Landing`]: touch.landing,
    [`${prefix}TouchAt`]: touch.at
  };
}

class TrackingFilingService {
  db;
  counters;
  companies;
  agent;
  stamp;
  logger = new import_common126.Logger(TrackingFilingService.name);
  constructor(db2, counters, companies, agent, stamp) {
    this.db = db2;
    this.counters = counters;
    this.companies = companies;
    this.agent = agent;
    this.stamp = stamp;
  }
  async file(submission) {
    const email = normalizeEmail(submission.email ?? "");
    if (!email)
      return this.skip(submission.id, "No email address");
    if (isMachineAddress(email) || isAutomatedAddress(email)) {
      return this.skip(submission.id, "Not an address a human reads");
    }
    const domain = email.split("@")[1] ?? null;
    if (!domain)
      return this.skip(submission.id, "No usable domain");
    if (isMachineDomain(domain)) {
      return this.skip(submission.id, "Not a domain a human reads");
    }
    if (import_auth42.workspaceDomains().includes(domain)) {
      return this.skip(submission.id, "One of our own addresses");
    }
    const suppressed = await this.suppressed(email, domain);
    if (suppressed)
      return this.skip(submission.id, suppressed);
    const existing = await this.db.contact.findFirst({
      where: { email, archivedAt: null },
      select: { id: true }
    });
    if (existing) {
      await this.attach(submission.id, existing.id, submission);
      return { filed: true, contactId: existing.id };
    }
    const window = import_tracking4.contactWindowKey();
    if (!await this.counters.take(window, import_tracking4.CONTACTS_PER_HOUR)) {
      return this.skip(submission.id, import_tracking4.CONTACT_CAP_REASON);
    }
    const companyId = await this.companies.companyForEmail(email);
    const { firstName, lastName } = splitName(submission.name, email);
    let contact;
    try {
      contact = await this.db.contact.create({
        data: {
          firstName,
          lastName,
          email,
          companyId,
          source: import_db36.RecordSource.TRACKING,
          lastActivityAt: new Date
        },
        select: { id: true }
      });
    } catch (error) {
      await this.counters.release(window);
      const raced = await this.raced(error, email);
      if (!raced)
        throw error;
      await this.attach(submission.id, raced.id, submission);
      return { filed: true, contactId: raced.id };
    }
    await this.attach(submission.id, contact.id, submission);
    await this.agent.contactCreated(contact.id, `Submitted a form on ${submission.host}`);
    this.logger.log({
      message: "Contact filed from a form submission",
      contactId: contact.id,
      host: submission.host
    });
    return { filed: true, contactId: contact.id };
  }
  async raced(cause, email) {
    if (!(cause instanceof import_db36.Prisma.PrismaClientKnownRequestError) || cause.code !== "P2002") {
      return null;
    }
    return this.db.contact.findFirst({
      where: { email, archivedAt: null },
      select: { id: true }
    });
  }
  async attach(submissionId, contactId, context) {
    const { visitorId } = context;
    const claimed = await this.db.formSubmission.updateMany({
      where: { id: submissionId, filedAt: null },
      data: { contactId, filedAt: new Date, skipReason: null }
    });
    if (claimed.count === 0)
      return;
    const submission = await this.db.formSubmission.findUniqueOrThrow({
      where: { id: submissionId },
      select: { host: true, path: true }
    });
    const author = await this.author(contactId);
    if (author) {
      const activity = await this.db.activity.create({
        data: {
          type: import_db36.ActivityType.NOTE,
          subject: `Submitted a form on ${submission.host}`,
          body: `${submission.host}${submission.path}`,
          contactId,
          occurredAt: new Date,
          createdById: author,
          meta: { automated: true, source: "tracking" }
        },
        select: { createdAt: true }
      });
      await this.stamp.touch({ contactId }, activity.createdAt);
    }
    if (!visitorId)
      return;
    const first = columns(context.firstTouch, "first");
    const last = columns(context.lastTouch, "last");
    await this.db.trackedVisitor.upsert({
      where: { id: visitorId },
      create: { id: visitorId, contactId, ...first, ...last },
      update: { contactId, ...last }
    });
  }
  async author(contactId) {
    const contact = await this.db.contact.findUnique({
      where: { id: contactId },
      select: { ownerId: true }
    });
    if (contact?.ownerId)
      return contact.ownerId;
    const anyUser = await this.db.user.findFirst({ select: { id: true } });
    return anyUser?.id ?? null;
  }
  async skip(submissionId, reason) {
    await this.db.formSubmission.update({
      where: { id: submissionId },
      data: { skipReason: reason }
    });
    return { filed: false, reason };
  }
  async suppressed(email, domain) {
    const [contact, host] = await Promise.all([
      this.db.suppressedContact.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
        select: { email: true }
      }),
      this.db.suppressedDomain.findUnique({
        where: { domain },
        select: { domain: true }
      })
    ]);
    if (contact)
      return "This address was deleted by a rep";
    if (host)
      return "This domain is suppressed";
    return null;
  }
}
TrackingFilingService = __legacyDecorateClassTS([
  import_common126.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof TrackingCounterService === "undefined" ? Object : TrackingCounterService,
    typeof CompanyDirectoryService === "undefined" ? Object : CompanyDirectoryService,
    typeof AgentTriggerService === "undefined" ? Object : AgentTriggerService,
    typeof ActivityStampService === "undefined" ? Object : ActivityStampService
  ])
], TrackingFilingService);

// src/tracking/tracking-ingest.service.ts
var MAX_LABEL = 80;
var MAX_PATH = 512;
var MAX_HOST = 253;
var KEPT = new Set(["page_view", "click", "form_submit"]);
var BOT = /bot|crawler|spider|crawling|headlesschrome|lighthouse|preview/i;
var SENSITIVE = /pass|secret|token|card|cvv|cvc|ssn|iban|routing/i;
var CARD = /^[0-9 -]{12,25}$/;
var ADDRESS = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/;
var fieldText = import_zod29.z.string().nullable().catch(null);

class TrackingIngestService {
  db;
  config;
  counters;
  filing;
  logger = new import_common127.Logger(TrackingIngestService.name);
  constructor(db2, config, counters, filing) {
    this.db = db2;
    this.config = config;
    this.counters = counters;
    this.filing = filing;
  }
  async accept(batch, request) {
    if (request.userAgent && BOT.test(request.userAgent))
      return;
    const compiled = await this.config.forSite(batch.siteId);
    if (!compiled)
      return;
    if (!import_tracking5.originAllowed(request.origin, compiled.config))
      return;
    const visitorId = sanitizeId(batch.visitorId);
    if (!visitorId)
      return;
    const events = batch.events.slice(0, import_tracking5.MAX_EVENTS_PER_BATCH);
    if (scripted(events))
      return;
    const accepted = events.flatMap((event) => {
      if (!KEPT.has(event.type))
        return [];
      const host = event.host?.toLowerCase().trim().slice(0, MAX_HOST);
      return host && import_tracking5.hostAllowed(host, compiled.config) ? [{ event, host }] : [];
    });
    if (accepted.length === 0)
      return;
    if (!await this.withinRate(accepted.length))
      return;
    const pageViews = accepted.filter(({ event }) => event.type === "page_view" || event.type === "click");
    const forms = accepted.filter(({ event }) => event.type === "form_submit");
    if (pageViews.length > 0) {
      await this.events(visitorId, pageViews, compiled.config);
    }
    for (const form of forms) {
      await this.submission(visitorId, form);
    }
  }
  async events(visitorId, accepted, config) {
    const rows = accepted.map(({ event, host }) => {
      const touch = event.type === "page_view" && event.touch ? import_attribution.classifyTouch(arriving(event.touch)) : null;
      const referrer = import_tracking5.stripQuery(event.referrer);
      return {
        visitorId,
        type: event.type,
        host,
        path: trim(import_tracking5.normalizePath(event.path), MAX_PATH),
        referrer: referrer ? trim(referrer, MAX_PATH) : null,
        label: event.label ? trim(event.label, MAX_LABEL) : null,
        source: touch?.source ?? null,
        medium: touch?.medium ?? null,
        campaign: touch?.campaign ?? null,
        occurredAt: occurredAt(event.at)
      };
    });
    await this.db.trackedEvent.createMany({ data: rows });
    await this.countViews(rows, config);
  }
  async countViews(rows, config) {
    const tallies = new Map;
    for (const row of rows) {
      const entry = import_tracking5.matchedHost(row.host, config);
      if (!entry)
        continue;
      const views = tallies.get(entry.host) ?? 0;
      tallies.set(entry.host, views + (row.type === "page_view" ? 1 : 0));
    }
    const lastSeenAt = new Date;
    await Promise.all([...tallies].map(([host, views]) => this.db.trackedDomain.updateMany({
      where: { host },
      data: { pageViews: { increment: views }, lastSeenAt }
    })));
  }
  async submission(visitorId, { event, host }) {
    const fields = clean(event.fields ?? {});
    const email = emailFrom(fields);
    const path = trim(import_tracking5.normalizePath(event.path), MAX_PATH);
    const at = occurredAt(event.at);
    const lastTouch = import_attribution.classifyTouch(arriving(event.touch ?? {}), at);
    const firstTouch = event.firstTouch ? import_attribution.classifyTouch(arriving(event.firstTouch), at) : lastTouch;
    const key = import_tracking5.dedupeKey({ host, path, email, at });
    const created = await this.db.formSubmission.createMany({
      data: [
        {
          visitorId,
          host,
          path,
          email,
          fields,
          firstTouch: stored(firstTouch),
          lastTouch: stored(lastTouch),
          dedupeKey: key
        }
      ],
      skipDuplicates: true
    });
    const submission = await this.db.formSubmission.findUnique({
      where: { dedupeKey: key },
      select: { id: true, filedAt: true, skipReason: true }
    });
    if (!submission)
      return;
    if (created.count === 0 && !unfiled(submission))
      return;
    const outcome = await this.filing.file({
      id: submission.id,
      email,
      host,
      visitorId,
      name: nameFrom(fields),
      firstTouch,
      lastTouch
    });
    if (!outcome.filed) {
      this.logger.log({
        message: "Form submission stored but not filed",
        host,
        reason: outcome.reason
      });
    }
  }
  async withinRate(events) {
    return this.counters.take(import_tracking5.rateWindowKey(), import_tracking5.EVENTS_PER_MINUTE, events);
  }
}
TrackingIngestService = __legacyDecorateClassTS([
  import_common127.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof TrackingConfigService === "undefined" ? Object : TrackingConfigService,
    typeof TrackingCounterService === "undefined" ? Object : TrackingCounterService,
    typeof TrackingFilingService === "undefined" ? Object : TrackingFilingService
  ])
], TrackingIngestService);
function unfiled(submission) {
  return submission.filedAt === null && submission.skipReason === null;
}
function arriving(touch) {
  return {
    ...touch,
    referrer: import_tracking5.stripQuery(touch.referrer) ?? undefined,
    landing: import_tracking5.stripQuery(touch.landing) ?? undefined
  };
}
function stored(touch) {
  return {
    source: touch.source,
    medium: touch.medium,
    campaign: touch.campaign,
    term: touch.term,
    content: touch.content,
    referrer: touch.referrer,
    landing: touch.landing,
    at: touch.at.toISOString()
  };
}
function scripted(events) {
  if (events.length < 3)
    return false;
  const stamps = events.flatMap((event) => event.at !== undefined && Number.isFinite(event.at) ? [event.at] : []);
  if (stamps.length !== events.length)
    return false;
  return new Set(stamps).size === 1;
}
function occurredAt(at) {
  const now = Date.now();
  if (at === undefined || !Number.isFinite(at))
    return new Date(now);
  const bounded = Math.min(Math.max(at, now - 86400000), now);
  return new Date(bounded);
}
function trim(value, max) {
  return value.length > max ? value.slice(0, max) : value;
}
function sanitizeId(value) {
  const trimmed = fieldText.parse(value)?.trim() ?? "";
  return /^[a-zA-Z0-9_-]{8,64}$/.test(trimmed) ? trimmed : null;
}
function clean(fields) {
  const kept = {};
  for (const [key, value] of Object.entries(fields).slice(0, 40)) {
    const text = fieldText.parse(value);
    if (text === null)
      continue;
    if (SENSITIVE.test(key))
      continue;
    if (CARD.test(text.trim()))
      continue;
    kept[trim(key, 64)] = trim(text, 512);
  }
  return kept;
}
function emailFrom(fields) {
  for (const [key, value] of Object.entries(fields)) {
    if (!/mail/i.test(key))
      continue;
    const email = address(value);
    if (email)
      return email;
  }
  for (const value of Object.values(fields)) {
    const email = address(value);
    if (email)
      return email;
  }
  return null;
}
function address(value) {
  const email = normalizeEmail(value);
  return email && ADDRESS.test(email) ? email : null;
}
function nameFrom(fields) {
  const first = pick(fields, /^(first[\s_-]?name|fname|given)/i);
  const last = pick(fields, /^(last[\s_-]?name|lname|surname|family)/i);
  if (first)
    return last ? `${first} ${last}` : first;
  return pick(fields, /^(full[\s_-]?name|name)$/i) ?? pick(fields, /name/i);
}
function pick(fields, pattern) {
  for (const [key, value] of Object.entries(fields)) {
    if (pattern.test(key) && value.trim())
      return value.trim();
  }
  return null;
}

// src/tracking/tracking-rollup.service.ts
var import_common128 = require("@nestjs/common");
class TrackingRollupService {
  db;
  constructor(db2) {
    this.db = db2;
  }
  async run(before) {
    const rolled = await this.db.$executeRaw`
			INSERT INTO "trackedPageDaily" ("day", "host", "path", "views", "visitors")
			SELECT
				date_trunc('day', "occurredAt") AS "day",
				"host",
				"path",
				count(*)::int AS "views",
				count(DISTINCT "visitorId")::int AS "visitors"
			FROM "trackedEvent"
			WHERE "occurredAt" < ${before} AND "type" = 'page_view'
			GROUP BY 1, 2, 3
			ON CONFLICT ("day", "host", "path") DO UPDATE
			SET "views" = GREATEST("trackedPageDaily"."views", EXCLUDED."views"),
				"visitors" = GREATEST("trackedPageDaily"."visitors", EXCLUDED."visitors");
		`;
    return rolled;
  }
}
TrackingRollupService = __legacyDecorateClassTS([
  import_common128.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db
  ])
], TrackingRollupService);

// src/tracking/tracking.controller.ts
var SWEEP_BATCH = 1e4;
var MAX_SWEEP_PASSES = 50;
var parsedBody = import_zod30.z.union([
  import_zod30.z.string().transform((text) => ({ text, json: null })),
  import_zod30.z.union([import_zod30.z.array(import_zod30.z.json()), import_zod30.z.looseObject({})]).transform((json) => ({ text: null, json }))
]).nullable().catch(null);
var trackingRequest = import_zod30.z.object({ body: parsedBody }).catch({ body: null });

class TrackingController {
  config;
  ingest;
  logger = new import_common129.Logger(TrackingController.name);
  constructor(config, ingest) {
    this.config = config;
    this.ingest = ingest;
  }
  async publicConfig(siteId) {
    if (!import_tracking6.isSiteId(siteId))
      return { config: null };
    const compiled = await this.config.forSite(siteId);
    return compiled ? { config: compiled.config, hash: compiled.hash } : { config: null };
  }
  async collect(request, response, origin, userAgent) {
    response.setHeader("cross-origin-resource-policy", "cross-origin");
    const raw = await read(request, import_tracking6.MAX_BODY_BYTES);
    if (!raw)
      return;
    let batch;
    try {
      batch = JSON.parse(raw);
    } catch {
      return;
    }
    if (!import_tracking6.isSiteId(batch?.siteId) || !Array.isArray(batch?.events))
      return;
    try {
      await this.ingest.accept(batch, {
        origin: origin ?? null,
        userAgent: userAgent ?? null
      });
    } catch (error) {
      this.logger.error({ message: "Tracking event was not stored" }, error instanceof Error ? error.stack : String(error));
    }
  }
}
__legacyDecorateClassTS([
  import_common129.Get("config/:siteId"),
  import_nestjs_better_auth9.AllowAnonymous(),
  import_swagger8.ApiOperation({
    summary: "Fetch a site's compiled tracking config, for the tracking script"
  }),
  import_swagger8.ApiParam({ name: "siteId", description: "Public site identifier." }),
  import_swagger8.ApiOkResponse({
    description: "The compiled config, or null if the site is unknown."
  }),
  __legacyDecorateParamTS(0, import_common129.Param("siteId")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], TrackingController.prototype, "publicConfig", null);
__legacyDecorateClassTS([
  import_common129.Post("e"),
  import_nestjs_better_auth9.AllowAnonymous(),
  import_common129.HttpCode(204),
  import_swagger8.ApiOperation({
    summary: "Ingest a batch of events from the tracking script"
  }),
  import_swagger8.ApiNoContentResponse({
    description: "Always returned, even when the batch was rejected or unreadable."
  }),
  __legacyDecorateParamTS(0, import_common129.Req()),
  __legacyDecorateParamTS(1, import_common129.Res({ passthrough: true })),
  __legacyDecorateParamTS(2, import_common129.Headers("origin")),
  __legacyDecorateParamTS(3, import_common129.Headers("user-agent")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof IncomingMessage === "undefined" ? Object : IncomingMessage,
    typeof Response === "undefined" ? Object : Response,
    String,
    String
  ]),
  __legacyMetadataTS("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], TrackingController.prototype, "collect", null);
TrackingController = __legacyDecorateClassTS([
  import_swagger8.ApiTags("Tracking"),
  import_common129.Controller("api/t"),
  __legacyMetadataTS("design:paramtypes", [
    typeof TrackingConfigService === "undefined" ? Object : TrackingConfigService,
    typeof TrackingIngestService === "undefined" ? Object : TrackingIngestService
  ])
], TrackingController);

class TrackingRetentionController {
  db;
  rollups;
  counters;
  logger = new import_common129.Logger(TrackingRetentionController.name);
  secret;
  constructor(db2, rollups, counters, config) {
    this.db = db2;
    this.rollups = rollups;
    this.counters = counters;
    this.secret = config.get("CRON_SECRET", { infer: true });
  }
  async viaGet(authorization) {
    return this.run(authorization);
  }
  async viaPost(authorization) {
    return this.run(authorization);
  }
  async run(authorization) {
    if (!this.secret) {
      this.logger.error({
        message: "CRON_SECRET is not set — refusing to run tracking retention."
      });
      throw new import_common129.ServiceUnavailableException("Retention is not configured.");
    }
    if (!timingSafeEquals5(authorization ?? "", `Bearer ${this.secret}`)) {
      throw new import_common129.ForbiddenException;
    }
    const before = startOfDay(new Date(Date.now() - import_tracking6.EVENT_RETENTION_DAYS * 24 * 60 * 60000));
    const rolled = await this.rollups.run(before);
    const { removed, complete } = await this.sweepEvents(before);
    const visitors = await this.sweepVisitors(before);
    const counters = await this.counters.sweep();
    if (!complete) {
      this.logger.warn({
        message: "Tracking retention hit its pass limit — events older than the window remain",
        removed,
        retentionDays: import_tracking6.EVENT_RETENTION_DAYS
      });
    }
    this.logger.log({
      message: "Tracking retention swept",
      rolled,
      removed,
      complete,
      visitors,
      counters,
      retentionDays: import_tracking6.EVENT_RETENTION_DAYS
    });
    return { rolled, removed, complete, visitors, counters };
  }
  async sweepEvents(before) {
    let removed = 0;
    for (let pass = 0;pass < MAX_SWEEP_PASSES; pass += 1) {
      const deleted = await this.db.$executeRaw`
				DELETE FROM "trackedEvent"
				WHERE "id" IN (
					SELECT "id" FROM "trackedEvent"
					WHERE "occurredAt" < ${before}
					LIMIT ${SWEEP_BATCH}
				);
			`;
      removed += deleted;
      if (deleted < SWEEP_BATCH)
        return { removed, complete: true };
    }
    return { removed, complete: false };
  }
  async sweepVisitors(before) {
    const orphaned = await this.db.$executeRaw`
			DELETE FROM "trackedVisitor"
			WHERE "contactId" IS NULL
				AND "lastSeen" < ${before}
				AND NOT EXISTS (
					SELECT 1 FROM "trackedEvent"
					WHERE "trackedEvent"."visitorId" = "trackedVisitor"."id"
				);
		`;
    return orphaned;
  }
}
__legacyDecorateClassTS([
  import_common129.Get("retention"),
  import_nestjs_better_auth9.AllowAnonymous(),
  import_swagger8.ApiOperation({
    summary: "Roll up and sweep tracking data older than the retention window"
  }),
  import_swagger8.ApiOkResponse({ description: "The sweep ran; removed and rolled counts." }),
  __legacyDecorateParamTS(0, import_common129.Headers("authorization")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], TrackingRetentionController.prototype, "viaGet", null);
__legacyDecorateClassTS([
  import_common129.Post("retention"),
  import_nestjs_better_auth9.AllowAnonymous(),
  import_swagger8.ApiExcludeEndpoint(),
  __legacyDecorateParamTS(0, import_common129.Headers("authorization")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], TrackingRetentionController.prototype, "viaPost", null);
TrackingRetentionController = __legacyDecorateClassTS([
  import_swagger8.ApiTags("Internal — Cron"),
  import_swagger8.ApiHeader({
    name: "authorization",
    description: "`Bearer <CRON_SECRET>`",
    required: true
  }),
  import_swagger8.ApiForbiddenResponse({ description: "CRON_SECRET did not match." }),
  import_swagger8.ApiServiceUnavailableResponse({ description: "CRON_SECRET is not set." }),
  import_common129.Controller("internal/tracking"),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof TrackingRollupService === "undefined" ? Object : TrackingRollupService,
    typeof TrackingCounterService === "undefined" ? Object : TrackingCounterService,
    typeof import_config6.ConfigService === "undefined" ? Object : import_config6.ConfigService
  ])
], TrackingRetentionController);
async function read(request, limit) {
  const existing = trackingRequest.parse(request).body;
  if (existing !== null) {
    if (existing.text !== null) {
      return existing.text.length > limit ? null : existing.text;
    }
    return JSON.stringify(existing.json);
  }
  return new Promise((resolve) => {
    const chunks = [];
    let size = 0;
    let settled = false;
    const finish = (value) => {
      if (settled)
        return;
      settled = true;
      resolve(value);
    };
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        request.destroy();
        finish(null);
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => finish(Buffer.concat(chunks).toString("utf8")));
    request.on("error", () => finish(null));
  });
}
function startOfDay(at) {
  const day = new Date(at);
  day.setUTCHours(0, 0, 0, 0);
  return day;
}
function timingSafeEquals5(a, b) {
  if (a.length !== b.length)
    return false;
  let mismatch = 0;
  for (let index = 0;index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return mismatch === 0;
}

// src/tracking/tracking.router.ts
var import_common131 = require("@nestjs/common");
var import_nestjs_trpc20 = require("nestjs-trpc");
var import_zod32 = require("zod");

// src/tracking/tracking.contracts.ts
var import_zod31 = require("zod");
var trackingFlagInput = import_zod31.z.object({
  flag: import_zod31.z.enum([
    "crossDomain",
    "limitToDomains",
    "cookieSubdomains",
    "secureCookies",
    "honourDnt",
    "paused"
  ]),
  enabled: import_zod31.z.boolean()
});
var cookieLifetimeInput = import_zod31.z.object({
  days: import_zod31.z.number().int().min(0).max(400)
});
var addDomainInput = import_zod31.z.object({
  host: import_zod31.z.string().min(1).max(253),
  scope: import_zod31.z.enum(["SITE_AND_SUBDOMAINS", "EXACT_HOST"]).default("EXACT_HOST")
});
var removeDomainInput = import_zod31.z.object({
  id: import_zod31.z.string().min(1)
});
var verifyInput = import_zod31.z.object({
  url: import_zod31.z.string().min(1).max(2048)
});
var companyActivityInput = import_zod31.z.object({
  companyId: import_zod31.z.string().min(1)
});
var contactActivityInput = import_zod31.z.object({
  contactId: import_zod31.z.string().min(1)
});
var domainScopeOutput = import_zod31.z.enum(["SITE_AND_SUBDOMAINS", "EXACT_HOST"]);
var trackedDomainOutput = import_zod31.z.object({
  id: import_zod31.z.string(),
  host: import_zod31.z.string(),
  scope: domainScopeOutput,
  pageViews: import_zod31.z.number(),
  lastSeenAt: import_zod31.z.string().nullable()
});
var trackingSettingsOutput = import_zod31.z.object({
  siteId: import_zod31.z.string().nullable(),
  ready: import_zod31.z.boolean(),
  scriptUrl: import_zod31.z.string(),
  snippet: import_zod31.z.string().nullable(),
  tagManagerSnippet: import_zod31.z.string().nullable(),
  crossDomain: import_zod31.z.boolean(),
  limitToDomains: import_zod31.z.boolean(),
  cookieSubdomains: import_zod31.z.boolean(),
  secureCookies: import_zod31.z.boolean(),
  honourDnt: import_zod31.z.boolean(),
  cookieDays: import_zod31.z.number(),
  paused: import_zod31.z.boolean(),
  cookieLifetimes: import_zod31.z.array(import_zod31.z.object({ days: import_zod31.z.number(), label: import_zod31.z.string() })),
  domains: import_zod31.z.array(trackedDomainOutput),
  receivingSince: import_zod31.z.string().nullable(),
  pageViews: import_zod31.z.number(),
  submissions: import_zod31.z.number(),
  canManage: import_zod31.z.boolean()
});
var rotateSiteIdOutput = import_zod31.z.object({
  siteId: import_zod31.z.string()
});
var foundInContainerOutput = import_zod31.z.object({
  id: import_zod31.z.string(),
  carriesSiteId: import_zod31.z.boolean()
});
var verifyOutput = import_zod31.z.discriminatedUnion("status", [
  import_zod31.z.object({
    status: import_zod31.z.literal("found"),
    host: import_zod31.z.string(),
    responseMs: import_zod31.z.number(),
    allowed: import_zod31.z.boolean(),
    pageView: import_zod31.z.boolean(),
    container: foundInContainerOutput.nullable()
  }),
  import_zod31.z.object({
    status: import_zod31.z.literal("missing"),
    host: import_zod31.z.string(),
    responseMs: import_zod31.z.number(),
    containers: import_zod31.z.array(import_zod31.z.string())
  }),
  import_zod31.z.object({
    status: import_zod31.z.literal("unreachable"),
    host: import_zod31.z.string(),
    detail: import_zod31.z.string()
  })
]);
var sourceRowOutput = import_zod31.z.object({
  source: import_zod31.z.string(),
  medium: import_zod31.z.string().nullable(),
  views: import_zod31.z.number(),
  contacts: import_zod31.z.number()
});
var sourcesOutput = import_zod31.z.array(sourceRowOutput);
var touchSummaryOutput = import_zod31.z.object({
  label: import_zod31.z.string(),
  source: import_zod31.z.string(),
  medium: import_zod31.z.string().nullable(),
  campaign: import_zod31.z.string().nullable(),
  landing: import_zod31.z.string().nullable(),
  referrer: import_zod31.z.string().nullable(),
  at: import_zod31.z.string().nullable()
});
var visitedPageOutput = import_zod31.z.object({
  host: import_zod31.z.string(),
  path: import_zod31.z.string(),
  views: import_zod31.z.number(),
  lastSeenAt: import_zod31.z.string()
});
var websiteActivityOutput = import_zod31.z.object({
  identified: import_zod31.z.boolean(),
  visitors: import_zod31.z.number(),
  views: import_zod31.z.number(),
  lastSeenAt: import_zod31.z.string().nullable(),
  pages: import_zod31.z.array(visitedPageOutput),
  firstTouch: touchSummaryOutput.nullable(),
  lastTouch: touchSummaryOutput.nullable()
});

// src/tracking/tracking.service.ts
var import_auth43 = require("@crm/auth");
var import_db37 = require("@crm/db");
var import_attribution2 = require("@crm/db/attribution");
var import_safe_fetch = require("@crm/db/safe-fetch");
var import_settings13 = require("@crm/db/settings");
var import_tracking7 = require("@crm/db/tracking");
var import_common130 = require("@nestjs/common");
class TrackingService {
  db;
  config;
  constructor(db2, config) {
    this.db = db2;
    this.config = config;
  }
  async settings(userId) {
    const [row, domains, latest, pageViews, submissions] = await Promise.all([
      this.db.appSetting.findUnique({
        where: { id: import_settings13.SETTINGS_ID },
        select: {
          trackingSiteId: true,
          trackingCrossDomain: true,
          trackingLimitToDomains: true,
          trackingCookieSubdomains: true,
          trackingSecureCookies: true,
          trackingHonourDnt: true,
          trackingCookieDays: true,
          trackingPaused: true
        }
      }),
      this.db.trackedDomain.findMany({ orderBy: { createdAt: "asc" } }),
      this.db.trackedEvent.findFirst({
        orderBy: { occurredAt: "desc" },
        select: { occurredAt: true }
      }),
      this.db.trackedEvent.count({ where: { type: "page_view" } }),
      this.db.formSubmission.count()
    ]);
    const ready = import_tracking7.trackingReady(row?.trackingLimitToDomains ?? true, domains.length);
    const siteId = ready ? await this.config.ensureSiteId() : row?.trackingSiteId ?? null;
    return {
      siteId,
      ready,
      scriptUrl: scriptUrl(),
      snippet: siteId ? snippet(siteId) : null,
      tagManagerSnippet: siteId ? import_tracking7.gtmSnippet(import_auth43.appUrl, siteId) : null,
      crossDomain: row?.trackingCrossDomain ?? true,
      limitToDomains: row?.trackingLimitToDomains ?? true,
      cookieSubdomains: row?.trackingCookieSubdomains ?? false,
      secureCookies: row?.trackingSecureCookies ?? true,
      honourDnt: row?.trackingHonourDnt ?? true,
      cookieDays: row?.trackingCookieDays ?? 395,
      paused: row?.trackingPaused ?? false,
      cookieLifetimes: [...import_tracking7.COOKIE_LIFETIMES],
      domains: domains.map((domain) => ({
        id: domain.id,
        host: domain.host,
        scope: domain.scope,
        pageViews: domain.pageViews,
        lastSeenAt: domain.lastSeenAt?.toISOString() ?? null
      })),
      receivingSince: latest?.occurredAt.toISOString() ?? null,
      pageViews,
      submissions,
      canManage: import_auth43.canManageTracking(await this.roleOf(userId))
    };
  }
  async setFlag(userId, flag, enabled) {
    await this.assertCanManage(userId);
    const column = {
      crossDomain: "trackingCrossDomain",
      limitToDomains: "trackingLimitToDomains",
      cookieSubdomains: "trackingCookieSubdomains",
      secureCookies: "trackingSecureCookies",
      honourDnt: "trackingHonourDnt",
      paused: "trackingPaused"
    }[flag];
    await this.db.appSetting.upsert({
      where: { id: import_settings13.SETTINGS_ID },
      create: { id: import_settings13.SETTINGS_ID, [column]: enabled },
      update: { [column]: enabled }
    });
    await this.config.invalidate();
  }
  async setCookieDays(userId, days) {
    await this.assertCanManage(userId);
    if (!import_tracking7.COOKIE_LIFETIMES.some((entry) => entry.days === days)) {
      throw new import_common130.BadRequestException("That is not a cookie lifetime we offer.");
    }
    await this.db.appSetting.upsert({
      where: { id: import_settings13.SETTINGS_ID },
      create: { id: import_settings13.SETTINGS_ID, trackingCookieDays: days },
      update: { trackingCookieDays: days }
    });
    await this.config.invalidate();
  }
  async addDomain(userId, input) {
    await this.assertCanManage(userId);
    const host = import_tracking7.normalizeHost(input.host);
    if (!host) {
      throw new import_common130.BadRequestException("That is not a domain. Try something like acme.com.");
    }
    try {
      const domain = await this.db.trackedDomain.create({
        data: { host, scope: input.scope }
      });
      await this.config.invalidate();
      return {
        id: domain.id,
        host: domain.host,
        scope: domain.scope,
        pageViews: domain.pageViews,
        lastSeenAt: null
      };
    } catch (error) {
      if (error instanceof import_db37.Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new import_common130.BadRequestException(`${host} is already on the list.`);
      }
      throw error;
    }
  }
  async removeDomain(userId, id) {
    await this.assertCanManage(userId);
    try {
      await this.db.trackedDomain.delete({ where: { id } });
    } catch (error) {
      if (error instanceof import_db37.Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new import_common130.NotFoundException("That domain is already gone.");
      }
      throw error;
    }
    await this.config.invalidate();
  }
  async rotateSiteId(userId) {
    await this.assertCanManage(userId);
    return { siteId: await this.config.rotateSiteId() };
  }
  async verify(userId, url) {
    await this.assertCanManage(userId);
    const domains = await this.db.trackedDomain.count();
    const row = await this.db.appSetting.findUnique({
      where: { id: import_settings13.SETTINGS_ID },
      select: { trackingLimitToDomains: true }
    });
    if (!import_tracking7.trackingReady(row?.trackingLimitToDomains ?? true, domains)) {
      throw new import_common130.BadRequestException("Add the domain your website runs on first — there is no script to find yet.");
    }
    const target = absolute(url);
    if (!target) {
      throw new import_common130.BadRequestException("That is not a URL. Try something like acme.com/pricing.");
    }
    const compiled = await this.config.compiled();
    const started = Date.now();
    const fetched = await import_safe_fetch.safeFetch(target.toString(), { timeoutMs: 8000 });
    const responseMs = Date.now() - started;
    const host = (fetched?.url ?? target).hostname.toLowerCase();
    if (!fetched?.response.ok) {
      return {
        status: "unreachable",
        host,
        detail: fetched ? `The page answered ${fetched.response.status}.` : "We could not reach that page."
      };
    }
    const body2 = (await fetched.response.text()).slice(0, import_tracking7.MAX_VERIFY_BYTES);
    const siteId = compiled?.config.siteId;
    if (!siteId) {
      return { status: "missing", host, responseMs, containers: [] };
    }
    const inHtml = mentions(body2, siteId);
    const containers = inHtml ? [] : import_tracking7.gtmContainers(body2);
    const container = inHtml ? null : await this.inContainers(containers, siteId);
    if (!inHtml && !container) {
      return { status: "missing", host, responseMs, containers };
    }
    const since = new Date(Date.now() - import_tracking7.VERIFY_WINDOW_MS);
    const seen = await this.db.trackedEvent.findFirst({
      where: { host, occurredAt: { gte: since } },
      select: { id: true }
    });
    return {
      status: "found",
      host,
      responseMs,
      allowed: compiled ? import_tracking7.hostAllowed(host, compiled.config) : false,
      pageView: seen !== null,
      container
    };
  }
  async inContainers(containers, siteId) {
    let attribute = null;
    for (const id of containers) {
      const fetched = await import_safe_fetch.safeFetch(import_tracking7.gtmContainerUrl(id), {
        timeoutMs: 8000
      });
      if (!fetched?.response.ok)
        continue;
      const source = (await fetched.response.text()).slice(0, import_tracking7.MAX_VERIFY_BYTES);
      const state = import_tracking7.gtmTag(source, siteId);
      if (state === "url")
        return { id, carriesSiteId: true };
      if (state === "attribute" && !attribute) {
        attribute = { id, carriesSiteId: false };
      }
    }
    return attribute;
  }
  async activityForCompany(companyId) {
    const visitors = await this.db.trackedVisitor.findMany({
      where: { contact: { companyId } },
      select: { id: true }
    });
    return this.activityFor(visitors.map((visitor) => visitor.id));
  }
  async activityForContact(contactId) {
    const visitors = await this.db.trackedVisitor.findMany({
      where: { contactId },
      select: { id: true }
    });
    return this.activityFor(visitors.map((visitor) => visitor.id));
  }
  async activityFor(visitorIds) {
    if (visitorIds.length === 0) {
      return {
        identified: false,
        visitors: 0,
        views: 0,
        lastSeenAt: null,
        pages: [],
        firstTouch: null,
        lastTouch: null
      };
    }
    const [first, last] = await Promise.all([
      this.db.trackedVisitor.findFirst({
        where: { id: { in: visitorIds }, firstSource: { not: null } },
        orderBy: { firstTouchAt: "asc" }
      }),
      this.db.trackedVisitor.findFirst({
        where: { id: { in: visitorIds }, lastSource: { not: null } },
        orderBy: { lastTouchAt: "desc" }
      })
    ]);
    const [grouped, latest, views] = await Promise.all([
      this.db.trackedEvent.groupBy({
        by: ["host", "path"],
        where: { visitorId: { in: visitorIds }, type: "page_view" },
        _count: { _all: true },
        _max: { occurredAt: true },
        orderBy: { _count: { path: "desc" } },
        take: 10
      }),
      this.db.trackedEvent.findFirst({
        where: { visitorId: { in: visitorIds } },
        orderBy: { occurredAt: "desc" },
        select: { occurredAt: true }
      }),
      this.db.trackedEvent.count({
        where: { visitorId: { in: visitorIds }, type: "page_view" }
      })
    ]);
    return {
      identified: true,
      visitors: visitorIds.length,
      views,
      lastSeenAt: latest?.occurredAt.toISOString() ?? null,
      pages: grouped.flatMap((row) => row._max.occurredAt ? [
        {
          host: row.host,
          path: row.path,
          views: row._count._all,
          lastSeenAt: row._max.occurredAt.toISOString()
        }
      ] : []),
      firstTouch: first ? summarise({
        source: first.firstSource,
        medium: first.firstMedium,
        campaign: first.firstCampaign,
        landing: first.firstLanding,
        referrer: first.firstReferrer,
        at: first.firstTouchAt
      }) : null,
      lastTouch: last ? summarise({
        source: last.lastSource,
        medium: last.lastMedium,
        campaign: last.lastCampaign,
        landing: last.lastLanding,
        referrer: last.lastReferrer,
        at: last.lastTouchAt
      }) : null
    };
  }
  async sources(userId) {
    await this.assertCanManage(userId);
    const [views, contacts] = await Promise.all([
      this.db.trackedEvent.groupBy({
        by: ["source", "medium"],
        where: { type: "page_view", source: { not: null } },
        _count: { _all: true }
      }),
      this.db.$queryRaw`
				SELECT "firstSource", "firstMedium", count(DISTINCT "contactId") AS contacts
				FROM "trackedVisitor"
				WHERE "contactId" IS NOT NULL AND "firstSource" IS NOT NULL
				GROUP BY 1, 2;
			`
    ]);
    const rows = new Map;
    for (const row of views) {
      if (!row.source)
        continue;
      const key = `${row.source}|${row.medium ?? ""}`;
      rows.set(key, {
        source: row.source,
        medium: row.medium,
        views: row._count._all,
        contacts: 0
      });
    }
    for (const row of contacts) {
      if (!row.firstSource)
        continue;
      const key = `${row.firstSource}|${row.firstMedium ?? ""}`;
      const existing = rows.get(key);
      const count = Number(row.contacts);
      if (existing) {
        existing.contacts = count;
        continue;
      }
      rows.set(key, {
        source: row.firstSource,
        medium: row.firstMedium,
        views: 0,
        contacts: count
      });
    }
    return [...rows.values()].sort((a, b) => b.contacts - a.contacts || b.views - a.views).slice(0, 20);
  }
  async assertCanManage(userId) {
    if (!import_auth43.canManageTracking(await this.roleOf(userId))) {
      throw new import_common130.ForbiddenException("Only an owner or an admin can change tracking.");
    }
  }
  async roleOf(userId) {
    const member = await this.db.member.findFirst({
      where: { organizationId: import_auth43.WORKSPACE_ID, userId },
      select: { role: true }
    });
    return member && import_auth43.isWorkspaceRole(member.role) ? member.role : null;
  }
}
TrackingService = __legacyDecorateClassTS([
  import_common130.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof TrackingConfigService === "undefined" ? Object : TrackingConfigService
  ])
], TrackingService);
function summarise(touch) {
  if (!touch.source)
    return null;
  return {
    label: import_attribution2.describeTouch(touch),
    source: touch.source,
    medium: touch.medium,
    campaign: touch.campaign,
    landing: touch.landing,
    referrer: touch.referrer,
    at: touch.at?.toISOString() ?? null
  };
}
function scriptUrl() {
  return import_tracking7.loaderUrl(import_auth43.appUrl);
}
function snippet(siteId) {
  return import_tracking7.trackingSnippet(import_auth43.appUrl, siteId);
}
function absolute(input) {
  const trimmed = input.trim();
  if (!trimmed)
    return null;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    return url.hostname.includes(".") ? url : null;
  } catch {
    return null;
  }
}
function mentions(body2, siteId) {
  return body2.includes(siteId) && /\/t\/crm\.js/.test(body2);
}

// src/tracking/tracking.router.ts
class TrackingRouter {
  tracking;
  constructor(tracking) {
    this.tracking = tracking;
  }
  async settings(ctx) {
    return this.tracking.settings(ctx.user.id);
  }
  async setFlag(ctx, input) {
    return this.tracking.setFlag(ctx.user.id, input.flag, input.enabled);
  }
  async setCookieLifetime(ctx, input) {
    return this.tracking.setCookieDays(ctx.user.id, input.days);
  }
  async addDomain(ctx, input) {
    return this.tracking.addDomain(ctx.user.id, input);
  }
  async removeDomain(ctx, input) {
    return this.tracking.removeDomain(ctx.user.id, input.id);
  }
  async rotateSiteId(ctx) {
    return this.tracking.rotateSiteId(ctx.user.id);
  }
  async verify(ctx, input) {
    return this.tracking.verify(ctx.user.id, input.url);
  }
  async sources(ctx) {
    return this.tracking.sources(ctx.user.id);
  }
  async companyActivity(input) {
    return this.tracking.activityForCompany(input.companyId);
  }
  async contactActivity(input) {
    return this.tracking.activityForContact(input.contactId);
  }
}
__legacyDecorateClassTS([
  import_nestjs_trpc20.Query({
    output: trackingSettingsOutput,
    meta: restMeta("GET", "/tracking/settings", ["Tracking"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc20.Ctx()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], TrackingRouter.prototype, "settings", null);
__legacyDecorateClassTS([
  import_nestjs_trpc20.Mutation({
    input: trackingFlagInput,
    output: import_zod32.z.void(),
    meta: restMeta("PATCH", "/tracking/flags", ["Tracking"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc20.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc20.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof import_zod32.z === "undefined" || typeof import_zod32.z.infer === "undefined" ? Object : import_zod32.z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], TrackingRouter.prototype, "setFlag", null);
__legacyDecorateClassTS([
  import_nestjs_trpc20.Mutation({
    input: cookieLifetimeInput,
    output: import_zod32.z.void(),
    meta: restMeta("PATCH", "/tracking/cookie-lifetime", ["Tracking"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc20.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc20.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof import_zod32.z === "undefined" || typeof import_zod32.z.infer === "undefined" ? Object : import_zod32.z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], TrackingRouter.prototype, "setCookieLifetime", null);
__legacyDecorateClassTS([
  import_nestjs_trpc20.Mutation({
    input: addDomainInput,
    output: trackedDomainOutput,
    meta: restMeta("POST", "/tracking/domains", ["Tracking"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc20.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc20.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof import_zod32.z === "undefined" || typeof import_zod32.z.infer === "undefined" ? Object : import_zod32.z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], TrackingRouter.prototype, "addDomain", null);
__legacyDecorateClassTS([
  import_nestjs_trpc20.Mutation({
    input: removeDomainInput,
    output: import_zod32.z.void(),
    meta: restMeta("DELETE", "/tracking/domains/{id}", ["Tracking"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc20.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc20.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof import_zod32.z === "undefined" || typeof import_zod32.z.infer === "undefined" ? Object : import_zod32.z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], TrackingRouter.prototype, "removeDomain", null);
__legacyDecorateClassTS([
  import_nestjs_trpc20.Mutation({
    output: rotateSiteIdOutput,
    meta: restMeta("POST", "/tracking/site-id/rotate", ["Tracking"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc20.Ctx()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], TrackingRouter.prototype, "rotateSiteId", null);
__legacyDecorateClassTS([
  import_nestjs_trpc20.Mutation({
    input: verifyInput,
    output: verifyOutput,
    meta: restMeta("POST", "/tracking/verify", ["Tracking"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc20.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc20.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof import_zod32.z === "undefined" || typeof import_zod32.z.infer === "undefined" ? Object : import_zod32.z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], TrackingRouter.prototype, "verify", null);
__legacyDecorateClassTS([
  import_nestjs_trpc20.Query({
    output: sourcesOutput,
    meta: restMeta("GET", "/tracking/sources", ["Tracking"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc20.Ctx()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], TrackingRouter.prototype, "sources", null);
__legacyDecorateClassTS([
  import_nestjs_trpc20.Query({
    input: companyActivityInput,
    output: websiteActivityOutput,
    meta: restMeta("GET", "/tracking/companies/{companyId}/activity", [
      "Tracking"
    ])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc20.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof import_zod32.z === "undefined" || typeof import_zod32.z.infer === "undefined" ? Object : import_zod32.z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], TrackingRouter.prototype, "companyActivity", null);
__legacyDecorateClassTS([
  import_nestjs_trpc20.Query({
    input: contactActivityInput,
    output: websiteActivityOutput,
    meta: restMeta("GET", "/tracking/contacts/{contactId}/activity", [
      "Tracking"
    ])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc20.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof import_zod32.z === "undefined" || typeof import_zod32.z.infer === "undefined" ? Object : import_zod32.z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], TrackingRouter.prototype, "contactActivity", null);
TrackingRouter = __legacyDecorateClassTS([
  import_nestjs_trpc20.Router({ alias: "tracking" }),
  import_nestjs_trpc20.UseMiddlewares(AuthMiddleware),
  __legacyDecorateParamTS(0, import_common131.Inject(TrackingService)),
  __legacyMetadataTS("design:paramtypes", [
    typeof TrackingService === "undefined" ? Object : TrackingService
  ])
], TrackingRouter);

// src/tracking/tracking.module.ts
class TrackingModule {
}
TrackingModule = __legacyDecorateClassTS([
  import_common132.Module({
    imports: [TrpcModule, AgentModule, CompaniesModule],
    controllers: [TrackingController, TrackingRetentionController],
    providers: [
      TrackingConfigService,
      TrackingCounterService,
      TrackingFilingService,
      TrackingIngestService,
      TrackingRollupService,
      TrackingService,
      TrackingRouter
    ],
    exports: [TrackingConfigService]
  })
], TrackingModule);

// src/users/users.module.ts
var import_common135 = require("@nestjs/common");

// src/users/users.router.ts
var import_common134 = require("@nestjs/common");
var import_nestjs_trpc21 = require("nestjs-trpc");
var import_zod33 = require("zod");

// src/users/users.service.ts
var import_common133 = require("@nestjs/common");
class UsersService {
  db;
  constructor(db2) {
    this.db = db2;
  }
  async list() {
    return this.db.user.findMany({
      select: { id: true, name: true, email: true, image: true },
      orderBy: [{ name: "asc" }, { email: "asc" }]
    });
  }
}
UsersService = __legacyDecorateClassTS([
  import_common133.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db
  ])
], UsersService);

// src/users/users.router.ts
var usersListOutput = import_zod33.z.array(import_zod33.z.object({
  id: import_zod33.z.string(),
  name: import_zod33.z.string(),
  email: import_zod33.z.string(),
  image: import_zod33.z.string().nullable()
}));

class UsersRouter {
  users;
  auth;
  constructor(users, auth5) {
    this.users = users;
    this.auth = auth5;
  }
  async me(ctx) {
    return this.auth.getProfile(ctx.user.id);
  }
  async list() {
    return this.users.list();
  }
}
__legacyDecorateClassTS([
  import_nestjs_trpc21.Query(),
  __legacyDecorateParamTS(0, import_nestjs_trpc21.Ctx()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], UsersRouter.prototype, "me", null);
__legacyDecorateClassTS([
  import_nestjs_trpc21.Query({
    output: usersListOutput,
    meta: restMeta("GET", "/users", ["Users"])
  }),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", []),
  __legacyMetadataTS("design:returntype", Promise)
], UsersRouter.prototype, "list", null);
UsersRouter = __legacyDecorateClassTS([
  import_nestjs_trpc21.Router({ alias: "users" }),
  import_nestjs_trpc21.UseMiddlewares(AuthMiddleware),
  __legacyDecorateParamTS(0, import_common134.Inject(UsersService)),
  __legacyDecorateParamTS(1, import_common134.Inject(AuthService)),
  __legacyMetadataTS("design:paramtypes", [
    typeof UsersService === "undefined" ? Object : UsersService,
    typeof AuthService === "undefined" ? Object : AuthService
  ])
], UsersRouter);

// src/users/users.module.ts
class UsersModule {
}
UsersModule = __legacyDecorateClassTS([
  import_common135.Module({
    imports: [AuthModule, TrpcModule],
    providers: [UsersService, UsersRouter],
    exports: [UsersService]
  })
], UsersModule);

// src/workspace/workspace.module.ts
var import_common138 = require("@nestjs/common");

// src/workspace/workspace.router.ts
var import_common137 = require("@nestjs/common");
var import_nestjs_trpc22 = require("nestjs-trpc");

// src/workspace/workspace.contracts.ts
var import_auth48 = require("@crm/auth");
var import_workspace4 = require("@crm/db/workspace");
var import_zod34 = require("zod");
var memberListInput = listInput.extend({
  role: import_zod34.z.array(import_zod34.z.string()).default([])
});
var updateWorkspaceInput = import_zod34.z.object({
  name: import_zod34.z.string().trim().min(1).max(120),
  website: import_zod34.z.string().trim().min(1).max(255),
  slug: import_zod34.z.string().trim().min(1).max(import_workspace4.MAX_SLUG).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional()
});
var setMemberRoleInput = import_zod34.z.object({
  memberId: import_zod34.z.string().min(1),
  role: import_zod34.z.enum(import_auth48.WORKSPACE_ROLES)
});
var workspaceOutput = import_zod34.z.object({
  id: import_zod34.z.string(),
  slug: import_zod34.z.string(),
  name: import_zod34.z.string(),
  website: import_zod34.z.string().nullable(),
  onboarded: import_zod34.z.boolean(),
  viewerRole: import_zod34.z.enum(import_auth48.WORKSPACE_ROLES).nullable(),
  canRename: import_zod34.z.boolean(),
  canChangeRoles: import_zod34.z.boolean()
});
var workspaceMemberOutput = import_zod34.z.object({
  id: import_zod34.z.string(),
  userId: import_zod34.z.string(),
  name: import_zod34.z.string(),
  email: import_zod34.z.string(),
  image: import_zod34.z.string().nullable(),
  role: import_zod34.z.enum(import_auth48.WORKSPACE_ROLES),
  joinedAt: import_zod34.z.string(),
  isViewer: import_zod34.z.boolean()
});
var memberListOutput = import_zod34.z.object({
  rows: import_zod34.z.array(workspaceMemberOutput),
  total: import_zod34.z.number(),
  facetCounts: import_zod34.z.record(import_zod34.z.string(), import_zod34.z.record(import_zod34.z.string(), import_zod34.z.number()))
});

// src/workspace/workspace.service.ts
var import_auth49 = require("@crm/auth");
var import_workspace5 = require("@crm/db/workspace");
var import_common136 = require("@nestjs/common");
var MEMBER_SELECT = {
  id: true,
  role: true,
  createdAt: true,
  userId: true,
  user: { select: { name: true, email: true, image: true } }
};
var SORTABLE6 = {
  name: (dir) => ({ user: { name: dir } }),
  email: (dir) => ({ user: { email: dir } }),
  role: (dir) => ({ role: dir }),
  joinedAt: (dir) => ({ createdAt: dir })
};
function toRole(value) {
  return import_auth49.isWorkspaceRole(value) ? value : "member";
}

class WorkspaceService {
  db;
  agent;
  logger = new import_common136.Logger(WorkspaceService.name);
  constructor(db2, agent) {
    this.db = db2;
    this.agent = agent;
  }
  async get(userId) {
    let row = await this.readWorkspace();
    if (!row) {
      await import_auth49.ensureWorkspaceMembership(userId);
      row = await this.readWorkspace();
    }
    if (!row) {
      throw new import_common136.ServiceUnavailableException("The workspace could not be read. Sign in again in a moment.");
    }
    const role = await import_auth49.workspaceRoleOf(userId);
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      website: row.website,
      onboarded: import_workspace5.isOnboarded(row.metadata),
      viewerRole: role,
      canRename: import_auth49.canRenameWorkspace(role),
      canChangeRoles: import_auth49.canChangeRole(role)
    };
  }
  async update(userId, input) {
    const role = await import_auth49.workspaceRoleOf(userId);
    if (!import_auth49.canRenameWorkspace(role)) {
      throw new import_common136.ForbiddenException("Only an owner or an admin can change the workspace.");
    }
    const before = await this.db.organization.findUnique({
      where: { id: import_auth49.WORKSPACE_ID },
      select: { website: true, metadata: true }
    });
    const website = normalizeDomain(input.website);
    if (!website) {
      throw new import_common136.BadRequestException("That is not a website. Enter the domain, like acme.com.");
    }
    await this.db.organization.update({
      where: { id: import_auth49.WORKSPACE_ID },
      data: {
        name: input.name,
        slug: import_workspace5.workspaceSlug(input.slug ?? input.name),
        website,
        metadata: import_workspace5.markOnboarded(before?.metadata ?? null, new Date)
      }
    });
    this.logger.log({ message: "Workspace updated", userId });
    if (website !== before?.website) {
      await this.agent.workspaceChanged(website, before?.website ? "The company using this CRM changed its website" : "The company using this CRM said what its website is");
    }
    return this.get(userId);
  }
  async members(userId, input) {
    const where = this.buildWhere(input);
    const { skip, take } = paginate(input);
    const [rows, total, roles] = await Promise.all([
      this.db.member.findMany({
        where,
        skip,
        take,
        select: MEMBER_SELECT,
        orderBy: resolveOrderBy(input, SORTABLE6, { createdAt: "asc" })
      }),
      this.db.member.count({ where }),
      this.db.member.groupBy({
        by: ["role"],
        where: this.searchWhere(input.q),
        _count: { _all: true }
      })
    ]);
    return {
      rows: rows.map((row) => this.toMember(row, userId)),
      total,
      facetCounts: { role: countsByKey(roles, "role") }
    };
  }
  async setMemberRole(userId, input) {
    const role = await import_auth49.workspaceRoleOf(userId);
    if (!import_auth49.canChangeRole(role)) {
      throw new import_common136.ForbiddenException("Only an owner or an admin can change a member's role.");
    }
    const updated = await this.db.$transaction(async (tx) => {
      const target = await tx.member.findFirst({
        where: { id: input.memberId, organizationId: import_auth49.WORKSPACE_ID },
        select: { id: true, role: true }
      });
      if (!target) {
        throw new import_common136.NotFoundException("That person is not in this workspace.");
      }
      if (target.role === "owner" && input.role !== "owner") {
        const owners = await tx.$queryRaw`
					SELECT id FROM "member"
					WHERE "organizationId" = ${import_auth49.WORKSPACE_ID} AND role = 'owner'
					FOR UPDATE
				`;
        if (owners.length <= 1) {
          throw new import_common136.ForbiddenException("The workspace needs an owner. Make someone else an owner first.");
        }
      }
      return tx.member.update({
        where: { id: target.id },
        data: { role: input.role },
        select: MEMBER_SELECT
      });
    });
    this.logger.log({
      message: "Workspace role changed",
      userId,
      memberId: updated.id,
      role: input.role
    });
    return this.toMember(updated, userId);
  }
  toMember(row, userId) {
    return {
      id: row.id,
      userId: row.userId,
      name: row.user.name,
      email: row.user.email,
      image: row.user.image,
      role: toRole(row.role),
      joinedAt: row.createdAt.toISOString(),
      isViewer: row.userId === userId
    };
  }
  searchWhere(q) {
    const term = q.trim();
    const where = { organizationId: import_auth49.WORKSPACE_ID };
    if (term) {
      where.user = {
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { email: { contains: term, mode: "insensitive" } }
        ]
      };
    }
    return where;
  }
  buildWhere(input) {
    const where = this.searchWhere(input.q);
    if (input.role.length > 0) {
      where.role = { in: input.role };
    }
    return where;
  }
  async readWorkspace() {
    return this.db.organization.findUnique({
      where: { id: import_auth49.WORKSPACE_ID },
      select: {
        id: true,
        slug: true,
        name: true,
        website: true,
        metadata: true
      }
    });
  }
}
WorkspaceService = __legacyDecorateClassTS([
  import_common136.Injectable(),
  __legacyDecorateParamTS(0, InjectDatabase()),
  __legacyMetadataTS("design:paramtypes", [
    typeof Db === "undefined" ? Object : Db,
    typeof AgentTriggerService === "undefined" ? Object : AgentTriggerService
  ])
], WorkspaceService);

// src/workspace/workspace.router.ts
class WorkspaceRouter {
  workspace;
  constructor(workspace) {
    this.workspace = workspace;
  }
  async get(ctx) {
    return this.workspace.get(ctx.user.id);
  }
  async members(ctx, input) {
    return this.workspace.members(ctx.user.id, input);
  }
  async update(ctx, input) {
    return this.workspace.update(ctx.user.id, input);
  }
  async setMemberRole(ctx, input) {
    return this.workspace.setMemberRole(ctx.user.id, input);
  }
}
__legacyDecorateClassTS([
  import_nestjs_trpc22.Query({
    output: workspaceOutput,
    meta: restMeta("GET", "/workspace", ["Workspace"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc22.Ctx()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], WorkspaceRouter.prototype, "get", null);
__legacyDecorateClassTS([
  import_nestjs_trpc22.Query({
    input: memberListInput,
    output: memberListOutput,
    meta: restMeta("POST", "/workspace/members/search", ["Workspace"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc22.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc22.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], WorkspaceRouter.prototype, "members", null);
__legacyDecorateClassTS([
  import_nestjs_trpc22.Mutation({
    input: updateWorkspaceInput,
    output: workspaceOutput,
    meta: restMeta("PATCH", "/workspace", ["Workspace"])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc22.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc22.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], WorkspaceRouter.prototype, "update", null);
__legacyDecorateClassTS([
  import_nestjs_trpc22.Mutation({
    input: setMemberRoleInput,
    output: workspaceMemberOutput,
    meta: restMeta("PATCH", "/workspace/members/{memberId}/role", [
      "Workspace"
    ])
  }),
  __legacyDecorateParamTS(0, import_nestjs_trpc22.Ctx()),
  __legacyDecorateParamTS(1, import_nestjs_trpc22.Input()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof AuthedTrpcContext === "undefined" ? Object : AuthedTrpcContext,
    typeof z === "undefined" || typeof z.infer === "undefined" ? Object : z.infer
  ]),
  __legacyMetadataTS("design:returntype", Promise)
], WorkspaceRouter.prototype, "setMemberRole", null);
WorkspaceRouter = __legacyDecorateClassTS([
  import_nestjs_trpc22.Router({ alias: "workspace" }),
  import_nestjs_trpc22.UseMiddlewares(AuthMiddleware),
  __legacyDecorateParamTS(0, import_common137.Inject(WorkspaceService)),
  __legacyMetadataTS("design:paramtypes", [
    typeof WorkspaceService === "undefined" ? Object : WorkspaceService
  ])
], WorkspaceRouter);

// src/workspace/workspace.module.ts
class WorkspaceModule {
}
WorkspaceModule = __legacyDecorateClassTS([
  import_common138.Module({
    imports: [AgentModule, TrpcModule],
    providers: [WorkspaceService, WorkspaceRouter],
    exports: [WorkspaceService]
  })
], WorkspaceModule);

// src/app.module.ts
class AppModule {
}
AppModule = __legacyDecorateClassTS([
  import_common139.Module({
    imports: [
      LoggingModule,
      import_config7.ConfigModule.forRoot({
        isGlobal: true,
        cache: true,
        validate: validateEnv
      }),
      AppCacheModule,
      DatabaseModule,
      CrmModule,
      import_nestjs_better_auth10.AuthModule.forRoot({ auth: import_auth51.auth, middleware: logAuthRoute }),
      AuthModule,
      HealthModule,
      TrpcModule,
      UsersModule,
      ApiKeysModule,
      CompaniesModule,
      ContactsModule,
      ConversationsModule,
      CurrencyModule,
      DealsModule,
      FieldsModule,
      ActivitiesModule,
      AgentModule,
      EnrichmentModule,
      DashboardModule,
      SearchModule,
      MailboxModule,
      GoogleModule,
      MicrosoftModule,
      SyncModule,
      SettingsModule,
      WorkspaceModule,
      SsoModule,
      SlackModule,
      BackfillModule,
      TelemetryModule,
      TrackingModule,
      ArchiveModule,
      SavedViewsModule
    ]
  })
], AppModule);

// src/create-app.ts
async function createApp() {
  const app = await import_core2.NestFactory.create(AppModule, new import_platform_express.ExpressAdapter, { bodyParser: false, logger: new ContextLogger });
  app.use(import_helmet.default());
  app.useGlobalPipes(new import_common140.ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true }
  }));
  let restBridge;
  app.use(REST_BRIDGE_PATH, (req, res, next) => {
    if (!restBridge) {
      next();
      return;
    }
    restBridge(req, res);
  });
  const apiKeySecurityScheme = {
    type: "apiKey",
    in: "header",
    name: import_auth53.API_KEY_HEADER
  };
  import_swagger9.SwaggerModule.setup("", app, () => {
    const { appRouter: appRouter2 } = app.get(import_nestjs_trpc23.AppRouterHost);
    const trpcDocument = import_trpc_to_openapi.generateOpenApiDocument(appRouter2, {
      title: "CRM API — tRPC bridge",
      description: "Every tRPC procedure, reachable over REST for tooling that cannot speak tRPC. Same validation, same middlewares, same services as the tRPC transport — this only translates the wire format.",
      version: "1.0",
      baseUrl: `${import_auth53.apiUrl}${REST_BRIDGE_PATH}`,
      securitySchemes: { apiKey: apiKeySecurityScheme }
    });
    const swaggerConfig = new import_swagger9.DocumentBuilder().setTitle("CRM API").setDescription(`REST surface of the CRM API — auth, health, the internal cron routes, and a generated REST bridge (under ${REST_BRIDGE_PATH}) for every tRPC procedure.`).setVersion("1.0").addCookieAuth(import_auth53.SESSION_COOKIE_NAME).addApiKey(apiKeySecurityScheme, "apiKey").build();
    const swaggerDocument = import_swagger9.SwaggerModule.createDocument(app, swaggerConfig);
    swaggerDocument.paths = {
      ...swaggerDocument.paths,
      ...trpcDocument.paths
    };
    swaggerDocument.components = {
      ...swaggerDocument.components,
      schemas: {
        ...swaggerDocument.components?.schemas,
        ...trpcDocument.components?.schemas
      }
    };
    return swaggerDocument;
  }, { jsonDocumentUrl: "openapi.json" });
  await app.init();
  const { appRouter } = app.get(import_nestjs_trpc23.AppRouterHost);
  restBridge = import_trpc_to_openapi.createOpenApiExpressMiddleware({
    router: appRouter,
    createContext: ({ req }) => createBaseTrpcContext(req)
  });
  return app;
}

// serverless/handler.ts
var instancePromise = null;
function getInstance() {
  if (!instancePromise) {
    instancePromise = (async () => {
      const app = await createApp();
      await app.init();
      return app.getHttpAdapter().getInstance();
    })();
  }
  return instancePromise;
}
async function handler(req, res) {
  const instance = await getInstance();
  instance(req, res);
}

//# debugId=CA79AF8A47B2B99364756E2164756E21
//# sourceMappingURL=api-handler.js.map
