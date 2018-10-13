import { delay } from "redux-saga";
import { put } from "redux-saga/effects";
import axios from "axios";

import * as actions from "../actions/index";

export function* logoutSaga(action) {
    yield localStorage.removeItem("token");
    yield localStorage.removeItem("expirationTime");
    yield localStorage.removeItem("userId");

    yield put(actions.logoutSucceed());
}

export function* checkAuthTimeoutSaga(action) {
    yield delay(action.expirationTime * 1000);

    yield put(actions.logout());
}

export function* authSaga(action) {
    yield put(actions.authStart());
    const authData = {
        email: action.email,
        password: action.password,
        returnSecureToken: true
    };

    let url =
        "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyAZbf4L72_XcNVKxpJYd5Xiig6c5jSVpGI";

    if (!action.isSignup) {
        url =
            "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyAZbf4L72_XcNVKxpJYd5Xiig6c5jSVpGI";
    }

    try {
        const response = yield axios.post(url, authData);

        const token = response.data.idToken;
        const localId = response.data.localId;
        const expirationTime = response.data.expiresIn;
        const expirationDate = new Date(
            yield new Date().getTime() + expirationTime * 1000
        );

        yield localStorage.setItem("token", token);
        yield localStorage.setItem("expirationDate", expirationDate);
        yield localStorage.setItem("userId", localId);

        yield put(actions.authSuccess(token, localId));
        yield put(actions.checkAuthTimeout(expirationTime));
    } catch (error) {
        yield put(actions.authFail(error.response.data.error));
    }
}

export function* authCheckStateSaga(action) {
    const token = yield localStorage.getItem("token");
    
    if (!token) {
        yield put(actions.logout());
    } else {
        const expirationDate = yield new Date(
            localStorage.getItem("expirationDate")
        );

        if (expirationDate <= new Date()) {
            yield put(actions.logout());
        } else {
            const userId = yield localStorage.getItem("userId");
            yield put(actions.authSuccess(token, userId));
            yield put(
                actions.checkAuthTimeout(
                    // Get miliseconds and divide by 1000 to convert into seconds
                    (expirationDate.getTime() - new Date().getTime()) / 1000
                )
            );
        }
    }
}
