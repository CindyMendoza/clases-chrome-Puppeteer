const puppeteer = require("puppeteer");

// occ jobs
/*(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.occ.com.mx/empleos/");

  function getJobsInformation() {
    let jobElementInformation = document.querySelectorAll("div[id*=jobcard]");
    jobElementInformation = [...jobElementInformation];

    const jobJsonInformation = jobElementInformation.map((el) => {
      const [
        { href: url },
        {
          children: [
            {
              children: [
                { innerText: fecha },
                { innerText: title },
                { innerText: salary },
              ],
            },
          ],
        },
      ] = el.children;
      fechaSplit = fecha.split("\n")[0];
      country = el.querySelector("p[class*=zonesLinks]").innerText;

      return { url, fechaSplit, title, salary, country };
    });

    return jobJsonInformation;
  }
  const jobJsonInformation = await page.evaluate(getJobsInformation)
  console.log(jobJsonInformation);
})();
*/

// teacher'version
const configData = {
  Nationality: "nacionalidad",
  "Issuing state": "paisEmision",
  "Surname and given names": "nombreCompleto",
  "Nationality code": "codigoNacionalidad",
  "Date of expiry": " fechaExpiracion",
  Sex: "sexo",
  "Date of birth": "fechaNacimiento",
  "Check digit for personal number": "codigoVerificacion",
};
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      "--start-maximized", // you can also use --start-fullscreen
    ],
  });
  const page = await browser.newPage();
  await page.goto("https://api.regulaforensics.com/");

  const elementHandle = await page.$("input[type=file]");
  await elementHandle.uploadFile("./images/dni.png");

  await page.waitForSelector("tbody>tr");

  const cardDataInformation = await page.evaluate((configData) => {
    let tableInfoCard = document.querySelectorAll("tbody>tr");
    tableInfoCard = Array.from(tableInfoCard);
    let cardDataInformation = tableInfoCard
      .map((el) => {
        const [
          { innerText: attribute },
          { innerText: elemMRZ },
          { innerText: elemVisualZone },
        ] = el.children;
        const value = elemVisualZone === "" ? elemVisualZone : elemMRZ;
        return { field: attribute, value };
      })
      .filter((el) => {
        !!configData(el.field);
      })
      .map((el) => {
        el.field = configData[el.field];
        return el;
      })
      .reduce((acum, el) => {
        acum[el.field] = el.value;
        return acum;
      }, {});
    return cardDataInformation;
  }, configData);

  console.log(JSON.stringify(cardDataInformation, null, 2));
  // const dniInformation = await page.evaluate(() => {
  //   let rowElements = document.querySelectorAll("tbody>tr");
  //   rowElements = [...rowElements];

  //   const dniInformation = rowElements.map((el) => {
  //     const [
  //       { innerText: attribute },
  //       { innerText: MRZ },
  //       // { innerText: visualZone },
  //     ] = el.children;

  //     return { attribute, MRZ };
  //   });

  //   return dniInformation;
  // });

  // const dniInformation = await page.evaluate(() => {
  //   let rowElements = document.querySelectorAll("tbody>tr");
  //   rowElements = [...rowElements];

  //   const dniInformation = rowElements.map((el) => {
  //     const [
  //       { innerText: attribute },
  //       { innerText: MRZ },
  //       // { innerText: visualZone },
  //     ] = el.children;

  //     return { attribute, MRZ };
  //   });

  //   return dniInformation;
  // });

  // console.log(typeof dniInformation);
  // Object.entries(dniInformation).forEach(([keyA, valueA]) => {
  //   console.log(JSON.stringify(valueA));
  //   Object.entries(valueA).forEach(([keyV, valueV]) => {
  //     console.log(JSON.stringify(valueV));
  //   });
  // });
})();
