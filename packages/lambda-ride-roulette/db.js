
const ridesDb = []
const preferencesDb = {}

const getRides = async () => {
  return ridesDb
}

const getPreferences = async (email) => {
  return preferencesDb[email] || []
}

const setPreferences = async (email, prefs) => {
  preferencesDb[email] = prefs
}

module.exports = {
  getRides,
  getPreferences,
  setPreferences
}
