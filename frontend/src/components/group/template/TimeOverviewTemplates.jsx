import React, { useEffect, useState } from 'react';
import { FaFileAlt } from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';
import useGroupStore from '../../../store/group';
import CreateProblemModal from '../../../modals/CreateProblemModal';
import { Button } from 'react-bootstrap';

const TimeOverviewTemplates = ({ groupId, pageId }) => {
    const [members, setMembers] = useState([]);
    const groupMemberListLoad = useGroupStore((state) => state.groupMemberListLoad);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const loadMembers = async () => {
            try {
                const response = await groupMemberListLoad({ groupId });
                setMembers(response);
                console.log(response);
            } catch (err) {
                console.error('멤버 목록 로드 실패 -> ', err);
            }
        };
        loadMembers();
    }, [groupId, groupMemberListLoad]);

    const handleShowModal = () => setShowModal(true)
    const handleCloseModal = () => setShowModal(false)

    return (
        <div style={{ color: 'white' }}>
            <h1>7월 2주차 스터디</h1>
            <h3>문제추가하기버튼</h3>
            <Button variant="primary" onClick={handleShowModal}>문제 추가하기</Button> 
            <CreateProblemModal 
                show={showModal} 
                handleClose={handleCloseModal} 
            /> 
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>문제</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>난이도</th>
                        {members.map((member, index) => (
                            <th key={index} style={{ border: '1px solid #ddd', padding: '8px' }}>{member.nickName}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>1000. A + B</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>브론즈 5</td>
                        {members.map((_, index) => (
                            <td key={index} style={{ border: '1px solid #ddd', padding: '8px' }}><FaFileAlt /><MdRefresh /></td>
                        ))}
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>1001. A - B</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>골드 5</td>
                        {members.map((_, index) => (
                            <td key={index} style={{ border: '1px solid #ddd', padding: '8px' }}><FaFileAlt /><MdRefresh /></td>
                        ))}
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>1002. A * B</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>실버 3</td>
                        {members.map((_, index) => (
                            <td key={index} style={{ border: '1px solid #ddd', padding: '8px' }}><FaFileAlt /><MdRefresh /></td>
                        ))}
                    </tr>
                </tbody>
            </table>
            
        </div>
    );
};

export default TimeOverviewTemplates;
