import React, { useEffect, useState } from 'react';
import { FaFileAlt, FaTrash } from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';
import useGroupStore from '../../../store/group';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import CreateProblemModal from '../../../modals/CreateProblemModal';
import DeleteStudyModal from '../../../modals/DeleteStudyModal';
import useAuthStore from '../../../store/auth';

const initialHeaderState = {
    year:'',
    month:'',
    order:'',
};

const TimeOverviewTemplates = ({ groupId, pageId }) => {
    const [members, setMembers] = useState([]);
    const groupMemberListLoad = useGroupStore((state) => state.groupMemberListLoad);
    const getFile = useGroupStore((state) => state.getFile);
    const location = useLocation();
    const [problems, setProblems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [studyId, setStudyId] = useState('');
    const [header, setHeader] = useState(initialHeaderState)
    const getCode = useGroupStore((state) => state.loadCode);
    const navigate = useNavigate();
    const deleteProblem = useGroupStore((state) => state.deleteProblem);

    const userInfo = useAuthStore.getState().getUserInfo()
    const userId = userInfo.userId;

    const [haveGit, setHaveGit] = useState(true);

    useEffect(() => {
        const loadFile = async () => {
            try {
                const response = await getFile({groupId, fileId:pageId});
                setProblems(response.problems);
                setStudyId(response.study.id);
                const headerState = {
                    year: response.study.year,
                    month: response.study.month,
                    order: response.study.times,
                }
                setHeader(headerState)
            } catch (err) {
                console.error(err);
            }
        };
        const loadMembers = async () => {
            try {
                const response = await groupMemberListLoad({ groupId });
                setMembers(response);
            } catch (err) {
                console.error(err);
            }
        };
        const checkGit = async () => {
            const myUserInfo = useAuthStore.getState().getUserInfo()
            if (myUserInfo.gitId === "") {
                setHaveGit(false); return
            }
            if (myUserInfo.repo === "") {
                setHaveGit(false); return
            }
            if (myUserInfo.branch === "") {
                setHaveGit(false); return
            }
        }
        loadMembers();
        loadFile();
        checkGit();
    }, [pageId, groupId, groupMemberListLoad, getFile]);

    const handleShowModal = () => setShowModal(true)
    const handleCloseModal = () => setShowModal(false)

    const handleShowDeleteModal = () => setShowDeleteModal(true)
    const handleCloseDeleteModal = () => setShowDeleteModal(false)
    
    
    // 코드페이지로 이동
    const navigateCodePage = async (memberStatus) => {
        navigate(`/group/${groupId}/code/${memberStatus.fileId}`);
    }
    
    // 코드 자동 불러오기
    const importCode = async (memberStatus, problemId) => {
        await getCode({ groupId, userId:memberStatus.userId, problemId})
    }

    // 문제 삭제하기
    const onDeleteFile = async (problemId) => {
        await deleteProblem({ groupId, problemId, studyId })
        window.location.reload()
    }

    return (
        <div style={{ color: 'white', margin:'10px', textAlign:'center' }}>
            <h1
                style={{display:'flex', justifyContent:'space-around'}}
            >{header.year}년 {header.month}월 {header.order}회차 스터디
                <Button 
                    onClick={handleShowDeleteModal} 
                    style={{
                        backgroundColor:'inherit',
                        color:'#bbbbbb'
                    }}>
                    스터디 삭제하기
                </Button> 
            </h1>
            <Button  
                onClick={handleShowModal}
                style={{
                    backgroundColor:'inherit',
                    color:'#eeeeee'
                }}>
                    문제 추가하기
            </Button> 
            <CreateProblemModal 
                show={showModal} 
                handleClose={handleCloseModal} 
                groupId={groupId}
                studyId={studyId}
                existingProblems={problems}
            />  
            <DeleteStudyModal 
                show={showDeleteModal} 
                handleClose={handleCloseDeleteModal} 
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
                            <td style={{ border: '1px solid #ddd', padding: '8px'}}>
                                <a href={`https://www.acmicpc.net/problem/${problem.number}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                    {problem.name}
                                </a>
                                &nbsp;&nbsp;&nbsp;
                                <FaTrash onClick={() => onDeleteFile(problem.problemId)} title="문제 삭제" style={{ cursor: 'pointer' }}/>
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{problem.level}</td>
                            {members.map((member, memberIndex) => (
                                <td key={memberIndex} style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    {problem.statuses.map((memberStatus, statusIndex) => (
                                        member.userId === memberStatus.userId ? (
                                            <div key={statusIndex}>
                                                <FaFileAlt onClick={() => navigateCodePage(memberStatus)} title="풀이로 이동" style={{ cursor: 'pointer' }} />
                                                {userId === memberStatus.userId ? (
                                                    haveGit ? (
                                                        <MdRefresh onClick={() => importCode(memberStatus, problem.problemId)} title="내 풀이 가져오기" style={{ cursor: 'pointer' }} />
                                                    ) : (
                                                        <MdRefresh title="Git 정보가 필요합니다." />
                                                    )
                                                ) : null}
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

export default TimeOverviewTemplates;
