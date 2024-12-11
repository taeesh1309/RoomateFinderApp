import { call, put, takeLatest, select, delay } from "redux-saga/effects";
import { Actions, Types } from "~store/reducers";
// import api from "~services/api";
import { useMatches } from '~views/MatchesContext';

function transformResponseData(response) {
  return response.matches.map((match, index) => ({
    age: match.Age,
    createdAt: new Date().toISOString(), // Use current timestamp
    description: `I am a ${match.Age} year old`,
    id: (index + 1).toString(), // Assign a unique ID based on index
    name: match.Name.trim(),
    pictures: match.Gender == "Female" ?
    
    [
      "https://images.unsplash.com/photo-1621820499272-1e2c427647b5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80",
      
    ]: ["https://plus.unsplash.com/premium_photo-1664476788423-7899ac87bd7f?q=80&w=2944&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"], // Placeholder image
    ethnicity: match.Ethnicity,
    Dietary: match["Dietary Preference"],
    smoker: match.Smoker,
    drinker: match.Drinker,
    expectedRent: match["Expected Rent"],
    bedroomPreference: match["Bedroom Preference"],
  }));
}

export function* fetchUsersRequest(action) {
  const config = yield select((state) => state.users.config);

  try {
    yield delay(1000);

    // get data from useMatches
    const response = useMatches();


    // Transform the response data
    const transformedUsers = transformResponseData(response);

    yield put(
      Actions.users.list.success({
        users: transformedUsers,
        nextPage: config.nextPage + 1,
        hasMore: true,
      })
    );
  } catch (err) {
    const error = { message: "Failed to fetch users" };
    yield put(Actions.users.list.failure(error));
  }
}

export default takeLatest(Types.FETCH_USERS_REQUEST, fetchUsersRequest);


// "https://images.unsplash.com/photo-1621820499272-1e2c427647b5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80"