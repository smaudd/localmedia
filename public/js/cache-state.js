const summaries = document.querySelectorAll("summary");

const setItemArray = (key, data) => {
  const cache = JSON.parse(window.localStorage.getItem(key)) || [];
  window.localStorage.setItem(key, JSON.stringify([...cache, data]));
};

const removeItemArray = (key, data) => {
  let cache = JSON.parse(window.localStorage.getItem(key)) || [];
  const filtered = cache.filter((item) => item !== data);
  window.localStorage.setItem(key, JSON.stringify(filtered));
};

for (let summary of Array.from(summaries)) {
  summary.addEventListener("click", (e) => {
    const parent = e.target.parentElement.parentElement;
    if (parent.getAttribute("open") === null) {
      setItemArray("state", summary.dataset.path);
    } else {
      removeItemArray("state", summary.dataset.path);
    }
  });
}

for (let summary of Array.from(summaries)) {
  const state = JSON.parse(window.localStorage.getItem("state")) || [];
  if (state.includes(summary.dataset.path)) {
    const parent = summary.parentElement;
    parent.setAttribute("open", true);
  }
}
