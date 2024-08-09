import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import '../css/group/inviteGroupModal.css'
import useGroupStore from "../store/group";

// 초대하기버튼에 API요청함수 달기

function InviteGroupModal({ show, handleClose, groupId }) {
    const [inviteMethod, setInviteMethod] = useState('email');
    const [groupCode, setGroupCode] = useState(''); 
    const [emails, setEmails] = useState('');
    const [nickName, setNickname] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [findNickName, setFindNickName] = useState(false);

    const checkInviteCode = useGroupStore((state) => state.checkInviteCode);
    const invitePossibleUsers = useGroupStore((state) => state.invitePossibleUsers);
    const sendInviteEmail = useGroupStore((state) => state.sendInviteEmail);

    const handleInviteMethodChange = (event) => {
        setEmails('')
        setNickname(''); 
        setSuggestions([]); 
        setFindNickName(false);
        setInviteMethod(event.target.value);
    };

    useEffect(() => {
        const getDetails = async () => {
            if (groupId) {
                try {
                    const inviteCode = await checkInviteCode({ groupId });
                    setGroupCode(inviteCode.teamCode);
                } catch (err) {
                    console.error('실패 -> ', err);
                }
            }
        };
        getDetails();
    }, [groupId, checkInviteCode]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (inviteMethod === 'nickName' && nickName) {
                try {
                    const responseData = await invitePossibleUsers({ groupId, nickName });
                    setSuggestions(responseData.map(user => user.nickName));
                    if (responseData[0].nickName === nickName) {
                        setFindNickName(true);
                    } else {
                        setFindNickName(false);
                    }
                } catch (err) {
                    console.error('닉네임으로 초대 실패 -> ', err);
                    setFindNickName(false);
                }
            } else {
                setSuggestions([]);
                setFindNickName(false);
            }
        };
        fetchSuggestions();
    }, [nickName, inviteMethod, groupId, invitePossibleUsers]);

    const handleInvite = async () => {
        try {
            if (inviteMethod === 'email') {
                await sendInviteEmail({ groupId, emails });
            } else {
                const responseData = await invitePossibleUsers({groupId, nickName });
                const emails = responseData[0].email
                await sendInviteEmail({ groupId, emails })
            }
        } catch (err) {
            console.error('초대 실패 -> ', err.message);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>초대하기</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onKeyPress={handleKeyPress}>
                    <Form.Group controlId="inviteMethod">
                        <Form.Label>초대 방법</Form.Label>
                        <Form.Check
                            type="radio"
                            id="inviteEmail"
                            label="이메일로 초대"
                            name="inviteMethod"
                            value="email"
                            checked={inviteMethod === 'email'}
                            onChange={handleInviteMethodChange}
                        />
                        <Form.Check
                            type="radio"
                            id="inviteNickname"
                            label="닉네임으로 검색"
                            name="inviteMethod"
                            value="nickName"
                            checked={inviteMethod === 'nickName'}
                            onChange={handleInviteMethodChange}
                        />
                    </Form.Group>
                    {inviteMethod === 'email' && (
                        <Form.Group controlId="emailInvite">
                            <Form.Label>이메일 주소</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="이메일 주소를 입력하세요. ( ,로 구분)"
                                value={emails}
                                onChange={(e) => setEmails(e.target.value)}
                            />
                        </Form.Group>
                    )}
                    {inviteMethod === 'nickName' && (
                        <Form.Group controlId="nicknameInvite">
                            <Form.Label>닉네임</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="닉네임을 입력하세요" 
                                value={nickName}
                                onChange={(e) => setNickname(e.target.value)}
                            />
                            {suggestions.length > 0 && (
                                <ul id="suggestions">
                                    {suggestions.map((suggestion) => (
                                        <li key={suggestion.id}
                                            onClick={() => setNickname(suggestion)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Form.Group>
                    )}
                    <Form.Group controlId="groupCode">
                        <Form.Label>그룹 코드 : {groupCode}</Form.Label>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    닫기
                </Button>
                { inviteMethod === 'email' && <Button variant="primary" onClick={handleInvite}>
                    초대하기
                </Button>}
                { inviteMethod === 'nickName' && <Button variant="primary" onClick={handleInvite} disabled={!findNickName}>
                    초대하기
                </Button>}
            </Modal.Footer>
        </Modal>
    );
}

export default InviteGroupModal;