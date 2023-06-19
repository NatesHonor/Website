function ReactGithubList({ username }) {
  var _useState = React.useState([]),
      repositories = _useState[0],
      setRepositories = _useState[1];

  React.useEffect(function () {
    var fetchRepositories = function fetchRepositories() {
      fetch("https://api.github.com/users/".concat(username, "/repos")).then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          console.error('Failed to fetch repositories:', response.status);
        }
      }).then(function (data) {
        setRepositories(data);
      })["catch"](function (error) {
        console.error('Error fetching repositories:', error);
      });
    };

    fetchRepositories();
  }, [username]);

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "GitHub Repositories for ", username), /*#__PURE__*/React.createElement("ul", null, repositories.map(function (repo) {
    return /*#__PURE__*/React.createElement("li", {
      key: repo.id
    }, /*#__PURE__*/React.createElement("a", {
      href: repo.html_url
    }, repo.name));
  })));
}

window.ReactGithubWidget = {
  render: function render(containerId, username) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ReactGithubList, {
      username: username
    }), document.getElementById(containerId));
  }
};
