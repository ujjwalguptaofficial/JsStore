import { GroupByHelper } from "./group_by_helper";
import { DATA_TYPE, ERROR_TYPE, QUERY_OPTION, OrderQuery, CaseOption } from "../../../common/index";
import { LogHelper } from "../../log_helper";
import { getDataType, removeSpace, isArray } from "../../utils/index";
import { Column } from "../../model/index";

export class Helper extends GroupByHelper {

    processGroupDistinctAggr() {
        if (this.query.distinct) {
            const groupBy = [];
            const result = this.results[0];
            for (const key in result) {
                groupBy.push(key);
            }
            const primaryKey = this.getPrimaryKey(this.query.from),
                index = groupBy.indexOf(primaryKey);
            groupBy.splice(index, 1);
            this.query.groupBy = groupBy.length > 0 ? groupBy : null;
        }
        if (this.query.groupBy) {
            if (this.query.aggregate) {
                this.executeAggregateGroupBy();
            }
            else {
                this.processGroupBy();
            }
        }
        else if (this.query.aggregate) {
            this.processAggregateQry();
        }
    }

    private getOrderColumnInfo_(orderColumn: string): Column {
        let column: Column;
        if (this.query.join == null) {
            column = this.getColumnInfo(orderColumn, this.query.from);
        }
        else {
            const splittedByDot = removeSpace(orderColumn).split(".");
            orderColumn = splittedByDot[1];
            column = this.getColumnInfo(orderColumn, splittedByDot[0]);
        }
        if (column == null) {
            const valueFromFirstColumn = this.results[0][orderColumn];
            if (valueFromFirstColumn) {
                return {
                    dataType: getDataType(valueFromFirstColumn),
                    name: orderColumn
                } as Column;
            }
            this.onErrorOccured(new LogHelper(ERROR_TYPE.ColumnNotExist, { column: orderColumn, isOrder: true }), true);
        }
        return column;
    }

    private compareStringInDesc_(a: string, b: string) {
        return b.localeCompare(a);
    }

    private compareStringinAsc_(a: string, b: string) {
        return a.localeCompare(b);
    }

    private compareDefaultInDesc_(a: string, b) {
        return new String(b).localeCompare(a);
    }

    private compareDefaultinAsc_(a, b: string) {
        return new String(a).localeCompare(b);
    }

    private compareNumberInDesc_(a: number, b: number) {
        return b - a;
    }

    private compareNumberinAsc_(a: number, b: number) {
        return a - b;
    }

    private compareDateInDesc_(a: Date, b: Date) {
        return b.getTime() - a.getTime();
    }

    private compareDateInAsc_(a: Date, b: Date) {
        return a.getTime() - b.getTime();
    }

    private getValInDesc_(value1, value2, caseQuery: { [columnName: string]: [CaseOption] }) {
        for (const columnName in caseQuery) {
            this.thenEvaluator.setCaseAndValue(caseQuery, value1);
            const column1 = this.thenEvaluator.setColumn(columnName).evaluate();
            this.thenEvaluator.setCaseAndValue(caseQuery, value2);
            const column2 = this.thenEvaluator.setColumn(columnName).evaluate();
            switch (typeof value1[column1]) {
                case DATA_TYPE.String:
                    return this.compareStringInDesc_(value1[column1], value2[column2]);
                default:
                    return this.compareNumberInDesc_(value1[column1], value2[column2]);
            }
        }
    }

    private getValInAsc_(value1, value2, caseQuery: { [columnName: string]: [CaseOption] }) {
        for (const columnName in caseQuery) {
            this.thenEvaluator.setCaseAndValue(caseQuery, value1);
            const column1 = this.thenEvaluator.setColumn(columnName).evaluate();
            this.thenEvaluator.setCaseAndValue(caseQuery, value2);
            const column2 = this.thenEvaluator.setColumn(columnName).evaluate();
            switch (typeof value1[column1]) {
                case DATA_TYPE.String:
                    return this.compareStringinAsc_(value1[column1], value2[column2]);
                default:
                    return this.compareNumberinAsc_(value1[column1], value2[column2]);
            }
        }
    }

    private getValueComparer_(column: Column, order: OrderQuery): (a, b) => number {

        switch (column.dataType) {
            case DATA_TYPE.String:
                return order.type === 'asc' ? this.compareStringinAsc_ : this.compareStringInDesc_;
            case DATA_TYPE.Number:
                return order.type === 'asc' ? this.compareNumberinAsc_ : this.compareNumberInDesc_;
            case DATA_TYPE.DateTime:
                return order.type === 'asc' ? this.compareDateInAsc_ : this.compareDateInDesc_;
            default:
                return order.type === 'asc' ? this.compareDefaultinAsc_ : this.compareDefaultInDesc_;
        }

    }

    private orderBy_(order: OrderQuery) {
        order.type = this.getOrderType_(order.type);
        let orderColumn = order.by;
        if (orderColumn != null && typeof orderColumn === DATA_TYPE.Object) {
            if (order.type === "asc") {
                this.results.sort((a, b) => {
                    return this.getValInAsc_(a, b, orderColumn as any);
                });
            }
            else {
                this.results.sort((a, b) => {
                    return this.getValInDesc_(a, b, orderColumn as any);
                });
            }
        }
        else {
            const columnInfo = this.getOrderColumnInfo_(orderColumn as string);
            if (columnInfo != null) {
                const orderMethod = this.getValueComparer_(columnInfo, order);
                orderColumn = columnInfo.name;
                if (order.case == null) {
                    this.results.sort((a, b) => {
                        return orderMethod(a[orderColumn as string], b[orderColumn as string]);
                    });
                }
                else {
                    this.thenEvaluator.setCaseAndColumn({ [orderColumn]: order.case }, orderColumn);
                    this.results.sort((a, b) => {
                        return orderMethod(
                            this.thenEvaluator.setValue(a).evaluate(),
                            this.thenEvaluator.setValue(b).evaluate()
                        );
                    });
                }
            }
        }

    }

    private getOrderType_(type: string) {
        return type == null ? 'asc' : type.toLowerCase();
    }

    protected processOrderBy() {
        const order = this.query.order;
        if (order && this.results.length > 0 && !this.sorted) {
            const orderQueryType = getDataType(order);
            if (orderQueryType === DATA_TYPE.Object) {
                this.orderBy_(order);
            }
            else if (orderQueryType === DATA_TYPE.Array) {
                this.orderBy_(order[0]);
                for (let i = 1, length = (order as any).length; i < length; i++) {
                    if (this.error == null) {
                        const prevOrderQueryBy = order[i - 1].by;
                        const currentOrderQuery: OrderQuery = order[i];
                        let currentorderQueryBy = currentOrderQuery.by;
                        const orderColumnDetail = this.getOrderColumnInfo_(currentorderQueryBy as string);
                        if (orderColumnDetail != null) {
                            currentorderQueryBy = orderColumnDetail.name;
                            currentOrderQuery.type = this.getOrderType_(currentOrderQuery.type);
                            const orderMethod = this.getValueComparer_(orderColumnDetail, currentOrderQuery);
                            this.results.sort((a, b) => {
                                if (a[prevOrderQueryBy] === b[prevOrderQueryBy]) {
                                    return orderMethod(
                                        a[currentorderQueryBy as string],
                                        b[currentorderQueryBy as string]);
                                }
                                return 0;
                            });
                        }
                    }
                }
            }
        }
    }

    protected processAggregateQry() {
        const datas = this.results;
        const datasLength = datas.length;
        const results = {};
        let columnToAggregate;
        // free results memory
        this.results = undefined;
        const getCount = () => {
            let result = 0;
            for (const i in datas) {
                result += datas[i][columnToAggregate] ? 1 : 0;
            }
            return result;
        };
        const getMax = () => {
            let result = 0;
            for (const i in datas) {
                result = result > datas[i][columnToAggregate] ?
                    result : datas[i][columnToAggregate];
            }
            return result;
        };
        const getMin = () => {
            let result = Infinity, value = Infinity;
            for (const i in datas) {
                value = datas[i][columnToAggregate] ?
                    datas[i][columnToAggregate] : Infinity;
                result = result < value ? result : value;
            }
            return result;
        };
        const getSum = () => {
            let result = 0;
            for (const i in datas) {
                result += datas[i][columnToAggregate];
            }
            return result;
        };
        const getAvg = () => {
            let result = 0;
            for (const i in datas) {
                result += datas[i][columnToAggregate];
            }
            return result / datasLength;
        };
        for (const prop in this.query.aggregate) {
            const aggregateColumn = this.query.aggregate[prop];
            const aggregateValType = getDataType(aggregateColumn);
            let aggregateCalculator;
            switch (prop) {
                case 'count':
                    aggregateCalculator = getCount; break;
                case 'max':
                    aggregateCalculator = getMax; break;
                case 'min':
                    aggregateCalculator = getMin; break;
                case 'sum':
                    aggregateCalculator = getSum; break;
                case 'avg':
                    aggregateCalculator = getAvg; break;
            }
            switch (aggregateValType) {
                case DATA_TYPE.String:
                    columnToAggregate = aggregateColumn;
                    results[`${prop}(${columnToAggregate})`] = aggregateCalculator();
                    break;
                case DATA_TYPE.Array:
                    for (const key in aggregateColumn) {
                        columnToAggregate = aggregateColumn[key];
                        results[`${prop}(${columnToAggregate})`] = aggregateCalculator();
                    }
            }
        }

        // add results to the first index of result
        for (const prop in results) {
            datas[0][prop] = results[prop];
        }
        this.results = [datas[0]];
    }
}