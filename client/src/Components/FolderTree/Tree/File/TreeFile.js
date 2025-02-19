import React, { useEffect, useRef, useState } from "react";
import { AiOutlineFile, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

import { StyledFile } from "./TreeFile.style";
import { useTreeContext } from "../state/TreeContext";
import { ActionsWrapper, StyledName, StyledNameText } from "../Tree.style.js";
import { PlaceholderInput } from "../TreePlaceholderInput";

import { FILE } from "../state/constants";
import FILE_ICONS from "../FileIcons";

import useFileService from "../../../../api/fileService";
import { getExactFilePath, shortenText } from "../../utils";

const File = ({ name, id, node }) => {
  const { dispatch, isImparative, onNodeClick } = useTreeContext();
  const [isEditing, setEditing] = useState(false);
  const ext = useRef("");
  const handleFiles = useFileService()

  let splitted = name?.split(".");
  ext.current = splitted[splitted.length - 1];

  const toggleEditing = () => setEditing(!isEditing);
  const commitEditing = async (name) => {
    let oldPath = getExactFilePath(node)
    let prevFile = oldPath.split('/').pop()
    let newPath = oldPath.slice(0, oldPath.length - prevFile.length) + name

    await handleFiles.rename({ old_name: oldPath, new_name: newPath })
    dispatch({ type: FILE.EDIT, payload: { id, name } });
    setEditing(false);
  };

  const commitDelete = async () => {
    let path = getExactFilePath(node)
    await handleFiles.deleteRes({ name: path })
    dispatch({ type: FILE.DELETE, payload: { id } });
  };

  const handleNodeClick = React.useCallback(
    (e) => {
      e.stopPropagation();
      onNodeClick({ node });
    },
    [node]
  );
  const handleCancel = () => {
    setEditing(false);
  };

  return (
    <StyledFile onClick={handleNodeClick} className="tree__file">
      {isEditing ? (
        <PlaceholderInput
          type="file"
          style={{ paddingLeft: 0 }}
          defaultValue={name}
          onSubmit={commitEditing}
          onCancel={handleCancel}
        />
      ) : (
        <ActionsWrapper>
          <StyledName>
            <div>
              {FILE_ICONS[ext.current] ? (
                FILE_ICONS[ext.current]
              ) : (
                <AiOutlineFile />
              )}
            </div>
            <StyledNameText>
              {shortenText(name)}
            </StyledNameText>
          </StyledName>
          {isImparative && (
            <div className="actions">

              <AiOutlineEdit onClick={toggleEditing} />
              <AiOutlineDelete onClick={commitDelete} />
            </div>
          )}
        </ActionsWrapper>
      )}
    </StyledFile>
  );
};

export { File };
