/*!
 * @license :jsstore - V3.7.6 - 09/03/2020
 * https://github.com/ujjwalguptaofficial/JsStore
 * Copyright (c) 2020 @Ujjwal Gupta; Licensed MIT
 */
var JsStore =
/******/
function (modules) {
  // webpackBootstrap

  /******/
  // The module cache

  /******/
  var installedModules = {};
  /******/

  /******/
  // The require function

  /******/

  function __webpack_require__(moduleId) {
    /******/

    /******/
    // Check if module is in cache

    /******/
    if (installedModules[moduleId]) {
      /******/
      return installedModules[moduleId].exports;
      /******/
    }
    /******/
    // Create a new module (and put it into the cache)

    /******/


    var module = installedModules[moduleId] = {
      /******/
      i: moduleId,

      /******/
      l: false,

      /******/
      exports: {}
      /******/

    };
    /******/

    /******/
    // Execute the module function

    /******/

    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/

    /******/
    // Flag the module as loaded

    /******/

    module.l = true;
    /******/

    /******/
    // Return the exports of the module

    /******/

    return module.exports;
    /******/
  }
  /******/

  /******/

  /******/
  // expose the modules object (__webpack_modules__)

  /******/


  __webpack_require__.m = modules;
  /******/

  /******/
  // expose the module cache

  /******/

  __webpack_require__.c = installedModules;
  /******/

  /******/
  // define getter function for harmony exports

  /******/

  __webpack_require__.d = function (exports, name, getter) {
    /******/
    if (!__webpack_require__.o(exports, name)) {
      /******/
      Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter
      });
      /******/
    }
    /******/

  };
  /******/

  /******/
  // define __esModule on exports

  /******/


  __webpack_require__.r = function (exports) {
    /******/
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      /******/
      Object.defineProperty(exports, Symbol.toStringTag, {
        value: 'Module'
      });
      /******/
    }
    /******/


    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    /******/
  };
  /******/

  /******/
  // create a fake namespace object

  /******/
  // mode & 1: value is a module id, require it

  /******/
  // mode & 2: merge all properties of value into the ns

  /******/
  // mode & 4: return value when already ns object

  /******/
  // mode & 8|1: behave like require

  /******/


  __webpack_require__.t = function (value, mode) {
    /******/
    if (mode & 1) value = __webpack_require__(value);
    /******/

    if (mode & 8) return value;
    /******/

    if (mode & 4 && typeof value === 'object' && value && value.__esModule) return value;
    /******/

    var ns = Object.create(null);
    /******/

    __webpack_require__.r(ns);
    /******/


    Object.defineProperty(ns, 'default', {
      enumerable: true,
      value: value
    });
    /******/

    if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) {
      return value[key];
    }.bind(null, key));
    /******/

    return ns;
    /******/
  };
  /******/

  /******/
  // getDefaultExport function for compatibility with non-harmony modules

  /******/


  __webpack_require__.n = function (module) {
    /******/
    var getter = module && module.__esModule ?
    /******/
    function () {
      return module['default'];
    } :
    /******/
    function () {
      return module;
    };
    /******/

    __webpack_require__.d(getter, 'a', getter);
    /******/


    return getter;
    /******/
  };
  /******/

  /******/
  // Object.prototype.hasOwnProperty.call

  /******/


  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  /******/

  /******/
  // __webpack_public_path__

  /******/


  __webpack_require__.p = "";
  /******/

  /******/

  /******/
  // Load entry module and return exports

  /******/

  return __webpack_require__(__webpack_require__.s = 1);
  /******/
}(
/************************************************************************/

/******/
[,
/* 0 */

/* 1 */

/***/
function (module, __webpack_exports__, __webpack_require__) {
  "use strict";

  __webpack_require__.r(__webpack_exports__); // CONCATENATED MODULE: ./src/common/enums.ts


  var ERROR_TYPE;

  (function (ERROR_TYPE) {
    ERROR_TYPE["WorkerNotSupplied"] = "worker_not_supplied";
    ERROR_TYPE["IndexedDbUndefined"] = "indexeddb_undefined";
    ERROR_TYPE["UndefinedColumn"] = "undefined_column";
    ERROR_TYPE["UndefinedValue"] = "undefined_value";
    ERROR_TYPE["UndefinedColumnName"] = "undefined_column_name";
    ERROR_TYPE["UndefinedDbName"] = "undefined_database_name";
    ERROR_TYPE["UndefinedColumnValue"] = "undefined_column_value";
    ERROR_TYPE["NotArray"] = "not_array";
    ERROR_TYPE["NoValueSupplied"] = "no_value_supplied";
    ERROR_TYPE["ColumnNotExist"] = "column_not_exist";
    ERROR_TYPE["EnableSearchOff"] = "enable_search_off";
    ERROR_TYPE["InvalidOp"] = "invalid_operator";
    ERROR_TYPE["NullValue"] = "null_value";
    ERROR_TYPE["WrongDataType"] = "wrong_data_type";
    ERROR_TYPE["TableNotExist"] = "table_not_exist";
    ERROR_TYPE["DbNotExist"] = "db_not_exist";
    ERROR_TYPE["ConnectionAborted"] = "connection_aborted";
    ERROR_TYPE["ConnectionClosed"] = "connection_closed";
    ERROR_TYPE["NotObject"] = "not_object";
    ERROR_TYPE["InvalidConfig"] = "invalid_config";
    ERROR_TYPE["DbBlocked"] = "Db_blocked";
    ERROR_TYPE["IndexedDbNotSupported"] = "indexeddb_not_supported";
    ERROR_TYPE["NullValueInWhere"] = "null_value_in_where";
    ERROR_TYPE["InvalidJoinQuery"] = "invalid_join_query";
    ERROR_TYPE["InvalidOrderQuery"] = "invalid_order_query";
    ERROR_TYPE["InvalidQuery"] = "invalid_query";
    ERROR_TYPE["InvalidGroupQuery"] = "invalid_group_query";
  })(ERROR_TYPE || (ERROR_TYPE = {}));

  var WORKER_STATUS;

  (function (WORKER_STATUS) {
    WORKER_STATUS["Registered"] = "registerd";
    WORKER_STATUS["Failed"] = "failed";
    WORKER_STATUS["NotStarted"] = "not_started";
  })(WORKER_STATUS || (WORKER_STATUS = {}));

  var DATA_TYPE;

  (function (DATA_TYPE) {
    DATA_TYPE["String"] = "string";
    DATA_TYPE["Object"] = "object";
    DATA_TYPE["Array"] = "array";
    DATA_TYPE["Number"] = "number";
    DATA_TYPE["Boolean"] = "boolean";
    DATA_TYPE["Null"] = "null";
    DATA_TYPE["DateTime"] = "date_time";
  })(DATA_TYPE || (DATA_TYPE = {}));

  var API;

  (function (API) {
    API["InitDb"] = "init_db";
    API["IsDbExist"] = "is_db_exist";
    API["GetDbVersion"] = "get_db_version";
    API["GetDbList"] = "get_db_list";
    API["Get"] = "get";
    API["Set"] = "set";
    API["Select"] = "select";
    API["Insert"] = "insert";
    API["Update"] = "update";
    API["Remove"] = "remove";
    API["GetDbSchema"] = "get_db_schema";
    API["OpenDb"] = "open_db";
    API["Clear"] = "clear";
    API["DropDb"] = "drop_db";
    API["Count"] = "count";
    API["ChangeLogStatus"] = "change_log_status";
    API["Terminate"] = "terminate";
    API["Transaction"] = "transaction";
    API["InitKeyStore"] = "init_keystore";
    API["CloseDb"] = "close_db";
    API["Union"] = "union";
  })(API || (API = {}));

  var EVENT;

  (function (EVENT) {
    EVENT["RequestQueueEmpty"] = "requestQueueEmpty";
    EVENT["RequestQueueFilled"] = "requestQueueFilled";
  })(EVENT || (EVENT = {}));

  var QUERY_OPTION;

  (function (QUERY_OPTION) {
    QUERY_OPTION["Where"] = "where";
    QUERY_OPTION["Like"] = "like";
    QUERY_OPTION["Regex"] = "regex";
    QUERY_OPTION["In"] = "in";
    QUERY_OPTION["Equal"] = "=";
    QUERY_OPTION["Between"] = "-";
    QUERY_OPTION["GreaterThan"] = ">";
    QUERY_OPTION["LessThan"] = "<";
    QUERY_OPTION["GreaterThanEqualTo"] = ">=";
    QUERY_OPTION["LessThanEqualTo"] = "<=";
    QUERY_OPTION["NotEqualTo"] = "!=";
    QUERY_OPTION["Aggregate"] = "aggregate";
    QUERY_OPTION["Max"] = "max";
    QUERY_OPTION["Min"] = "min";
    QUERY_OPTION["Avg"] = "avg";
    QUERY_OPTION["Count"] = "count";
    QUERY_OPTION["Sum"] = "sum";
    QUERY_OPTION["Or"] = "or";
    QUERY_OPTION["Skip"] = "skip";
    QUERY_OPTION["Limit"] = "limit";
    QUERY_OPTION["And"] = "and";
    QUERY_OPTION["IgnoreCase"] = "ignoreCase";
    QUERY_OPTION["Then"] = "then";
  })(QUERY_OPTION || (QUERY_OPTION = {}));

  var IDB_MODE;

  (function (IDB_MODE) {
    IDB_MODE["ReadOnly"] = "readonly";
    IDB_MODE["ReadWrite"] = "readwrite";
  })(IDB_MODE || (IDB_MODE = {}));

  var OCCURENCE;

  (function (OCCURENCE) {
    OCCURENCE["First"] = "f";
    OCCURENCE["Last"] = "l";
    OCCURENCE["Any"] = "a";
  })(OCCURENCE || (OCCURENCE = {}));

  var CONNECTION_STATUS;

  (function (CONNECTION_STATUS) {
    CONNECTION_STATUS["Connected"] = "connected";
    CONNECTION_STATUS["Closed"] = "closed";
    CONNECTION_STATUS["NotStarted"] = "not_started";
    CONNECTION_STATUS["UnableToStart"] = "unable_to_start";
    CONNECTION_STATUS["ClosedByJsStore"] = "closed_by_jsstore";
  })(CONNECTION_STATUS || (CONNECTION_STATUS = {})); // CONCATENATED MODULE: ./src/main/config.ts


  var Config =
  /** @class */
  function () {
    function Config() {}

    Config.isLogEnabled = false;
    Config.isRuningInWorker = true;
    return Config;
  }(); // CONCATENATED MODULE: ./src/main/log_helper.ts


  var log_helper_LogHelper =
  /** @class */
  function () {
    function LogHelper(type, info) {
      if (info === void 0) {
        info = null;
      }

      this.type = type;
      this._info = info;
      this.message = this.getMsg();
    }

    LogHelper.prototype.throw = function () {
      throw this.get();
    };

    LogHelper.log = function (msg) {
      if (Config.isLogEnabled) {
        console.log(msg);
      }
    };

    LogHelper.prototype.logError = function () {
      console.error(this.get());
    };

    LogHelper.prototype.logWarning = function () {
      console.warn(this.get());
    };

    LogHelper.prototype.get = function () {
      return {
        message: this.message,
        type: this.type
      };
    };

    LogHelper.prototype.getMsg = function () {
      var errMsg;

      switch (this.type) {
        case ERROR_TYPE.WorkerNotSupplied:
          errMsg = "Worker object is not passed in instance constructor";
          break;

        case ERROR_TYPE.IndexedDbUndefined:
          errMsg = "Browser does not support indexeddb";
          break;

        default:
          errMsg = this.message;
          break;
      }

      return errMsg;
    };

    return LogHelper;
  }(); // CONCATENATED MODULE: ./src/main/connection_helper.ts


  var connection_helper_ConnectionHelper =
  /** @class */
  function () {
    function ConnectionHelper(worker) {
      this.isDbOpened_ = false;
      this.isDbIdle_ = true;
      this.requestQueue_ = [];
      this.isCodeExecuting_ = false;
      this.inactivityTimer_ = -1000;
      this.eventQueue = []; // these apis have special permissions. These apis dont wait for database open.

      this.whiteListApi_ = [API.InitDb, API.IsDbExist, API.GetDbVersion, API.GetDbList, API.OpenDb, API.GetDbSchema, API.Get, API.Set, API.ChangeLogStatus, API.Terminate, API.InitKeyStore];

      if (worker) {
        this.worker_ = worker;
        this.worker_.onmessage = this.onMessageFromWorker_.bind(this);
      } else {
        Config.isRuningInWorker = false;
      }
    }

    ConnectionHelper.prototype.initKeyStore_ = function () {
      if (Config.isRuningInWorker) {
        this.prcoessExecutionOfQry_({
          name: API.InitKeyStore,
          onSuccess: function () {},
          onError: function (err) {
            console.error(err);
          }
        }, 0);
      } else {
        JsStoreWorker.KeyStore.init();
      }
    };

    ConnectionHelper.prototype.onMessageFromWorker_ = function (msg) {
      this.processFinishedQuery_(msg.data);
    };

    ConnectionHelper.prototype.processFinishedQuery_ = function (message) {
      var finishedRequest = this.requestQueue_.shift();

      if (finishedRequest) {
        log_helper_LogHelper.log("request " + finishedRequest.name + " finished");

        if (message.errorOccured) {
          finishedRequest.onError(message.errorDetails);
        } else {
          switch (finishedRequest.name) {
            case API.OpenDb:
            case API.InitDb:
              this.isDbOpened_ = true;
              break;

            case API.Terminate:
              this.isDbOpened_ = false;

              if (Config.isRuningInWorker === true) {
                this.worker_.terminate();
              }

              break;

            case API.CloseDb:
              if (this.requestQueue_.length > 0) {
                this.openDb_();
              } else {
                this.isDbIdle_ = true;
                this.callEvent(EVENT.RequestQueueEmpty, []);
              }

              break;
          }

          finishedRequest.onSuccess(message.returnedValue);
        }

        this.isCodeExecuting_ = false;
        this.executeQry_();
      }
    };

    ConnectionHelper.prototype.openDb_ = function () {
      this.initKeyStore_();
      this.prcoessExecutionOfQry_({
        name: API.OpenDb,
        query: this.activeDbName,
        onSuccess: function () {},
        onError: function (err) {
          console.error(err);
        }
      }, 1);
    };

    ConnectionHelper.prototype.pushApi = function (request) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        request.onSuccess = function (result) {
          resolve(result);
        };

        request.onError = function (error) {
          reject(error);
        };

        if (_this.requestQueue_.length === 0) {
          _this.callEvent(EVENT.RequestQueueFilled, []);

          if (_this.isDbIdle_ === true && _this.isDbOpened_ === true) {
            _this.openDb_();
          } else {
            clearTimeout(_this.inactivityTimer_);

            _this.initKeyStore_();
          }
        }

        _this.prcoessExecutionOfQry_(request);
      });
    };

    ConnectionHelper.prototype.prcoessExecutionOfQry_ = function (request, index) {
      this.isDbIdle_ = false;

      if (index != null) {
        this.requestQueue_.splice(index, 0, request);
      } else {
        this.requestQueue_.push(request);
      }

      log_helper_LogHelper.log("request pushed: " + request.name);
      this.executeQry_();
    };

    ConnectionHelper.prototype.executeQry_ = function () {
      var _this = this;

      var requestQueueLength = this.requestQueue_.length;

      if (!this.isCodeExecuting_ && requestQueueLength > 0) {
        if (this.isDbOpened_ === true) {
          this.sendRequestToWorker_(this.requestQueue_[0]);
          return;
        }

        var allowedQueryIndex = this.requestQueue_.findIndex(function (item) {
          return _this.whiteListApi_.indexOf(item.name) >= 0;
        }); // shift allowed query to zeroth index

        if (allowedQueryIndex >= 0) {
          this.requestQueue_.splice(0, 0, this.requestQueue_.splice(allowedQueryIndex, 1)[0]);
          this.sendRequestToWorker_(this.requestQueue_[0]);
        }
      } else if (requestQueueLength === 0 && this.isDbIdle_ === false && this.isDbOpened_) {
        this.inactivityTimer_ = setTimeout(function () {
          _this.prcoessExecutionOfQry_({
            name: API.CloseDb,
            onSuccess: function () {},
            onError: function (err) {
              console.error(err);
            }
          });
        }, 100);
      }
    };

    ConnectionHelper.prototype.sendRequestToWorker_ = function (request) {
      this.isCodeExecuting_ = true;
      var requestForWorker = {
        name: request.name,
        query: request.query
      };

      if (Config.isRuningInWorker === true) {
        this.worker_.postMessage(requestForWorker);
      } else {
        new JsStoreWorker.QueryExecutor(this.processFinishedQuery_.bind(this)).checkConnectionAndExecuteLogic(requestForWorker);
      }
    };

    ConnectionHelper.prototype.callEvent = function (event, args) {
      var events = this.eventQueue.filter(function (ev) {
        if (ev.event === event) {
          return ev;
        }
      });
      events.forEach(function (ev) {
        ev.callback.apply(ev, args);
      });
    };

    return ConnectionHelper;
  }(); // CONCATENATED MODULE: ./src/main/util.ts


  var Util =
  /** @class */
  function () {
    function Util() {}

    Object.defineProperty(Util, "sqlWeb", {
      get: function () {
        return Util.sqlWeb_ == null ? self['SqlWeb'] : Util.sqlWeb_;
      },
      set: function (value) {
        Util.sqlWeb_ = value;
      },
      enumerable: true,
      configurable: true
    });
    return Util;
  }(); // CONCATENATED MODULE: ./src/main/connection.ts


  var __extends = undefined && undefined.__extends || function () {
    var extendStatics = function (d, b) {
      extendStatics = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };

      return extendStatics(d, b);
    };

    return function (d, b) {
      extendStatics(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();

  var connection_Connection =
  /** @class */
  function (_super) {
    __extends(Connection, _super);

    function Connection(worker) {
      return _super.call(this, worker) || this;
    }
    /**
     *  open database
     *
     * @param {string} dbName
     * @returns
     * @memberof Instance
     */


    Connection.prototype.openDb = function (dbName) {
      this.activeDbName = dbName;
      return this.pushApi({
        name: API.OpenDb,
        query: dbName
      });
    };
    /**
     * creates DataBase
     *
     * @param {IDataBase} dataBase
     * @returns
     * @memberof Instance
     */


    Connection.prototype.initDb = function (dataBase) {
      this.activeDbName = dataBase.name;
      return this.pushApi({
        name: API.InitDb,
        query: dataBase
      });
    };
    /**
     * drop dataBase
     *
     * @returns
     * @memberof Instance
     */


    Connection.prototype.dropDb = function () {
      return this.pushApi({
        name: API.DropDb,
        query: null
      });
    };
    /**
     * select data from table
     *
     * @template T
     * @param {SelectQuery} query
     * @returns
     * @memberof Instance
     */


    Connection.prototype.select = function (query) {
      return this.pushApi({
        name: API.Select,
        query: query
      });
    };
    /**
     * get no of record from table
     *
     * @param {CountQuery} query
     * @returns
     * @memberof Instance
     */


    Connection.prototype.count = function (query) {
      return this.pushApi({
        name: API.Count,
        query: query
      });
    };
    /**
     * insert data into table
     *
     * @param {InsertQuery} query
     * @returns
     * @memberof Instance
     */


    Connection.prototype.insert = function (query) {
      return this.pushApi({
        name: API.Insert,
        query: query
      });
    };
    /**
     * update data into table
     *
     * @param {UpdateQuery} query
     * @returns
     * @memberof Instance
     */


    Connection.prototype.update = function (query) {
      return this.pushApi({
        name: API.Update,
        query: query
      });
    };
    /**
     * remove data from table
     *
     * @param {RemoveQuery} query
     * @returns
     * @memberof Instance
     */


    Connection.prototype.remove = function (query) {
      return this.pushApi({
        name: API.Remove,
        query: query
      });
    };
    /**
     * delete all data from table
     *
     * @param {string} tableName
     * @returns
     * @memberof Instance
     */


    Connection.prototype.clear = function (tableName) {
      return this.pushApi({
        name: API.Clear,
        query: tableName
      });
    };
    /**
     * set log status
     *
     * @param {boolean} status
     * @memberof Instance
     */


    Connection.prototype.setLogStatus = function (status) {
      Config.isLogEnabled = status ? status : Config.isLogEnabled;
      this.pushApi({
        name: API.ChangeLogStatus,
        query: Config.isLogEnabled
      });
    };
    /**
     * get version of database
     *
     * @param {(string | DbInfo)} dbName
     * @returns
     * @memberof Instance
     */


    Connection.prototype.getDbVersion = function (dbName) {
      return this.pushApi({
        name: API.GetDbVersion,
        query: dbName
      });
    };
    /**
     * is database exist
     *
     * @param {(DbInfo | string)} dbInfo
     * @returns
     * @memberof Instance
     */


    Connection.prototype.isDbExist = function (dbInfo) {
      return this.pushApi({
        name: API.IsDbExist,
        query: dbInfo
      });
    };
    /**
     * returns list of database created
     *
     * @returns
     * @memberof Instance
     */


    Connection.prototype.getDbList = function () {
      return this.pushApi({
        name: API.GetDbList,
        query: null
      });
    };
    /**
     * get Database Schema
     *
     * @param {string} dbName
     * @returns
     * @memberof Instance
     */


    Connection.prototype.getDbSchema = function (dbName) {
      return this.pushApi({
        name: API.GetDbSchema,
        query: dbName
      });
    };
    /**
     * get the value from keystore table
     *
     * @param {string} key
     * @returns
     * @memberof Instance
     */


    Connection.prototype.get = function (key) {
      return this.pushApi({
        name: API.Get,
        query: key
      });
    };
    /**
     * set the value in keystore table
     *
     * @param {string} key
     * @param {*} value
     * @returns
     * @memberof Instance
     */


    Connection.prototype.set = function (key, value) {
      return this.pushApi({
        name: API.Set,
        query: {
          key: key,
          value: value
        }
      });
    };
    /**
     * terminate the connection
     *
     * @returns
     * @memberof Instance
     */


    Connection.prototype.terminate = function () {
      return this.pushApi({
        name: API.Terminate,
        query: null
      });
    };
    /**
     * execute the transaction
     *
     * @param {TranscationQuery} query
     * @returns
     * @memberof Instance
     */


    Connection.prototype.transaction = function (query) {
      if (Config.isRuningInWorker === true) {
        query.logic = query.logic.toString();
      }

      return this.pushApi({
        name: API.Transaction,
        query: query
      });
    };
    /**
     * run sql code
     *
     * @param {(string | object)} query
     * @returns {Promise<any>}
     * @memberof Instance
     */


    Connection.prototype.runSql = function (query) {
      var result = Util.sqlWeb.parseSql(query);
      return this[result.api](result.data);
    };

    Connection.prototype.on = function (event, eventCallBack) {
      this.eventQueue.push({
        event: event,
        callback: eventCallBack
      });
    };

    Connection.prototype.off = function (event) {
      var _this = this;

      var indexes = this.eventQueue.map(function (ev, i) {
        if (ev.event === event) {
          return i;
        }
      });
      indexes.forEach(function (i) {
        _this.eventQueue.splice(i, 0);
      });
    };

    Connection.prototype.union = function (query) {
      return this.pushApi({
        name: API.Union,
        query: query
      });
    };

    return Connection;
  }(connection_helper_ConnectionHelper); // CONCATENATED MODULE: ./src/main/instance.ts


  var instance_Instance =
  /** @class */
  function () {
    return function (worker) {
      console.warn('Instance is obsolete, please use Connection. Refer - https://jsstore.net/tutorial/connection/');
      return new connection_Connection(worker);
    };
  }(); // CONCATENATED MODULE: ./src/main/helper.ts

  /**
   * Enable log
   *
   */


  var enableLog = function () {
    Config.isLogEnabled = true;
  }; // CONCATENATED MODULE: ./src/main/global.ts

  /**
   *
   * supply sqlweb
   * @param {*} value
   */


  var useSqlWeb = function (value) {
    Util.sqlWeb = value;
  }; // CONCATENATED MODULE: ./src/main/index.ts

  /* concated harmony reexport Instance */


  __webpack_require__.d(__webpack_exports__, "Instance", function () {
    return instance_Instance;
  });
  /* concated harmony reexport Connection */


  __webpack_require__.d(__webpack_exports__, "Connection", function () {
    return connection_Connection;
  });
  /* concated harmony reexport Config */


  __webpack_require__.d(__webpack_exports__, "Config", function () {
    return Config;
  });
  /* concated harmony reexport enableLog */


  __webpack_require__.d(__webpack_exports__, "enableLog", function () {
    return enableLog;
  });
  /* concated harmony reexport useSqlWeb */


  __webpack_require__.d(__webpack_exports__, "useSqlWeb", function () {
    return useSqlWeb;
  });
  /* concated harmony reexport DATA_TYPE */


  __webpack_require__.d(__webpack_exports__, "DATA_TYPE", function () {
    return DATA_TYPE;
  });
  /***/

}
/******/
]);