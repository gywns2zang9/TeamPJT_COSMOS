// 외부 라이브러리에서 필요한 모듈을 임포트합니다.
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// 비밀번호 변경 기능을 처리하는 커스텀 훅을 정의합니다.
const usePasswordChange = () => {
    // useState 훅을 사용하여 현재 비밀번호, 새로운 비밀번호, 비밀번호 확인의 상태를 관리합니다.
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // react-router-dom의 useNavigate 훅을 사용하여 프로그램적으로 페이지를 이동합니다.
    const navigate = useNavigate();

    // 사용자가 비밀번호 입력 필드에 입력할 때 상태를 업데이트하는 이벤트 핸들러입니다.
    const handleChangeCurrentPassword = (event) => setCurrentPassword(event.target.value);
    const handleChangeNewPassword = (event) => setNewPassword(event.target.value);
    const handleChangeConfirmPassword = (event) => setConfirmPassword(event.target.value);

    // 비밀번호 변경 처리를 담당하는 함수입니다.
    const handlePasswordChange = async () => {
        const userId = 1; // 사용자 ID가 1이라고 가정합니다. 실제 애플리케이션에서는 동적으로 가져와야 합니다.

        // 디버깅을 위해 비밀번호를 로그에 출력합니다.
        console.log(
            `
            "oldPassword":${currentPassword},
            "newPassword":${newPassword}
            `
        );
        try {
            // 서버에 비밀번호 변경 요청을 보냅니다.
            const response = await axios.patch(
                `http://localhost:8080/users/${userId}/password`,
                {
                    oldPassword: currentPassword,
                    newPassword: newPassword
                }
            );
            // 요청이 성공했을 때의 처리입니다.
            if (response.status === 200) {
                console.log("비밀번호 변경 성공!");
            }
        } catch (error) {
            // 요청이 실패했을 때의 처리입니다.
            console.log("비밀번호 변경 실패!");
        }
    };

    // 사용자 정보를 변경하는 페이지로 돌아가는 함수입니다.
    const toBack = () => {
        navigate("/userinfochange");
    };

    // 훅에서 반환하는 값들입니다.
    return {
        currentPassword,
        newPassword,
        confirmPassword,
        handleChangeCurrentPassword,
        handleChangeNewPassword,
        handleChangeConfirmPassword,
        handlePasswordChange,
        toBack,
    };
};

// 훅을 익스포트합니다.
export default usePasswordChange;
