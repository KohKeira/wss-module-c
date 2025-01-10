const useState = (initial) => {
  let state = initial;
  const setState = (newVal) => {
    state = newVal;
    render();
  };
  return [() => state, setState];
};

const getTitleCase = (wordArray) => {
  let cleanTitle = wordArray.split("/")[1];
  cleanTitle = cleanTitle.split(".")[0];
  cleanTitle = cleanTitle.split("-");
  let titleCase = [];
  for (const word of cleanTitle) {
    titleCase.push(word[0].toUpperCase() + word.slice(1));
  }
  titleCase = titleCase.join(" ");
  return titleCase;
};

const [getQuestions, setQuestions] = useState([]);
const [getCodes, setCodes] = useState([]);
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
const loadAllFiles = async () => {
  try {
    let fileList = await fetchFile("./README.txt");
    fileList = fileList.trim().split("\r\n");
    let codeList = [];
    let questionList = [];
    for (const file of fileList) {
      if (file.startsWith("code/")) {
        codeList.push(file);
      } else {
        questionList.push(file);
      }
    }
    questionList.sort((a, b) => {
      if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
      } else return -1;
    });
    console.log(questionList);
    setQuestions(questionList);
    setCodes(codeList);
  } catch (error) {
    console.error(error.message);
  }
};

const loadQuestionsTable = () => {
  const questionTableBody = document.getElementById("questionTableBody");
  let content = "";
  getQuestions().forEach((q, i) => {
    let titleCase = getTitleCase(q);

    content += `   
    <tr>
      <td>${i + 1}</td>
      <td><a href="">${titleCase}</a></td>
    </tr>
`;
  });
  questionTableBody.innerHTML = content;
};

const render = () => {
  loadQuestionsTable();
};
loadAllFiles();
