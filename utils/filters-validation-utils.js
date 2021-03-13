"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filters = void 0;
function filters(query) {
    if (!query.pageSize || typeof query.pageSize !== "number") {
        return {
            type: "error",
            msg: !query.pageSize
                ? "pageSize not provided! Please provide it as a query params."
                : "pageSize Should be a number",
        };
    }
    else if (!query.pageNumber || typeof query.pageNumber !== "number") {
        return {
            type: "error",
            msg: !query.pageNumber
                ? "pageNumber not provided! Please provide it as a query params."
                : "pageNumber should be a number",
        };
    }
    else if (!query.sort || typeof query.sort !== "string") {
        return {
            type: "error",
            msg: !query.sort
                ? "sort not provided! Please provide it as a query params."
                : "sort should be a string",
        };
    }
    else if (!query.sortName || typeof query.sortName !== "string") {
        return {
            type: "error",
            msg: !query.sortName
                ? "sortName not provided! Please provide it as a query params."
                : "sortName should be a string",
        };
    }
    else {
        return undefined;
    }
}
exports.filters = filters;
//# sourceMappingURL=filters-validation-utils.js.map