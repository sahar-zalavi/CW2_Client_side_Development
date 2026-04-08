$(document).ready(function () {

    const pages = [
      { name: "Home", url: "home.html" },
      { name: "Accounts", url: "accounts.html" },
      { name: "Transfers", url: "transfers.html" },
      { name: "Support", url: "support.html" }
    ];

    $("#searchInput").on("input", function () {
      const query = $(this).val().toLowerCase();
      $("#searchResults").empty();

      if (query === "") {
        return;
      }

      const matches = pages.filter(page =>
        page.name.toLowerCase().includes(query)
      );

      if (matches.length === 0) {
        $("#searchResults").append("<p>No results found</p>");
        return;
      }

      matches.forEach(page => {
        $("#searchResults").append(
          `<a href="${page.url}" class="search-result">${page.name}</a>`
        );
      });
  });

});
