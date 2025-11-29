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
    <Table className="rounded-lg overflow-hidden text-sm border border-[var(--baseMedia)]">
      <TableHead
        className="text-[#FFF] text-left"
        style={{ background: "var(--colorTableHeader)" }}
      >
        <TableRow>
          {headers.map((header) => (
            <TableHeaderCell key={header} className="px-4 py-2 capitalize">
              {header}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody className="bg-[var(--baseSuperClara)] text-[var(--baseOscura)]">
        {data.map((row, i) => (
          <TableRow key={i} className="odd:bg-[rgba(0,0,0,.03)]">
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
