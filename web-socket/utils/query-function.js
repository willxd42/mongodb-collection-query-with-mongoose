const metaphone = require("metaphone");

function getOption(data) {
  return `$${data.option}`;
}

function getObject(obj) {
  let data = {};

  for (const option in obj) {
    if (option === "ne") {
      data.$ne = obj[option];
    }
    if (option === "eq") {
      data.$eq = obj[option];
    }
    if (option === "gt") {
      data.$gt = obj[option];
    }
    if (option === "gte") {
      data.$gte = obj[option];
    }
    if (option === "lt") {
      data.$lt = obj[option];
    }
    if (option === "lte") {
      data.$lte = obj[option];
    }
  }

  return data;
}

function getTypesStructuredValue(rules, io) {
  if (rules.type !== undefined) {
    if (rules.type === "string") {
      return `${rules.data}`;
    } else if (rules.type === "number") {
      return parseInt(rules.data);
    } else if (rules.type === "float") {
      return parseFloat(rules.data);
    } else if (rules.type === "boolean") {
      return eval(rules.data) ? true : false;
    } else if (rules.type === "date") {
      return new Date(`${rules.data}`);
    } else {
      return (() => {
        for (const client of reqQuery.client) {
          io.to(client.id).emit("error", {
            status: 400,
            message:
              "range can only accept the following types string, number, float, boolean and date",
          });
        }
      })();
    }
  } else {
    return (() => {
      for (const client of reqQuery.client) {
        io.to(client.id).emit("error", {
          status: 400,
          message:
            "You've constructed your query wrongly kindly consult the documentation",
        });
      }
    })();
  }
}

function getTypes(rules, io, reqQuery) {
  if (rules.field && rules.field === "sound") {
    const data = `/.*${`${metaphone(rules.data)}`.replace(
      /[-[\]{}()*+?.,\\^$|#\s]/g,
      "\\$&"
    )}.*/i`;
    return { [rules.field]: eval(data) };
  } else if (rules.option === "cn") {
    const data = `/.*${`${rules.data}`.replace(
      /[-[\]{}()*+?.,\\^$|#\s]/g,
      "\\$&"
    )}.*/i`;
    return { [rules.field]: eval(data) };
  } else if (rules.option === "in" || rules.option === "nin") {
    return {
      [rules.field]: { [getOption(rules)]: rules.data },
    };
  } else if (rules.type !== undefined) {
    if (rules.type === "string") {
      return { [rules.field]: { [getOption(rules)]: `${rules.data}` } };
    } else if (rules.type === "number") {
      return {
        [rules.field]: { [getOption(rules)]: parseInt(rules.data) },
      };
    } else if (rules.type === "float") {
      return {
        [rules.field]: { [getOption(rules)]: parseFloat(rules.data) },
      };
    } else if (rules.type === "boolean") {
      return {
        [rules.field]: { [getOption(rules)]: eval(rules.data) ? true : false },
      };
    } else if (rules.type === "plainArray") {
      if (rules.option === "all") {
        return {
          [rules.field]: { $all: rules.data },
        };
      } else {
        return {
          [rules.field]: rules.data,
        };
      }
    } else if (rules.type === "objectArray") {
      return {
        [rules.field]: getObject(rules.data),
      };
    } else if (rules.type === "date") {
      return {
        [rules.field]: { [getOption(rules)]: new Date(`${rules.data}`) },
      };
    } else if (rules.type === "range") {
      const range1 = rules.data[0];
      const range2 = rules.data[1];

      return {
        [rules.field]: {
          [getOption(range1)]: getTypesStructuredValue(range1, io),
          [getOption(range2)]: getTypesStructuredValue(range2, io),
        },
      };
    } else {
      return { [rules.field]: { [getOption(rules)]: rules.data } };
    }
  } else {
    return (() => {
      for (const client of reqQuery.client) {
        io.to(client.id).emit("error", {
          status: 400,
          message:
            "You've constructed your query wrongly kindly consult the documentation",
        });
      }
    })();
  }
}

function query(query, io, reqQuery) {
  // structuring for NoSQL query //

  const result = query.map((rules) => {
    if (rules.option === "expression") {
      return { [rules.field]: rules.data };
    } else {
      return getTypes(rules, io, reqQuery);
    }
  });

  // console.log("result", result);

  return result;
}

module.exports = query;
