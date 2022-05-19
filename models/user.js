class user {
  constructor(
    coins,
    isHost,
    token,
    idToken,
    refreshToken,
    userID,
    isBlocked,
    name,
    surname,
    email,
    userType,
    profileComplete,
    profile,
    demographicsComplete,
    demographics,
    bio,
    activities,
    locationInfo,
    searchHistory,
    chats,
    rating,
    ranking
  ) {
    this.coins = coins;
    this.isHost = typeof isHost == "undefined" ? false : isHost;
    this.token = token;
    this.idToken = idToken;
    this.refreshToken = refreshToken;
    this.userID = userID;
    this.isBlocked = isBlocked;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.userType = userType;
    this.profileComplete =
      profileComplete == "undefined" ? false : profileComplete;
    this.profile = profile == "undefined" ? [] : profile;
    this.demographicsComplete =
      typeof demographicsComplete == "undefined" ? false : demographicsComplete;
    this.demographics = typeof demographics == "undefined" ? [] : demographics;
    this.bio = typeof bio == "undefined" ? null : bio;
    this.activities = activities;
    if (typeof activities == "undefined") this.activities = [];
    else {
      this.activities = activities;
    }
    if (typeof locationInfo == "undefined")
      this.locationInfo = {
        liveLocation: null,
        hangouts: null,
      };
    else {
      this.locationInfo = locationInfo;
    }
    this.searchHistory = searchHistory == "undefined" ? [] : searchHistory;
    this.chats = chats == "undefined" ? [] : chats;
    this.rating = rating == "undefined" ? 0 : rating;
    this.ranking = ranking == "undefined" ? null : ranking;
  }
}

export default user;
