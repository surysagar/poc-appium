import React, { useState } from 'react';
import { Tabs, Tab, Box, Menu, MenuItem, ListItemIcon, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import DevicesIcon from '@mui/icons-material/Devices';
import CreateIcon from '@mui/icons-material/Create';
import BuildIcon from '@mui/icons-material/Build';
import TemplateIcon from '@mui/icons-material/InsertDriveFile';
import TestCaseManagement from './TestCaseManagementPage';
import DeviceManagementTable from './DeviceManagementPage';
import TestResultsTable from './TestResultPage';
import RunFromTemplate from './RunFromTemplatePage';
import { Chart } from 'react-google-charts';
import ChartsComponent from '../components/ChartsComponent';
import TestRunCharts from '../components/ResultDataCharts';
import TemplateRunOverview from '../components/templatesCharts';
import TemplateRunOverviewHeatmap from '../components/templatesCharts';

const HomePage = () => {
  const [tabValue, setTabValue] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [homePageActive, setHomePageActive] = useState(true);
  const [showRunFromTemplate, setShowRunFromTemplate] = useState(false);

  const handleTabChange = (event, newValue) => {
    setHomePageActive(false);
    setTabValue(newValue);
    setShowRunFromTemplate(false);
    window.scrollTo(0, 0); // Scroll to top

  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRunFromTemplateClick = (event) => {
    setHomePageActive(false);
    setShowRunFromTemplate(true);
    setAnchorEl(event.currentTarget);
    setTabValue(0);
    window.scrollTo(0, 0); // Scroll to top

  };

  const redirectToHome = () => {
    setHomePageActive(true);
    setTabValue(null);
  }
  const redirectToTab = (evt) => {
    setHomePageActive(false);

    console.log(evt);
    if (evt === '/device-management') {
      setTabValue(3);
    }
    if (evt === '/test-results') {
      setTabValue(2);
    }

    window.scrollTo(0, 0); // Scroll to top

  }

  return (
    <div 
      style={{
        textAlign: 'center',
        backgroundImage: 'url("/bg1.jpg")',
        backgroundSize: '100% auto',
        backgroundPosition: 'top',
        backgroundRepeat: 'repeat',
        minHeight: '1024px',
        color: '#fff',
        paddingTop: '50px',
      }}
    >
      <div style={{position:'absolute', left: '80px', top: '20px'}} onClick={redirectToHome} >
        <img style={{ width: '80px', height:'80px'}} src='/GE-logo.png' alt="logo" />
      </div>

      <h1>Status and Control Web</h1>
      
      <Box sx={{ 
        width: '80%', 
        margin: '0 auto', 
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
        borderRadius: '8px', 
        padding: '10px'
      }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          textColor="secondary"
          indicatorColor="secondary"
          sx={{
            '& .MuiTab-root': {
              color: '#fff',
              padding: '12px 24px',
            },
            '& .Mui-selected': {
              color: '#ffcc00',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#ffcc00',
            }
          }}
        >
          <Tab icon={<PlayArrowIcon />} label="Test Run Management" onMouseEnter={handleMenuOpen} />
          <Tab icon={<AssignmentIcon />} label="Test Case Management" />
          <Tab icon={<BarChartIcon />} label="Test Results" />
          <Tab icon={<DevicesIcon />} label="Device Management" />
        </Tabs>

        <Menu
          id="run-management-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          MenuListProps={{
            onMouseLeave: handleMenuClose,
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={handleRunFromTemplateClick}>
            <ListItemIcon>
              <TemplateIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Run from Template</Typography>
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component="a" href="/create-custom-test-run">
            <ListItemIcon>
              <CreateIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Create Custom Test Run</Typography>
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component="a" href="/create-regular-test-run">
            <ListItemIcon>
              <BuildIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Create Regular Test Run</Typography>
          </MenuItem>
        </Menu>
      </Box>

      <Box sx={{ 
        padding: '20px', 
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        borderRadius: '8px', 
        marginTop: '20px',
        width: '80%', 
        margin: '0 auto',
      }}>
        {showRunFromTemplate && !homePageActive && (
          <div>
            <Typography variant="h8" style={{marginLeft:'-720px', color: 'gray'}}>Test Run Management > Run From Template</Typography>
            <RunFromTemplate />
          </div>
        )}

        {tabValue === 1 && <TestCaseManagement />}
        {tabValue === 2 && <TestResultsTable />}
        {tabValue === 3 && <DeviceManagementTable />}
        
        {homePageActive && (
          <div className="dashboard">
            <div className="dashboard-grid">
              <ChartsComponent redirectToTab={redirectToTab} />
              <TemplateRunOverviewHeatmap redirectToTab={redirectToTab} />
              
              {/* <TemplateRunOverview /> */}
            </div>
          </div>
        )}
      </Box>
    </div>
  );
};

export default HomePage;
