export function filterTopic(topic: string, filter: string) {
  const split = filter.split("#");
  const e = new Error(
    "wrong usage of # in topic filter, only use # at the end once",
  );

  if (split.length > 2) {
    throw e;
  }

  if (split.length === 2 && split[1] !== "") {
    throw e;
  }

  const filterLevels = filter.split("/");
  const topicLevels = topic.split("/");

  for (let i = 0; i < topicLevels.length; i++) {
    if (filterLevels[i] === "#") {
      return true;
    }

    if (filterLevels[i] !== "+" && filterLevels[i] !== topicLevels[i]) {
      return false;
    }
  }

  return filterLevels.length === topicLevels.length;
}
