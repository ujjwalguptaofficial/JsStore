import { Select } from "./";
import { removeSpace, getDataType, LogHelper } from "@/worker/utils";
import { ERROR_TYPE, DATA_TYPE, ICaseOption, IColumn, IOrderQuery } from "@/common";

export const processGroupDistinctAggr = function (this: Select) {
    const query = this.query;
    if (query.distinct) {
        const groupBy = [];
        const result = this.results[0];
        for (const key in result) {
            groupBy.push(key);
        }
        const primaryKey = this.primaryKey();
        const index = groupBy.indexOf(primaryKey);
        groupBy.splice(index, 1);
        query.groupBy = groupBy.length > 0 ? groupBy : null;
    }
    if (query.groupBy) {
        if (query.aggregate) {
            this.executeAggregateGroupBy();
        }
        else {
            this.processGroupBy();
        }
    }
    else if (query.aggregate) {
        this.processAggregateQry();
    }
};

const getOrderColumnInfo = function (this: Select, orderColumn: string) {
    let column: IColumn;
    if (!this.query.store) {
        if (this.query.join == null) {
            column = this.getColumnInfo(orderColumn);
        }
        else {
            const splittedByDot = removeSpace(orderColumn).split(".");
            const joinOrderColumn = splittedByDot[1];
            if (process.env.NODE_ENV !== 'production' && joinOrderColumn == null) {
                new LogHelper(ERROR_TYPE.ColumnNotExist,
                    { column: orderColumn, isOrder: true, isJoin: true }
                ).throw()
            }
            column = this.getColumnInfo(joinOrderColumn, splittedByDot[0]);
        }
    }
    if (column == null) {
        const valueFromFirstColumn = this.results[0][orderColumn];
        if (valueFromFirstColumn) {
            return {
                dataType: getDataType(valueFromFirstColumn),
                name: orderColumn
            } as IColumn;
        }
        throw new LogHelper(ERROR_TYPE.ColumnNotExist,
            { column: orderColumn, isOrder: true }
        )

    }
    return column;
}

const compareStringInDesc_ = (a: string, b: string) => {
    return b.localeCompare(a);
}

const compareStringinAsc_ = (a: string, b: string) => {
    return a.localeCompare(b);
}

const compareDefaultInDesc_ = (a: string, b) => {
    return new String(b).localeCompare(a);
}

const compareDefaultinAsc_ = (a, b: string) => {
    return new String(a).localeCompare(b);
}

const compareNumberInDesc_ = (a: number, b: number) => {
    return b - a;
}

const compareNumberinAsc_ = (a: number, b: number) => {
    return a - b;
}

const compareDateInDesc_ = (a: Date, b: Date) => {
    return b.getTime() - a.getTime();
}

const compareDateInAsc_ = (a: Date, b: Date) => {
    return a.getTime() - b.getTime();
}

const getValueComparer_ = (column: IColumn, order: IOrderQuery): (a, b) => number => {
    switch (column.dataType) {
        case DATA_TYPE.String:
            return order.type === 'asc' ? compareStringinAsc_ : compareStringInDesc_;
        case DATA_TYPE.Number:
            return order.type === 'asc' ? compareNumberinAsc_ : compareNumberInDesc_;
        case DATA_TYPE.DateTime:
            return order.type === 'asc' ? compareDateInAsc_ : compareDateInDesc_;
        default:
            return order.type === 'asc' ? compareDefaultinAsc_ : compareDefaultInDesc_;
    }

}

const orderBy_ = function (this: Select, order: IOrderQuery) {
    order.type = getOrderType_(order.type);
    let orderColumn = order.by;
    const thenEvaluator = this.thenEvaluator;
    if (orderColumn != null && typeof orderColumn === DATA_TYPE.Object) {
        const caseQuery = orderColumn as { [columnName: string]: [ICaseOption] };
        const getValInAscDesc = (stringComparer, numberComparer) => {
            return (value1, value2) => {
                for (const columnName in caseQuery) {
                    thenEvaluator.setCaseAndValue(caseQuery, value1);
                    const column1 = thenEvaluator.setColumn(columnName).evaluate();
                    thenEvaluator.setCaseAndValue(caseQuery, value2);
                    const column2 = thenEvaluator.setColumn(columnName).evaluate();
                    switch (typeof value1[column1]) {
                        case DATA_TYPE.String:
                            return stringComparer(value1[column1], value2[column2]);
                        default:
                            return numberComparer(value1[column1], value2[column2]);
                    }
                }
            }
        };
        let sortMethod = order.type === 'asc' ?
            getValInAscDesc(compareStringinAsc_, compareNumberinAsc_) :
            getValInAscDesc(compareStringInDesc_, compareNumberInDesc_);

        this.results.sort(sortMethod);
    }
    else {
        const columnInfo = getOrderColumnInfo.call(this, orderColumn as string);
        if (columnInfo != null) {
            const orderMethod = getValueComparer_(columnInfo, order);
            orderColumn = columnInfo.name;
            if (order.case == null) {
                this.results.sort((a, b) => {
                    return orderMethod(a[orderColumn as string], b[orderColumn as string]);
                });
            }
            else {
                thenEvaluator.setCaseAndColumn({ [orderColumn as string]: order.case }, orderColumn as string);
                this.results.sort((a, b) => {
                    return orderMethod(
                        thenEvaluator.setValue(a).evaluate(),
                        thenEvaluator.setValue(b).evaluate()
                    );
                });
            }
        }
    }

}

const getOrderType_ = (type: string) => {
    return type == null ? 'asc' : type.toLowerCase();
}

export const processOrderBy = function (this: Select) {
    const order = this.query.order;
    if (order && this.results.length > 0 && !this.sorted) {
        const orderQueryType = getDataType(order);
        if (orderQueryType === DATA_TYPE.Object) {
            orderBy_.call(this, order);
        }
        else if (orderQueryType === DATA_TYPE.Array) {
            orderBy_.call(this, order[0]);
            for (let i = 1, length = (order as any).length; i < length; i++) {
                const prevOrderQueryBy = order[i - 1].by;
                const currentOrderQuery: IOrderQuery = order[i];
                let currentorderQueryBy = currentOrderQuery.by;
                const orderColumnDetail = getOrderColumnInfo.call(this, currentorderQueryBy as string);
                if (orderColumnDetail != null) {
                    currentorderQueryBy = orderColumnDetail.name;
                    currentOrderQuery.type = getOrderType_(currentOrderQuery.type);
                    const orderMethod = getValueComparer_(orderColumnDetail, currentOrderQuery);
                    this.results.sort((a, b) => {
                        if (a[prevOrderQueryBy] === b[prevOrderQueryBy]) {
                            return orderMethod(
                                a[currentorderQueryBy as string],
                                b[currentorderQueryBy as string]
                            );
                        }
                        return 0;
                    });
                }
            }
        }
    }
}

export const processAggregateQry = function (this: Select) {
    const datas = this.results;
    const datasLength = datas.length;
    const results = {};
    let columnToAggregate;

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
        return getSum() / datasLength;
    };
    const aggregateQry = this.query.aggregate;
    for (const prop in aggregateQry) {
        const aggregateColumn = aggregateQry[prop];
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
                aggregateCalculator = getAvg;
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