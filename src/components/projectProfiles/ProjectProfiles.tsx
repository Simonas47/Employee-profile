import './ProjectProfiles.scss';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import moment from 'moment';
import { useEffect, useState } from 'react';

import Project from '../../models/Project.interface';
import { ProjectsService } from '../../services/projects.service';
import { ProjectStatus } from '../enums/ProjectStatus';
import ProjectForm from '../projectForm/ProjectForm';
import ProjectFilter from './ProjectFilter';
import ProjectProfilesResult from './ProjectProfilesResults';

export const correctDateFormat = (date: string) => {
  return date === null ? null : moment(date).format('YYYY/MM/DD');
};

const ProjectProfiles = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [addedProjectId, setAddedProjectId] = useState<number>();
  const [filterTextValue, setFilterTextValue] = useState<ProjectStatus>(ProjectStatus.ALL);

  const projectsService = new ProjectsService();

  useEffect(() => {
    getProjects();
  }, []);

  const rerenderProjects = () => {
    getProjects();
  };

  const getProjects = async () => {
    const projects = await projectsService.getAllProjects();
    setProjects(projects);
  };

  const closeProjectForm = (projectId?: number) => {
    setOpenPopup(false);
    if (projectId) setAddedProjectId(projectId);
    getProjects();
  };

  const handleProjectDelete = async (id: number) => {
    await projectsService.deleteProjectById(id);
    setProjects(projects.filter((project) => project.id !== id));
  };
  const filteredProjectsList = projects.filter((project) => {
    if (filterTextValue !== ProjectStatus.ALL) {
      return filterTextValue === project.status;
    } else return true;
  });

  const onFilterValueSelection = (filterValue: ProjectStatus) => {
    setFilterTextValue(filterValue);
  };

  return (
    <div className="project-profiles-container">
      <Stack direction="row" sx={{ width: '70vw' }}>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          sx={{
            position: 'relative',
            width: 275,
            right: 0,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              left: 0,
              paddingTop: 1,
            }}
          >
            <ProjectFilter onFilterValueSelection={onFilterValueSelection} />
          </Box>
        </Stack>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          sx={{
            position: 'relative',
            width: '100%',
            left: 0,
            paddingTop: 1,
          }}
        >
          <Box
            sx={{
              display: filteredProjectsList.length === 0 ? 'none' : 'inline',
              color: 'primary.main',
              fontSize: 14,
            }}
          >
            {filterTextValue === 'All'
              ? filteredProjectsList.length + ' projects found'
              : filteredProjectsList.length + " '" + filterTextValue + "' projects found"}
          </Box>
        </Stack>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          sx={{
            position: 'relative',
            width: 250,
            right: 0,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              right: 0,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              id="addNewProject"
              onClick={() => setOpenPopup(true)}
              sx={{
                my: 1,
                padding: 1,
                paddingLeft: 3,
                paddingRight: 3,
              }}
            >
              Add new project
            </Button>
          </Box>
        </Stack>
      </Stack>
      {openPopup && <ProjectForm onClose={closeProjectForm} />}
      <Box
        sx={{
          position: 'relative',
          my: 2,
          width: '100%',
          left: 0,
        }}
      >
        <ProjectProfilesResult
          rerender={rerenderProjects}
          projects={filteredProjectsList}
          handleProjectDelete={handleProjectDelete}
          focusProjectId={addedProjectId}
          filterStatus={filterTextValue}
        />
      </Box>
    </div>
  );
};

export default ProjectProfiles;
