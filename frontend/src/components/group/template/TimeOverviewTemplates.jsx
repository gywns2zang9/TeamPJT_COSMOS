import React, { useEffect, useState } from 'react';
import { FaFileAlt } from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';
import useGroupStore from '../../../store/group';
import { useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import CreateProblemModal from '../../../modals/CreateProblemModal';

const TimeOverviewTemplates = ({ groupId, pageId }) => {
    const [members, setMembers] = useState([]);
    const groupMemberListLoad = useGroupStore((state) => state.groupMemberListLoad);
    const getFile = useGroupStore((state) => state.getFile);
    const location = useLocation();
    const [problems, setProblems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [studyId, setStudyId] = useState('');

    useEffect(() => {
        
        const loadFile = async () => {
            try {
                const response = await getFile({groupId, fileId:pageId});
                console.log(response);
                setProblems(response.problems);
                setStudyId(response.fileId)
            } catch (err) {
                console.error('파일 로드 실패 -> ', err);
            }
        };
        const loadMembers = async () => {
            try {
                const response = await groupMemberListLoad({ groupId });
                setMembers(response);
            } catch (err) {
                console.error('멤버 목록 로드 실패 -> ', err);
            }
        };

        loadMembers();
        loadFile();
    }, [groupId, groupMemberListLoad, getFile]);

    const handleShowModal = () => setShowModal(true)
    const handleCloseModal = () => setShowModal(false)

    return (
        <div style={{ color: 'white' }}>
            <h1>7월 2주차 스터디</h1>
            <Button variant="primary" onClick={handleShowModal}>문제 추가하기</Button> 
            <CreateProblemModal 
                show={showModal} 
                handleClose={handleCloseModal} 
                groupId={groupId}
                studyId={studyId}
            /> 
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>사이트</th>
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
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{problem.site}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{problem.number}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{problem.name}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{problem.level}</td>
                            {members.map((_, memberIndex) => (
                                <td key={memberIndex} style={{ border: '1px solid #ddd', padding: '8px' }}><FaFileAlt /><MdRefresh /></td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TimeOverviewTemplates;
