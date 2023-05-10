import DeleteIcon from '@mui/icons-material/Delete';
import {
  Avatar,
  Box,
  Grid,
  IconButton,
  InputLabel,
  Link,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FormikErrors, getIn } from 'formik';
import React from 'react';
import { useSelector } from 'react-redux';

import ProjectEmployee from '../../models/ProjectEmployee.interface';
import ProjectEmployeeError from '../../models/ProjectEmployeeError.interface';
import { ROUTES } from '../../routes/routes';
import { UserStateRoot } from '../../store/types/user';

type ProjectEmployeeEditItemProps = {
  projectEmployee: ProjectEmployee;
  projectStartDate: string;
  projectEndDate: string;
  index: number;
  isTouched: boolean;
  formikErrors: FormikErrors<ProjectEmployee>;
  apiError?: ProjectEmployeeError;
  setFieldValue: (field: string, value: string | undefined) => void;
  setFieldTouched: (field: string, touched?: boolean | undefined, shouldValidate?: boolean | undefined) => void;
  onDelete: (projectEmployeeId: number) => void;
};

const ProjectEmployeeEditItem: React.FC<ProjectEmployeeEditItemProps> = (props: ProjectEmployeeEditItemProps) => {
  const {
    projectEmployee,
    projectStartDate,
    projectEndDate,
    index,
    isTouched,
    formikErrors,
    apiError,
    setFieldValue,
    setFieldTouched,
    onDelete,
  } = props;
  const userId = useSelector((state: UserStateRoot) => state.userState.value).id;

  const isInactiveOrDismissed = (status: string): boolean => {
    return ['INACTIVE', 'DISMISSED'].includes(status);
  };

  const startDateError = getIn(formikErrors, `projectEmployeeStartDate`);
  const endDateError = getIn(formikErrors, `projectEmployeeEndDate`);
  const activityPeriodError = getIn(formikErrors, `projectEmployeeActivityDates`);

  return (
    <Grid container alignItems={'center'} mb={1}>
      <Grid item xs={5}>
        <Box display={'flex'} alignItems={'center'} mt={2.4}>
          <ListItemAvatar>
            <Avatar
              src={`data:${projectEmployee.imageType};base64,${projectEmployee.imageBytes}`}
              sx={{
                border: '0.01px solid lightgrey',
                opacity: isInactiveOrDismissed(projectEmployee.status) ? 0.35 : 1,
              }}
            />
          </ListItemAvatar>
          <ListItemText
            secondary={<>{projectEmployee.title}</>}
            sx={{
              color: isInactiveOrDismissed(projectEmployee.status) ? '#666666' : 'primary.main',
            }}
          >
            <Link
              href={
                projectEmployee.id !== userId
                  ? `${process.env.REACT_APP_BASE_URL}${ROUTES.SKILLS}?employeeId=${projectEmployee.id}`
                  : `${process.env.REACT_APP_BASE_URL}${ROUTES.SKILLS}`
              }
              underline="hover"
              target="_blank"
            >
              {projectEmployee.middleName
                ? `${projectEmployee.name} ${projectEmployee.middleName} ${projectEmployee.surname}`
                : `${projectEmployee.name} ${projectEmployee.surname}`}
            </Link>
          </ListItemText>
        </Box>
      </Grid>
      <Grid item xs={6} display={'flex'}>
        <Box mr={4} onBlur={() => setFieldTouched(`projectEmployees.${index}.projectEmployeeEndDate`)}>
          <InputLabel>
            <Typography sx={{ fontSize: 14, fontWeight: 400 }}>Start Date</Typography>
          </InputLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{
                width: 180,
                '& .MuiInputBase-input': {
                  height: 10,
                },
              }}
              format="YYYY/MM/DD"
              minDate={dayjs(projectStartDate)}
              value={projectEmployee.projectEmployeeStartDate ? dayjs(projectEmployee.projectEmployeeStartDate) : null}
              onChange={(newValue) => {
                setFieldValue(`projectEmployees.${index}.projectEmployeeStartDate`, newValue?.toString());
              }}
              slotProps={{
                textField: {
                  error: Boolean(activityPeriodError) || (isTouched && Boolean(startDateError)) || false,
                  helperText: isTouched && startDateError,
                },
              }}
            />
          </LocalizationProvider>
        </Box>
        <Box onBlur={() => setFieldTouched(`projectEmployees.${index}.projectEmployeeEndDate`)}>
          <InputLabel>
            <Typography sx={{ fontSize: 14, fontWeight: 400 }}>End Date</Typography>
          </InputLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{
                width: 180,
                '& .MuiInputBase-input': {
                  height: 10,
                },
              }}
              format="YYYY/MM/DD"
              minDate={dayjs(projectEmployee.projectEmployeeStartDate)}
              maxDate={dayjs(projectEndDate)}
              value={projectEmployee.projectEmployeeEndDate ? dayjs(projectEmployee.projectEmployeeEndDate) : null}
              onChange={(newValue) => {
                setFieldValue(`projectEmployees.${index}.projectEmployeeEndDate`, newValue?.toString());
              }}
              slotProps={{
                textField: {
                  error: Boolean(endDateError || activityPeriodError),
                  helperText: endDateError,
                },
              }}
            />
          </LocalizationProvider>
        </Box>
      </Grid>
      <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2.4 }}>
        <IconButton
          className="btn-delete"
          aria-label="delete"
          sx={{
            color: 'primary.main',
            backgroundColor: '#F4F4F4',
          }}
          onClick={() => onDelete(projectEmployee.id)}
        >
          <DeleteIcon />
        </IconButton>
      </Grid>
      <Grid item xs={5} />
      <Grid item xs={6}>
        <Typography sx={{ color: '#D32F2F', fontSize: 12 }}>{activityPeriodError}</Typography>
        {apiError && (
          <Typography sx={{ color: '#D32F2F', fontSize: 12, mt: 1 }}>
            {apiError.message}
            <br />
            {apiError.employmentDates.map((employmentDate, index) => {
              const hiringDate = dayjs(employmentDate.hiringDate).format('YYYY/MM/DD');
              const exitDate = employmentDate.exitDate
                ? dayjs(employmentDate.exitDate).format('YYYY/MM/DD')
                : 'Present';
              return (
                <span key={employmentDate.hiringDate}>
                  {hiringDate} - {exitDate}
                  {index < apiError.employmentDates.length - 1 ? ',' : ''}
                  <br />
                </span>
              );
            })}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

const ProjectEmployeeEditItemMemo = React.memo(ProjectEmployeeEditItem);

export default ProjectEmployeeEditItemMemo;
