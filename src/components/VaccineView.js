import * as React from 'react';
import classNames from 'classnames/bind';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { getJurisdictionList, getTotalFirstDoses } from '../helpers/dataHelpers';
import { numberFormatter, getJurisdictionDisplay } from '../helpers/formatHelpers';
import VaccineBarChart from './VaccineBarChart';
import styles from './VaccineView.css';

import type { VaccineAllocationsT } from '../types/flowTypes';

const cx = classNames.bind(styles);

type PropsT = {|
  vaccineAllocations: VaccineAllocationsT,
|};

const ITEM_HEIGHT = 48;

const VaccineView = (props: PropsT): React.Node => {
  const { vaccineAllocations } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [combinedBars, setCombinedBars] = React.useState(false);
  const [jurisdiction, setJurisdiction] = React.useState('Total');

  const options = getJurisdictionList(vaccineAllocations);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemSelected = (option) => {
    setJurisdiction(option);
    handleClose();
  };

  const toggleCheckbox = React.useCallback(() => {
    setCombinedBars(val => !val);
  }, []);

  return (
    <div className={cx('vaccine-view')}>
      <h1 className={cx('vaccine-view-title')}>COVID-19 Vaccine Tracker</h1>
      <div className={cx('vaccine-view-content')}>
        <Menu
          id="jurisdiction-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '25ch',
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option} onClick={() => handleMenuItemSelected(option)}>
              {getJurisdictionDisplay(option)}
            </MenuItem>
          ))}
        </Menu>
        <Button
          className={cx('select-jurisdiction-button')}
          aria-controls="customized-menu"
          aria-haspopup="true"
          variant="contained"
          color="primary"
          onClick={handleClick}
        >
          Select Jurisdiction
        </Button>
        <h2 className={cx('vaccine-chart-title')}>
          {
            `${getJurisdictionDisplay(jurisdiction)} - ` +
            `${numberFormatter(getTotalFirstDoses(vaccineAllocations, jurisdiction))} total vaccines†`
          }
        </h2>
        <VaccineBarChart
          vaccineAllocations={vaccineAllocations}
          combinedBars={combinedBars}
          jurisdiction={jurisdiction}
        />
        <div className={cx('filter-options-checkbox')}>
          <FormControl component="fieldset" >
            <FormControlLabel
              control={<Checkbox checked={combinedBars} onChange={toggleCheckbox} name="combined" />}
              label="Combine manufacturers"
            />
          </FormControl>
        </div>
        <p>
          {
            '* Marshall Islands, Micronesia, Palau will not receive Pfizer vaccines due to logistical considerations \
            with ultra-cold requirements. ** Jurisdiction will receive first and second doses simultaneously to \
            optimize transportation logistics. A sub-set of these jurisdictions are also receiving expected \
            allocations for the remainder of the month pulled forward. ***Jurisdiction will receive a "Sovereign \
            Nation Supplement" for American Indian/Alaskan Native populations that elected to receive vaccines through \
            the state instead of Indian Health Service. **** Federal Entities includes; Bureau of Prisons, Dept. of \
            Defense, Dept. of State, Indian Health Service, & Veterans Affairs + Dept. of Homeland Security. ~San \
            Antonio and Houston jurisdiction allocations consolidated with Texas. † First doses only.'
          }
        </p>
      </div>
    </div>
  );
};

export default VaccineView;
