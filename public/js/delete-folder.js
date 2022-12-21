const deleteFolderButtons = document.querySelectorAll(
  "button[data-folder-delete]"
);
function onClickFolderButton(e) {
  function submit(e) {
    console.log(e.target);
    e.preventDefault();
    const location = e.target.dataset.path;
    const modal = new Modal({
      title: "Deleting...",
      body: Modal.spinner(1),
      onMount: () => {
        Modal.spin(1);
      },
    });
    fetch(`/folder/${encodeURIComponent(location)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location,
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
    title: "Delete folder",
    body: `
    <form data-path="${e.target.dataset.path}">
        <div class="window-body">
            <menu role="tablist">
                <button aria-selected="true">Deletion</button>
            </menu>
            <article role="tabpanel">
                Are you sure?
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

for (let input of Array.from(deleteFolderButtons)) {
  input.addEventListener("click", onClickFolderButton);
}
