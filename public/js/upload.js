const fileInputs = document.querySelectorAll("input[type=file]");
console.log(fileInputs);
function onChangeInput(e) {
  const { files } = e.target;
  const data = new FormData();
  for (let file of files) {
    data.append("file", file);
  }
  data.append("location", e.target.dataset.path);
  new Modal({
    title: "Uploading...",
    body: Modal.spinner(1),
    onMount: () => {
      Modal.spin(1);
    },
  });
  fetch("/upload", {
    method: "POST",
    body: data,
  })
    .then((r) => r.json)
    .then(() => {
      window.location.reload();
    })
    .catch(console.error);
}

for (let input of Array.from(fileInputs)) {
  input.addEventListener("change", onChangeInput);
}
