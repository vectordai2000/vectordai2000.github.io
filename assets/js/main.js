/* =========================================================
   Zifeng Dai — site behaviour
   Theme, navigation, reveal, filters, copy, GitHub snapshot.
   ========================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme ---------- */
  var themeToggle = document.querySelector(".theme-toggle");

  function readStoredTheme() {
    try {
      return window.localStorage.getItem("theme");
    } catch (error) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      window.localStorage.setItem("theme", theme);
    } catch (error) {
      /* localStorage can be unavailable in private mode; ignore. */
    }
  }

  function applyTheme(theme, persist) {
    root.setAttribute("data-theme", theme);

    if (themeToggle) {
      var isDark = theme === "dark";
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme"
      );
      themeToggle.setAttribute("title", isDark ? "Light mode" : "Dark mode");
    }

    if (persist) storeTheme(theme);
  }

  applyTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light", false);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next, true);
    });
  }

  if (window.matchMedia) {
    var scheme = window.matchMedia("(prefers-color-scheme: dark)");
    var onSchemeChange = function (event) {
      if (!readStoredTheme()) applyTheme(event.matches ? "dark" : "light", false);
    };
    if (scheme.addEventListener) scheme.addEventListener("change", onSchemeChange);
    else if (scheme.addListener) scheme.addListener(onSchemeChange);
  }

  /* ---------- Mobile navigation ---------- */
  var nav = document.querySelector(".nav");
  var menuToggle = document.querySelector(".menu-toggle");

  function closeNav() {
    if (!nav || !menuToggle) return;
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Toggle menu");
    document.body.classList.remove("nav-open");
  }

  if (nav && menuToggle) {
    menuToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Toggle menu");
      document.body.classList.toggle("nav-open", open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });

    var wide = window.matchMedia("(min-width: 901px)");
    if (wide.addEventListener) {
      wide.addEventListener("change", function (event) {
        if (event.matches) closeNav();
      });
    }
  }

  /* ---------- Reveal on scroll ---------- */
  var revealItems = document.querySelectorAll("[data-reveal]");
  if (revealItems.length && "IntersectionObserver" in window && !reduceMotion) {
    document.body.classList.add("reveal-ready");

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    revealItems.forEach(function (item, index) {
      item.style.setProperty("--delay", Math.min(index * 55, 220) + "ms");
      observer.observe(item);
    });
  }

  /* ---------- Blog filters ---------- */
  var chips = document.querySelectorAll("[data-filter]");
  var rows = document.querySelectorAll("[data-tags]");
  var count = document.querySelector("[data-count]");
  var countLabel = document.querySelector("[data-count-label]");

  if (chips.length && rows.length) {
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var filter = chip.getAttribute("data-filter");
        var shown = 0;

        chips.forEach(function (other) {
          other.setAttribute("aria-pressed", String(other === chip));
        });

        rows.forEach(function (row) {
          var tags = (row.getAttribute("data-tags") || "").split(/\s+/);
          var match = filter === "all" || tags.indexOf(filter) !== -1;
          row.hidden = !match;
          if (match) shown += 1;
        });

        if (count) count.textContent = String(shown);
        if (countLabel) countLabel.textContent = shown === 1 ? "note" : "notes";
      });
    });
  }

  /* ---------- Copy citation ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (button) {
    button.addEventListener("click", function () {
      var target = document.querySelector(button.getAttribute("data-copy"));
      if (!target) return;

      var text = target.textContent || "";
      var original = button.textContent;

      function done() {
        button.textContent = "Copied";
        button.classList.add("is-copied");
        window.setTimeout(function () {
          button.textContent = original;
          button.classList.remove("is-copied");
        }, 1800);
      }

      function fallback() {
        var area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        try {
          document.execCommand("copy");
          done();
        } catch (error) {
          button.textContent = "Press Ctrl+C";
        }
        document.body.removeChild(area);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fallback);
      } else {
        fallback();
      }
    });
  });

  /* ---------- GitHub snapshot ---------- */
  var repoNodes = document.querySelectorAll("[data-repo]");
  var ghStatus = document.querySelector("[data-gh-status]");

  if (repoNodes.length) {
    fetch("https://api.github.com/users/hkhldzf/repos?per_page=100&sort=updated", {
      headers: { Accept: "application/vnd.github+json" }
    })
      .then(function (response) {
        if (!response.ok) throw new Error("GitHub API " + response.status);
        return response.json();
      })
      .then(function (repos) {
        if (!Array.isArray(repos)) return;

        var map = {};
        repos.forEach(function (repo) {
          map[repo.name.toLowerCase()] = repo;
        });

        repoNodes.forEach(function (node) {
          var repo = map[node.getAttribute("data-repo").toLowerCase()];
          if (!repo) return;

          var stars = node.querySelector("[data-repo-stars]");
          var updated = node.querySelector("[data-repo-updated]");
          if (stars) stars.textContent = repo.stargazers_count === 1 ? "1 star" : repo.stargazers_count + " stars";

          if (updated && repo.pushed_at) {
            var date = new Date(repo.pushed_at);
            updated.textContent = "Updated " + date.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric"
            });
            updated.setAttribute("datetime", repo.pushed_at);
          }
        });

        if (ghStatus) {
          ghStatus.textContent = "Live from GitHub";
          ghStatus.classList.add("is-live");
        }
      })
      .catch(function () {
        if (ghStatus) ghStatus.textContent = "Static snapshot · Oct 2026";
      });
  }

  /* ---------- Footer year ---------- */
  var year = String(new Date().getFullYear());
  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = year;
  });
})();
