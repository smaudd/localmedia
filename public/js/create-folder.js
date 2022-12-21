const folderButtons = document.querySelectorAll("button[data-folder]");
function onClickFolderButton(e) {
  console.log(e.target);
  function submit(e) {
    e.preventDefault();
    const location = e.target.dataset.path;
    const name = e.target.elements[1].value;
    const modal = new Modal({
      title: "Creating...",
      body: Modal.spinner(1),
      onMount: () => {
        Modal.spin(1);
      },
    });
    fetch("/folder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location,
        name,
      }),
    })
      .then((r) => r.json())
      .then(() => {
        modal.close();
        window.location.reload();
      });
  }
  ///
  new Modal({
    title: "Create Folder",
    body: `
    <form data-path="${e.target.dataset.path}">
        <div class="window-body">
            <menu role="tablist">
                <button aria-selected="true">New</button>
            </menu>
            <article role="tabpanel">
                <p>Name</p>
                <input style="width: 98%;" name="name" />
            </article>
            <section class="field-row" style="justify-content: flex-end">
                <button type="submit">OK</button>
            </section>
        </div>
  </form>
`,
    canClose: true,
    onMount: (node) => {
      node.querySelector("form").addEventListener("submit", submit);
    },
  });
}

for (let input of Array.from(folderButtons)) {
  input.addEventListener("click", onClickFolderButton);
}
