const fetchFile = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Response not ok");
    }
    const data = res.text();
    return data;
  } catch (error) {
    console.error(error.message);
  }
};

const getTitleCase = (word) => {
  cleanTitle = word.split("_");
  let titleCase = [];
  for (const word of cleanTitle) {
    titleCase.push(word[0].toUpperCase() + word.slice(1));
  }
  titleCase = titleCase.join(" ");
  return titleCase;
};

let titleDiv = document.getElementById("title");
let descriptionDiv = document.getElementById("description");
let metadataDiv = document.getElementById("metadata");
let problemDiv = document.getElementById("problem");
let linkDiv = document.querySelector(".link");

const loadStatement = async () => {
  let searchParams = new URLSearchParams(location.search);
  let title = searchParams.get("title");
  try {
    let content = await fetchFile("question/" + title);
    if (title.endsWith(".html")) {
      // directly show the html content

      document.querySelector("html").innerHTML = content;
      linkDiv = document.createElement("div");
      linkDiv.classList.add("link");
      document.body.appendChild(linkDiv)
    } else {
      displayStatement(content);
    }
    linkDiv.innerHTML = `
    <a href="./submission.html?title=${title}">See all submissions</a>`;
  } catch (error) {
    console.error(error.message);
  }
};

const displayStatement = (content) => {
  let metaContent = "";
  let contentArray = content.split("---").slice(1);
  let metadata = contentArray[0].trim().split("\r\n");

  for (let data of metadata) {
    if (data.includes(":")) {
      dataArray = data.split(": ");
      // handle complusory metadata
      if (dataArray[0] === "Title") {
        titleDiv.innerText = dataArray[1];
      } else if (dataArray[0] === "Description") {
        descriptionDiv.innerText = dataArray[1];
      } else {
        if (dataArray[0].includes("_")) {
          metaContent += `
            <p>${getTitleCase(dataArray[0])}: ${dataArray[1]}</p>
            `;
        } else {
          metaContent += `
            <p>${data}</p>
            `;
        }
      }
    } else {
      metaContent += `
        <p>${data}</p>
        `;
    }
  }
  metadataDiv.innerHTML += metaContent;

  // load problem and example

  let problemContent = "";
  let problemData = contentArray[1].trim().split("\r\n");
  //   console.log(problemdata);
  let exampleCount = 1;
  for (let i = 0; i < problemData.length; i++) {
    const data = problemData[i];
    if (data.includes("Example")) {
      problemContent += `
        <div class='exampleDiv'>Example ${exampleCount}:
        <div class='exampleContent'>
        ${problemData[i + 1]}
        </div>
        </div>
        `;
      exampleCount++;
      i++;
    } else {
      problemContent += `
    <p>${data}</p>
    `;
    }
  }

  problemDiv.innerHTML += problemContent;
};

loadStatement();
