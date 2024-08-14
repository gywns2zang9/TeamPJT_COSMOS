import React, { useEffect, useState } from 'react';
import { FaFileAlt } from 'react-icons/fa';
import useGroupStore from '../../../store/group';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import CreateStudyModal from '../../../modals/CreateStudyModal';

const OverviewPageTemplates = ({ groupId, pageId }) => {
    const [members, setMembers] = useState([]);
    const groupMemberListLoad = useGroupStore((state) => state.groupMemberListLoad);
    const getContentsLoad = useGroupStore((state) => state.getFile);
    const [problems, setProblems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getContents = async () => {
            try {
                const response = await getContentsLoad({groupId, fileId:pageId})
                console.log(response);
                setProblems(response.problems);
            } catch (err) {
                console.error('파일불러오기 실패 -> ', err);
            }
        }
        const loadMembers = async () => {
            try {
                const response = await groupMemberListLoad({ groupId });
                setMembers(response);
            } catch (err) {
                console.error('멤버 목록 로드 실패 -> ', err);
            }
        };
        getContents();
        loadMembers();
    }, [groupId, groupMemberListLoad, getContentsLoad]);

    // 코드페이지로 이동
    const navigateCodePage = async (memberStatus) => {
        console.log(memberStatus);
        navigate(`/group/${groupId}/code/${memberStatus.fileId}`);
    }

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <div style={{ color: 'white', margin:'10px', textAlign:'center' }}>
            <h1>스터디 종합기록</h1>
            <Button onClick={handleShowModal} style={{backgroundColor:'inherit' }} >스터디 생성</Button>
            <CreateStudyModal 
                show={showModal} 
                handleClose={handleCloseModal} 
                groupId={groupId}
            />
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>스터디 정보</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>문제번호</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>문제제목</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>난이도</th>
                        {members.map((member, index) => (
                            <th key={index} style={{ border: '1px solid #ddd', padding: '8px' }}>{member.nickName}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {problems.map((problem, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>24년 8월 1회차</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{problem.number}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <a href={`https://www.acmicpc.net/problem/${problem.number}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                    {problem.name}
                                </a>
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{problem.level}</td>
                            {members.map((member, memberIndex) => (
                                <td key={memberIndex} style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    {problem.statuses.map((memberStatus, statusIndex) => (
                                        member.userId === memberStatus.userId ? (
                                            <div key={statusIndex}>
                                                <FaFileAlt onClick={() => navigateCodePage(memberStatus)} /> 
                                            </div>
                                        ) : <div key={statusIndex}>
                                            </div>
                                    ))}
                                </td>
                            ))}
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OverviewPageTemplates;