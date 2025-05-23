import React from 'react';
import { useTable, usePagination, useExpanded, useGlobalFilter } from 'react-table';
import PropTypes from 'prop-types';
import { useFetchData } from 'src/react-query/useFetchApis';

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => (
  <span>
    Search:{' '}
    <input
      value={globalFilter || ''}
      onChange={e => setGlobalFilter(e.target.value)}
      className="form-control"
      placeholder="search college . . ."
      style={{ display: 'inline', width: 'auto', marginLeft: '10px' }}
    />
  </span>
);

GlobalFilter.propTypes = {
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func.isRequired,
};

const ExpanderCell = ({ row }) => (
  <span className="p-1" {...row.getToggleRowExpandedProps()}>
    {row.isExpanded ? <i className="bi bi-chevron-up"></i> : <i className="bi bi-chevron-down"></i>}
  </span>
);

ExpanderCell.propTypes = {
  row: PropTypes.shape({
    getToggleRowExpandedProps: PropTypes.func.isRequired,
    isExpanded: PropTypes.bool.isRequired,
  }).isRequired,
};

const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setGlobalFilter,
    state: { pageIndex, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    useExpanded,
    usePagination
  );

  return (
    <>
      <div className="container d-flex justify-content-between border py-3 rounded bg-light">
        <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
        <div>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </div>
      </div>
      <table {...getTableProps()} className="w-100 my-2">
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <React.Fragment key={row.id}>
                <tr {...row.getRowProps()}>
                  <div className="p-4 w-100 d-flex align-item-center justify-content-between border rounded bg-grey mt-2">
                    {row.cells.map((cell, index) => (
                      <td className="fw-bold" {...cell.getCellProps()} key={index}>
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </div>
                </tr>
                {row.isExpanded ? (
                  <tr>
                    <td className="p-0" colSpan={columns.length}>
                      <div
                        className="border bg-light rounded"
                        style={{
                          maxHeight: '300px',
                          overflowY: 'scroll',
                          overflowX: 'hidden',
                          padding: '10px',
                        }}
                      >
                        <div className="row">
                          <div className="col-12 col-md-6">
                            <ul className="list-group">
                              {Object.entries(row.original)
                                .slice(0, Math.ceil(Object.entries(row.original).length / 2))
                                .map(
                                  ([key, value]) =>
                                    key !== 'id' &&
                                    key !== 'college_name' && (
                                      <li key={key} className="list-group-item">
                                        <strong>{key.replace(/_/g, ' ')}:</strong>{' '}
                                        {value.toString().includes('http') ? (
                                          <a href={value} target="_blank" rel="noopener noreferrer">
                                            {value}
                                          </a>
                                        ) : (
                                          value
                                        )}
                                      </li>
                                    )
                                )}
                            </ul>
                          </div>
                          <div className="col-12 col-md-6">
                            <ul className="list-group">
                              {Object.entries(row.original)
                                .slice(Math.ceil(Object.entries(row.original).length / 2))
                                .map(
                                  ([key, value]) =>
                                    key !== 'id' &&
                                    key !== 'college_name' && (
                                      <li key={key} className="list-group-item">
                                        <strong>{key.replace(/_/g, ' ')}:</strong>{' '}
                                        {value.toString().includes('http') ? (
                                          <a href={value} target="_blank" rel="noopener noreferrer">
                                            {value}
                                          </a>
                                        ) : (
                                          value
                                        )}
                                      </li>
                                    )
                                )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <div className="pagination d-flex gap-2 justify-content-center align-items-center">
        <button
          className="btn btn-primary"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          Previous
        </button>{' '}
        <button className="btn btn-primary" onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
      </div>
    </>
  );
};

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};

export const ViewColleges = () => {
  const { data, error, isLoading } = useFetchData('colleges', `/colleges/all/`);
  const columns = React.useMemo(
    () => [
      {
        Header: 'College Name',
        accessor: 'college_name',
      },
      {
        Header: () => null,
        id: 'expander',
        Cell: ExpanderCell,
      },
    ],
    []
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data || data.length === 0) return <div>No records to display.</div>;

  return <Table columns={columns} data={data} />;
};
