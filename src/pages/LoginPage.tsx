import {useState} from "react";
import {useNavigate} from "react-router";
import {USER_KEY} from "../constants/localStorageKeys.ts";
import {TASK_URL} from "../constants/routes.ts";

const USER_NAME_REGEX = /^[a-zA-Z0-9_]{8,20}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,20}$/;

function checkUserName(userName: string): boolean {
    return USER_NAME_REGEX.test(userName);
}

function checkPassword(password: string): boolean {
    return PASSWORD_REGEX.test(password);
}

export default function LoginPage() {
    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState("");
    const [userNameTouched, setUserNameTouched] = useState<boolean>(false);
    const [passwordTouched, setPasswordTouched] = useState<boolean>(false);
    const navigate = useNavigate();

    function handleLoginButton() {
        localStorage.setItem(USER_KEY, userName)
        navigate(TASK_URL)
    }

    return (
        <div className="login-page">
            <div>
                <label>Username</label>
                <input
                    id="Username"
                    onBlur={() => setUserNameTouched(true)}
                    onChange={(event) => setUserName(event.target.value)}
                />

                {userNameTouched && !checkUserName(userName) && (
                    <div role="alert">Invalid username</div>
                )}
            </div>

            <div>
                <label>Password</label>
                <input
                    id="Password"
                    type="password"
                    onBlur={() => setPasswordTouched(true)}
                    onChange={(event) => setPassword(event.target.value)}
                />

                {passwordTouched && !checkPassword(password) && (
                    <div role="alert"> Invalid password </div>
                )}
            </div>

            <button
                disabled={!checkUserName(userName) || !checkPassword(password)}
                onClick={handleLoginButton}
            >
                Login
            </button>
        </div>
    )
}
