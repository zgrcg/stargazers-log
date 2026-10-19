const repositoryList = document.querySelector("#repository-list");
const statusMessage = document.querySelector("#status");

function createRepositoryItem(event) {
  const item = document.createElement("li");
  const link = document.createElement("a");
  const description = document.createElement("p");
  const date = document.createElement("time");
  const repositoryUrl = new URL(event.repository);

  if (repositoryUrl.protocol !== "https:") {
    throw new Error(`Unsupported repository URL: ${event.repository}`);
  }

  link.href = repositoryUrl.href;
  link.textContent = repositoryUrl.pathname.slice(1);
  description.className = "repository-description";
  description.textContent = event.description;
  date.dateTime = event.starredAt;
  date.textContent = `Starred on ${new Intl.DateTimeFormat("en", {
    dateStyle: "long"
  }).format(new Date(`${event.starredAt}T00:00:00`))}`;

  item.append(link, description, date);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("./events.json");
    if (!response.ok) {
      throw new Error(`Could not load repositories (${response.status}).`);
    }

    const events = await response.json();
    if (!Array.isArray(events)) {
      throw new Error("Repository data must be a list.");
    }

    repositoryList.replaceChildren(...events.map(createRepositoryItem));
    statusMessage.textContent = events.length
      ? ""
      : "No starred repositories yet.";
  } catch (error) {
    console.error("Failed to load starred repositories:", error);
    statusMessage.textContent = "Repositories could not be loaded. Please try again later.";
  }
}

loadRepositories();
