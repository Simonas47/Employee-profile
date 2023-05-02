import { Avatar, Box, Checkbox, Link, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useSelector } from 'react-redux';

import Employee from '../../models/Employee.interface';
import { ROUTES } from '../../routes/routes';
import { UserStateRoot } from '../../store/types/user';

type ProjectEmployeeAddItemProps = {
  employee: Employee;
  selected: boolean;
  onStateChange: (selected: boolean) => void;
};

const ProjectEmployeeAddItem: React.FC<ProjectEmployeeAddItemProps> = (props: ProjectEmployeeAddItemProps) => {
  const { employee, selected, onStateChange } = props;
  const userId = useSelector((state: UserStateRoot) => state.userState.value).id;
  const isInactiveOrDismissed = (status: string): boolean => {
    return ['INACTIVE', 'DISMISSED'].includes(status);
  };

  return (
    <>
      <ListItem sx={{ padding: 0 }}>
        <Box display={'flex'} sx={{ alignItems: 'center' }}>
          <Checkbox
            sx={{ alignSelf: 'center', mr: 0.5 }}
            checked={selected}
            onChange={() => onStateChange(!selected)}
          />
          <ListItemAvatar>
            <Avatar
              src={`data:${employee.imageType};base64,${employee.imageBytes}`}
              sx={{
                border: '0.01px solid lightgrey',
                opacity: isInactiveOrDismissed(employee.status) ? 0.35 : 1,
              }}
            />
          </ListItemAvatar>
          <ListItemText
            secondary={employee.title}
            sx={{
              color: 'primary.main',
            }}
          >
            <Link
              href={
                employee.id !== userId
                  ? `${process.env.REACT_APP_BASE_URL}/skills?employeeId=${employee.id}`
                  : `${process.env.REACT_APP_BASE_URL}${ROUTES.SKILLS}`
              }
              underline="hover"
              target="_blank"
            >
              {employee.middleName
                ? `${employee.name} ${employee.middleName} ${employee.surname}`
                : `${employee.name} ${employee.surname}`}
            </Link>
          </ListItemText>
        </Box>
      </ListItem>
    </>
  );
};

export default ProjectEmployeeAddItem;
