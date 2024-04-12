export async function fetchDataUsrs() {
  const responseUsrs = await fetch("/api/usrs");
  const users = await responseUsrs.json();

  return users;
}

export async function fetchDataActivities() {
  const responseActivity = await fetch("/api/actividades");
  const activities = await responseActivity.json();

  return activities;
}
