document.addEventListener("DOMContentLoaded", function () {
  const commandPalette = document.createElement("div");
  commandPalette.id = "commandPalette";
  commandPalette.className = "command-palette";
  commandPalette.innerHTML = `
        <input type="text" id="commandInput" placeholder="Type a command..." autofocus autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
        <ul id="commandList"></ul>
    `;
  document.body.appendChild(commandPalette);

  const overlay = document.createElement("div");
  overlay.className = "overlay";
  document.body.appendChild(overlay);

  const style = document.createElement("style");
  style.innerHTML = `
        .command-palette {
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            width: 400px;
            background: #2b2b2b;
            border-radius: 8px;
            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
            display: none;
            flex-direction: column;
            padding: 10px;
            z-index: 1000;
        }

        .command-palette input {
            width: 100%;
            padding: 10px;
            font-size: 16px;
            border: none;
            outline: none;
            background: #1e1e1e;
            color: white;
            border-radius: 4px;
        }

        .command-palette ul {
            list-style: none;
            padding: 0;
            margin: 10px 0 0;
            max-height: 200px;
            overflow-y: auto;
        }

        .command-palette li {
            padding: 10px;
            cursor: pointer;
            font-size: 14px;
            color: white;
            background: #333;
            transition: background 0.2s;
            border-radius: 4px;
        }

        .command-palette li:hover,
        .command-palette .selected {
            background: #555;
        }

        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            z-index: 999;
        }
    `;
  document.head.appendChild(style);

  const commandInput = document.getElementById("commandInput");
  const commandList = document.getElementById("commandList");

  const defaultCommands = [
    { name: "Home", action: () => (window.location.href = "/") },
    { name: "Search Sitemap", action: searchSitemap },
  ];

  let sitemapLinks = [];
  let commands = [...defaultCommands];
  let filteredCommands = [...commands];
  let selectedIndex = -1;

  function fetchSitemap() {
    fetch("/sitemap.xml")
      .then((response) => response.text())
      .then((text) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        const urls = xmlDoc.getElementsByTagName("url");
        sitemapLinks = Array.from(urls).map((url) => {
          const loc = url.getElementsByTagName("loc")[0].textContent;
          const summaryTag = url.getElementsByTagName("summary");
          const summary =
            summaryTag.length > 0
              ? summaryTag[0].textContent
              : "No summary available";
          const cleanName = loc
            .replace(/^https?:\/\/[^/]+\//, "")
            .replace(/[-_]/g, " ")
            .replace(/\//g, " > ")
            .trim();
          return {
            name: cleanName + " - " + summary,
            action: () => (window.location.href = loc),
          };
        });
      })
      .catch((error) => console.error("Error fetching sitemap:", error));
  }

  fetchSitemap();

  function searchSitemap() {
    commands = [...sitemapLinks];
    filterCommands("");
  }

  function restoreDefaultCommands() {
    commands = [...defaultCommands];
    filterCommands("");
  }

  function openCommandPalette() {
    commandPalette.style.display = "flex";
    overlay.style.display = "block";
    commandInput.value = "";
    commandInput.focus();
    restoreDefaultCommands();
  }

  function closeCommandPalette() {
    commandPalette.style.display = "none";
    overlay.style.display = "none";
  }

  document.addEventListener("keydown", function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "p") {
      event.preventDefault();
      openCommandPalette();
    }
    if (event.key === "Escape") {
      closeCommandPalette();
    }
  });

  commandInput.addEventListener("input", function () {
    filterCommands(this.value);
  });

  function filterCommands(query) {
    commandList.innerHTML = "";
    filteredCommands = commands.filter((cmd) =>
      cmd.name.toLowerCase().includes(query.toLowerCase()),
    );
    filteredCommands.forEach((cmd, index) => {
      const li = document.createElement("li");
      li.textContent = cmd.name;
      li.addEventListener("click", () => executeCommand(index));
      commandList.appendChild(li);
    });
    selectedIndex = -1;
  }

  function executeCommand(index) {
    if (filteredCommands[index]) {
      filteredCommands[index].action();
    }
  }

  overlay.addEventListener("click", closeCommandPalette);
});
