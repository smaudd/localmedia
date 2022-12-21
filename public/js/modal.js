class Modal {
  constructor({
    title = "Hi",
    buttons = "",
    canClose,
    body = "",
    onMount = () => {},
  }) {
    this.container = document.createElement("div");
    this.container.classList.add("modal");
    const html = `
        <div class="window" style="width: 300px">
        <div class="title-bar">
            <div class="title-bar-text">${title}</div>
            <div class="title-bar-controls">
            ${canClose ? `<button aria-label="Close"></button>` : ""}
            </div>
        </div>
        <div class="window-body">
            <p>${body}</p>
        </div>
        </div>
    `;
    this.container.innerHTML = html;
    // Append to body
    document.body.appendChild(this.container);
    onMount(this.container);
    this.closeElement = document.querySelector('button[aria-label="Close"]');
    if (canClose) {
      this._listenClose();
    }
  }
  _listenClose() {
    this.closeElement.addEventListener("click", this.close.bind(this));
  }
  _unlistenClose() {
    this.closeElement.removeEventListener("click", this.close.bind(this));
  }
  // spin();
  close() {
    document.body.removeChild(this.container);
    this._unlistenClose();
  }
  static spinner(id) {
    this.id = id;
    return `<progress max="100" value="0" id="_${id}" style="width: 100%"></progress>`;
  }
  static spin(id) {
    let i = 0;
    const element = document.querySelector(`#_${id}`);
    function loop() {
      if (i >= 100) {
        i = 0;
      } else {
        i += 5;
      }
      element.value = i;
      window.requestAnimationFrame(() => setTimeout(() => loop(), 24));
    }
    loop();
  }
}
