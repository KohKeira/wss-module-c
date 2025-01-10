const useState = (initial) => {
  let state = initial;
  const setState = (newVal) => {
    state = newVal;
    render();
  };
  return [() => state, setState];
};

const getTitleCase = (word) => {
  let cleanTitle = word.split("/")[1];
  cleanTitle = cleanTitle.split(".")[0];
  cleanTitle = cleanTitle.split("-");
  let titleCase = [];
  for (const word of cleanTitle) {
    titleCase.push(word[0].toUpperCase() + word.slice(1));
  }
  titleCase = titleCase.join(" ");
  return titleCase;
};

const debounce = (fn) => {
  let debounceId;
  return function (...args) {
    clearTimeout(debounceId);
    debounceId = setTimeout(() => {
      fn(...args);
    }, 400);
  };
};

const noResult = document.getElementById("noResult");
const paginate = document.querySelector(".paginate");
const [getQuestions, setQuestions] = useState([]);
const [getFilteredQuestions, setFilteredQuestions] = useState([]);
const [getPage, setPage] = useState(1);
let totalPage = 0;
let maxPerPage = 8;

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
    let questionList = [];
    for (const file of fileList) {
      if (file.startsWith("question/")) {
        questionList.push(file);
      }
    }
    questionList.sort((a, b) => {
      if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
      } else return -1;
    });
    totalPage = Math.ceil(questionList.length / maxPerPage);

    setQuestions(questionList);
    setFilteredQuestions(questionList);
  } catch (error) {
    console.error(error.message);
  }
};

const loadQuestionsTable = () => {
  const questionTableBody = document.getElementById("questionTableBody");
  let content = "";
  let startIndex = (getPage() - 1) * maxPerPage;
  getFilteredQuestions()
    .slice(startIndex, startIndex + 8)
    .forEach((q, i) => {
      let titleCase = getTitleCase(q);

      content += `   
    <tr>
      <td>${i + 1}</td>
      <td><a href="statement.html?title=${
        q.split("/")[1]
      }">${titleCase}</a></td>
    </tr>
`;
    });
  if (content === "") {
    noResult.style.display = "block";
    paginate.style.display = "none";
  } else {
    noResult.style.display = "none";
    paginate.style.display = "flex";
  }
  questionTableBody.innerHTML = content;
};

const handleSearch = (e) => {
  let search = e.target.value.toLowerCase();

  //search subsequence and substring

  let filtered = getQuestions().filter((a) => {
    const title = getTitleCase(a).toLowerCase();
    let count = 0;
    for (const char of title) {
      if (char === search[count]) {
        count++;
      }
      if (count === search.length) return true;
    }
    return false;
  });
  totalPage = Math.ceil(filtered.length / maxPerPage);

  setFilteredQuestions(filtered);
};

const loadPagination = () => {
  const paginate = document.getElementById("pageButtons");
  let content = "";
  for (let i = 1; i <= totalPage; i++) {
    content += `   
        <button type="button" class="paginate-btn" onclick='setPage(${i})'}>${i}</button>
        `;
  }
  paginate.innerHTML = content;
};

const loadInitialPagination = () => {
  let paginate = document.querySelectorAll(".paginate-btn");
  paginate = [...paginate];
  paginate[0].addEventListener("click", () => {
    setPage(1);
  });
  paginate[1].addEventListener("click", () => {
    setPage(getPage() - 1);
  });
  paginate.slice(-1)[0].addEventListener("click", () => {
    setPage(totalPage);
  });
  paginate.slice(-2)[0].addEventListener("click", () => {
    setPage(getPage() + 1);
  });
};
const disablePaginationButton = () => {
  let paginate = document.querySelectorAll(".paginate-btn");
  paginate = [...paginate];
  paginate[0].disabled = getPage() === 1;
  paginate[1].disabled = getPage() === 1;
  paginate.slice(-1)[0].disabled = getPage() === totalPage;
  paginate.slice(-2)[0].disabled = getPage() === totalPage;
};

const render = () => {
  loadQuestionsTable();
  loadPagination();
  disablePaginationButton();
};

const debounceSearch = debounce(handleSearch);
loadAllFiles();
loadInitialPagination();
