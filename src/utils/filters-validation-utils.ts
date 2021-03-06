import { Response, QueryInterface } from "./interfaces-utils";

export function filters(query: QueryInterface): Response | undefined {
  // validating pageSize, pageNumber, sort, and sortName quey params
  if (typeof query.pageSize !== "number") {
    return {
      status: 400,
      type: "error",
      msg: !query.pageSize
        ? "pageSize not provided! Please provide it as a query params."
        : "pageSize Should be a number",
    };
  } else if (typeof query.pageNumber !== "number") {
    return {
      status: 400,
      type: "error",
      msg: !query.pageNumber
        ? "pageNumber not provided! Please provide it as a query params."
        : "pageNumber should be a number",
    };
  } else if (typeof query.sort !== "string") {
    return {
      status: 400,
      type: "error",
      msg: !query.sort
        ? "sort not provided! Please provide it as a query params."
        : "sort should be a string",
    };
  } else if (typeof query.sortName !== "string") {
    return {
      status: 400,
      type: "error",
      msg: !query.sortName
        ? "sortName not provided! Please provide it as a query params."
        : "sortName should be a string",
    };
  } else {
    return undefined;
  }
}
