import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import './Dropdown.scss';

import Filters from '../Filters';
import Slider from '../Slider';

const useStyles = makeStyles(theme => ({
  root: {
    width: '96%',
    marginTop: '10px',
    marginBottom: '10px',
  },
  expansionPanel: {
    display: 'block',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function SimpleExpansionPanel() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Filters</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails
            classes={{
                root: classes.expansionPanel, 
            }}
        >
            <Filters/>
            <Slider/>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}