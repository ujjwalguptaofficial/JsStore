export var Service;
(function (Service) {
    Service.connection = new JsStore.Instance();
    var IdbService = /** @class */ (function () {
        function IdbService() {
            this._dbName = "Student";
        }
        /**
         * create database
         *
         * @memberof IdbService
         */
        IdbService.prototype.createDb = function () {
            var _this = this;
            JsStore.isDbExist(this._dbName).then(function (exist) {
                if (exist) {
                    Service.connection.openDb(_this._dbName);
                }
                else {
                    Service.connection.createDb(_this.getDatabase());
                }
            }).catch(function (err) {
                console.error(err);
                alert(err._message);
            });
        };
        IdbService.prototype.getStudents = function () {
            return Service.connection.select({
                From: 'Student'
            });
        };
        IdbService.prototype.getDatabase = function () {
            var TblStudent = {
                Name: 'Student',
                Columns: [
                    {
                        Name: 'Id',
                        PrimaryKey: true,
                        AutoIncrement: true
                    },
                    {
                        Name: 'Name',
                        NotNull: true,
                        DataType: JsStore.Data_Type.String
                    },
                    {
                        Name: 'Gender',
                        DataType: JsStore.Data_Type.String,
                        Default: 'male'
                    },
                    {
                        Name: 'Country',
                        NotNull: true,
                        DataType: JsStore.Data_Type.String
                    },
                    {
                        Name: 'City',
                        NotNull: true,
                        DataType: JsStore.Data_Type.String
                    }
                ]
            };
            var DataBase = {
                Name: 'Students',
                Tables: [TblStudent]
            };
            return DataBase;
        };
        return IdbService;
    }());
    Service.IdbService = IdbService;
})(Service || (Service = {}));
//# sourceMappingURL=P:/Users/ujjwal/Documents/projects/JsStore/Example/TypeScript Example/service/idb_service.js.map