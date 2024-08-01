import React, { useEffect, useState } from 'react';
import { FaFileAlt } from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';
import useGroupStore from '../../store/group';



const StudyPageTemplates = ({ groupId, pageId }) => {
    // const [ members, setMembers ] = useState([]);
    // const getGroupMembers = useGroupStore((state) => state.groupDetailLoad)


    return (
        <>
            <div style={{color:'white'}}>
                <h1>7월 2주차 스터디</h1>
                <h2>참여 : 곽지혁, 지경근, 김효준, 정호성</h2>
                <h2>불참 : 정예은, 김도한</h2>
                <h3>문제</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>문제</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>난이도</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>곽지혁</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>김도한</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>김효준</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>지경근</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>정예은</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>정호성</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>1000. A + B</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>브론즈 5</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}><FaFileAlt /><MdRefresh/></td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}><FaFileAlt /><MdRefresh/></td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}><FaFileAlt /><MdRefresh/></td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}><FaFileAlt /><MdRefresh/></td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}><FaFileAlt /><MdRefresh/></td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}><FaFileAlt /><MdRefresh/></td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>1001. A - B</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>골드 5</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}><FaFileAlt /><MdRefresh/></td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}><FaFileAlt /><MdRefresh/></td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}><FaFileAlt /><MdRefresh/></td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}><FaFileAlt /><MdRefresh/></td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}><FaFileAlt /><MdRefresh/></td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}><FaFileAlt /><MdRefresh/></td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>1002. A * B</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>실버 3</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}><FaFileAlt /><MdRefresh/></td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}><FaFileAlt /><MdRefresh/></td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}><FaFileAlt /><MdRefresh/></td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}><FaFileAlt /><MdRefresh/></td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}><FaFileAlt /><MdRefresh/></td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}><FaFileAlt /><MdRefresh/></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default StudyPageTemplates;
