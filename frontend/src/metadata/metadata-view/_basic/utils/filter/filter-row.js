import {
  getFormattedFilters,
} from './core';
import {
  creatorFilter,
  dateFilter,
  textFilter,
} from './filter-column';
import {
  FILTER_CONJUNCTION_TYPE,
} from '../../constants/filter';
import { DateUtils } from '../date';
import { CellType, DATE_FORMAT_MAP } from '../../constants/column';

const getFilterResult = (row, filter, { username, userId }) => {
  const { column_key, column } = filter;
  let cellValue = row[column_key];
  switch (column.type) {
    case CellType.CTIME:
    case CellType.MTIME: {
      cellValue = DateUtils.format(cellValue, DATE_FORMAT_MAP.YYYY_MM_DD_HH_MM_SS);
      return dateFilter(cellValue, filter);
    }
    case CellType.TEXT: {
      return textFilter(cellValue, filter, userId);
    }
    case CellType.LAST_MODIFIER:
    case CellType.CREATOR: {
      return creatorFilter(cellValue, filter, username);
    }
    default: {
      return false;
    }
  }
};

/**
 * Filter row
 * @param {object} row e.g. { _id, .... }
 * @param {string} filterConjunction e.g. 'And' | 'Or'
 * @param {array} filters e.g. [{ column_key, filter_predicate, ... }, ...]
 * @param {object} formulaRow
 * @param {string} username
 * @param {string} userId
 * @param {object} userDepartmentIdsMap e.g. { current_user_department_ids: [8, 10], current_user_department_and_sub_ids: [8, 10, 12, 34] }
 * @returns filter result, bool
 */
const filterRow = (row, filterConjunction, filters, { username = '', userId } = {}) => {
  if (filterConjunction === FILTER_CONJUNCTION_TYPE.AND) {
    return filters.every((filter) => (
      getFilterResult(row, filter, { username, userId })
    ));
  }
  if (filterConjunction === FILTER_CONJUNCTION_TYPE.OR) {
    return filters.some((filter) => (
      getFilterResult(row, filter, { username, userId })
    ));
  }
  return false;
};

/**
 * Filter rows
 * @param {string} filterConjunction e.g. 'And' | 'Or'
 * @param {array} filters e.g. [{ column_key, filter_predicate, ... }, ...]
 * @param {array} rows e.g. [{ _id, .... }, ...]
 * @param {string} username
 * @param {string} userId
 * @returns filtered rows ids, array
 */
const filterRows = (filterConjunction, filters, rows, { username, userId }) => {
  let filteredRows = [];
  const formattedFilters = getFormattedFilters(filters);
  rows.forEach((row) => {
    const rowId = row._id;
    if (filterRow(row, filterConjunction, formattedFilters, { username, userId })) {
      filteredRows.push(rowId);
    }
  });
  return filteredRows;
};

export {
  filterRow,
  filterRows,
};
