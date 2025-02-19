import React, { useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { AiTwotoneSave } from "react-icons/ai";
import { TbUserPlus } from 'react-icons/tb';
import { BsFillPlayFill } from 'react-icons/bs';
import ClockLoader from 'react-spinners/ClockLoader';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import colors from '../../constants/colors';
import ShareModal from './ShareModal';
import useSaveFile from '../../hooks/useSaveFile';
import useEditor from '../../hooks/useEditor';
import useCompileService from '../../api/compileService';

const Navbar = ({ projectName: projectName, showInvite = true }) => {
   const [isInviteModalActive, setIsInviteModalActive] = useState(false);
   const navigate = useNavigate();
   const { handleFileSave, FileSaveAlert, isSaving } = useSaveFile();
   const { editorData, setEditorData } = useEditor();
   const { compileProject, CompileAlert } = useCompileService();

   const run = async () => {
      const output = await compileProject();
      setEditorData(prev => {
         return { ...prev, console: output };
      });
   };

   return (
      <>
         <ShareModal open={isInviteModalActive} setOpen={setIsInviteModalActive} />
         <div
            style={{
               backgroundColor: colors.light,
               height: 50,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'space-between',
               color: 'whitesmoke',
               paddingRight: 10,
               paddingLeft: 10,
               paddingBottom: 5,
               paddingTop: 5,
            }}
         >
            <div style={{ fontWeight: 'bold', marginLeft: 10 }}>{projectName}</div>
            <div style={{ width: '100%', position: 'fixed', textAlign: 'center' }}>
               <Button
                  onClick={editorData.filePath ? run : () => {}}
                  variant="contained"
                  size="large"
                  disabled={!editorData.filePath}
                  sx={{
                     borderRadius: 2,
                     backgroundColor: '#044A10',
                     textTransform: 'none',
                     alignItems: 'center',
                     justifyContent: 'center',
                     color: '#6CD97E',
                     fontWeight: 'bold',
                     ':hover': {
                        backgroundColor: '#009118',
                        color: 'whitesmoke',
                     },
                     ':disabled': {
                        backgroundColor: '#2b3245',
                        color: 'whitesmoke',
                     },
                  }}
               >
                  {!editorData.filePath ? (
                     <>
                        <CircularProgress size={12} style={{ color: 'whitesmoke', marginRight: 4 }} />
                        <div style={{ marginLeft: 4 }}>Working</div>
                     </>
                  ) : (
                     <>
                        <BsFillPlayFill style={{ marginRight: 4, fontSize: 20 }} />
                        <div style={{ marginLeft: 4 }}>Run</div>
                     </>
                  )}
               </Button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
               <ClockLoader loading={isSaving} color="#8f8f8f" size={20} />
               <div style={{ marginRight: 20 }}>
                  <abbr title={`Save now (${navigator.platform.match('Mac') ? 'Cmd' : 'Ctrl'}+S)`}>
                     <IconButton color="primary" onClick={handleFileSave}>
                        <AiTwotoneSave size={20} color="whitesmoke" />
                     </IconButton>
                  </abbr>
               </div>
               {showInvite && (
                  <Button
                     style={{ color: 'whitesmoke', borderColor: 'whitesmoke' }}
                     variant="text"
                     startIcon={<TbUserPlus />}
                     size="small"
                     onClick={() => setIsInviteModalActive(true)}
                  >
                     Invite
                  </Button>
               )}
               <FileSaveAlert />
               <CompileAlert />
            </div>
         </div>
      </>
   );
};

export default Navbar;
