import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import {
  useTable,
  usePagination,
  useExpanded,
  useGlobalFilter,
} from 'react-table';

const fetchColleges = async () => {
  const { data } = await axios.get('http://127.0.0.1:8000/colleges/all/');
  return data;
};

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => (
  <span>
    Search:{' '}
    <input
      value={globalFilter || ''}
      onChange={(e) => setGlobalFilter(e.target.value)}
      className="form-control"
      placeholder="search college . . ."
      style={{ display: 'inline', width: 'auto', marginLeft: '10px' }}
    />
  </span>
);

const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
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
        <GlobalFilter
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <div>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </div>
      </div>
      <table {...getTableProps()} className="w-100 my-2">
        {/* <thead className="thead-dark">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead> */}
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <React.Fragment key={row.id}>
                <tr {...row.getRowProps()}>
                  <div className="p-4 w-100 d-flex align-item-center justify-content-between border rounded bg-grey mt-2">
                    {row.cells.map((cell) => (
                      <td className="fw-bold" {...cell.getCellProps()}>
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
                                .slice(
                                  0,
                                  Math.ceil(
                                    Object.entries(row.original).length / 2
                                  )
                                )
                                .map(
                                  ([key, value]) =>
                                    key !== 'id' &&
                                    key !== 'college_name' && (
                                      <li key={key} className="list-group-item">
                                        <strong>
                                          {key.replace(/_/g, ' ')}:
                                        </strong>{' '}
                                        {value.toString().includes('http') ? (
                                          <a
                                            href={value}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
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
                                .slice(
                                  Math.ceil(
                                    Object.entries(row.original).length / 2
                                  )
                                )
                                .map(
                                  ([key, value]) =>
                                    key !== 'id' &&
                                    key !== 'college_name' && (
                                      <li key={key} className="list-group-item">
                                        <strong>
                                          {key.replace(/_/g, ' ')}:
                                        </strong>{' '}
                                        {value.toString().includes('http') ? (
                                          <a
                                            href={value}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
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
        <button
          className="btn btn-primary"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
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

export const ViewColleges = () => {
  const { data, error, isLoading } = useQuery('colleges', fetchColleges);

  const columns = React.useMemo(
    () => [
      {
        Header: 'College Name',
        accessor: 'college_name',
      },
      {
        // Add a column for the expandable rows
        Header: () => null,
        id: 'expander',
        Cell: ({ row }) => (
          <span className="p-1" {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? (
              <i className="bi bi-chevron-up"></i>
            ) : (
              <i className="bi bi-chevron-down"></i>
            )}
          </span>
        ),
      },
    ],
    []
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <Table columns={columns} data={data} />;
};
