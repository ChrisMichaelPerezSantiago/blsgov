const {
  cheerio: { load },
} = require("./common");
const request = require("./request");
const fs = require("fs");

const getOccupations = async () => {
  const res = await request(
    "https://www.bls.gov/oes/current/oes_stru.htm#00-0000"
  );
  const $ = load(res);

  const occupations = $(
    "table#main-content-table tbody tr td#main-content-td div.verdana.md ul li ul li ul li"
  )
    .map(
      (_, element) =>
        new Promise((resolve, reject) => {
          try {
            const $element = $(element);
            let occupation = $element.find("a").text();
            occupation =
              occupation &&
              occupation
                .replace(/^\s+|\s+$/g, "")
                .split(",")
                .join(",")
                .replace(/\s+/g, " ");

            let code = $element.html().split(";")[0];
            code = code.replace(/&nbsp/g, "");

            resolve({ code, occupation });
          } catch (error) {
            const e = new Error(error);
            reject(e);
          }
        })
    )
    .get();

  let json = await Promise.all(occupations);

  /**
   * @description Unique occupation
   */
  json = json.reduce((acc, curr) => {
    if (!acc.some((x) => x.occupation === curr.occupation)) {
      acc.push(curr);
    }
    return acc;
  }, []);

  json = JSON.stringify(json, null, 2);

  fs.appendFile("occupations.json", json, (err) => {
    console.log(json);
    if (err) throw err;
  });
  return json;
};

getOccupations().then((r) => console.log(r));
