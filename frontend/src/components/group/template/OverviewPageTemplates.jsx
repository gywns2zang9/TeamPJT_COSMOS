import React, { useEffect, useState } from 'react';
import { FaFileAlt } from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';
import useGroupStore from '../../../store/group';

const OverviewPageTemplates = ({ groupId, pageId }) => {
    const [members, setMembers] = useState([]);
    const groupMemberListLoad = useGroupStore((state) => state.groupMemberListLoad);

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

    return (
        <div style={{ color: 'white' }}>
            <h1>7월 2주차 스터디</h1>
            <h3>문제추가하기버튼</h3>
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

export default OverviewPageTemplates;
