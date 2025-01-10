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

const sortByTime = (submissions) => {
  submissions.sort((a, b) => {
    let aTime = a.split("_").slice(-1);
    let bTime = b.split("_").slice(-1);
    if (aTime > bTime) return -1;
    return 1;
  });
  return submissions;
};

const getTitleCase = (word) => {
  let cleanTitle = "";
  if (word.includes("/")) {
    cleanTitle = word.split("/")[1];
    cleanTitle = cleanTitle.split(".")[0];
    cleanTitle = cleanTitle.split("-");
  } else {
    cleanTitle = word.split("-");
  }
  let titleCase = [];
  for (const word of cleanTitle) {
    titleCase.push(word[0].toUpperCase() + word.slice(1));
  }
  titleCase = titleCase.join(" ");
  return titleCase;
};

let submissions = [];
const submissionsContainer = document.querySelector(".submissionsContainer");
const titleDiv = document.getElementById("title");
let detailsDivList;

const loadSubmissions = async () => {
  let searchParams = new URLSearchParams(location.search);
  let title = searchParams.get("title");
  title = title.split(".")[0];

  titleDiv.innerText = getTitleCase(title);
  try {
    let fileList = await fetchFile("./README.txt");
    fileList = fileList.trim().split("\r\n");
    let submissions = [];
    for (const file of fileList) {
      if (file.startsWith("code/" + title)) {
        submissions.push(file);
      }
    }
    // order submissions, with latest first
    submissions = sortByTime(submissions);
    console.log(submissions);
    displaySubmissions(submissions);
  } catch (error) {
    console.error(error.message);
  }
};
const displaySubmissions = async (submissions) => {
  let content = "";
  let id = 0;
  for (const s of submissions) {
    //remove extension
    let submissionArray = s.split(".")[0];
    submissionArray = submissionArray.split("_");
    let name = getTitleCase(submissionArray[1]);
    let time = submissionArray[2].split("-");
    let [test, ...fileContent] = await loadFileContent(s);
    console.log(fileContent[0]);
    content += `
    <div>
    <p onclick='toggleDetails(${id})'>
    ${name} (${time[0]}-${time[1]}-${time[2]} ${time[3]}:${time[4]}:${time[5]})
    </p>
    <div class='submission-details'>
    ${displayTestCases(test)}
    <pre class='code'>${fileContent.join("\n")}
    </pre>
    </div>
    </div>
    `;
    id++;
  }

  submissionsContainer.innerHTML = content;
};

const loadFileContent = async (s) => {
  try {
    let fileContent = await fetchFile(s);
    fileContent = fileContent.split("\r\n");
    return fileContent;
  } catch (error) {
    console.error(error.message);
  }
};

const displayTestCases = (test) => {
  // show number of circles depending on number of test cases passed and not completed
  let testCase = test.split(": ")[1];
  let totalCorrect = testCase.split("/")[0];
  let totalNotTest =
    testCase.split("/")[1] - 1 - totalCorrect < 0
      ? 0
      : testCase.split("/")[1] - 1 - totalCorrect;

  let content = ` 
    <div class="testCases">
    ${[...Array(parseInt(totalCorrect)).fill("")]
      .map(() => '<div class="test green"></div>')
      .join("")}
    <div class="test red"></div>
      ${[...Array(parseInt(totalNotTest)).fill("")]
        .map(() => '<div class="test"></div>')
        .join("")}
    </div>
    `;
  return content;
};
const toggleDetails = (id) => {
  if (!detailsDivList) {
    detailsDivList = document.querySelectorAll(".submission-details");
  }
  // show details of submissions if not displayed
  if (detailsDivList[id].computedStyleMap().get("display") == "none") {
    detailsDivList[id].style.display = "block";
  } else {
    detailsDivList[id].style.display = "none";
  }
};
loadSubmissions();
