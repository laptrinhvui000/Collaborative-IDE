import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { languageDefaultFile } from "../constants/languageDefaultFile";
import { ProjectContext } from "../contexts/ProjectContext";
import useAuth from "./useAuth";
import useAxios from "./useAxios";
import useAzure from "./useAzure";

const useProject = () => {
    const location = useLocation();
    const { adminUsername, setAdminUsername, activeProjectName, setActiveProjectname, activeProjectLanguage, setActiveProjectLanguage } = useContext(ProjectContext)
    const { username } = useAuth()

    const api = useAxios()
    const azure = useAzure()

    useEffect(() => {
        if (location.pathname.startsWith('/@')) {
            // Set project name only when we are on the collaborate screen
            setActiveProjectname(getProjectNameIfCollaborate(location.pathname))
            setAdminUsername(getUserNameIfCollaborate(location.pathname))
        }
        else if (location.pathname.startsWith('/join')) {
            const shareIdentifier = getProjectNameIfJoin(location.pathname)
            getProjectDetailsFromShare(shareIdentifier)
        }
    }, [location])

    const getUserNameIfCollaborate = (string) => {
        return string.split('@')[1].split('/')[0]
    }

    const getProjectNameIfCollaborate = (pathname) => {
        return pathname.split('@')[1].split('/')[1];
    }

    const getProjectNameIfJoin = (pathname) => {
        return pathname.split('/').slice(-1)[0];
    }

    const createDefaultFile = (language, projectName) => {
        return new Promise((resolve, reject) => {
            azure.put('/files/save', {
                "username": username,
                "projectName": projectName,
                "path": languageDefaultFile(language)
            }).then(result => resolve(result)).catch(err => reject(err))
        })
    }

    const createProject = (projectName, language) => {
        return new Promise((resolve, reject) => {
            api.post('/create', {
                "projectName": projectName,
                "language": language
            })
                .then(result => {
                    createDefaultFile(language, projectName)
                        .then(() => resolve(result))
                        .catch(err => reject(err))
                })
                .catch(err => reject(err))
        })
    }
    const getProjects = () => {
        return new Promise((resolve, reject) => {
            api.get('/get').then(result => {
                return resolve(result);
            }).catch(err => {
                return reject(err);
            })
        })
    }

    const getProjectDetailsFromShare = (shareIdentifier) => {
        api.get('/share/details', {
            params: {
                share: shareIdentifier
            }
        }).then(result => {
            const data = result.data;
            setActiveProjectname(data.name)
            setAdminUsername(data.username)
        }).catch(err => console.error(err))
    }

    const isShareIDPresent = (shareID) => {
        return new Promise((resolve, reject) => {
            api.get("/share/isValid", {
                params: {
                    share: shareID
                }
            })
                .then(res => resolve(true))
                .catch(err => reject(false))
        })
    }

    return { activeProjectName, adminUsername, getProjects, isShareIDPresent, createProject, activeProjectLanguage, setActiveProjectLanguage }
}

export default useProject;