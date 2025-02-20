document.addEventListener("DOMContentLoaded", function () {
  const searchModal = document.createElement("div");
  searchModal.id = "searchModal";
  searchModal.className = "search-modal";
  searchModal.innerHTML = `
        <span class="search-prompt">/</span>
        <input type="text" id="searchInput" placeholder="Search..." autofocus />
        <span id="searchCount" class="search-count"></span>
    `;
  document.body.appendChild(searchModal);

  const style = document.createElement("style");
  style.textContent = `
        .search-modal {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: #222;
            color: #fff;
            display: flex;
            align-items: center;
            padding: 10px;
            font-size: 16px;
            font-family: monospace;
            border-top: 2px solid #555;
            display: none;
            z-index: 1000;
        }
        .search-prompt {
            color: #0f0;
            font-weight: bold;
            margin-right: 5px;
        }
        .search-modal input {
            flex-grow: 1;
            background: transparent;
            border: none;
            color: #fff;
            font-size: 16px;
            outline: none;
        }
        .search-count {
            margin-left: 10px;
            font-size: 14px;
            color: #aaa;
        }
        .search-highlight {
            background: yellow;
            color: black;
            font-weight: bold;
            display: inline;
        }
        .current-highlight {
            background: orange;
        }
    `;
  document.head.appendChild(style);

  const searchInput = document.getElementById("searchInput");
  const searchCount = document.getElementById("searchCount");

  let textNodes = [];
  let matchElements = [];
  let currentIndex = -1;
  let lastSearchQuery = "";

  function scanTextNodes(element) {
    textNodes = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false,
    );

    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeValue.trim()) {
        textNodes.push(node);
      }
    }
  }

  function restoreOriginalText() {
    matchElements.forEach((el) => {
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent), el);
      }
    });
    matchElements = [];
  }

  function highlightMatches(query) {
    restoreOriginalText(); // Ensure the page is reset before searching again
    if (!query.trim()) return;

    matchElements = [];
    const regex = new RegExp(query, "gi");

    textNodes.forEach((node) => {
      let match;
      let text = node.nodeValue;
      let parent = node.parentNode;
      let lastIndex = 0;
      let frag = document.createDocumentFragment();

      while ((match = regex.exec(text)) !== null) {
        frag.appendChild(
          document.createTextNode(text.substring(lastIndex, match.index)),
        );

        let mark = document.createElement("span");
        mark.className = "search-highlight";
        mark.textContent = text.substring(
          match.index,
          match.index + query.length,
        );
        matchElements.push(mark);
        frag.appendChild(mark);

        lastIndex = match.index + query.length;
      }

      frag.appendChild(document.createTextNode(text.substring(lastIndex)));

      if (matchElements.length > 0) {
        parent.replaceChild(frag, node);
      }
    });

    currentIndex = -1;
    updateMatchCount();
  }

  function clearHighlights() {
    restoreOriginalText();
    searchCount.textContent = "";
  }

  function navigateMatches(direction) {
    if (matchElements.length === 0) return;

    if (currentIndex !== -1) {
      matchElements[currentIndex].classList.remove("current-highlight");
    }

    currentIndex =
      (currentIndex + direction + matchElements.length) % matchElements.length;
    matchElements[currentIndex].classList.add("current-highlight");
    matchElements[currentIndex].scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    updateMatchCount();
  }

  function updateMatchCount() {
    searchCount.textContent = matchElements.length
      ? `${currentIndex + 1}/${matchElements.length}`
      : "";
  }

  function openSearchModal() {
    searchModal.style.display = "flex";
    searchInput.value = "";
    searchInput.focus();
    scanTextNodes(document.body); // Always rescan text nodes on opening
    lastSearchQuery = "";
  }

  function closeSearchModal() {
    searchModal.style.display = "none";
    clearHighlights();
  }

  document.addEventListener("keydown", function (event) {
    if (
      event.key === "/" &&
      !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
    ) {
      event.preventDefault();
      openSearchModal();
    } else if (event.key === "Escape") {
      closeSearchModal();
    }
  });

  searchInput.addEventListener("input", function () {
    if (searchInput.value.trim() === "") {
      clearHighlights();
    }
  });

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && searchInput.value.trim() !== lastSearchQuery) {
      event.preventDefault();
      lastSearchQuery = searchInput.value.trim();
      scanTextNodes(document.body); // Rescan nodes before new search
      highlightMatches(lastSearchQuery);
    } else if (
      event.key === "Enter" &&
      searchInput.value.trim() === lastSearchQuery
    ) {
      event.preventDefault();
      navigateMatches(event.shiftKey ? -1 : 1);
    }
  });
});
