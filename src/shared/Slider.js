import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
  root: {
    width: 300,
  },
});

const marks = [
  {
    value: 0,
    label: '$0',
  },
  {
    value: 20,
    label: '$20',
  },
  {
    value: 40,
    label: '$40',
  },
  {
    value: 60,
    label: '$60',
  },
  {
    value: 80,
    label: '$80',
  },
  {
    value: 100,
    label: '$100',
  },
];

function valueLabelFormat(value) {
  return marks.findIndex(mark => mark.value === value) + 1;
}

function valuetext(value) {
    return `$${value}`;
  }
export default function RangeSlider() {
    const classes = useStyles();
    const [value, setValue] = React.useState([20, 37]);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    return (
      <div className={classes.root}>
        <Typography id="range-slider" gutterBottom>
          Price Range
        </Typography>
        <Slider
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          marks={marks}
          
          aria-labelledby="range-slider"
          getAriaValueText={valuetext}
        />
      </div>
    );
  }