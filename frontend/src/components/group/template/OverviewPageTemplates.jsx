import React, { useEffect, useState } from 'react';
import { FaFileAlt } from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';
import useGroupStore from '../../../store/group';
import { useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import CreateStudyModal from '../../../modals/CreateStudyModal';

const OverviewPageTemplates = ({ groupId, pageId }) => {
    const [members, setMembers] = useState([]);
    const groupMemberListLoad = useGroupStore((state) => state.groupMemberListLoad);
    const getContentsLoad = useGroupStore((state) => state.getFile);
    const [problems, setProblems] = useState([]);
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        const getContents = async () => {
            try {
                const response = await getContentsLoad({groupId, fileId:pageId})
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

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <div style={{ color: 'white' }}>
            <h1>스터디가 걸어온 길</h1>
            <Button onClick={handleShowModal}>스터디 생성하기 버튼</Button>
            <CreateStudyModal 
                show={showModal} 
                handleClose={handleCloseModal} 
                groupId={groupId}
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
                                <td key={memberIndex} style={{ border: '1px solid #ddd', padding: '8px' }}><FaFileAlt /></td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OverviewPageTemplates;