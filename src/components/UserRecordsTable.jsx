
import React, {
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle
 } from 'react';
import { useAuth } from '../context/AuthContext';
import useAxiosAuth from '../hooks/useAxiosAuth';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import '../styles/UserRecordsTable.css';

const UserRecordsTable = forwardRef((props, ref) => {
  const { user } = useAuth();
  console.log('ESTE ES EL USER: ',user);
  const axiosAuth = useAxiosAuth();
  const [records, setRecords] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [total, setTotal] = useState(0);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const [exportUrl, setExportUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await axiosAuth.get('/records/export');
      setExportUrl(response.data.url);
    } catch (err) {
      console.error('Error exportando historial:', err);
      alert('Hubo un error exportando el historial.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async () => {
    try {
      const res = await axiosAuth.get('/records', {
        params: {
          page,
          perPage,
          search,
          orderBy: sorting[0]?.id || 'createdAt',
          order: sorting[0]?.desc ? 'desc' : 'asc',
        },
      });
      setRecords(res.data.records);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Error fetching records:', err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [page, perPage, search, sorting]);

  const columns = useMemo(
    () => [
      { accessorKey: 'operation_type', header: 'Operation' },
      { accessorKey: 'amount', header: 'Cost' },
      { accessorKey: 'user_balance', header: 'Balance' },
      { accessorKey: 'operation_response', header: 'Result' },
      { accessorKey: 'createdAt', header: 'Date' },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <button onClick={() => handleDelete(row.original.id)}>Delete</button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: records,
    columns,
    pageCount: Math.ceil(total / perPage),
    state: {
      sorting,
    },
    manualPagination: true,
    manualSorting: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleDelete = async (id) => {
    try {
      await axiosAuth.delete(`/records/${id}`);
      setAlertMessage('Record deleted successfully.');
      setAlertType('success');
      fetchRecords();
    } catch (err) {
      setAlertMessage('Error deleting record.');
      setAlertType('error');
      console.error('Error deleting record:', err);
    }
    setTimeout(() => {
      setAlertMessage('');
      setAlertType('');
    }, 3000);    
  };
  
  useImperativeHandle(ref, () => ({
    refresh: fetchRecords
  }));

  return (
   <div>
    {records.length > 0 && (
    <div className="records-container">
     <div className="records-wrapper">
       <h4>Operations History</h4>

        {alertMessage && (
          <div className={`alert ${alertType === 'success' ? 'alert-success' : 'alert-error'}`}>
            {alertMessage}
          </div>
        )}

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="records-search"
        />

        <table className="records-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted()
                      ? header.column.getIsSorted() === 'asc'
                        ? ' ↑'
                        : ' ↓'
                      : ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="records-pagination">
          <div>
            <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={records.length < perPage}
            >
              Next
            </button>
          </div>

          <div className="action-buttons">
            
            <button
              onClick={handleExport}
              disabled={loading}
            >
              {loading ? 'Exporting...' : 'Export Records to AWS S3'}
            </button>

            {exportUrl && (
              <button
                onClick={() => window.open(exportUrl, '_blank', 'noopener,noreferrer')}
              >
               See AWS S3 Bucket
              </button>
            )}
           </div>      

          <div>
            
            <select
              id="perPageSelect"
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
            >
              {[5, 10, 20].map((n) => (
                <option key={n} value={n}>
                  {n} per page
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
    )}
   </div>        
  );
});
export default UserRecordsTable;
