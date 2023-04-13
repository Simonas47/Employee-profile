import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setLoading } from '../../features/loading';
import { setChangedSkills } from '../../features/changedSkills';
import { setViewState } from '../../features/viewState';
import { SkillsService } from '../../services/skills.service';
import { ChangedSkillsDataRoot } from '../../store/types';
import { SkillLevel } from './models/enums/SkillLevel';
import { ChangedSkill } from './models/interfaces/ChangedSkill.interface';
import { Skill } from './models/interfaces/Skill.interface';
import SkillsTab from './SkillsTab';

function SkillsTabData() {
  const [skillDataArr, setSkillDataArr] = useState<Array<Skill>>([]);
  const changedSkills = useSelector((state: ChangedSkillsDataRoot) => state.changedSkills.value);

  const skillsService = new SkillsService();

  const dispatch = useDispatch();
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    dispatch(setLoading(true));
    const response = await skillsService.fetchSkillData();
    setSkillDataArr(response);
    dispatch(setLoading(false));
  }

  function setErrorForSkills(childObj: ChangedSkill | Skill) {
    const skillWithError = skillDataArr.find((obj) => obj.id === childObj.id);
    if (skillWithError === undefined) throw new Error('undefined object...');
    skillWithError.hasError = true;
    const parentObjs = skillDataArr.filter((parentObj) => parentObj.id === skillWithError.parentId);
    parentObjs.forEach((obj) => {
      setErrorForSkills(obj);
    });
  }

  function errorCheck() {
    skillDataArr.forEach((obj) => (obj.hasError = false));
    const unselectedLevelSkills = changedSkills.filter((obj) => obj.skillLevel === SkillLevel.NONE);
    if (unselectedLevelSkills.length > 0) {
      unselectedLevelSkills.forEach((objWithError) => {
        setErrorForSkills(objWithError);
      });
      setSkillDataArr([...skillDataArr]);
      return true;
    }
  }

  async function handleSave() {
    if (errorCheck()) return;
    changedSkills.forEach(async (obj) => {
      await skillsService.updateEmployeeSkill(obj);
    });
    await fetchData();
    dispatch(setViewState({}));
    dispatch(setChangedSkills([]));
  }

  async function handleCancel() {
    skillDataArr.forEach((obj) => (obj.hasError = false));
    dispatch(setChangedSkills([]));
    await fetchData();
    dispatch(setViewState({}));
  }

  return (
    <>
      {skillDataArr ? (
        <SkillsTab skillDataArray={skillDataArr} saveFunction={handleSave} cancelFunction={handleCancel} />
      ) : null}
    </>
  );
}

export default SkillsTabData;
