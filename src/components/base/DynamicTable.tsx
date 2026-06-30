"use client";
import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from "@tremor/react";

type Props = {
  data: Record<string, any>[]; // array de objetos dinámicos
};

export default function DynamicTable({ data }: Props) {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">Sin datos</p>;
  }

  // tomar las claves del primer objeto como headers
  const headers = Object.keys(data[0]);

  return (
    <Table className="app-table">
      <TableHead
        className="app-table-head text-left"
      >
        <TableRow>
          {headers.map((header) => (
            <TableHeaderCell key={header} className="px-4 py-2 capitalize">
              {header}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody className="bg-white text-[var(--baseOscura)]">
        {data.map((row, i) => (
          <TableRow key={i} className="app-table-row">
            {headers.map((header) => (
              <TableCell key={header} className="px-4 py-2">
                {row[header]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
