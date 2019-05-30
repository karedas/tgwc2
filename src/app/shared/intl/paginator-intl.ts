import { MatPaginatorIntl } from '@angular/material/paginator';

const italianRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 di ${length}`; }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} di ${length}`;
};


export function getItalianPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Risultati per pagina:';
  paginatorIntl.nextPageLabel = 'Avanti';
  paginatorIntl.lastPageLabel = 'Ultima pagina';
  paginatorIntl.firstPageLabel = 'Prima pagina';
  paginatorIntl.previousPageLabel = 'Precedente';
  paginatorIntl.getRangeLabel = italianRangeLabel;

  return paginatorIntl;
}
