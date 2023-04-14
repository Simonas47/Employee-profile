import './ProjectProfiles.scss';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import React, { useEffect, useState } from 'react';

import Project from '../../models/Project.interface';
import { ProjectsService } from '../../services/projects.service';
import { ProjectStatus } from '../enums/ProjectStatus';
import ProjectFilter from './ProjectFilter';
import ProjectProfilesResult from './ProjectProfilesResults';

const ProjectProfiles = () => {
  const [results, setResults] = useState<Project[]>([]);
  const [filterTextValue, setFilterTextValue] = useState('All');

  const projectsService = new ProjectsService();

  useEffect(() => {
    getResults();
  }, []);

  const getResults = async () => {
    const result = await projectsService.getAllProjects();
    setResults(result);
  };

  const handleProjectDelete = async (id: string) => {
    await projectsService.deleteProjectById(id);
    setResults(results.filter((project) => project.id !== id));
  };

  const filteredProjectsList = results.filter((project) => {
    if (filterTextValue === ProjectStatus.ONGOING) {
      return project.status === ProjectStatus.ONGOING;
    } else if (filterTextValue === ProjectStatus.FINISHED) {
      return project.status === ProjectStatus.FINISHED;
    } else if (filterTextValue === ProjectStatus.FUTURE) {
      return project.status === ProjectStatus.FUTURE;
    } else {
      return project;
    }
  });

  const onFilterValueSelection = (filterValue: string) => {
    setFilterTextValue(filterValue);
  };

  return (
    <div className="project-profiles-container">
      <Stack direction="row">
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          sx={{
            position: 'relative',
            width: 250,
            left: -205,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              left: 0,
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
            width: 300,
            left: -180,
          }}
        >
          <Box
            sx={{
              display: filteredProjectsList.length === 0 ? 'none' : 'inline',
              color: '#000048',
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
            width: 145,
            left: 440,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              left: 0,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              id="addNewProject"
              sx={{
                my: 1,
              }}
            >
              Add new project
            </Button>
          </Box>
        </Stack>
      </Stack>
      <Box
        sx={{
          position: 'relative',
          my: 2,
          width: 1344,
          left: -205,
        }}
      >
        <ProjectProfilesResult
          results={filteredProjectsList}
          handleProjectDelete={handleProjectDelete}
          filterStatus={filterTextValue}
        />
      </Box>
    </div>
  );
};

export default ProjectProfiles;
