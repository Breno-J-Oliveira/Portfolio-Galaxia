/* Public snapshot rendered in HTML: the index works without GitHub API calls. */
(function () {
  "use strict";
  const grid = document.getElementById("repo-grid");
  if (!grid) return;
  const items = [...grid.querySelectorAll(".repo-item")];
  const search = document.getElementById("repo-search");
  const language = document.getElementById("repo-language");
  const kind = document.getElementById("repo-kind");
  const sort = document.getElementById("repo-sort");
  const more = document.getElementById("repo-more");
  const reset = document.getElementById("repo-reset");
  const count = document.getElementById("repo-count");
  const normalize = PortfolioUI.normalize;
  const searchable = new Map(
    items.map((item) => [item, normalize(item.textContent)]),
  );
  const pageSize = 12;
  let limit = pageSize;
  let matching = [];

  function render() {
    const query = normalize(search.value.trim());
    matching = items.filter(
      (item) =>
        (!query || searchable.get(item).includes(query)) &&
        (language.value === "all" ||
          item.dataset.language === language.value) &&
        (kind.value === "all" || item.dataset.kind === kind.value),
    );
    matching.sort((a, b) =>
      sort.value === "name"
        ? a.dataset.repoName.localeCompare(b.dataset.repoName, "pt-BR")
        : b.dataset.updated.localeCompare(a.dataset.updated) ||
          a.dataset.repoName.localeCompare(b.dataset.repoName, "pt-BR"),
    );
    items.forEach((item) => {
      item.hidden = true;
    });
    matching.forEach((item, i) => {
      grid.appendChild(item);
      item.hidden = i >= limit;
    });
    const visible = Math.min(limit, matching.length);
    count.textContent = `${visible} de ${matching.length} repositórios${matching.length !== items.length ? ` encontrados (${items.length} no catálogo)` : " públicos"}.`;
    document.getElementById("repo-empty").hidden = matching.length > 0;
    more.hidden = visible >= matching.length;
    more.textContent = `Mostrar mais ${Math.min(pageSize, matching.length - visible)} repositórios`;
    reset.hidden =
      !query &&
      language.value === "all" &&
      kind.value === "all" &&
      sort.value === "updated";
  }
  function save(push) {
    const url = new URL(location.href);
    for (const [key, value, empty] of [
      ["repo-q", search.value, ""],
      ["repo-language", language.value, "all"],
      ["repo-origin", kind.value, "all"],
      ["repo-order", sort.value, "updated"],
    ]) {
      if (value === empty) url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    }
    if (url.href !== location.href)
      history[push ? "pushState" : "replaceState"]({}, "", url);
  }
  function readLocation() {
    const params = new URL(location.href).searchParams;
    search.value = (params.get("repo-q") || "").slice(0, 150);
    for (const [select, key, fallback] of [
      [language, "repo-language", "all"],
      [kind, "repo-origin", "all"],
      [sort, "repo-order", "updated"],
    ]) {
      const value = params.get(key);
      select.value = [...select.options].some(
        (option) => option.value === value,
      )
        ? value
        : fallback;
    }
    limit = pageSize;
    render();
  }
  search.addEventListener("input", () => {
    limit = pageSize;
    render();
    save(false);
  });
  [language, kind, sort].forEach((select) =>
    select.addEventListener("change", () => {
      limit = pageSize;
      render();
      save(true);
    }),
  );
  reset.addEventListener("click", () => {
    search.value = "";
    language.value = kind.value = "all";
    sort.value = "updated";
    limit = pageSize;
    render();
    save(true);
    search.focus();
  });
  more.addEventListener("click", () => {
    const firstNew = matching[limit];
    limit += pageSize;
    render();
    if (firstNew) firstNew.querySelector("a").focus({ preventScroll: true });
  });
  window.addEventListener("popstate", readLocation);
  readLocation();
})();
